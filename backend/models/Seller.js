const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
  fullName:    { type: String, required: [true, 'Full name is required'], trim: true },
  shopName:    { type: String, required: [true, 'Shop/farm name is required'], trim: true },
  phone:       { type: String, required: [true, 'Phone is required'] },
  email:       { type: String, required: [true, 'Email is required'], lowercase: true, trim: true },
  products:    { type: String }, // what they sell (free text)
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model('Seller', sellerSchema);
