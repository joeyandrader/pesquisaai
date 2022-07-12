'use strict';

//Models
const Category = require('../models/CategoryModel');
const Product = require('../models/ProductModel');
const User = require('../models/UserModel');



module.exports = class ProductController {

    static async viewProduct(req, res) {

        const numPage = req.params.num;

        var limitPage = 16;
        var offSet = 0;

        if (isNaN(numPage) || numPage === 1) {
            offSet = 0;
        } else {
            offSet = parseInt(numPage) * limitPage;
        }

        const reqSearch = new RegExp(req.query.search, 'i')
        // console.log(req.query.typeSearch)



        //Get URL params
        var searchUrl = `?search=${req.query.search}`;


        console.log(req.query.typeSearch)

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
            Product.findById(idItem).populate('userId').limit(8).then(itemDetail => {
                if (itemDetail.notActive === true || itemDetail.approvedStatus === 'refused' || itemDetail.approvedStatus === 'pending') {
                    res.redirect('/')
                } else {
                    Product.find({ categoryId: itemDetail.categoryId }).populate('userId').then(relatedProduct => {
                        res.render('pages/itemDetails', {
                            category: category,
                            itemDetail: itemDetail,
                            relatedProduct: relatedProduct
                        })
                    })
                }
            }).catch(err => {
                res.redirect('/')
            })
        })
    }


    // USER PRODUCT
    static async newProduct(req, res) {
        await Category.find().then(category => {
            res.render('dashboard/pages/products/registerProduct', {
                category: category,
                error_msg: req.flash('error_msg'),
                success_msg: req.flash('success_msg'),
                name: req.flash('name'),
                description: req.flash('description'),
                brand: req.flash('brand'),
                productStatus: req.flash('productStatus'),
                activeProduct: req.flash('activeProduct')
            });
        })
    }


    static async saveNewProduct(req, res) {
        const { name, description, brand, category, productStatus, activeProduct } = req.body
        const userId = req.user.id;

        req.flash('name', name)
        req.flash('description', description)
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
            type: 'product',
            name,
            description,
            brand,
            categoryId: category,
            userId: userId,
            productStatus,
            active: activeProduct,
            image: req.file.filename
        })

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
        const product = await Product.find({ $and: [{ userId: id, type: "product" }] });

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
        const { id, name, brand, category, description, activeProduct } = req.body

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
        } else if (product.categoryId != category) {
            product.categoryId = category
            product.approvedStatus = "pending"
        }


        if (activeProduct) {
            product.active = activeProduct
        } else if (activeProduct == undefined) {
            product.active = true
        }


        if (req.file) {
            product.image = req.file.filename
            product.approvedStatus = "pending"
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
            res.redirect(`/account/products/edit/id/${id}`)
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


    static async getAllCategorys(req, res) {
        let categoryId = req.params.id
        let getNameCategory = await Category.findById(categoryId);

        let numPage = req.params.num;

        var limitPage = 16;
        var offSet = 0;

        if (isNaN(numPage) || numPage === 1) {
            offSet = 0;
        } else {
            offSet = parseInt(numPage) * limitPage;
        }

        //Get URL params
        var searchUrl

        await Product.find({ $and: [{ categoryId: categoryId, approvedStatus: "approved" }] }).limit(limitPage).skip(offSet).populate('categoryId').then(allProducts => {
            req.flash('success_msg', `Resultado da busca pela categoria:  ${getNameCategory.name}`);
            Category.find().then(category => {
                Product.find({
                    $and: [{ categoryId: categoryId, approvedStatus: "approved" }]
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
}