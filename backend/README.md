# Moutanak Backend — Setup Guide

## Prerequisites
- Node.js 18+
- MongoDB running locally on port 27017

---

## 1. Install dependencies

```bash
npm install
```

> Two new packages are added vs your original package.json:
> - `bcryptjs` — password hashing
> - `jsonwebtoken` — JWT auth tokens

---

## 2. Configure .env

The `.env` file is already created with:
```
MONGO_URI=mongodb://localhost:27017/moutanak
PORT=5000
JWT_SECRET=moutanak_super_secret_jwt_key_change_this_in_production
```

⚠️  Change `JWT_SECRET` to a long random string before going to production.

---

## 3. Run the server

```bash
# Development (auto-restart on file change)
npm run dev

# Production
npm start
```

Server starts at: http://localhost:5000

---

## 4. Seed the database with sample products

First create an admin user via signup, then promote them in MongoDB:
```js
// In MongoDB shell or Compass
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
```

Then call the seed endpoint:
```
POST http://localhost:5000/api/products/seed/init
Authorization: Bearer <your_admin_token>
```

---

## 5. Connect the frontend

Replace the bottom `<script>` block in your HTML with:
```html
<script src="api.js"></script>   <!-- the api.js file from this backend folder -->
```

Or paste the contents of `api.js` into your existing script block,
**replacing** the static `renderProducts(products)` call at the bottom.

---

## API Reference

### Auth
| Method | Endpoint           | Auth     | Description            |
|--------|--------------------|----------|------------------------|
| POST   | /api/auth/signup   | Public   | Register new user      |
| POST   | /api/auth/login    | Public   | Login, get JWT token   |
| GET    | /api/auth/me       | 🔒 User  | Get current user       |
| PUT    | /api/auth/me       | 🔒 User  | Update profile         |

### Products
| Method | Endpoint                     | Auth          | Description              |
|--------|------------------------------|---------------|--------------------------|
| GET    | /api/products                | Public        | List / search / filter   |
| GET    | /api/products/:id            | Public        | Single product           |
| POST   | /api/products                | 🔒 Seller/Admin | Create product          |
| PUT    | /api/products/:id            | 🔒 Seller/Admin | Update product          |
| DELETE | /api/products/:id            | 🔒 Seller/Admin | Delete product          |
| POST   | /api/products/seed/init      | 🔒 Admin      | Seed 8 sample products   |

**Query params for GET /api/products:**
- `cat` — vegetable | fruit | dairy | grain | herb
- `search` — text search on name
- `inStock` — true | false
- `sort` — price_asc | price_desc | rating_desc | newest
- `page` — page number (default 1)
- `limit` — items per page (default 20)

### Cart (all require auth)
| Method | Endpoint                   | Description              |
|--------|----------------------------|--------------------------|
| GET    | /api/cart                  | Get user's cart          |
| POST   | /api/cart/add              | Add item (productId, qty)|
| PUT    | /api/cart/update           | Update qty (0 = remove)  |
| DELETE | /api/cart/remove/:productId| Remove one item          |
| DELETE | /api/cart/clear            | Empty cart               |

### Orders (require auth)
| Method | Endpoint                 | Auth        | Description             |
|--------|--------------------------|-------------|-------------------------|
| POST   | /api/orders              | 🔒 User    | Place order from cart   |
| GET    | /api/orders              | 🔒 User    | My orders (admin = all) |
| GET    | /api/orders/:id          | 🔒 User    | Single order            |
| PUT    | /api/orders/:id/status   | 🔒 Admin   | Update order status     |
| DELETE | /api/orders/:id          | 🔒 User    | Cancel pending order    |

**Supported promo codes:**
- `FRESH20` — 20% discount

### Sellers
| Method | Endpoint                  | Auth       | Description             |
|--------|---------------------------|------------|-------------------------|
| POST   | /api/sellers/register     | Public     | Submit seller application|
| GET    | /api/sellers              | 🔒 Admin  | List applications       |
| PUT    | /api/sellers/:id/status   | 🔒 Admin  | Approve / reject        |

---

## Project Structure

```
backend/
├── server.js           ← Express app entry point
├── .env                ← Environment variables
├── package.json
├── api.js              ← Frontend integration snippet
├── config/
│   └── db.js           ← MongoDB connection
├── middleware/
│   └── auth.js         ← JWT protect / role guards
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Cart.js
│   ├── Order.js
│   └── Seller.js
└── routes/
    ├── auth.js
    ├── products.js
    ├── cart.js
    ├── orders.js
    └── sellers.js
```
