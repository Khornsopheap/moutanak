// =============================================
// MOUTANAK — CART
// js/cart.js
// =============================================

let cart = JSON.parse(localStorage.getItem("cart")) || {};

// =============================================
// HELPERS
// =============================================
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function getCartItems() {
    return Object.values(cart);
}

// =============================================
// UPDATE UI
// =============================================
function updateCartUI() {

    const items = getCartItems();

    const totalQty = items.reduce((sum, item) => {
        return sum + Number(item.qty);
    }, 0);

    const subtotal = items.reduce((sum, item) => {
        return sum + (Number(item.price) * Number(item.qty));
    }, 0);

    // Badge
    const badge = document.getElementById("cart-badge");

    if (badge) {
        if (totalQty > 0) {
            badge.textContent = totalQty;
            badge.classList.remove("hidden");
        } else {
            badge.classList.add("hidden");
        }
    }

    // Cart text
    const countText = document.getElementById("cart-count-text");

    if (countText) {
        countText.textContent =
            `(${totalQty} item${totalQty !== 1 ? "s" : ""})`;
    }

    // Totals
    const subtotalEl = document.getElementById("cart-subtotal");
    const totalEl    = document.getElementById("cart-total");

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (totalEl)    totalEl.textContent    = `$${subtotal.toFixed(2)}`;

    saveCart();

    console.log("CART:", cart);
}

// =============================================
// RENDER CART DRAWER
// =============================================
function renderCartDrawer() {

    const container = document.getElementById("cart-items");

    if (!container) return;

    const items = getCartItems();

    if (!items.length) {

        container.innerHTML = `
            <div id="cart-empty" class="text-center py-20 text-slate-400">
                <i class="fa-solid fa-basket-shopping text-5xl mb-4 block"></i>
                <p class="font-bold text-lg">Your cart is empty</p>
                <p class="text-sm mt-1">Add some fresh products!</p>
            </div>
        `;

        return;
    }

    container.innerHTML = items.map(item => `
        <div class="flex gap-3 items-center pb-4 border-b border-slate-100">

            <img
                src="${item.img}"
                class="w-16 h-16 rounded-xl object-cover border border-slate-100"
            >

            <div class="flex-1 min-w-0">

                <p class="font-semibold text-sm text-slate-800 truncate">
                    ${item.name}
                </p>

                <p class="text-xs text-slate-500 mt-0.5">
                    $${Number(item.price).toFixed(2)} each
                </p>

                <div class="flex items-center gap-2 mt-2">

                    <button
                        onclick="changeQty('${item.id}', -1)"
                        class="w-8 h-8 rounded-full border border-slate-200 hover:bg-slate-100 transition"
                    >
                        <i class="fa-solid fa-minus text-xs"></i>
                    </button>

                    <span class="font-bold text-sm w-5 text-center">
                        ${item.qty}
                    </span>

                    <button
                        onclick="changeQty('${item.id}', 1)"
                        class="w-8 h-8 rounded-full border border-slate-200 hover:bg-slate-100 transition"
                    >
                        <i class="fa-solid fa-plus text-xs"></i>
                    </button>

                </div>
            </div>

            <div class="text-right">

                <p class="font-black text-slate-800">
                    $${(Number(item.price) * Number(item.qty)).toFixed(2)}
                </p>

                <button
                    onclick="removeFromCart('${item.id}')"
                    class="text-xs text-red-400 hover:text-red-600 mt-1"
                >
                    Remove
                </button>

            </div>
        </div>
    `).join("");
}

// =============================================
// ADD TO CART
// =============================================
function addToCart(id) {

    const product = apiProducts.find(p => String(p.id) === String(id));

    if (!product) {
        console.error("Product not found:", id);
        return;
    }

    if (cart[id]) {

        cart[id].qty += 1;

    } else {

        cart[id] = {
            id: product.id,
            name: product.name,
            price: Number(product.price),
            img: product.img,
            qty: 1
        };
    }

    updateCartUI();

    renderCartDrawer();

    showToast(`🛒 ${product.name} added to cart!`);

    const badge = document.getElementById("cart-badge");

    if (badge) {

        badge.classList.add("badge-pulse");

        setTimeout(() => {
            badge.classList.remove("badge-pulse");
        }, 400);
    }
}

// =============================================
// REMOVE
// =============================================
function removeFromCart(id) {

    delete cart[id];

    updateCartUI();

    renderCartDrawer();
}

// =============================================
// CHANGE QTY
// =============================================
function changeQty(id, delta) {

    if (!cart[id]) return;

    cart[id].qty += delta;

    if (cart[id].qty <= 0) {
        delete cart[id];
    }

    updateCartUI();

    renderCartDrawer();
}

// =============================================
// OPEN / CLOSE
// =============================================
function openCart() {

    document.getElementById("cart-drawer").classList.add("open");

    document.getElementById("cart-overlay").classList.add("open");

    renderCartDrawer();
}

function closeCart() {

    document.getElementById("cart-drawer").classList.remove("open");

    document.getElementById("cart-overlay").classList.remove("open");
}

// =============================================
// INIT
// =============================================
updateCartUI();

renderCartDrawer();