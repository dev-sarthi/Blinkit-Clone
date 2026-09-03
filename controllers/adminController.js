const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');

// GET /admin
exports.getDashboard = async (req, res) => {
  try {
    const [totalProducts, totalOrders, totalUsers, totalCategories] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments(),
      Category.countDocuments(),
    ]);

    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      totalProducts,
      totalOrders,
      totalUsers,
      totalCategories,
      recentOrders,
    });
  } catch (err) {
    req.flash('error', 'Failed to load dashboard.');
    res.redirect('/');
  }
};

// ─── PRODUCTS ────────────────────────────────────────────

// GET /admin/products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category').sort({ createdAt: -1 });
    res.render('admin/products', { title: 'Manage Products', products });
  } catch (err) {
    req.flash('error', 'Failed to load products.');
    res.redirect('/admin');
  }
};

// GET /admin/products/add
exports.getAddProduct = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.render('admin/product-form', { title: 'Add Product', product: null, categories });
  } catch (err) {
    req.flash('error', 'Failed to load form.');
    res.redirect('/admin/products');
  }
};

// POST /admin/products/add
exports.postAddProduct = async (req, res) => {
  try {
    const { name, description, price, discountPrice, category, stock, unit, isActive } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';

    await Product.create({
      name,
      description,
      price: parseFloat(price),
      discountPrice: discountPrice ? parseFloat(discountPrice) : null,
      category,
      image,
      stock: parseInt(stock) || 0,
      unit: unit || '1 pc',
      isActive: isActive === 'on' || isActive === 'true',
    });

    req.flash('success', 'Product created.');
    res.redirect('/admin/products');
  } catch (err) {
    req.flash('error', 'Could not create product.');
    res.redirect('/admin/products/add');
  }
};

// GET /admin/products/edit/:id
exports.getEditProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const categories = await Category.find().sort({ name: 1 });
    if (!product) {
      req.flash('error', 'Product not found.');
      return res.redirect('/admin/products');
    }
    res.render('admin/product-form', { title: 'Edit Product', product, categories });
  } catch (err) {
    req.flash('error', 'Failed to load product.');
    res.redirect('/admin/products');
  }
};

// POST /admin/products/edit/:id
exports.postEditProduct = async (req, res) => {
  try {
    const { name, description, price, discountPrice, category, stock, unit, isActive } = req.body;
    const updateData = {
      name,
      description,
      price: parseFloat(price),
      discountPrice: discountPrice ? parseFloat(discountPrice) : null,
      category,
      stock: parseInt(stock) || 0,
      unit: unit || '1 pc',
      isActive: isActive === 'on' || isActive === 'true',
    };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    await Product.findByIdAndUpdate(req.params.id, updateData);
    req.flash('success', 'Product updated.');
    res.redirect('/admin/products');
  } catch (err) {
    req.flash('error', 'Could not update product.');
    res.redirect('/admin/products');
  }
};

// POST /admin/products/delete/:id
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { isActive: false });
    req.flash('success', 'Product deactivated.');
    res.redirect('/admin/products');
  } catch (err) {
    req.flash('error', 'Could not deactivate product.');
    res.redirect('/admin/products');
  }
};

// ─── CATEGORIES ──────────────────────────────────────────

// GET /admin/categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.render('admin/categories', { title: 'Manage Categories', categories });
  } catch (err) {
    req.flash('error', 'Failed to load categories.');
    res.redirect('/admin');
  }
};

// POST /admin/categories/add
exports.addCategory = async (req, res) => {
  try {
    const { name, image } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    await Category.create({ name, slug, image: image || '' });
    req.flash('success', 'Category created.');
    res.redirect('/admin/categories');
  } catch (err) {
    req.flash('error', 'Could not create category.');
    res.redirect('/admin/categories');
  }
};

// POST /admin/categories/edit/:id
exports.editCategory = async (req, res) => {
  try {
    const { name, image } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    await Category.findByIdAndUpdate(req.params.id, { name, slug, image });
    req.flash('success', 'Category updated.');
    res.redirect('/admin/categories');
  } catch (err) {
    req.flash('error', 'Could not update category.');
    res.redirect('/admin/categories');
  }
};

// POST /admin/categories/delete/:id
exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    req.flash('success', 'Category deleted.');
    res.redirect('/admin/categories');
  } catch (err) {
    req.flash('error', 'Could not delete category.');
    res.redirect('/admin/categories');
  }
};

// ─── ORDERS ──────────────────────────────────────────────

// GET /admin/orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.render('admin/orders', { title: 'Manage Orders', orders });
  } catch (err) {
    req.flash('error', 'Failed to load orders.');
    res.redirect('/admin');
  }
};

// GET /admin/orders/:id
exports.getOrderDetail = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');
    if (!order) {
      req.flash('error', 'Order not found.');
      return res.redirect('/admin/orders');
    }
    res.render('admin/order-detail', { title: `Order #${order._id}`, order });
  } catch (err) {
    req.flash('error', 'Failed to load order.');
    res.redirect('/admin/orders');
  }
};

// POST /admin/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await Order.findByIdAndUpdate(req.params.id, { status });
    req.flash('success', 'Order status updated.');
    res.redirect('/admin/orders');
  } catch (err) {
    req.flash('error', 'Could not update order status.');
    res.redirect('/admin/orders');
  }
};
