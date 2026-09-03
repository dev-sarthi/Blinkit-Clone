const Product = require('../models/Product');
const Category = require('../models/Category');

// GET / — Home page: categories grid + featured products
exports.getHome = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    const products = await Product.find({ isActive: true })
      .populate('category')
      .sort({ createdAt: -1 })
      .limit(12);

    res.render('products/home', { title: 'QuickKart — Groceries in Minutes', categories, products });
  } catch (err) {
    req.flash('error', 'Failed to load home page.');
    res.redirect('/');
  }
};

// GET /products?category=slug&search=term&page=1
exports.getListing = async (req, res) => {
  try {
    const { category, search, page = 1 } = req.query;
    const limit = 12;
    const skip = (parseInt(page) - 1) * limit;

    const filter = { isActive: true };
    let pageTitle = 'All Products';

    if (category) {
      const cat = await Category.findOne({ slug: category });
      if (cat) {
        filter.category = cat._id;
        pageTitle = cat.name;
      }
    }

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
      pageTitle = `Search: "${search}"`;
    }

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate('category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(total / limit);

    res.render('products/listing', {
      title: pageTitle,
      products,
      currentPage: parseInt(page),
      totalPages,
      category: category || '',
      search: search || '',
    });
  } catch (err) {
    req.flash('error', 'Failed to load products.');
    res.redirect('/');
  }
};

// GET /products/:id — Product detail page
exports.getDetail = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product || !product.isActive) {
      return res.status(404).render('errors/404', { title: 'Product Not Found' });
    }

    // Get related products from same category
    const related = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
      isActive: true,
    }).limit(4);

    res.render('products/detail', { title: product.name, product, related });
  } catch (err) {
    res.status(404).render('errors/404', { title: 'Product Not Found' });
  }
};
