const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { requireAuth } = require('../middleware/authMiddleware');

router.use(requireAuth);

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.post('/update', cartController.updateCart);
router.post('/remove', cartController.removeFromCart);

module.exports = router;
