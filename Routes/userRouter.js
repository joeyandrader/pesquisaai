const express = require('express')
const router = express.Router();
const { isUser } = require('../helpers/eUser')
const { imageUpload } = require('../helpers/imageUpload');

//Controllers
const UserController = require('../controllers/userController');
const ProductController = require('../controllers/ProductController');
const ServiceController = require('../controllers/ServiceController');

//User
router.get('/', isUser, UserController.index);
router.get('/logout', isUser, UserController.logout);


//Products
router.get('/new/product', isUser, ProductController.newProduct);
router.get('/products', isUser, ProductController.listProduct);
router.get('/products/editproduct/:id', isUser, ProductController.editProduct);
router.post('/products/editproduct/save', isUser, imageUpload.single('image'), ProductController.saveEditProduct);
router.post('/new/product/save', isUser, imageUpload.single('image'), ProductController.saveNewProduct);
router.post('/products/delete/:id', isUser, ProductController.deleteProduct);


//Services
router.get('/new/service', isUser, ServiceController.newService);
router.post('/new/service/save', isUser, imageUpload.single('image'), ServiceController.saveNewService);
router.get('/services', isUser, ServiceController.listService);
router.get('/services/edit/id/:id', isUser, ServiceController.editService);
router.post('/services/edit/save', isUser, imageUpload.single('image'), ServiceController.saveEditService);
router.post('/services/delete', isUser, ServiceController.deleteService);


//Profile
router.get('/profile', isUser, UserController.profile);
router.post('/profile/save', isUser, imageUpload.single('image'), UserController.saveProfile);
router.get('/profile/resetpassword', isUser, UserController.resetPassword);
router.post('/profile/resetPassword/save', isUser, UserController.saveResetPassword);


//Suport
router.get('/ticket', isUser, UserController.ticket);
router.get('/ticket/new', isUser, UserController.newTicket);
router.post('/ticket/new/save', isUser, UserController.saveNewTicket);
router.get('/ticket/:id', isUser, UserController.myTicket);
router.post('/ticket/answer/', isUser, UserController.answerTicket);


//export
module.exports = router;