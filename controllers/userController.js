const res = require('express/lib/response');
const passport = require('passport');
const { generateCodeJwt } = require('../helpers/ConfirmAccount');
//Models
const Product = require('../models/ProductModel');
const Category = require('../models/CategoryModel');
const User = require('../models/UserModel');
const Service = require('../models/ServiceModel');
const Ticket = require('../models/TicketModel');
const CategoryTicket = require('../models/CategoryTicketModel');

class UserController {
    static async index(req, res) {

        generateCodeJwt(req.user);

        const getProductViews = await Product.find({ $and: [{ userId: req.user.id, approvedStatus: 'approved' }] }).populate('categoryId').sort({ views: 'DESC' });

        Product.find({ $and: [{ approvedStatus: 'pending', userId: req.user.id }] }).count().then(pendingCount => {
            Product.find({ userId: req.user.id }).count().then(countProduct => {
                Product.find({ $and: [{ approvedStatus: 'approved', userId: req.user.id }] }).count().then(approvedCount => {
                    Product.find({ $and: [{ approvedStatus: 'refused', userId: req.user.id }] }).count().then(refusedCount => {
                        Service.find({ userId: req.user.id }).count().then(countService => {
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

    static async newProduct(req, res) {
        await Category.find().then(category => {
            res.render('dashboard/pages/products/registerProduct', {
                category: category,
                error_msg: req.flash('error_msg'),
                success_msg: req.flash('success_msg'),
                name: req.flash('name'),
                description: req.flash('description'),
                productOrigin: req.flash('productOrigin'),
                brand: req.flash('brand'),
                productStatus: req.flash('productStatus'),
                activeProduct: req.flash('activeProduct')
            });
        })
    }

    static async saveNewProduct(req, res) {
        const { name, description, productOrigin, brand, category, productStatus, activeProduct } = req.body
        const userId = req.user.id;

        req.flash('name', name)
        req.flash('description', description)
        req.flash('productOrigin', productOrigin)
        req.flash('brand', brand)
        req.flash('productStatus', productStatus)
        req.flash('activeProduct', activeProduct)


        if (!name) {
            req.flash('error_msg', 'O nome do produto precisa ser preenchido!');
            res.redirect("/account/new/product");
            return
        }
        if (!brand) {
            req.flash('error_msg', 'A marca do produto precisa ser preenchido!');
            res.redirect("/account/new/product");
            return
        }
        if (!productOrigin) {
            req.flash('error_msg', 'A origem do produto precisa ser preenchido!');
            res.redirect("/account/new/product");
            return
        }
        if (category === "") {
            req.flash('error_msg', 'O categoria do produto precisa ser preenchido!');
            res.redirect("/account/new/product");
            return
        }
        if (!description) {
            req.flash('error_msg', 'A descrição precisa ser preenchido!');
            res.redirect("/account/new/product");
            return
        }
        if (!req.file) {
            req.flash('error_msg', 'A foto do produto é obrigatorio');
            res.redirect("/account/new/product");
            return
        }
        if (productStatus === "") {
            req.flash('error_msg', 'O status do produto precisa ser preenchido!');
            res.redirect("/account/new/product");
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
            res.redirect('/account/new/product');
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
            res.redirect(`/account/products/editproduct/${id}`)
            return
        } else if (product.name !== name) {
            product.name = name
            product.approvedStatus = "pending"
        }

        if (!brand) {
            req.flash('error_msg', 'O campo marca está vazio')
            res.redirect(`/account/products/editproduct/${id}`)
            return
        } else if (product.brand !== brand) {
            product.brand = brand
            product.approvedStatus = "pending"
        }


        if (!productOrigin) {
            req.flash('error_msg', 'O campo de origem está vazio')
            res.redirect(`/account/products/editproduct/${id}`)
            return
        } else if (product.productOrigin !== productOrigin) {
            product.productOrigin = productOrigin
            product.approvedStatus = "pending"
        }

        if (!description) {
            req.flash('error_msg', 'O campo de descrição está vazio')
            res.redirect(`/account/products/editproduct/${id}`)
            return
        } else if (product.description !== description) {
            product.description = description
            product.approvedStatus = "pending"
        }


        if (!category) {
            req.flash('error_msg', 'O campo de descrição está vazio')
            res.redirect(`/account/products/editproduct/${id}`)
            return
        } else if (product.categoryId[0].id !== category) {
            product.categoryId = category
            product.approvedStatus = "pending"
        }


        if (req.file) {
            product.image = req.file.filename
        }

        try {
            await Product.findOneAndUpdate(
                { _id: product._id },
                { $set: product },
                { new: true }
            )

            req.flash('success_msg', 'Produto editado com sucesso!')
            res.redirect('/account/products');

        } catch (error) {
            req.flash('error_msg', 'Erro ao editar o produto! o erro foi gravado!')
            res.redirect(`/account/products/editproduct/${id}`)
            console.log(`Erro ao editar o produto ID: ${id} : ${error}`)
            res.redirect('/account/products');
        }

    }

    static async deleteProduct(req, res) {
        const { id } = req.body

        try {
            await Product.findByIdAndDelete(id);
            res.redirect('/account/products')
        } catch (error) {
            req.flash('error_msg', 'Erro ao deletar o produto!')
            console.log(`O usuario ${req.user.cnpj} tentou deletar o produto id: ${id} e deu erro: ${error}`);
            res.redirect('/account/products')
        }
    }

    static async newService(req, res) {
        Category.find().then(category => {
            res.render('dashboard/pages/services/registerService', {
                error_msg: req.flash('error_msg'),
                success_msg: req.flash('success_msg'),
                category: category,
                name: req.flash('name'),
                description: req.flash('description')
            })
        })
    }

    static async saveNewService(req, res) {
        const { name, description, category, activeProduct } = req.body
        const userId = req.user.id;

        req.flash('name', name)
        req.flash('description', description)

        let image = ''

        if (!name) {
            req.flash('error_msg', 'O nome do serviço precisa ser preenchido!');
            res.redirect("/account/new/service");
            return
        }

        if (!description) {
            req.flash('error_msg', 'A descrição precisa ser preenchido!');
            res.redirect("/account/new/service");
            return
        }

        if (!req.file) {
            req.flash('error_msg', 'A image precisa ser selecionada!');
            res.redirect("/account/new/service");
            return
        }

        if (category === "") {
            req.flash('error_msg', 'O categoria do serviço precisa ser preenchido!');
            res.redirect("/account/new/service");
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
            res.redirect('/account/new/service')
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

    static async editService(req, res) {
        const id = req.params.id

        const category = await Category.find()
        const service = await Service.findById(id).populate('userId').populate('categoryId');
        res.render('dashboard/pages/services/editService', {
            error_msg: req.flash('error_msg'),
            success_msg: req.flash('success_msg'),
            category: category,
            service: service
        })
    }

    static async saveEditService(req, res) {

        const { id, name, description, category, activeProduct } = req.body

        if (!name) {
            req.flash('error_msg', 'O nome nao pode ser vazio!')
            res.redirect(`/account/services/edit/id/${id}`)
            return
        }
        if (!description) {
            req.flash('error_msg', 'A descrição nao pode ser vazio!')
            res.redirect(`/account/services/edit/id/${id}`)
            return
        }
        if (category === '') {
            req.flash('error_msg', 'A categoria nao pode ser vazio!')
            res.redirect(`/account/services/edit/id/${id}`)
            return
        }

        await Service.findById(id).then(service => {
            service.name = name
            service.description = description
            service.categoryId = category
            service.notActive = activeProduct

            if (req.file) {
                service.image = req.file.filename
            }

            service.save().then(() => {
                req.flash('success_msg', 'Serviço editado com sucesso!');
                res.redirect('/account/services')
            }).catch(error => {
                req.flash('error_msg', 'Erro interno! contate um administrador!');
                console.log(`erro ao editar produto ${id} ERROR : ${error}`)
                res.redirect('/account/services')
            })
        }).catch(error => {
            req.flash('error_msg', 'Erro ao atualizar o serviço, contate um administrador!');
            console.log(`erro ao editar produto ${id} ERROR : ${error}`)
            res.redirect('/account/services')
        })

    }

    static async deleteService(req, res) {
        const id = req.body.id

        if (!isNaN(id)) {
            req.flash('error_msg', 'erro na requisição, essa ação foi gravada!')
            res.redirect('/account/services')
            return
        }

        await Service.findByIdAndDelete(id).then(() => {
            req.flash('success_msg', 'Serviço Deletado com sucesso!')
            res.redirect('/account/services')
        }).catch(error => {
            req.flash('error_msg', 'Erro ao deletar serviços!')
            res.redirect('/account/services')
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
}

module.exports = UserController