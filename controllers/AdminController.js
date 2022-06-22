const slugify = require('slugify')
const passport = require('passport')
const bcrypt = require('bcrypt');


//Model
const Category = require('../models/CategoryModel');
const Product = require('../models/ProductModel');
const User = require('../models/UserModel');
const Service = require('../models/ServiceModel');


class AdminController {

    static async index(req, res) {
        const user = req.user

        let peddingProduct = await Product.find({ approvedStatus: 'pending' }).populate('userId').populate('categoryId').limit(15);

        let peddingUser = await User.find({ approvedStatus: 'pending' }).limit(15)


        let countFornecedores = await User.find().count();
        let countProducts = await Product.find().count();
        let countService = await Service.find().count();

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
            peddingUser: peddingUser
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
            user: user
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
}

module.exports = AdminController