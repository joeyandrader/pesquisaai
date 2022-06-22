const bcrypt = require('bcrypt');
const passport = require('passport')


//Models
const Category = require('../models/CategoryModel');
const Product = require('../models/ProductModel');
const User = require('../models/UserModel');
const Service = require('../models/ServiceModel');

class IndexController {
    static async index(req, res) {
        Product.find().limit(8).sort({ createdAt: 'DESC' }).populate('userId').then(product => {
            Category.find().then(category => {
                Service.find().then(service => {
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
        res.render('pages/about', {
            category: category
        })
    }

    static async contact(req, res) {
        const category = await Category.find();
        res.render('pages/contact', {
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
        } catch (error) {
            console.log(error)
        }
    }

    static async confirmAccount(req, res) {
        res.send('Confirmar conta');
    }

    static async login(req, res) {

        if (req.user) {
            res.redirect('/user')
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
            successRedirect: '/user',
            failureRedirect: "/login",
            failureFlash: true
        })(req, res, next)
    }

    static async resetPassword(req, res) {
        res.render('pages/resetPassword', {
            error_msg: req.flash('error_msg'),
            success_msg: req.flash('success')
        })
    }

    static async viewProduct(req, res) {

        const numPage = req.params.num;

        var limitPage = 8;
        var offSet = 0;

        if (isNaN(numPage) || numPage === 1) {
            offSet = 0;
        } else {
            offSet = parseInt(numPage) * limitPage;
        }

        //Ordena os produtos de acordo com a URL passada no GET
        const urlAsc = '/products?orderProduct=asc'
        const urlDesc = '/products?orderProduct=desc'
        const getUrl = req.url
        let orderByString = ''
        if (getUrl == urlAsc) {
            orderByString = 'ASC'
        } else if (getUrl == urlDesc) {
            orderByString = 'DESC'
        } else {
            orderByString = 'DESC'
        }

        // FIM do OrderBy
        const reqSearch = new RegExp(req.query.search, 'i')
        // console.log(req.query.typeSearch)



        //Get URL params
        var searchUrl = `?typeSearch=${req.query.typeSearch}&search=${req.query.search}`;


        Product.find({
            $and: [
                { approvedStatus: 'approved' },
                { notActive: false }
            ],
            $or: [
                { name: reqSearch },
                { brand: reqSearch },
            ],
        }).limit(limitPage).skip(offSet).sort({ createdAt: 'DESC' }).populate('userId').populate('categoryId').then(allProducts => {
            Category.find().then(category => {

                Product.find({
                    $and: [
                        { approvedStatus: 'approved' },
                        { notActive: false }
                    ],
                    $or: [
                        { name: reqSearch },
                        { brand: reqSearch },
                    ],
                }).count().then(countProduct => {

                    var next;
                    if (offSet + limitPage >= countProduct) {
                        next = false
                    } else {
                        next = true
                    }

                    var resultPage = {
                        page: parseInt(numPage),
                        next: next,
                        allProducts: allProducts,
                    }

                    var pages = Math.ceil(countProduct / limitPage);
                    var totalPage = Array.from({ length: pages }).map((item, index) => {
                        return index
                    });

                    res.render('pages/viewsProducts', {
                        category: category,
                        error_msg: req.flash('error_msg'),
                        resultPage: resultPage,
                        searchUrl: searchUrl,
                        totalPage: totalPage,
                        countProduct: countProduct
                    })
                })

            })
        })
    }


    static async productDetails(req, res) {
        let idItem = req.params.id

        const getProduct = await Product.findById(idItem)

        if (getProduct) {
            await Product.updateOne({ _id: idItem }, { $inc: { views: 1 } })
        }


        await Category.find().then(category => {
            Product.findById(idItem).populate('userId').then(itemDetail => {
                if (itemDetail.notActive === true || itemDetail.approvedStatus === 'refused' || itemDetail.approvedStatus === 'pending') {
                    res.redirect('/')
                } else {
                    Product.find({ categoryId: itemDetail.categoryId }).then(relatedProduct => {
                        res.render('pages/itemDetails', { category: category, itemDetail: itemDetail, relatedProduct: relatedProduct })
                    })
                }
            }).catch(err => {
                res.redirect('/')
            })
        })
    }



    static async getAllCategorys(req, res) {
        let categoryId = req.params.id
        let getNameCategory = await Category.findById(categoryId);

        let numPage = req.params.num;

        var limitPage = 2;
        var offSet = 0;

        if (isNaN(numPage) || numPage === 1) {
            offSet = 0;
        } else {
            offSet = parseInt(numPage) * limitPage;
        }

        //Get URL params
        var searchUrl

        console.log(getNameCategory.name)
        await Product.find({ categoryId: categoryId }).limit(limitPage).skip(offSet).populate('categoryId').then(allProducts => {
            req.flash('success_msg', `Resultado da busca pela categoria:  ${getNameCategory.name}`);
            Category.find().then(category => {
                Product.find({
                    categoryId: categoryId
                }).count().then(countProduct => {

                    var next;
                    if (offSet + limitPage >= countProduct) {
                        next = false
                    } else {
                        next = true
                    }

                    var resultPage = {
                        page: parseInt(numPage),
                        next: next,
                        allProducts: allProducts,
                    }

                    var pages = Math.ceil(countProduct / limitPage);
                    var totalPage = Array.from({ length: pages }).map((item, index) => {
                        return index
                    });

                    res.render('pages/ViewsCategorys', {
                        allProducts: allProducts,
                        category: category,
                        success_msg: req.flash('success_msg'),
                        countProduct: countProduct,
                        resultPage: resultPage,
                        totalPage: totalPage,
                        searchUrl: searchUrl,
                        categoryId: categoryId
                    })
                })
            })
        })
    }

    static async providerProfile(req, res) {
        const urlProfile = req.params.comercialProfile

        const getInfoProfile = await User.findOne({ urlProfile: urlProfile })

        if (getInfoProfile) {
            if (getInfoProfile.enableProfile) {
                const category = await Category.find();
                res.render('pages/profilePage',
                    {
                        category: category
                    }
                )
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