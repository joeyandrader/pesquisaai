const slugify = require('slugify')
const passport = require('passport')
const bcrypt = require('bcrypt');
const { enviarEmail } = require('../helpers/nodemailer');

//Model
const Category = require('../models/CategoryModel');
const Product = require('../models/ProductModel');
const User = require('../models/UserModel');
const TicketCategory = require('../models/CategoryTicketModel');
const Ticket = require('../models/TicketModel');


class AdminController {

    static async index(req, res) {
        const user = req.user

        let peddingProduct = await Product.find({ approvedStatus: 'pending' }).populate('userId').populate('categoryId').limit(15);

        let peddingUser = await User.find({ approvedStatus: 'pending' }).limit(15)


        let countFornecedores = await User.find().count();
        let countProducts = await Product.find({ type: "product" }).count();
        let countService = await Product.find({ type: "service" }).count();

        let countProductPending = await Product.find({ approvedStatus: 'pending' }).count();
        let countProductApproved = await Product.find({ approvedStatus: 'approved' }).count();
        let countProductRefused = await Product.find({ approvedStatus: 'refused' }).count();
        res.render('admin/dashboard', {
            user: user,
            peddingProduct: peddingProduct,
            countFornecedores: countFornecedores,
            countProducts: countProducts,
            countService: countService,
            countProductPending: countProductPending,
            countProductApproved: countProductApproved,
            countProductRefused: countProductRefused,
            peddingUser: peddingUser,
            error_msg: req.flash('error_msg'),
            success_msg: req.flash('success_msg')
        })
    }

    static async users(req, res) {

        const allUser = await User.find();

        res.render('admin/pages/users/listUser',
            {
                allUser: allUser
            }
        )
    }

    static async userEdit(req, res) {
        const id = req.params.id
        const user = await User.findById(id);
        res.render('admin/pages/users/editUser', {
            user: user,
            error_msg: req.flash('error_msg'),
            success_msg: req.flash('success_msg')
        })
    }

    static async saveUserEdit(req, res) {

        const { id, name, surname, email, webSite, stateRegistration, fantasyName, socialReason, cep, county, address, uf, district, addressNumber, complement, celNumber, phoneNumber, approvedStatus, accountType } = req.body

        if (!name) {
            req.flash('error_msg', 'O Nome não pode ser vazio!')
            res.redirect(`/admin/user/edit/id/${id}`);
            return
        }
        if (!surname) {
            req.flash('error_msg', 'O sobrenome não pode ser vazio!')
            res.redirect(`/admin/user/edit/id/${id}`);
            return
        }
        if (!email) {
            req.flash('error_msg', 'O email não pode ser vazio!')
            res.redirect(`/admin/user/edit/id/${id}`);
            return
        }
        if (!stateRegistration) {
            req.flash('error_msg', 'A inscrição estadual não pode ser vazio!')
            res.redirect(`/admin/user/edit/id/${id}`);
            return
        }
        if (!fantasyName) {
            req.flash('error_msg', 'O nome fantasia não pode ser vazio!')
            res.redirect(`/admin/user/edit/id/${id}`);
            return
        }
        if (!socialReason) {
            req.flash('error_msg', 'A razão social não pode ser vazio!')
            res.redirect(`/admin/user/edit/id/${id}`);
            return
        }
        if (!cep) {
            req.flash('error_msg', 'O cep não pode ser vazio!')
            res.redirect(`/admin/user/edit/id/${id}`);
            return
        }
        if (!county) {
            req.flash('error_msg', 'A cidade não pode ser vazio!')
            res.redirect(`/admin/user/edit/id/${id}`);
            return
        }
        if (!address) {
            req.flash('error_msg', 'O endereço não pode ser vazio!')
            res.redirect(`/admin/user/edit/id/${id}`);
            return
        }
        if (!uf) {
            req.flash('error_msg', 'A UF não pode ser vazio!')
            res.redirect(`/admin/user/edit/id/${id}`);
            return
        }
        if (!district) {
            req.flash('error_msg', 'O bairro não pode ser vazio!')
            res.redirect(`/admin/user/edit/id/${id}`);
            return
        }
        if (!addressNumber) {
            req.flash('error_msg', 'O numero não pode ser vazio!')
            res.redirect(`/admin/user/edit/id/${id}`);
            return
        }
        if (!complement) {
            req.flash('error_msg', 'O complemento não pode ser vazio!')
            res.redirect(`/admin/user/edit/id/${id}`);
            return
        }
        if (!complement) {
            req.flash('error_msg', 'O complemento não pode ser vazio!')
            res.redirect(`/admin/user/edit/id/${id}`);
            return
        }
        if (!celNumber) {
            req.flash('error_msg', 'O numero de celular não pode ser vazio!')
            res.redirect(`/admin/user/edit/id/${id}`);
            return
        }
        if (!phoneNumber) {
            req.flash('error_msg', 'O numero de telefone não pode ser vazio!')
            res.redirect(`/admin/user/edit/id/${id}`);
            return
        }


        await User.findById(id).then(user => {
            user.name = name
            user.surname = surname
            user.email = email
            user.webSite = webSite
            user.stateRegistration = stateRegistration
            user.fantasyName = fantasyName
            user.socialReason = socialReason
            user.cep = cep
            user.county = county
            user.address = address
            user.uf = uf
            user.district = district
            user.addressNumber = addressNumber
            user.complement = complement
            user.celNumber = celNumber
            user.phoneNumber = phoneNumber
            user.approvedStatus = approvedStatus
            user.accountType = accountType

            if (user.approvedStatus === 'approved') {
                enviarEmail(
                    `Pesquisa Aí - Status da sua conta!`,
                    `${email}`,
                    `Parabens ${name} ${surname} sua conta foi aprovada!`,
                    `Parabens ${name} ${surname} sua conta foi aprovada!`,
                    `
                    <h1>Parabéns!</h1>
                    <h2>Olá ${name} ${surname}</h2>
                    <h4>Sua conta CNPJ: ${user.cnpj} foi APROVADA!</h4>
                    <h4>Você pode acessar esse <a href="${process.env.URL}/login" target="blank">link</a> e logar na sua conta</h4>
                    <br />
                    <p>Você pode cadastrar seus produtos e serviços! lembrando que os mesmo passa por um processo de analise para ser liberados!</p>
                    `
                )
            }

            if (user.approvedStatus === 'refused') {
                enviarEmail(
                    `Pesquisa Aí - Status da sua conta!`,
                    `${email}`,
                    `Ops ${name} ${surname} sua conta foi RECUSADA!`,
                    `Lamentamos muito ${name} ${surname} mas sua conta foi recusada! 🙁`,
                    `
                    <h1>Lamento ${fantasyName}!</h1>
                    <h2>Olá ${name} ${surname}</h2>
                    <h4>Sua conta CNPJ: ${user.cnpj} foi recusada!</h4>
                    <h4><strong>Motivo: </strong> Motivo tal e tal e tal, (criar dinamicamente)</h4>
                    <br />
                    <h3>Você pode acessar esse <a href="${process.env.URL}" target="blank">link</a> e corrigir os dados preenchidos!</h3>
                    `
                )
            }

            if (user.approvedStatus === 'pending') {
                enviarEmail(
                    `Pesquisa Aí - Status da sua conta!`,
                    `${email}`,
                    `Olá ${name} ${surname} sua conta está PENDENTE!`,
                    `Sua conta está pendente para analise novamente!`,
                    `
                    <h1>Não se preocupe ${fantasyName}! sua conta está em analise novamente! 😊</h1>
                    <h4><strong>Motivo: </strong> Motivo tal e tal e tal, (criar dinamicamente)</h4>
                    <br />
                    <h3>Você pode acessar esse <a href="${process.env.URL}" target="blank">link</a> e corrigir os dados preenchidos!</h3>
                    `
                )
            }

            user.save().then(() => {
                req.flash('success_msg', 'Fornecedor editado com sucesso!');
                res.redirect(`/admin/user/edit/id/${id}`)
            }).catch((error) => {
                req.flash('error_msg', 'Error interno : ERROR : ' + error);
                res.redirect(`/admin/user/edit/id/${id}`)
            })
        }).catch((error) => {
            req.flash('error_msg', 'Erro ao salvar a edição! ERROR: ' + error);
            res.redirect(`/admin/user/edit/id/${id}`)
        })

    }



    static async listCategorys(req, res) {
        const getAllCategory = await Category.find();
        res.render('admin/pages/categorys/listCategory', {
            error_msg: req.flash('error_msg'),
            success_msg: req.flash('success_msg'),
            getAllCategory: getAllCategory
        })
    }


    static async addCategory(req, res) {
        res.render('admin/pages/categorys/addCategory', {
            error_msg: req.flash('error_msg')
        })
    }


    static async saveNewCategory(req, res) {
        const { name } = req.body

        if (!name) {
            req.flash('error_msg', 'Categoria precisa ser preenchida');
            res.redirect('/admin/categorys');
            return
        }

        let nameUpperCase = name.toUpperCase()

        const category = new Category({
            name: nameUpperCase,
            slugify: slugify(name).toUpperCase()
        })

        try {
            const newCategory = await category.save()
            req.flash('success_msg', 'Categoria adicionada com sucesso!')
            res.redirect('/admin/categorys')
        } catch (error) {
            console.log("Erro ao adicionar uma categoria :" + error)
        }
    }

    static async editCategory(req, res) {
        const id = req.params.id

        const category = await Category.findById(id);

        res.render('admin/pages/categorys/editCategory', {
            category: category
        })
    }

    static async saveEditCategory(req, res) {
        const { id, name } = req.body

        if (!name) {
            req.flash('error_msg', 'O nome não pode ser vazio!')
            res.redirect(`/admin/category/edit/id/${id}`)
            return
        }

        let nameUpperCase = name.toUpperCase()

        await Category.findById(id).then(category => {
            category.name = nameUpperCase
            category.slugify = slugify(nameUpperCase)

            category.save().then(() => {
                req.flash('success_msg', 'Categoria editada com sucesso!')
                res.redirect('/admin/categorys')
            }).catch(error => {
                req.flash('error_msg', 'Erro Interno ERROR: ' + error)
                res.redirect(`/admin/category/edit/id/${id}`)
            })
        }).catch(error => {
            req.flash('error_msg', 'Erro ao editar a categoria ERROR: ' + error)
            res.redirect(`/admin/category/edit/id/${id}`)
        })
    }

    static async approvedProduct(req, res) {
        const { id } = req.body

        await Product.findById(id).then(product => {
            product.approvedStatus = "approved"

            product.save().then(() => {
                req.flash('success_msg', 'Produto aprovado!');
                res.redirect('/admin')
            }).catch(error => {
                req.flash('error_msg', 'Erro interno! ERRO : ' + error);
                res.redirect('/admin')
            })
        }).catch(error => {
            req.flash('error_msg', 'Erro ao aprovar o produto! ERROR : ' + error);
            res.redirect('/admin')
        })
    }

    static async pendingProduct(req, res) {
        const { id } = req.body

        await Product.findById(id).then(product => {
            product.approvedStatus = "pending"

            product.save().then(() => {
                req.flash('success_msg', 'Produto alterado para pendente com sucesso!');
                res.redirect('/admin')
            }).catch(error => {
                req.flash('error_msg', 'Erro interno! ERRO : ' + error);
                res.redirect('/admin')
            })
        }).catch(error => {
            req.flash('error_msg', 'Erro ao alterar para pendente o produto! ERROR : ' + error);
            res.redirect('/admin')
        })
    }

    static async refusedProduct(req, res) {
        const { id } = req.body

        await Product.findById(id).then(product => {
            product.approvedStatus = "refused"

            product.save().then(() => {
                req.flash('success_msg', 'Produto alterado para recusado com sucesso!!');
                res.redirect('/admin')
            }).catch(error => {
                req.flash('error_msg', 'Erro interno! ERRO : ' + error);
                res.redirect('/admin')
            })
        }).catch(error => {
            req.flash('error_msg', 'Erro ao recusar o produto! ERROR : ' + error);
            res.redirect('/admin')
        })
    }

    static async products(req, res) {
        const product = await Product.find().populate('userId').populate('categoryId');
        res.render('admin/pages/products/products',
            {
                product: product
            }
        )
    }

    static async editProduct(req, res) {
        const id = req.params.id
        const product = await Product.findById(id).populate('categoryId').populate('userId');
        const category = await Category.find();
        res.render('admin/pages/products/editProduct',
            {
                error_msg: req.flash('error_msg'),
                success_msg: req.flash('success_msg'),
                product: product,
                category: category
            }
        )
    }

    static async saveEditProduct(req, res) {
        const { id, name, brand, productOrigin, category, description, approvedStatus } = req.body

        if (!name) {
            req.flash('error_msg', 'O nome não pode ser vazio!')
            res.redirect(`/admin/products/edit/id/${id}`);
            return
        }
        if (!brand) {
            req.flash('error_msg', 'A marca não pode ser vazio!')
            res.redirect(`/admin/products/edit/id/${id}`);
            return
        }
        if (!productOrigin) {
            req.flash('error_msg', 'A origem do produto não pode ser vazio!')
            res.redirect(`/admin/products/edit/id/${id}`);
            return
        }
        if (category === '') {
            req.flash('error_msg', 'A categoria precisa ser selecionada!')
            res.redirect(`/admin/products/edit/id/${id}`);
            return
        }

        if (!description) {
            req.flash('error_msg', 'A descrição do produto não pode ser vazio!')
            res.redirect(`/admin/products/edit/id/${id}`);
            return
        }

        await Product.findById(id).then(product => {
            product.name = name
            product.brand = brand
            product.productOrigin = productOrigin
            product.categoryId = category
            product.description = description
            product.approvedStatus = approvedStatus

            product.save().then(() => {
                req.flash('success_msg', 'Produto editado com sucesso!')
                res.redirect(`/admin/products/edit/id/${id}`);
            }).catch((error) => {
                req.flash('error_msg', 'Erro Interno! ERROR : ' + error)
                res.redirect(`/admin/products/edit/id/${id}`);
                return
            })
        }).catch((error) => {
            req.flash('error_msg', 'Erro ao editar o produto ERROR : ' + error)
            res.redirect(`/admin/products/edit/id/${id}`);
            return
        })
    }


    static async services(req, res) {

        const services = await Service.find().populate('userId').populate('categoryId');

        res.render('admin/pages/services/services',
            {
                error_msg: req.flash('error_msg'),
                success_msg: req.flash('success_msg'),
                services: services
            }
        )
    }

    static async editServices(req, res) {
        const id = req.params.id
        const service = await Service.findById(id).populate('categoryId').populate('userId');
        const category = await Category.find();

        res.render('admin/pages/services/editService', {
            error_msg: req.flash('error_msg'),
            success_msg: req.flash('success_msg'),
            service: service,
            category: category
        })
    }

    static async saveEditService(req, res) {
        const { id, name, category, description, approvedStatus } = req.body

        if (!name) {
            req.flash('error_msg', 'O nome nao pode ser vazio!')
            res.redirect(`/admin/services/edit/id/${id}`)
            return
        }
        if (category === '') {
            req.flash('error_msg', 'Selecione uma categoria!')
            res.redirect(`/admin/services/edit/id/${id}`)
            return
        }
        if (!description) {
            req.flash('error_msg', 'A descrição nao pode ser vazio!')
            res.redirect(`/admin/services/edit/id/${id}`)
            return
        }

        await Service.findById(id).then(service => {
            service.name = name
            service.categoryId = category
            service.description = description
            service.approvedStatus = approvedStatus

            service.save().then(() => {
                req.flash('success_msg', 'Serviço atualizado com sucesso!')
                res.redirect(`/admin/services/edit/id/${id}`)
            }).catch((error) => {
                req.flash('error_msg', 'Erro Interno ERROR : ' + error)
                res.redirect(`/admin/services/edit/id/${id}`);
                return
            })
        }).catch((error) => {
            req.flash('error_msg', 'Erro ao editar o serviço ERROR : ' + error)
            res.redirect(`/admin/services/edit/id/${id}`);
            return
        })
    }


    static async ticketCategory(req, res) {

        const ticketCategory = await TicketCategory.find();

        res.render('admin/pages/TicketCategorys/listCategory', {
            error_msg: req.flash('error_msg'),
            success_msg: req.flash('success_msg'),
            ticketCategory: ticketCategory
        })
    }

    static async newTicketCategory(req, res) {
        res.render('admin/pages/TicketCategorys/addCategory', {
            error_msg: req.flash('error_msg'),
            success_msg: req.flash('success_msg')
        });
    }

    static async saveNewTicketCategory(req, res) {
        const { name } = req.body

        if (!name) {
            req.flash('error_msg', 'O nome não pode ser vazio')
            res.redirect('/admin/categorys/ticket/new')
            return
        }

        const nameUpper = name.toUpperCase();

        const newCategory = new TicketCategory({
            name: nameUpper,
            slugify: slugify(nameUpper)
        })

        try {
            const saveCategory = await newCategory.save()
            req.flash('success_msg', 'Categoria criada com sucesso!')
            res.redirect('/admin/categorys/ticket')
        } catch (error) {
            req.flash('error_msg', 'Erro ao criar a categoria ticket, ERROR : ' + error)
            res.redirect('/admin/categorys/ticket')
        }
    }

    static async editTicketCategory(req, res) {
        const id = req.params.id
        const ticketCategory = await TicketCategory.findById(id);

        res.render('admin/pages/TicketCategorys/EditCategory', {
            ticketCategory: ticketCategory
        })
    }

    static async saveEditTicketCategory(req, res) {
        const { id, name } = req.body

        if (!name) {
            req.flash('error_msg', 'O nome não pode ser vazio')
            res.redirect('/admin/categorys/ticket/new')
            return
        }

        const nameUpper = name.toUpperCase();

        await TicketCategory.findById(id).then(ticketCategory => {
            ticketCategory.name = nameUpper
            ticketCategory.slugify = slugify(nameUpper)

            ticketCategory.save().then(() => {
                req.flash('success_msg', 'Categoria editada com sucesso!')
                res.redirect('/admin/categorys/ticket')
            }).catch(error => {
                req.flash('error_msg', 'Erro interno, ERROR : ' + error)
                res.redirect(`/admin/categorys/ticket/edit/id/${id}`)
            })
        }).catch(error => {
            req.flash('error_msg', 'Erro ao editar a categoria ticket, ERROR : ' + error)
            res.redirect(`/admin/categorys/ticket/edit/id/${id}`)
        })
    }

    static async deleteTicketCategory(req, res) {
        const { id } = req.body

        try {
            await TicketCategory.findByIdAndDelete(id);
            req.flash('success_msg', 'Categoria Ticket deletada com sucesso!')
            res.redirect('/admin/categorys/ticket')
        } catch (error) {
            req.flash('error_msg', 'Erro ao deletar a categoria!')
            console.log(`Erro ao deletar categoria Ticket : error ( ${error} )`)
            res.redirect('/admin/categorys/ticket')
        }
    }


    static async ticket(req, res) {
        const ticket = await Ticket.find().populate('userId').populate('categoryId');
        res.render('admin/pages/tickets/listTickets', {
            error_msg: req.flash('error_msg'),
            success_msg: req.flash('success_msg'),
            ticket: ticket
        });
    }
}

module.exports = AdminController