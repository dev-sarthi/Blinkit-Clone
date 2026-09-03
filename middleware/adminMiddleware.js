/**
 * Admin-only middleware. Must be used AFTER requireAuth.
 */
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    req.flash('error', 'Access denied. Admins only.');
    return res.redirect('/');
  }
  next();
};

module.exports = { requireAdmin };
