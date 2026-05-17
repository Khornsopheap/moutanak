const express = require('express');
const router  = express.Router();
const Product = require('../models/Product');
const { protect, sellerOrAdmin, adminOnly } = require('../middleware/auth');

// ─── GET /api/products ─────────────────────────────────────────────────────
// Public. Supports ?cat=vegetable&search=corn&inStock=true&sort=price_asc
router.get('/', async (req, res) => {
  try {
    const { cat, search, inStock, sort, page = 1, limit = 20 } = req.query;

    const query = {};

    if (cat && cat !== 'all')      query.category = cat.toLowerCase();
    if (inStock !== undefined)     query.inStock   = inStock === 'true';
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const sortMap = {
      price_asc:   { price:  1 },
      price_desc:  { price: -1 },
      rating_desc: { rating: -1 },
      newest:      { createdAt: -1 },
    };
    const sortOption = sortMap[sort] || { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(query).sort(sortOption).skip(skip).limit(Number(limit)),
      Product.countDocuments(query),
    ]);

    res.json({
      products,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─── GET /api/products/:id ─────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'username email');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─── POST /api/products ────────────────────────────────────────────────────
// Seller or Admin only
router.post('/', protect, sellerOrAdmin, async (req, res) => {
  try {
    const { name, price, img, category, badge, inStock, description, stockQty } = req.body;

    if (!name || !price || !img || !category) {
      return res.status(400).json({ message: 'Name, price, image, and category are required' });
    }

    const product = await Product.create({
      name, price, img, category, badge, inStock, description, stockQty,
      seller: req.user._id,
    });

    res.status(201).json({ message: 'Product created', product });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─── PUT /api/products/:id ─────────────────────────────────────────────────
router.put('/:id', protect, sellerOrAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Only the owning seller or admin can update
    if (
      req.user.role !== 'admin' &&
      product.seller?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ message: 'Product updated', product: updated });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─── DELETE /api/products/:id ──────────────────────────────────────────────
router.delete('/:id', protect, sellerOrAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (
      req.user.role !== 'admin' &&
      product.seller?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await product.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─── POST /api/products/seed ───────────────────────────────────────────────
// Admin: seed the 8 sample products from the frontend
router.post('/seed/init', protect, adminOnly, async (req, res) => {
  try {
    const sampleProducts = [
      { name:'Organic Sweet Corn',    price:2.50, img:'https://i.pinimg.com/736x/1c/09/8d/1c098de09433dfd928107f372640d969.jpg', category:'vegetable', badge:'Organic',     rating:5, reviews:42,  inStock:true  },
      { name:'Fresh Broccoli Crown',  price:3.00, img:'https://i.pinimg.com/1200x/9a/f9/54/9af95411a83b13ab636ff3775005546d.jpg', category:'vegetable', badge:'Local',       rating:4, reviews:28,  inStock:true  },
      { name:'Crisp Gala Apples',     price:4.50, img:'https://i.pinimg.com/736x/1c/09/8d/1c098de09433dfd928107f372640d969.jpg', category:'fruit',     badge:'Sale',        rating:5, reviews:61,  inStock:true  },
      { name:'Free Range Eggs (12)',  price:6.00, img:'https://i.pinimg.com/1200x/9a/f9/54/9af95411a83b13ab636ff3775005546d.jpg', category:'dairy',     badge:null,          rating:5, reviews:89,  inStock:true  },
      { name:'Jasmine Rice 1kg',      price:3.50, img:'https://i.pinimg.com/736x/1c/09/8d/1c098de09433dfd928107f372640d969.jpg', category:'grain',     badge:'Best Seller', rating:4, reviews:114, inStock:true  },
      { name:'Fresh Mint Bundle',     price:1.50, img:'https://i.pinimg.com/1200x/9a/f9/54/9af95411a83b13ab636ff3775005546d.jpg', category:'herb',      badge:'New',         rating:4, reviews:17,  inStock:true  },
      { name:'Baby Spinach 200g',     price:2.00, img:'https://i.pinimg.com/736x/1c/09/8d/1c098de09433dfd928107f372640d969.jpg', category:'vegetable', badge:'Organic',     rating:5, reviews:33,  inStock:false },
      { name:'Ripe Banana Bunch',     price:1.80, img:'https://i.pinimg.com/1200x/9a/f9/54/9af95411a83b13ab636ff3775005546d.jpg', category:'fruit',     badge:null,          rating:4, reviews:52,  inStock:true  },
    ];

    await Product.deleteMany({});
    const inserted = await Product.insertMany(sampleProducts);
    res.status(201).json({ message: `Seeded ${inserted.length} products`, products: inserted });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
