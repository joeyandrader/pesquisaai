const express = require('express');
const router = express.Router();

//Controllers 
const IndexController = require('../controllers/indexController');
const ProductController = require('../controllers/ProductController');

//Index
router.get('/', IndexController.index);
router.get('/about', IndexController.about);
router.get('/contact', IndexController.contact);


//Register and login
router.get('/register', IndexController.register);
router.get('/login', IndexController.login);
router.post('/register/save', IndexController.saveRegister);
router.post('/login/authenticate', IndexController.userAuth);
router.get('/resetpassword', IndexController.resetPassword);


//Product
router.get('/products/page/:num', ProductController.viewProduct);
router.get('/products/details/:id', ProductController.productDetails);


//Categorys
router.get('/search/category/:id/page/:num', ProductController.getAllCategorys);


//Profile comercial
router.get('/profile/:comercialProfile', IndexController.suplierProfile);



module.exports = router