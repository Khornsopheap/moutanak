// ============================================================
//  api.js  —  paste this at the TOP of your <script> block
//  (or save as a separate file and import it)
// ============================================================

const API = 'http://localhost:5000/api';

// ── Token helpers ────────────────────────────────────────────
const getToken  = () => localStorage.getItem('moutanak_token');
const setToken  = (t) => localStorage.setItem('moutanak_token', t);
const clearToken = () => localStorage.removeItem('moutanak_token');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

// ── Generic fetch wrapper ────────────────────────────────────
async function apiFetch(path, options = {}) {
  try {
    const res = await fetch(`${API}${path}`, {
      headers: authHeaders(),
      ...options,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
  } catch (err) {
    showToast(`❌ ${err.message}`);
    throw err;
  }
}

// ============================================================
//  AUTH
// ============================================================

async function signupUser(username, email, phone, password) {
  const data = await apiFetch('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ username, email, phone, password }),
  });
  setToken(data.token);
  updateNavForUser(data.user);
  closeModal();
  showToast(`🌿 Welcome, ${data.user.username}!`);
  // Load cart from server
  await loadServerCart();
}

async function loginUser(username, password) {
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  setToken(data.token);
  updateNavForUser(data.user);
  closeModalLogin();
  showToast(`👋 Welcome back, ${data.user.username}!`);
  await loadServerCart();
}

function logoutUser() {
  clearToken();
  cart = {};
  updateCartUI();
  renderCartDrawer();
  showToast('👋 Logged out');
  // revert nav
  document.getElementById('nav-signup-btn')?.classList.remove('hidden');
  document.getElementById('nav-user-btn')?.classList.add('hidden');
}

function updateNavForUser(user) {
  // Optional: swap Sign Up button for user avatar/name
  const signupBtn = document.getElementById('nav-signup-btn');
  const userBtn   = document.getElementById('nav-user-btn');
  if (signupBtn) signupBtn.classList.add('hidden');
  if (userBtn)   { userBtn.classList.remove('hidden'); userBtn.textContent = user.username; }
}

// ============================================================
//  PRODUCTS — load from backend
// ============================================================

async function fetchProducts(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const data = await apiFetch(`/products${qs ? '?' + qs : ''}`);
  return data.products || [];
}

// Replace the static renderProducts(products) init call with:
async function initProducts() {
  const list = await fetchProducts();
  renderProducts(list);
}

// Updated filterProducts (search)
async function filterProducts(q) {
  currentSearch = q.toLowerCase();
  const params = {};
  if (currentCat !== 'all') params.cat = currentCat;
  if (currentSearch)        params.search = currentSearch;
  const list = await fetchProducts(params);
  renderProducts(list);
}

// Updated filterCat
async function filterCat(cat, btn) {
  currentCat = cat;
  document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  const params = {};
  if (cat !== 'all') params.cat = cat;
  if (currentSearch) params.search = currentSearch;
  const list = await fetchProducts(params);
  renderProducts(list);
}

// ============================================================
//  CART — server-side (requires auth) with local fallback
// ============================================================

async function loadServerCart() {
  if (!getToken()) return;
  try {
    const data = await apiFetch('/cart');
    // Rebuild local cart object from server cart
    cart = {};
    for (const item of data.cart.items) {
      const p = item.product;
      cart[p._id] = {
        id:    p._id,
        name:  p.name,
        price: item.priceAtAdd,
        img:   p.img,
        qty:   item.qty,
      };
    }
    updateCartUI();
  } catch (_) {
    // Not logged in, keep local cart
  }
}

async function addToCart(id) {
  const p = allProducts.find(x => x._id === id || x.id === id);
  if (!p) return;

  if (getToken()) {
    // Server cart
    await apiFetch('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId: id, qty: 1 }),
    });
    await loadServerCart();
  } else {
    // Local cart (not logged in)
    cart[id] = cart[id]
      ? { ...cart[id], qty: cart[id].qty + 1 }
      : { ...p, qty: 1 };
    updateCartUI();
  }

  showToast(`🛒 ${p.name} added to cart!`);
  const badge = document.getElementById('cart-badge');
  badge.classList.add('badge-pulse');
  setTimeout(() => badge.classList.remove('badge-pulse'), 400);
}

async function removeFromCart(id) {
  if (getToken()) {
    await apiFetch(`/cart/remove/${id}`, { method: 'DELETE' });
    await loadServerCart();
  } else {
    delete cart[id];
    updateCartUI();
  }
  renderCartDrawer();
}

async function changeQty(id, delta) {
  if (!cart[id]) return;
  const newQty = cart[id].qty + delta;

  if (getToken()) {
    if (newQty <= 0) {
      await removeFromCart(id);
    } else {
      await apiFetch('/cart/update', {
        method: 'PUT',
        body: JSON.stringify({ productId: id, qty: newQty }),
      });
      await loadServerCart();
      renderCartDrawer();
    }
  } else {
    if (newQty <= 0) removeFromCart(id);
    else {
      cart[id].qty = newQty;
      updateCartUI();
      renderCartDrawer();
    }
  }
}

// ============================================================
//  ORDERS — place order
// ============================================================

async function placeOrder(deliveryAddress, paymentMethod, promoCode) {
  if (!getToken()) { openModalLogin(); return; }
  const data = await apiFetch('/orders', {
    method: 'POST',
    body: JSON.stringify({ deliveryAddress, paymentMethod, promoCode }),
  });
  cart = {};
  updateCartUI();
  renderCartDrawer();
  closeCart();
  showToast(`✅ ${data.message}`);
}

// ============================================================
//  SELLER REGISTRATION
// ============================================================

async function submitSellerApplication(fullName, shopName, phone, email, products) {
  const data = await apiFetch('/sellers/register', {
    method: 'POST',
    body: JSON.stringify({ fullName, shopName, phone, email, products }),
  });
  showToast(`🌿 ${data.message}`);
  return data;
}

// ============================================================
//  BIND FORM EVENTS
//  Call this once DOM is ready — replaces inline onclick handlers
// ============================================================

function bindForms() {
  document.getElementById('btn-signup')?.addEventListener('click', async () => {
    const username = document.querySelector('#modal input[placeholder*="username"]').value;
    const email    = document.querySelector('#modal input[type="email"]').value;
    const phone    = document.querySelector('#modal input[placeholder*="phone"]').value;
    const password = document.getElementById('signup-pwd').value;
    await signupUser(username, email, phone, password);
  });

  document.getElementById('btn-login')?.addEventListener('click', async () => {
    const username = document.querySelector('#modallogin input[type="text"]').value;
    const password = document.getElementById('login-pwd').value;
    await loginUser(username, password);
  });

  document.getElementById('btn-seller-submit')?.addEventListener('click', async () => {
    const inputs = document.querySelectorAll('#seller-page input, #seller-page textarea');
    await submitSellerApplication(
      inputs[0].value, inputs[1].value,
      inputs[2].value, inputs[3].value, inputs[4].value
    );
  });
}

// ============================================================
//  INIT
// ============================================================
let allProducts = [];

(async () => {
  allProducts = await fetchProducts().catch(() => products); // fallback to hardcoded
  renderProducts(allProducts);
  await loadServerCart();
  bindForms();
  // Restore user session if token exists
  if (getToken()) {
    apiFetch('/auth/me').then(d => updateNavForUser(d.user)).catch(() => clearToken());
  }
})();
