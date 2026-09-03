const User = require('../models/User');
const { generateToken } = require('../utils/generateToken');

// GET /auth/signup
exports.getSignup = (req, res) => {
  if (req.user) return res.redirect('/');
  res.render('auth/signup', { title: 'Sign Up' });
};

// POST /auth/signup
exports.postSignup = async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;

    if (!name || !email || !password) {
      req.flash('error', 'Name, email and password are required.');
      return res.redirect('/auth/signup');
    }
    if (password.length < 6) {
      req.flash('error', 'Password must be at least 6 characters.');
      return res.redirect('/auth/signup');
    }
    if (password !== confirmPassword) {
      req.flash('error', 'Passwords do not match.');
      return res.redirect('/auth/signup');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash('error', 'An account with that email already exists.');
      return res.redirect('/auth/signup');
    }

    const user = await User.create({ name, email, phone, password });
    const token = generateToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'lax',
    });

    req.flash('success', 'Account created successfully! Welcome aboard.');
    res.redirect('/');
  } catch (err) {
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect('/auth/signup');
  }
};

// GET /auth/login
exports.getLogin = (req, res) => {
  if (req.user) return res.redirect('/');
  res.render('auth/login', { title: 'Log In' });
};

// POST /auth/login
exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      req.flash('error', 'Please provide email and password.');
      return res.redirect('/auth/login');
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/auth/login');
    }

    const token = generateToken(user._id);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    });

    req.flash('success', `Welcome back, ${user.name}!`);
    res.redirect('/');
  } catch (err) {
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect('/auth/login');
  }
};

// GET /auth/logout
exports.logout = (req, res) => {
  res.clearCookie('token');
  req.flash('success', 'You have been logged out.');
  res.redirect('/');
};
