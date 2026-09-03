const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth } = require('../middleware/authMiddleware');

router.use(requireAuth);

router.get('/profile', userController.getProfile);
router.post('/profile', userController.updateProfile);
router.get('/addresses', userController.getAddresses);
router.post('/addresses/add', userController.addAddress);
router.post('/addresses/edit/:id', userController.editAddress);
router.post('/addresses/delete/:id', userController.deleteAddress);

module.exports = router;
