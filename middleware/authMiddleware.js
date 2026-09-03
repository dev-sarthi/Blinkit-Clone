const { verifyToken } = require('../utils/generateToken');
const User = require('../models/User');
const Cart = require('../models/Cart');

/**
 * Soft auth — runs on EVERY request.
 * If a valid JWT cookie exists, sets req.user and res.locals.user.
 * Also loads cart count for the header badge.
 * Never blocks the request; unauthenticated users simply get req.user = null.
 */
const setUser = async (req, res, next) => {
  res.locals.user = null;
  res.locals.cartCount = 0;
  req.user = null;

  const token = req.cookies && req.cookies.token;
  if (!token) return next();

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-password');
    if (user) {
      req.user = user;
      res.locals.user = user;

      // Load cart count for header badge
      const cart = await Cart.findOne({ user: user._id });
      if (cart) {
        res.locals.cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
      }
    }
  } catch (_err) {
    // Invalid/expired token — clear cookie silently
    res.clearCookie('token');
  }
  next();
};

/**
 * Hard auth — used on protected routes.
 * Redirects to /login if user is not authenticated.
 */
const requireAuth = (req, res, next) => {
  if (!req.user) {
    req.flash('error', 'Please log in to continue.');
    return res.redirect('/auth/login');
  }
  next();
};

module.exports = { setUser, requireAuth };
