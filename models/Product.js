const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true },
  description:   { type: String, default: '' },
  price:         { type: Number, required: true },
  discountPrice: { type: Number, default: null },
  category:      { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  image:         { type: String, default: '' },
  stock:         { type: Number, required: true, default: 0 },
  unit:          { type: String, default: '1 pc' },
  isActive:      { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
