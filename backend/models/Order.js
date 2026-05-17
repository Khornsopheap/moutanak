const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name:         { type: String, required: true },
  img:          { type: String },
  qty:          { type: Number, required: true },
  priceAtOrder: { type: Number, required: true },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
  },
  deliveryAddress: {
    street:   { type: String },
    city:     { type: String },
    province: { type: String },
    phone:    { type: String },
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['cash_on_delivery', 'card', 'paypal'],
    default: 'cash_on_delivery',
  },
  promoCode: { type: String },
  discount:   { type: Number, default: 0 },
  notes:      { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
