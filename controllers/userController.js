const res = require('express/lib/response');
const passport = require('passport');
const { generateCodeJwt } = require('../helpers/ConfirmAccount');
const bcrypt = require('bcrypt');

//Models
const Product = require('../models/ProductModel');
const Category = require('../models/CategoryModel');
const User = require('../models/UserModel');
const Ticket = require('../models/TicketModel');
const CategoryTicket = require('../models/CategoryTicketModel');
const AnswerTicket = require('../models/AnswerTicket');

class UserController {
    static async index(req, res) {

        generateCodeJwt(req.user);

        const getProductViews = await Product.find({ $and: [{ userId: req.user.id, approvedStatus: 'approved' }] }).populate('categoryId').sort({ views: 'DESC' });

        Product.find({ $and: [{ approvedStatus: 'pending', userId: req.user.id }] }).count().then(pendingCount => {
            Product.find({ $and: [{ userId: req.user.id, type: "product" }] }).count().then(countProduct => {
                Product.find({ $and: [{ approvedStatus: 'approved', userId: req.user.id }] }).count().then(approvedCount => {
                    Product.find({ $and: [{ approvedStatus: 'refused', userId: req.user.id }] }).count().then(refusedCount => {
                        Product.find({ $and: [{ userId: req.user.id, type: "service" }] }).count().then(countService => {
                            res.render('dashboard/dashboard', {
                                countProduct: countProduct,
                                pendingCount: pendingCount,
                                approvedCount: approvedCount,
                                refusedCount: refusedCount,
                                countService: countService,
                                getProductViews: getProductViews
                            });
                        })
                    })
                })
            })
        })
    }

    static async logout(req, res) {
        req.logout(() => {
            req.flash("success_msg", "Deslogado com sucesso!")
            res.redirect('/login')
        });
    }

    static async profile(req, res) {
        res.render('dashboard/pages/profile',
            {
                error_msg: req.flash('error_msg'),
                success_msg: req.flash('success_msg')
            })
    }

    static async saveProfile(req, res) {

        const { id, name, surname, stateRegistration, socialReason, website, fantasyName, cep, county, address, district, complement, addressNumber, celNumber, phoneNumber } = req.body

        const user = await User.findById(id);

        console.log(name)

        if (!name) {
            req.flash('error_msg', 'O campo nome não pode ser vazio!')
            res.redirect('/account/profile');
            return
        }
        user.name = name

        if (!surname) {
            req.flash('error_msg', 'O campo sobrenome não pode ser vazio!')
            res.redirect('/account/profile');
            return
        }
        user.surname = surname

        if (!stateRegistration) {
            req.flash('error_msg', 'O campo inscrição estadual não pode ser vazio!')
            res.redirect('/account/profile');
            return
        }
        user.stateRegistration = stateRegistration

        if (!socialReason) {
            req.flash('error_msg', 'O campo razão social não pode ser vazio!')
            res.redirect('/account/profile');
            return
        }
        user.socialReason = socialReason

        if (!fantasyName) {
            req.flash('error_msg', 'O campo nome fantasia não pode ser vazio!')
            res.redirect('/account/profile');
            return
        }
        user.fantasyName = fantasyName

        if (website) {
            user.webSite = website
        }

        if (!cep) {
            req.flash('error_msg', 'O campo cep não pode ser vazio!')
            res.redirect('/account/profile');
            return
        }
        user.cep = cep

        if (!county) {
            req.flash('error_msg', 'O campo cidade não pode ser vazio!')
            res.redirect('/account/profile');
            return
        }
        user.county = county

        if (!address) {
            req.flash('error_msg', 'O campo endereço não pode ser vazio!')
            res.redirect('/account/profile');
            return
        }
        user.address = address

        if (!district) {
            req.flash('error_msg', 'O campo bairro não pode ser vazio!')
            res.redirect('/account/profile');
            return
        }
        user.district = district

        if (!complement) {
            req.flash('error_msg', 'O campo complemento não pode ser vazio!')
            res.redirect('/account/profile');
            return
        }
        user.complement = complement

        if (!addressNumber) {
            req.flash('error_msg', 'O campo numero não pode ser vazio!')
            res.redirect('/account/profile');
            return
        }

        user.addressNumber = addressNumber

        if (!celNumber) {
            req.flash('error_msg', 'O campo celular não pode ser vazio!')
            res.redirect('/account/profile');
            return
        }
        user.celNumber = celNumber

        if (!phoneNumber) {
            req.flash('error_msg', 'O campo celular não pode ser vazio!')
            res.redirect('/account/profile');
            return
        }
        user.phoneNumber = phoneNumber

        if (req.file) {
            user.image = req.file.filename
        }


        try {
            await User.findOneAndUpdate(
                { _id: user._id },
                { $set: user },
                { new: true }
            )

            req.flash('success_msg', 'Perfil atualizado com sucesso!');
            res.redirect('/account/profile');
        } catch (error) {
            req.flash('error_msg', 'Erro ao editar o perfil! essa ação foi gravada!')
            console.log(`Erro ao editar o perfil ID : ${id} : (ERROR INFO : ${error})`)
        }

    }

    static async resetPassword(req, res) {
        res.render('dashboard/pages/resetPassword', {
            error_msg: req.flash('error_msg'),
            success_msg: req.flash('success_msg')
        });
    }

    static async saveResetPassword(req, res) {
        const id = req.user.id
        const { currentPassword, password, confirmPassword } = req.body

        const user = await User.findById(id)

        //bcrypt
        const checkPassword = await bcrypt.compare(currentPassword, user.password);

        if (!currentPassword) {
            req.flash('error_msg', 'A senha atual precisa ser preenchida')
            res.redirect('/account/profile/resetPassword')
            return
        }

        if (!password) {
            req.flash('error_msg', 'A senha nao pode ser vazio!')
            res.redirect('/account/profile/resetPassword')
            return
        }
        if (!confirmPassword) {
            req.flash('error_msg', 'A confirmação da senha nao pode ser vazio!')
            res.redirect('/account/profile/resetPassword')
            return
        }

        if (password !== confirmPassword) {
            req.flash('error_msg', 'A senha e confirmação de senha não sao iguais!')
            res.redirect('/account/profile/resetPassword')
            return
        }

        if (!checkPassword) {
            req.flash('error_msg', 'Senha atual nao confere!')
            res.redirect('/account/profile/resetPassword')
            return
        }


        //Create new hash password
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        try {
            await User.findById(id).then((user) => {
                user.password = passwordHash

                user.save().then(() => {
                    req.logout(() => {
                        req.flash('success_msg', 'Senha alterada! por favor realize o login novamente!')
                        res.redirect('/login')
                    })
                }).catch(error => {
                    req.flash('error_msg', 'Erro ao alterar a senha!')
                    console.log(error)
                    res.redirect('/account/profile/resetPassword')
                })
            })
        } catch (error) {
            console.log(error)
            req.flash('error_msg', 'Erro ao alterar a senha!')
            res.redirect('/account/profile/resetPassword')
        }
    }

    static async ticket(req, res) {
        const getAllTicket = await Ticket.find({ userId: req.user.id }).populate('categoryId');

        res.render('dashboard/pages/ticket/ticket', {
            error_msg: req.flash('error_msg'),
            success_msg: req.flash('success_msg'),
            getAllTicket: getAllTicket
        })
    }

    static async newTicket(req, res) {

        const categoryTicket = await CategoryTicket.find();

        res.render('dashboard/pages/ticket/newTicket', {
            error_msg: req.flash('error_msg'),
            success_msg: req.flash('success_msg'),
            categoryTicket: categoryTicket
        })
    }

    static async saveNewTicket(req, res) {

        const { title, category, description } = req.body

        if (!title) {
            req.flash('error_msg', 'O titulo precisa ser preenchido!')
            res.redirect('/account/ticket/new')
            return
        }

        if (!category || category === '') {
            req.flash('error_msg', 'A categoria precisa ser selecionada!')
            res.redirect('/account/ticket/new')
            return
        }

        if (!description) {
            req.flash('error_msg', 'A descrição precisa ser preenchido!')
            res.redirect('/account/ticket/new')
            return
        }


        function createRandonId() {
            return `#${Math.floor(Math.random() * 100000)}`;
        }

        let getTicketId = await Ticket.findOne({ ticketId: createRandonId() });

        if (getTicketId) {
            createRandonId()
        }


        const registerTicket = new Ticket({
            ticketId: createRandonId(),
            title,
            description,
            categoryId: category,
            userId: req.user.id,
        })

        try {
            registerTicket.save();
            req.flash('success_msg', 'Ticket Criado com sucesso!');
            res.redirect('/account/ticket');
        } catch (error) {
            console.log('Erro ao criar o ticket ' + error);
        }
    }

    static async myTicket(req, res) {
        const id = req.params.id

        const getTicket = await Ticket.findById(id).populate('categoryId').populate('userId');
        const categoryTicket = await CategoryTicket.find();
        const answerTicket = await AnswerTicket.find({ ticketId: id }).populate('userId')
        res.render('dashboard/pages/ticket/viewTicket', {
            error_msg: req.flash('error_msg'),
            success_msg: req.flash('success_msg'),
            getTicket: getTicket,
            categoryTicket: categoryTicket,
            answerTicket: answerTicket
        })
    }

    static async answerTicket(req, res) {
        const { id, name, body } = req.body

        const getTicket = await Ticket.findById(id);


        if (!body) {
            req.flash('error_msg', 'O corpo da mensagem precisa ser preenchido!');
            res.redirect(`/account/ticket/${id}`);
            return
        }

        const answer = new AnswerTicket({
            name: req.user.name,
            body,
            ticketId: getTicket.id,
            userId: req.user.id
        })


        try {
            await answer.save()
            await Ticket.findById(id).then(ticket => {
                ticket.status = "answered"
                ticket.save()
            })

            req.flash('success_msg', 'Resposta enviada!');
            res.redirect(`/account/ticket/${id}`);
        } catch (error) {
            req.flash('error_msg', 'Erro ao enviar a resposta! Contate um administrador!');
            res.redirect(`/account/ticket/${id}`);
        }
    }

    static async editBusinessProfile(req, res) {
        const user = await User.findById(req.user.id);

        res.render('dashboard/pages/businessProfile/businessProfile', {
            error_msg: req.flash('error_msg'),
            success_msg: req.flash('success_msg'),
            user: user
        })
    }

    static async saveEditBusinessProfile(req, res) {
        const { urlprofile, activebusinessprofile } = req.body
        const id = req.user.id;


        console.log(activebusinessprofile)

        try {
            await User.findById(id).then((user) => {

                user.urlProfile = urlprofile
                user.enableProfile = activebusinessprofile

                if (req.file) {
                    user.bannerProfile = req.file.filename
                }

                if (activebusinessprofile == undefined) {
                    user.enableProfile = false
                }

                user.save().then(() => {
                    req.flash('success_msg', 'Perfil comercial salvo com sucesso!')
                    res.redirect('/account/businessProfile')
                }).catch((err) => {
                    req.flash('error_msg', 'Erro ao salvar o perfil comercial!')
                    res.redirect('/account/businessProfile')
                })
            })
        } catch (error) {
            req.flash('error_msg', 'Erro interno!')
            console.log(`Erro ao salvar o perfil comercial do usuario ${req.user.id} ${req.user.name}, MSG do error: ${error}`)
            res.redirect('/account/businessProfile')
        }
    }
}

module.exports = UserController