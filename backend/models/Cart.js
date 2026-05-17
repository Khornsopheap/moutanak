const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  qty: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    default: 1,
  },
  priceAtAdd: {
    type: Number, 
    required: true,
  },
}, { _id: false });

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  items: [cartItemSchema],
}, { timestamps: true });

// Virtual: total price
cartSchema.virtual('total').get(function () {
  return this.items.reduce((sum, i) => sum + i.priceAtAdd * i.qty, 0);
});

module.exports = mongoose.model('Cart', cartSchema);
