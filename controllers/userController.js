const User = require('../models/User');
const Address = require('../models/Address');

// GET /user/profile
exports.getProfile = (req, res) => {
  res.render('user/profile', { title: 'My Profile' });
};

// POST /user/profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    await User.findByIdAndUpdate(req.user._id, { name, phone });
    req.flash('success', 'Profile updated.');
    res.redirect('/user/profile');
  } catch (err) {
    req.flash('error', 'Could not update profile.');
    res.redirect('/user/profile');
  }
};

// GET /user/addresses
exports.getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id });
    res.render('user/addresses', { title: 'My Addresses', addresses });
  } catch (err) {
    req.flash('error', 'Failed to load addresses.');
    res.redirect('/user/profile');
  }
};

// POST /user/addresses/add
exports.addAddress = async (req, res) => {
  try {
    const { label, fullAddress, city, pincode, phone, isDefault } = req.body;

    if (!fullAddress || !city || !pincode || !phone) {
      req.flash('error', 'All address fields are required.');
      return res.redirect('/user/addresses');
    }

    // If this is marked default, un-default the others
    if (isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    await Address.create({
      user: req.user._id,
      label: label || 'Home',
      fullAddress,
      city,
      pincode,
      phone,
      isDefault: !!isDefault,
    });

    req.flash('success', 'Address added.');
    res.redirect('/user/addresses');
  } catch (err) {
    req.flash('error', 'Could not add address.');
    res.redirect('/user/addresses');
  }
};

// POST /user/addresses/edit/:id
exports.editAddress = async (req, res) => {
  try {
    const { label, fullAddress, city, pincode, phone, isDefault } = req.body;

    if (isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { label, fullAddress, city, pincode, phone, isDefault: !!isDefault }
    );

    req.flash('success', 'Address updated.');
    res.redirect('/user/addresses');
  } catch (err) {
    req.flash('error', 'Could not update address.');
    res.redirect('/user/addresses');
  }
};

// POST /user/addresses/delete/:id
exports.deleteAddress = async (req, res) => {
  try {
    await Address.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    req.flash('success', 'Address deleted.');
    res.redirect('/user/addresses');
  } catch (err) {
    req.flash('error', 'Could not delete address.');
    res.redirect('/user/addresses');
  }
};
