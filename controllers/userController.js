const res = require('express/lib/response');
const passport = require('passport');

//Models
const Product = require('../models/ProductModel');
const Category = require('../models/CategoryModel');
const User = require('../models/UserModel');
const Service = require('../models/ServiceModel');
const Ticket = require('../models/TicketModel');
const CategoryTicket = require('../models/CategoryTicketModel');

class UserController {
    static async index(req, res) {

        const getProductViews = await Product.find({ $and: [{ userId: req.user.id, approvedStatus: 'approved' }] }).populate('categoryId').sort({ views: 'DESC' });

        Product.find({ $and: [{ approvedStatus: 'pending', userId: req.user.id }] }).count().then(pendingCount => {
            Product.find({ userId: req.user.id }).count().then(countProduct => {
                Product.find({ $and: [{ approvedStatus: 'approved', userId: req.user.id }] }).count().then(approvedCount => {
                    Product.find({ $and: [{ approvedStatus: 'refused', userId: req.user.id }] }).count().then(refusedCount => {
                        Service.find().then(service => {
                            res.render('dashboard/dashboard', {
                                countProduct: countProduct,
                                pendingCount: pendingCount,
                                approvedCount: approvedCount,
                                refusedCount: refusedCount,
                                service: service,
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

    static async newProduct(req, res) {
        await Category.find().then(category => {
            res.render('dashboard/pages/products/registerProduct', {
                category: category,
                error_msg: req.flash('error_msg'),
                success_msg: req.flash('success_msg')
            });
        })
    }

    static async saveNewProduct(req, res) {
        const { name, description, productOrigin, brand, category, productStatus, activeProduct } = req.body
        const userId = req.user.id;

        if (!name) {
            req.flash('error_msg', 'O nome do produto precisa ser preenchido!');
            res.redirect("/user/new/product");
            return
        }

        if (!req.file) {
            req.flash('error_msg', 'A foto do produto é obrigatorio');
            res.redirect("/user/new/product");
            return
        }

        if (!description) {
            req.flash('error_msg', 'A descrição precisa ser preenchido!');
            res.redirect("/user/new/product");
            return
        }
        if (!productOrigin) {
            req.flash('error_msg', 'A origem do produto precisa ser preenchido!');
            res.redirect("/user/new/product");
            return
        }
        if (!brand) {
            req.flash('error_msg', 'A marca do produto precisa ser preenchido!');
            res.redirect("/user/new/product");
            return
        }
        if (category === "") {
            req.flash('error_msg', 'O categoria do produto precisa ser preenchido!');
            res.redirect("/user/new/product");
            return
        }
        if (productStatus === "") {
            req.flash('error_msg', 'O status do produto precisa ser preenchido!');
            res.redirect("/user/new/product");
            return
        }

        //get Category

        const product = new Product({
            name,
            description,
            productOrigin,
            brand,
            categoryId: category,
            userId: userId,
            productStatus,
            notActive: activeProduct,
            image: req.file.filename
        })

        console.log(activeProduct)

        try {
            const saveProduct = await product.save();
            req.flash('success_msg', 'Produto cadastrado com sucesso!');
            res.redirect('/user/new/product');
        } catch (error) {
            console.log('Erro ao cadastrar produto ' + error)
        }
    }

    static async listProduct(req, res) {
        const id = req.user.id;
        const product = await Product.find({ userId: id })

        function formatDate(date) {
            return date.toLocaleString();
        }

        res.render('dashboard/pages/products/listProduct', {
            error_msg: req.flash('error_msg'),
            success_msg: req.flash('success_msg'),
            product: product,
            formatDate: formatDate
        })
    }

    static async editProduct(req, res) {
        const id = req.params.id

        Product.findById(id).populate('categoryId').then(product => {
            Category.find().then(category => {
                res.render('dashboard/pages/products/editProduct', {
                    product: product,
                    category: category,
                    error_msg: req.flash('error_msg'),
                    success_msg: req.flash('success_msg')
                })
            })
        })
    }

    static async saveEditProduct(req, res) {
        const { id, name, brand, productOrigin, category, description, productStatus, activeProduct } = req.body

        const product = await Product.findById(id);

        if (!name) {
            req.flash('error_msg', 'O campo nome está vazio')
            return
        } else if (product.name !== name) {
            product.name = name
            product.approvedStatus = "pending"
        }

        if (!brand) {
            req.flash('error_msg', 'O campo marca está vazio')
            return
        } else if (product.brand !== brand) {
            product.brand = brand
            product.approvedStatus = "pending"
        }


        if (!productOrigin) {
            req.flash('error_msg', 'O campo de origem está vazio')
            return
        } else if (product.productOrigin !== productOrigin) {
            product.productOrigin = productOrigin
            product.approvedStatus = "pending"
        }

        if (!description) {
            req.flash('error_msg', 'O campo de descrição está vazio')
            return
        } else if (product.description !== description) {
            product.description = description
            product.approvedStatus = "pending"
        }


        if (!category) {
            req.flash('error_msg', 'O campo de descrição está vazio')
            return
        } else if (product.categoryId[0].id !== category) {
            product.categoryId = category
            product.approvedStatus = "pending"
        }


        if (req.file) {
            product.image = req.file.filename
        }

        if (activeProduct) {
            product.notActive = true
            product.approvedStatus
        } else {
            product.notActive = false
            product.approvedStatus
        }

        try {
            await Product.findOneAndUpdate(
                { _id: product._id },
                { $set: product },
                { new: true }
            )

            req.flash('success_msg', 'Produto editado com sucesso!')
            res.redirect('/user/myproducts');

        } catch (error) {
            req.flash('error_msg', 'Erro ao editar o produto! o erro foi gravado!')
            console.log(`Erro ao editar o produto ID: ${id} : ${error}`)
            res.redirect('/user/myproducts');
        }



    }

    static async newService(req, res) {
        Category.find().then(category => {
            res.render('dashboard/pages/services/registerService', {
                error_msg: req.flash('error_msg'),
                success_msg: req.flash('success_msg'),
                category: category,
            })
        })
    }

    static async saveNewService(req, res) {
        const { name, description, category, activeProduct } = req.body
        const userId = req.user.id;

        let image = ''

        if (!name) {
            req.flash('error_msg', 'O nome do serviço precisa ser preenchido!');
            res.redirect("/user/new/service");
            return
        }

        if (!description) {
            req.flash('error_msg', 'A descrição precisa ser preenchido!');
            res.redirect("/user/new/service");
            return
        }

        if (category === "") {
            req.flash('error_msg', 'O categoria do serviço precisa ser preenchido!');
            res.redirect("/user/new/service");
            return
        }

        //Register product
        const service = new Service({
            name,
            description,
            userId: userId,
            categoryId: category,
            notActive: activeProduct,
            image: req.file.filename
        })

        try {
            const newService = await service.save();
            req.flash('success_msg', 'Serviço cadastrado com sucesso!')
            req.flash('succes_msg', '*O serviço vai ser analisado em ate 2 dias você será notificado, caso aprovado o produto estará visivel no site!*')
            res.redirect('/user/new/service')
        } catch (error) {
            console.log('Erro ao cadastrar serviço ' + error)
        }
    }


    static async listService(req, res) {
        const id = req.user.id;

        const service = await Service.find({ userId: id })
        res.render('dashboard/pages/services/listService', {
            error_msg: req.flash('error_msg'),
            success_msg: req.flash('success_msg'),
            service: service
        })
    }


    static async profile(req, res) {
        res.render('dashboard/pages/profile',
            {
                error_msg: req.flash('error_msg'),
                success_msg: req.flash('success_msg')
            })
    }

    static async saveProfile(req, res) {

        const { id, name, surname, stateRegistration, socialReason, fantasyName, cep, county, address, district, complement, addressNumber, celNumber, phoneNumber } = req.body

        const user = await User.findById(id);

        console.log(name)

        if (!name) {
            req.flash('error_msg', 'O campo nome não pode ser vazio!')
            res.redirect('/user/profile');
            return
        }
        user.name = name

        if (!surname) {
            req.flash('error_msg', 'O campo sobrenome não pode ser vazio!')
            res.redirect('/user/profile');
            return
        }
        user.surname = surname

        if (!stateRegistration) {
            req.flash('error_msg', 'O campo inscrição estadual não pode ser vazio!')
            res.redirect('/user/profile');
            return
        }
        user.stateRegistration = stateRegistration

        if (!socialReason) {
            req.flash('error_msg', 'O campo razão social não pode ser vazio!')
            res.redirect('/user/profile');
            return
        }
        user.socialReason = socialReason

        if (!fantasyName) {
            req.flash('error_msg', 'O campo nome fantasia não pode ser vazio!')
            res.redirect('/user/profile');
            return
        }
        user.fantasyName = fantasyName

        if (!cep) {
            req.flash('error_msg', 'O campo cep não pode ser vazio!')
            res.redirect('/user/profile');
            return
        }
        user.cep = cep

        if (!county) {
            req.flash('error_msg', 'O campo cidade não pode ser vazio!')
            res.redirect('/user/profile');
            return
        }
        user.county = county

        if (!address) {
            req.flash('error_msg', 'O campo endereço não pode ser vazio!')
            res.redirect('/user/profile');
            return
        }
        user.address = address

        if (!district) {
            req.flash('error_msg', 'O campo bairro não pode ser vazio!')
            res.redirect('/user/profile');
            return
        }
        user.district = district

        if (!complement) {
            req.flash('error_msg', 'O campo complemento não pode ser vazio!')
            res.redirect('/user/profile');
            return
        }
        user.complement = complement

        if (!addressNumber) {
            req.flash('error_msg', 'O campo numero não pode ser vazio!')
            res.redirect('/user/profile');
            return
        }
        user.addressNumber = addressNumber

        if (!celNumber) {
            req.flash('error_msg', 'O campo celular não pode ser vazio!')
            res.redirect('/user/profile');
            return
        }
        user.celNumber = celNumber

        if (!phoneNumber) {
            req.flash('error_msg', 'O campo celular não pode ser vazio!')
            res.redirect('/user/profile');
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
            res.redirect('/user/profile');
        } catch (error) {
            req.flash('error_msg', 'Erro ao editar o perfil! essa ação foi gravada!')
            console.log(`Erro ao editar o perfil ID : ${id} : (ERROR INFO : ${error})`)
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
            res.redirect('/user/ticket/new')
            return
        }

        if (!category || category === '') {
            req.flash('error_msg', 'A categoria precisa ser selecionada!')
            res.redirect('/user/ticket/new')
            return
        }

        if (!description) {
            req.flash('error_msg', 'A descrição precisa ser preenchido!')
            res.redirect('/user/ticket/new')
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
            res.redirect('/user/ticket');
        } catch (error) {
            console.log('Erro ao criar o ticket ' + error);
        }
    }
}

module.exports = UserController