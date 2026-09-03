const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name:     { type: String, required: true },
  price:    { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items:         [orderItemSchema],
  address: {
    label:       String,
    fullAddress: String,
    city:        String,
    pincode:     String,
    phone:       String,
  },
  totalAmount:   { type: Number, required: true },
  status: {
    type: String,
    enum: ['placed', 'packed', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'placed',
  },
  paymentMethod: { type: String, enum: ['cod', 'mock_online'], default: 'cod' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
