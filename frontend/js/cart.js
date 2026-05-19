// =============================================
//  MOUTANAK — Cart Module
//  js/cart.js
// =============================================

let cart = {};

// ---------- Helpers ----------
function updateCartUI() {
    const total    = Object.values(cart).reduce((s, i) => s + i.qty, 0);
    const subtotal = Object.values(cart).reduce((s, i) => s + i.price * i.qty, 0);

    const badge = document.getElementById('cart-badge');
    if (total > 0) { badge.textContent = total; badge.classList.remove('hidden'); }
    else           { badge.classList.add('hidden'); }

    document.getElementById('cart-count-text').textContent = `(${total} item${total !== 1 ? 's' : ''})`;
    document.getElementById('cart-subtotal').textContent   = `$${subtotal.toFixed(2)}`;
    document.getElementById('cart-total').textContent      = `$${subtotal.toFixed(2)}`;
}

function renderCartDrawer() {
    const el    = document.getElementById('cart-items');
    const empty = document.getElementById('cart-empty');
    const items = Object.values(cart);

    if (!items.length) {
        el.innerHTML = '';
        el.appendChild(empty);
        empty.classList.remove('hidden');
        return;
    }

    empty.classList.add('hidden');
    el.innerHTML = items.map(i => `
        <div class="flex gap-3 items-center">
            <img src="${i.img}" class="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-slate-100">
            <div class="flex-1 min-w-0">
                <p class="font-semibold text-sm text-slate-800 truncate">${i.name}</p>
                <p class="text-xs text-slate-500 mt-0.5">$${i.price.toFixed(2)} each</p>
                <div class="flex items-center gap-2 mt-2">
                    <button onclick="changeQty('${i.id}', -1)" class="qty-btn border border-slate-200 text-slate-600"><i class="fa-solid fa-minus text-[10px]"></i></button>
                    <span class="text-sm font-bold w-5 text-center">${i.qty}</span>
                    <button onclick="changeQty('${i.id}', 1)"  class="qty-btn border border-slate-200 text-slate-600"><i class="fa-solid fa-plus text-[10px]"></i></button>
                </div>
            </div>
            <div class="text-right flex-shrink-0">
                <p class="font-black text-slate-800">$${(i.price * i.qty).toFixed(2)}</p>
                <button onclick="removeFromCart('${i.id}')" class="text-xs text-red-400 hover:text-red-600 mt-1 cursor-pointer transition">Remove</button>
            </div>
        </div>
    `).join('<div class="border-t border-slate-100"></div>');
}

// ---------- Public API ----------
function addToCart(id) {
    const p = apiProducts.find(x => String(x.id) === String(id));
    if (!p) return;

    cart[id] = cart[id]
        ? { ...cart[id], qty: cart[id].qty + 1 }
        : { ...p, qty: 1 };

    updateCartUI();
    showToast(`🛒 ${p.name} added to cart!`);

    const badge = document.getElementById('cart-badge');
    badge.classList.add('badge-pulse');
    setTimeout(() => badge.classList.remove('badge-pulse'), 400);
}

function removeFromCart(id) {
    delete cart[id];
    updateCartUI();
    renderCartDrawer();
}

function changeQty(id, delta) {
    if (!cart[id]) return;
    cart[id].qty += delta;
    if (cart[id].qty <= 0) removeFromCart(id);
    else { updateCartUI(); renderCartDrawer(); }
}

function openCart() {
    document.getElementById('cart-drawer').classList.add('open');
    document.getElementById('cart-overlay').classList.add('open');
    renderCartDrawer();
}

function closeCart() {
    document.getElementById('cart-drawer').classList.remove('open');
    document.getElementById('cart-overlay').classList.remove('open');
}