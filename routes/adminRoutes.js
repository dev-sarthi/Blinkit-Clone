const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const adminController = require('../controllers/adminController');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');

// Multer config for product image uploads
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    cb(null, ext && mime);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

router.use(requireAuth, requireAdmin);

// Dashboard
router.get('/', adminController.getDashboard);

// Products
router.get('/products', adminController.getProducts);
router.get('/products/add', adminController.getAddProduct);
router.post('/products/add', upload.single('image'), adminController.postAddProduct);
router.get('/products/edit/:id', adminController.getEditProduct);
router.post('/products/edit/:id', upload.single('image'), adminController.postEditProduct);
router.post('/products/delete/:id', adminController.deleteProduct);

// Categories
router.get('/categories', adminController.getCategories);
router.post('/categories/add', adminController.addCategory);
router.post('/categories/edit/:id', adminController.editCategory);
router.post('/categories/delete/:id', adminController.deleteCategory);

// Orders
router.get('/orders', adminController.getOrders);
router.get('/orders/:id', adminController.getOrderDetail);
router.post('/orders/:id/status', adminController.updateOrderStatus);

module.exports = router;
