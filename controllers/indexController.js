const bcrypt = require('bcrypt');
const passport = require('passport')
const { enviarEmail } = require('../helpers/nodemailer');


//Models
const Category = require('../models/CategoryModel');
const Product = require('../models/ProductModel');
const User = require('../models/UserModel');

class IndexController {
    static async index(req, res) {
        Product.find({ type: "products" }).limit(8).sort({ createdAt: 'DESC' }).populate('userId').then(product => {
            Category.find().then(category => {
                Product.find({ type: "service" }).then(service => {
                    res.render('home',
                        {
                            category: category,
                            product: product,
                            service: service
                        }
                    );
                })
            })
        })
    }

    static async about(req, res) {
        const category = await Category.find();
        res.render('pages/About', {
            category: category
        })
    }

    static async contact(req, res) {
        const category = await Category.find();
        res.render('pages/Contact', {
            category: category
        })
    }

    static async register(req, res) {

        if (req.user) {
            res.redirect('/user')
            return
        }

        Category.find().then(category => {
            res.render("pages/reg", {
                error_msg: req.flash("error_msg"), success_msg: req.flash("success_msg"),
                name: req.flash('name'),
                surname: req.flash('surname'),
                fantasyName: req.flash('fantasyName'),
                stateRegistration: req.flash('stateRegistration'),
                socialReason: req.flash('socialReason'),
                email: req.flash('email'),
                cnpj: req.flash('cnpj'),
                cpf: req.flash('cpf'),
                address: req.flash('address'),
                district: req.flash('district'),
                addressNumber: req.flash('addressNumber'),
                uf: req.flash('uf'),
                cep: req.flash('cep'),
                county: req.flash('county'),
                complement: req.flash('complement'),
                celNumber: req.flash('celNumber'),
                phoneNumber: req.flash('phoneNumber'),
                webSite: req.flash('webSite'),
                category: category
            })
        })
    }

    static async saveRegister(req, res) {

        const { name, surname, fantasyName, stateRegistration, socialReason, email, password, confirmPassword, cnpj, cpf, address, district, addressNumber, uf, cep, county, complement, celNumber, phoneNumber, confirmTerms } = req.body;

        //Get values input
        req.flash('cnpj', cnpj)
        req.flash('name', name)
        req.flash('surname', surname)
        req.flash('fantasyName', fantasyName)
        req.flash('stateRegistration', stateRegistration)
        req.flash('socialReason', socialReason)
        req.flash('email', email)
        req.flash('cpf', cpf)
        req.flash('address', address)
        req.flash('district', district)
        req.flash('addressNumber', addressNumber)
        req.flash('uf', uf)
        req.flash('cep', cep)
        req.flash('county', county)
        req.flash('complement', complement)
        req.flash('celNumber', celNumber)
        req.flash('phoneNumber', phoneNumber)

        //chek if user exist
        const findCnpj = await User.findOne({ cnpj: cnpj });

        if (findCnpj) {
            req.flash('error_msg', "Ja existe um usuario cadastrado com esse CNPJ");
            res.redirect('/register')
            return
        }

        //Validations
        if (!cnpj) {
            req.flash("error_msg", "O CNPJ precisa ser preenchido");
            res.redirect('/register')
            return
        }
        if (!stateRegistration) {
            req.flash("error_msg", "A inscrição estadual precisa ser preenchido");
            res.redirect('/register')
            return
        }
        if (!socialReason) {
            req.flash("error_msg", "O nome social precisa ser preenchido");
            res.redirect('/register')
            return
        }
        if (!fantasyName) {
            req.flash("error_msg", "O nome fantasia precisa ser preenchido");
            res.redirect('/register')
            return
        }
        if (!email) {
            req.flash("error_msg", "O email precisa ser preenchido");
            res.redirect('/register')
            return
        }
        if (!cpf) {
            req.flash("error_msg", "O CPF precisa ser preenchido");
            res.redirect('/register')
            return
        }
        if (!name) {
            req.flash("error_msg", "O nome precisa ser preenchido");
            res.redirect('/register')
            return
        }
        if (!surname) {
            req.flash("error_msg", "O sobrenome precisa ser preenchido");
            res.redirect('/register')
            return
        }
        if (!password) {
            req.flash("error_msg", "A senha precisa ser preenchido");
            res.redirect('/register')
            return
        }
        if (!confirmPassword) {
            req.flash("error_msg", "A confirmação da senha precisa ser preenchido");
            res.redirect('/register')
            return
        }
        if (!cep) {
            req.flash("error_msg", "O CEP precisa ser preenchido");
            res.redirect('/register')
            return
        }
        if (!county) {
            req.flash("error_msg", "A cidade precisa ser preenchido");
            res.redirect('/register')
            return
        }
        if (!uf) {
            req.flash("error_msg", "O UF precisa ser preenchido");
            res.redirect('/register')
            return
        }
        if (!address) {
            req.flash("error_msg", "O Endereço precisa ser preenchido");
            res.redirect('/register')
            return
        }
        if (!district) {
            req.flash("error_msg", "O bairro precisa ser preenchido");
            res.redirect('/register')
            return
        }
        if (!addressNumber) {
            req.flash("error_msg", "O numero do endereço precisa ser preenchido");
            res.redirect('/register')
            return
        }
        if (!complement) {
            req.flash("error_msg", "O complemento precisa ser preenchido");
            res.redirect('/register')
            return
        }
        if (!celNumber) {
            req.flash("error_msg", "O celular precisa ser preenchido");
            res.redirect('/register')
            return
        }
        if (!phoneNumber) {
            req.flash("error_msg", "O telefone precisa ser preenchido");
            res.redirect('/register')
            return
        }
        if (!confirmTerms) {
            req.flash("error_msg", "O termo precisa ser confirmado");
            res.redirect('/register')
            return
        }

        //Confirm Password
        if (password !== confirmPassword) {
            req.flash("error_msg", "As senhas não sao iguais");
            res.redirect('/register')
            return
        }

        if (password.length < 6) {
            req.flash("error_msg", "A senha é muito curta!")
            res.redirect('/register')
            return
        }


        //Create HashPassword
        const salt = bcrypt.genSaltSync(12);
        const passwordHash = bcrypt.hashSync(password, salt)

        const user = new User({
            name,
            surname,
            fantasyName,
            stateRegistration,
            socialReason,
            email,
            password: passwordHash,
            cnpj,
            cpf,
            address,
            district,
            addressNumber,
            uf,
            cep,
            county,
            complement,
            celNumber,
            phoneNumber,
            confirmTerms: true,
        });

        try {
            const newUser = await user.save()
            req.flash('success_msg', 'Cadastro realizado!')
            res.redirect('/login')

            enviarEmail(
                "Bem vindo ao Pesquisa Aí",
                `${email}`,
                `Bem vindo ao Pesquisa Aí ${name} ${surname}`,
                `Olá ${name} ${surname}`,
                `
                <h2>Olá ${name} ${surname}</h2>, 
                que bom ter você com a gente! sua conta atualmente está <strong>Pendente</strong>
                <br>
                <p>Daremos um prazo de ate 2 dias uteis para que sua conta seja analisada, caso for aprovado enviaremos um email informando!</p>
                <p>Duvidas acesse nosso <a href="http://www.google.com.br" target="blank">FAQ</a></p>
                `
            );
        } catch (error) {
            console.log(error)
        }
    }

    static async confirmAccount(req, res) {
        res.send('Confirmar conta');
    }

    static async login(req, res) {

        if (req.user) {
            res.redirect('/account')
            return
        }

        const category = Category.find().then(category => {
            res.render('pages/login', {
                success_msg: req.flash('success_msg'),
                error_msg: req.flash('error_msg'),
                cnpj: req.flash('cnpj'),
                category: category
            })
        });
    }

    static async userAuth(req, res, next) {
        passport.authenticate("local", {
            successRedirect: (req.session.returnTo || '/account'),
            failureRedirect: "/login",
            failureFlash: true
        })(req, res, next)
        delete req.session.returnTo;
    }

    static async resetPassword(req, res) {
        res.render('pages/resetPassword', {
            error_msg: req.flash('error_msg'),
            success_msg: req.flash('success')
        })
    }


    //Suplier Profile

    static async businessProfile(req, res) {

        const urlProfile = req.params.businessProfile
        const getInfoProfile = await User.findOne({ urlProfile: urlProfile })

        if (getInfoProfile) {
            const category = await Category.find({ userId: getInfoProfile.id });
            const product = await Product.find({ userId: getInfoProfile.id });
            
            if (getInfoProfile.enableProfile) {
                res.render('pages/profilePage', {
                    category: category,
                    getInfoProfile: getInfoProfile,
                    product: product
                })
            } else {
                req.flash('error_msg', 'Fornecedor nao encontrado!');
                res.redirect('/');
            }
        } else {
            req.flash('error_msg', 'Fornecedor nao encontrado!');
            res.redirect('/');
        }
    }
}



module.exports = IndexController