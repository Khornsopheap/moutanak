const express = require('express');
const router  = express.Router();
const Seller  = require('../models/Seller');
const { protect, adminOnly } = require('../middleware/auth');

// ─── POST /api/sellers/register ───────────────────────────────────────────
// Public — anyone can apply
router.post('/register', async (req, res) => {
  try {
    const { fullName, shopName, phone, email, products } = req.body;

    if (!fullName || !shopName || !phone || !email) {
      return res.status(400).json({ message: 'Full name, shop name, phone, and email are required' });
    }

    const existing = await Seller.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'A seller application with this email already exists' });
    }

    const seller = await Seller.create({ fullName, shopName, phone, email, products });

    res.status(201).json({
      message: 'Seller application submitted! We will review it and get back to you.',
      seller,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─── GET /api/sellers  (admin only) ────────────────────────────────────────
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const sellers = await Seller.find(filter).sort({ createdAt: -1 });
    res.json(sellers);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─── PUT /api/sellers/:id/status  (admin only) ────────────────────────────
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be pending, approved, or rejected' });
    }

    const seller = await Seller.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!seller) return res.status(404).json({ message: 'Seller not found' });

    // If approved and seller has a linked user, upgrade their role
    if (status === 'approved' && seller.userId) {
      const User = require('../models/User');
      await User.findByIdAndUpdate(seller.userId, { role: 'seller' });
    }

    res.json({ message: `Application ${status}`, seller });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
