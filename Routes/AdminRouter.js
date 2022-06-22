const express = require('express')
const router = express.Router();
const AdminController = require('../controllers/AdminController');
const { isUser, isAdmin } = require('../helpers/eUser');


router.get('/user', isAdmin, AdminController.users);
router.get('/user/edit/id/:id', isAdmin, AdminController.userEdit);

router.get('/categorys', isAdmin, AdminController.listCategorys);
router.get('/categorys/new', isAdmin, AdminController.addCategory)
router.post('/categorys/save', isAdmin, AdminController.saveNewCategory);
router.get('/', isAdmin, AdminController.index);

module.exports = router