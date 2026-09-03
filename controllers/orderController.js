const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Address = require('../models/Address');
const Product = require('../models/Product');

// GET /orders/checkout
exports.getCheckout = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      req.flash('error', 'Your cart is empty.');
      return res.redirect('/cart');
    }

    const addresses = await Address.find({ user: req.user._id });

    let total = 0;
    const items = cart.items
      .filter(item => item.product)
      .map(item => {
        const price = item.product.discountPrice || item.product.price;
        const subtotal = price * item.quantity;
        total += subtotal;
        return { ...item.toObject(), subtotal, effectivePrice: price };
      });

    res.render('orders/checkout', { title: 'Checkout', items, total, addresses });
  } catch (err) {
    req.flash('error', 'Failed to load checkout.');
    res.redirect('/cart');
  }
};

// POST /orders/place
exports.placeOrder = async (req, res) => {
  try {
    const { addressId, paymentMethod = 'cod' } = req.body;

    // 1. Get cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      req.flash('error', 'Your cart is empty.');
      return res.redirect('/cart');
    }

    // 2. Get address
    const address = await Address.findOne({ _id: addressId, user: req.user._id });
    if (!address) {
      req.flash('error', 'Please select a valid delivery address.');
      return res.redirect('/orders/checkout');
    }

    // 3. Atomically decrement stock for each item
    let totalAmount = 0;
    const orderItems = [];

    for (const cartItem of cart.items) {
      if (!cartItem.product) continue;

      const price = cartItem.product.discountPrice || cartItem.product.price;
      const qty = cartItem.quantity;

      // Atomic stock decrement with stock-check condition
      const updated = await Product.findOneAndUpdate(
        { _id: cartItem.product._id, stock: { $gte: qty } },
        { $inc: { stock: -qty } },
        { new: true }
      );

      if (!updated) {
        req.flash('error', `"${cartItem.product.name}" is out of stock or insufficient quantity. Please update your cart.`);
        return res.redirect('/cart');
      }

      orderItems.push({
        product: cartItem.product._id,
        name: cartItem.product.name,
        price,
        quantity: qty,
      });

      totalAmount += price * qty;
    }

    // 4. Create order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      address: {
        label: address.label,
        fullAddress: address.fullAddress,
        city: address.city,
        pincode: address.pincode,
        phone: address.phone,
      },
      totalAmount,
      paymentMethod,
    });

    // 5. Clear cart
    cart.items = [];
    await cart.save();

    req.flash('success', 'Order placed successfully!');
    res.redirect(`/orders/confirmation/${order._id}`);
  } catch (err) {
    req.flash('error', 'Failed to place order. Please try again.');
    res.redirect('/orders/checkout');
  }
};

// GET /orders/confirmation/:id
exports.getConfirmation = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) {
      return res.status(404).render('errors/404', { title: 'Order Not Found' });
    }
    res.render('orders/confirmation', { title: 'Order Confirmed', order });
  } catch (err) {
    res.status(404).render('errors/404', { title: 'Order Not Found' });
  }
};

// GET /orders/history
exports.getHistory = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.render('orders/history', { title: 'Order History', orders });
  } catch (err) {
    req.flash('error', 'Failed to load order history.');
    res.redirect('/');
  }
};
