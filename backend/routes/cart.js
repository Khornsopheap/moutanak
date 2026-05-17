const express = require('express');
const router  = express.Router();
const Cart    = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// All cart routes require authentication
router.use(protect);

// Helper: get or create a cart for the logged-in user
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
};

// ─── GET /api/cart ─────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    const total = cart.items.reduce((s, i) => s + i.priceAtAdd * i.qty, 0);
    res.json({ cart, total: +total.toFixed(2) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─── POST /api/cart/add ────────────────────────────────────────────────────
// Body: { productId, qty? }
router.post('/add', async (req, res) => {
  try {
    const { productId, qty = 1 } = req.body;

    if (!productId) return res.status(400).json({ message: 'productId is required' });

    const product = await Product.findById(productId);
    if (!product)       return res.status(404).json({ message: 'Product not found' });
    if (!product.inStock) return res.status(400).json({ message: 'Product is out of stock' });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });

    const existingIdx = cart.items.findIndex(
      (i) => i.product.toString() === productId
    );

    if (existingIdx >= 0) {
      cart.items[existingIdx].qty += Number(qty);
    } else {
      cart.items.push({ product: productId, qty: Number(qty), priceAtAdd: product.price });
    }

    await cart.save();
    await cart.populate('items.product');

    const total = cart.items.reduce((s, i) => s + i.priceAtAdd * i.qty, 0);
    res.json({ message: `${product.name} added to cart`, cart, total: +total.toFixed(2) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─── PUT /api/cart/update ──────────────────────────────────────────────────
// Body: { productId, qty }  — set qty to 0 to remove
router.put('/update', async (req, res) => {
  try {
    const { productId, qty } = req.body;

    if (!productId || qty === undefined) {
      return res.status(400).json({ message: 'productId and qty are required' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const idx = cart.items.findIndex((i) => i.product.toString() === productId);
    if (idx === -1) return res.status(404).json({ message: 'Item not in cart' });

    if (Number(qty) <= 0) {
      cart.items.splice(idx, 1);
    } else {
      cart.items[idx].qty = Number(qty);
    }

    await cart.save();
    await cart.populate('items.product');

    const total = cart.items.reduce((s, i) => s + i.priceAtAdd * i.qty, 0);
    res.json({ message: 'Cart updated', cart, total: +total.toFixed(2) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─── DELETE /api/cart/remove/:productId ────────────────────────────────────
router.delete('/remove/:productId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(
      (i) => i.product.toString() !== req.params.productId
    );

    await cart.save();
    await cart.populate('items.product');

    const total = cart.items.reduce((s, i) => s + i.priceAtAdd * i.qty, 0);
    res.json({ message: 'Item removed', cart, total: +total.toFixed(2) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─── DELETE /api/cart/clear ────────────────────────────────────────────────
router.delete('/clear', async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
