const express = require('express')
const router = express.Router();
const { isUser } = require('../helpers/eUser')
const { imageUpload } = require('../helpers/imageUpload');
//Controllers
const UserController = require('../controllers/userController');

router.get('/', isUser, UserController.index);
router.get('/logout', isUser, UserController.logout);

//Products
router.get('/new/product', isUser, UserController.newProduct);
router.get('/products', isUser, UserController.listProduct);
router.get('/products/editproduct/:id', isUser, UserController.editProduct);
router.post('/products/editproduct/save', isUser, imageUpload.single('image'), UserController.saveEditProduct);
router.post('/new/product/save', isUser, imageUpload.single('image'), UserController.saveNewProduct);
router.post('/products/delete/:id', isUser, UserController.deleteProduct);

//Services
router.get('/new/service', isUser, UserController.newService);
router.post('/new/service/save', isUser, imageUpload.single('image'), UserController.saveNewService);
router.get('/services', isUser, UserController.listService);
router.get('/services/edit/id/:id', isUser, UserController.editService);
router.post('/services/edit/save', isUser, imageUpload.single('image'), UserController.saveEditService);
router.post('/services/delete', isUser, UserController.deleteService);
//Profile
router.get('/profile', isUser, UserController.profile);
router.post('/profile/save', isUser, imageUpload.single('image'), UserController.saveProfile);

//Suport
router.get('/ticket', isUser, UserController.ticket);
router.get('/ticket/new', isUser, UserController.newTicket);
router.post('/ticket/new/save', isUser, UserController.saveNewTicket);

module.exports = router;