require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const expressLayouts = require('express-ejs-layouts');

const connectDB = require('./config/db');
const logger = require('./utils/logger');
const { morganMiddleware } = require('./utils/logger');
const { setUser } = require('./middleware/authMiddleware');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const productController = require('./controllers/productController');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// ─── VIEW ENGINE ─────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// ─── MIDDLEWARE ──────────────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(morganMiddleware);

// Session (required for connect-flash)
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 60 * 1000 }, // 1 hour
}));
app.use(flash());

// Make flash messages available in all views
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// Set user on every request (reads JWT cookie)
app.use(setUser);

// ─── ROUTES ─────────────────────────────────────────────
app.get('/', productController.getHome);
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);

// ─── ERROR HANDLING ─────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── START SERVER ───────────────────────────────────────
app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
