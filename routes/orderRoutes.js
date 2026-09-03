const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { requireAuth } = require('../middleware/authMiddleware');

router.use(requireAuth);

router.get('/checkout', orderController.getCheckout);
router.post('/place', orderController.placeOrder);
router.get('/confirmation/:id', orderController.getConfirmation);
router.get('/history', orderController.getHistory);

module.exports = router;
