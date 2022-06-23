const express = require('express')
const router = express.Router();
const AdminController = require('../controllers/AdminController');
const { isUser, isAdmin } = require('../helpers/eUser');


//index
router.get('/', isAdmin, AdminController.index);


//User
router.get('/user', isAdmin, AdminController.users);
router.get('/user/edit/id/:id', isAdmin, AdminController.userEdit);
router.post('/user/edit-user/save', isAdmin, AdminController.saveUserEdit);


//Categorys
router.get('/categorys', isAdmin, AdminController.listCategorys);
router.get('/categorys/new', isAdmin, AdminController.addCategory);
router.post('/categorys/save', isAdmin, AdminController.saveNewCategory);
router.get('/categorys/edit/id/:id', isAdmin, AdminController.editCategory);
router.post('/categorys/edit/save', isAdmin, AdminController.saveEditCategory);

//Products
router.post('/products/approved/', isAdmin, AdminController.approvedProduct);
router.post('/products/pending/', isAdmin, AdminController.pendingProduct);
router.post('/products/refused/', isAdmin, AdminController.refusedProduct);
router.get('/products', isAdmin, AdminController.products);
router.get('/products/edit/id/:id', isAdmin, AdminController.editProduct);
router.post('/products/edit/save', isAdmin, AdminController.saveEditProduct);


//services
router.get('/services', isAdmin, AdminController.services);
router.get('/services/edit/id/:id', isAdmin, AdminController.editServices);
router.post('/service/edit/save', isAdmin, AdminController.saveEditService);


//Ticket Category
router.get('/categorys/ticket', isAdmin, AdminController.ticketCategory);
router.get('/categorys/ticket/new', isAdmin, AdminController.newTicketCategory);
router.post('/categorys/ticket/save', isAdmin, AdminController.saveNewTicketCategory);
router.get('/categorys/ticket/edit/id/:id', isAdmin, AdminController.editTicketCategory);
router.post('/categorys/ticket/edit/save', isAdmin, AdminController.saveEditTicketCategory);
router.post('/categorys/ticket/delete/', isAdmin, AdminController.deleteTicketCategory);

//Ticket
router.get('/ticket', isAdmin, AdminController.ticket);

module.exports = router