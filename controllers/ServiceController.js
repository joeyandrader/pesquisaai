'use strict';

//Models
const Category = require('../models/CategoryModel');
const Product = require('../models/ProductModel');
const User = require('../models/UserModel');


module.exports = class ServiceController {
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

        //Register service
        const service = new Product({
            type: "service",
            name,
            description,
            userId: userId,
            categoryId: category,
            active: activeProduct,
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

        const service = await Product.find({ $and: [{ userId: id, type: "service" }] });

        res.render('dashboard/pages/services/listService', {
            error_msg: req.flash('error_msg'),
            success_msg: req.flash('success_msg'),
            service: service
        })
    }

    static async editService(req, res) {
        const id = req.params.id

        const category = await Category.find()
        const service = await Product.findById(id).populate('userId').populate('categoryId');
        res.render('dashboard/pages/services/editService', {
            error_msg: req.flash('error_msg'),
            success_msg: req.flash('success_msg'),
            category: category,
            service: service
        })
    }

    static async saveEditService(req, res) {

        const { id, name, description, category, activeProduct } = req.body

        const service = await Product.findById(id);

        if (!name) {
            req.flash('error_msg', 'O nome nao pode ser vazio!')
            res.redirect(`/account/services/edit/id/${id}`)
            return
        } else if (service.name !== name) {
            service.name = name
            service.approvedStatus = "pending"
        }


        if (!description) {
            req.flash('error_msg', 'A descrição nao pode ser vazio!')
            res.redirect(`/account/services/edit/id/${id}`)
            return
        } else if (service.description !== description) {
            service.name = description
            service.approvedStatus = "pending"
        }

        if (category === '') {
            req.flash('error_msg', 'A categoria nao pode ser vazio!')
            res.redirect(`/account/services/edit/id/${id}`)
            return
        } else if (service.categoryId != category) {
            service.categoryId = category
            service.approvedStatus = "pending"
        }

        if (activeProduct) {
            service.active = activeProduct
        } else if (activeProduct == undefined) {
            service.active = true
        }

        if (req.file) {
            service.image = req.file.filename
            service.approvedStatus = "pending"
        }

        try {
            await Product.findOneAndUpdate(
                { _id: id },
                { $set: service },
                { new: true }
            )
            req.flash('success_msg', 'Serviço editado com sucesso!')
            res.redirect('/account/services');
        } catch (error) {
            req.flash('error_msg', 'Erro ao editar o serviço! o erro foi gravado!')
            res.redirect(`/account/services/edit/id/${id}`)
            console.log(`Erro ao editar o Serviço ID: ${id} : ${error}`)
            res.redirect('/account/services');
        }


    }


    static async deleteService(req, res) {
        const id = req.body.id

        if (!isNaN(id)) {
            req.flash('error_msg', 'erro na requisição, essa ação foi gravada!')
            res.redirect('/account/services')
            return
        }

        await Product.findByIdAndDelete(id).then(() => {
            req.flash('success_msg', 'Serviço Deletado com sucesso!')
            res.redirect('/account/services')
        }).catch(error => {
            req.flash('error_msg', 'Erro ao deletar serviços!')
            res.redirect('/account/services')
        })
    }
}