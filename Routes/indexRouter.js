const express = require('express');
const router = express.Router();

//Controllers 
const IndexController = require('../controllers/indexController');

router.get('/', IndexController.index);
router.get('/about', IndexController.about);
router.get('/contact', IndexController.contact);
router.get('/register', IndexController.register);
router.get('/login', IndexController.login);
router.post('/register/save', IndexController.saveRegister);
router.post('/login/authenticate', IndexController.userAuth);
router.get('/products/page/:num', IndexController.viewProduct);
router.get('/products/details/:id', IndexController.productDetails);
router.get('/search/category/:id/page/:num', IndexController.getAllCategorys);
router.get('/f/:comercialProfile', IndexController.providerProfile);

router.get('/resetpassword', IndexController.resetPassword)

module.exports = router