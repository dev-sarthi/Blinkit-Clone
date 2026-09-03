const Cart = require('../models/Cart');
const Product = require('../models/Product');

// GET /cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    let items = [];
    let total = 0;

    if (cart && cart.items.length > 0) {
      items = cart.items
        .filter(item => item.product) // filter out deleted products
        .map(item => {
          const price = item.product.discountPrice || item.product.price;
          const subtotal = price * item.quantity;
          total += subtotal;
          return { ...item.toObject(), subtotal, effectivePrice: price };
        });
    }

    res.render('cart/cart', { title: 'Your Cart', items, total });
  } catch (err) {
    req.flash('error', 'Failed to load cart.');
    res.redirect('/');
  }
};

// POST /cart/add
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const qty = Math.max(1, parseInt(quantity));

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      req.flash('error', 'Product not found.');
      return res.redirect(req.get('Referrer') || '/');
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const existingIdx = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (existingIdx > -1) {
      cart.items[existingIdx].quantity += qty;
    } else {
      cart.items.push({ product: productId, quantity: qty });
    }

    await cart.save();
    req.flash('success', `${product.name} added to cart!`);
    res.redirect(req.get('Referrer') || '/');
  } catch (err) {
    req.flash('error', 'Could not add item to cart.');
    res.redirect(req.get('Referrer') || '/');
  }
};

// POST /cart/update
exports.updateCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const qty = Math.max(1, parseInt(quantity));

    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      const item = cart.items.find(i => i.product.toString() === productId);
      if (item) {
        item.quantity = qty;
        await cart.save();
        req.flash('success', 'Cart updated.');
      }
    }
    res.redirect('/cart');
  } catch (err) {
    req.flash('error', 'Could not update cart.');
    res.redirect('/cart');
  }
};

// POST /cart/remove
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = cart.items.filter(i => i.product.toString() !== productId);
      await cart.save();
      req.flash('success', 'Item removed from cart.');
    }
    res.redirect('/cart');
  } catch (err) {
    req.flash('error', 'Could not remove item from cart.');
    res.redirect('/cart');
  }
};
