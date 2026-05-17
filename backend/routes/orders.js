const express = require('express');
const router  = express.Router();
const Order   = require('../models/Order');
const Cart    = require('../models/Cart');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

const PROMO_CODES = { FRESH20: 0.20 }; // 20% off

// ─── POST /api/orders ──────────────────────────────────────────────────────
// Place an order (from cart or direct body)
// Body: { deliveryAddress, paymentMethod, promoCode, notes, items? }
router.post('/', protect, async (req, res) => {
  try {
    const { deliveryAddress, paymentMethod, promoCode, notes, items: directItems } = req.body;

    let orderItems = [];

    if (directItems && directItems.length > 0) {
      // Direct order (buy now)
      for (const di of directItems) {
        const product = await Product.findById(di.productId);
        if (!product || !product.inStock) {
          return res.status(400).json({ message: `${di.productId} is unavailable` });
        }
        orderItems.push({
          product:      product._id,
          name:         product.name,
          img:          product.img,
          qty:          di.qty || 1,
          priceAtOrder: product.price,
        });
      }
    } else {
      // Order from cart
      const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
      if (!cart || !cart.items.length) {
        return res.status(400).json({ message: 'Cart is empty' });
      }
      for (const item of cart.items) {
        if (!item.product.inStock) {
          return res.status(400).json({ message: `${item.product.name} is out of stock` });
        }
        orderItems.push({
          product:      item.product._id,
          name:         item.product.name,
          img:          item.product.img,
          qty:          item.qty,
          priceAtOrder: item.priceAtAdd,
        });
      }
    }

    // Calculate total
    let total = orderItems.reduce((s, i) => s + i.priceAtOrder * i.qty, 0);

    // Apply promo code
    let discount = 0;
    if (promoCode && PROMO_CODES[promoCode.toUpperCase()]) {
      discount = +(total * PROMO_CODES[promoCode.toUpperCase()]).toFixed(2);
      total    = +(total - discount).toFixed(2);
    }

    const order = await Order.create({
      user:            req.user._id,
      items:           orderItems,
      totalAmount:     total,
      deliveryAddress: deliveryAddress || {},
      paymentMethod:   paymentMethod || 'cash_on_delivery',
      promoCode:       promoCode || null,
      discount,
      notes,
    });

    // Clear cart after ordering
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.status(201).json({ message: 'Order placed successfully 🎉', order });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─── GET /api/orders ───────────────────────────────────────────────────────
// User gets their own orders; admin gets all
router.get('/', protect, async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { user: req.user._id };
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .populate('user', 'username email');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─── GET /api/orders/:id ───────────────────────────────────────────────────
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'username email');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // User can only see their own orders
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─── PUT /api/orders/:id/status  (admin only) ─────────────────────────────
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending','confirmed','processing','shipped','delivered','cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: `Order status updated to ${status}`, order });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─── DELETE /api/orders/:id  (cancel — user or admin) ─────────────────────
router.delete('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (req.user.role !== 'admin' && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending orders can be cancelled' });
    }

    order.status = 'cancelled';
    await order.save();
    res.json({ message: 'Order cancelled', order });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
