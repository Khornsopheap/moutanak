// =============================================
//  MOUTANAK — Products Render & Filter
//  js/products.js
// =============================================

let apiProducts = [];
let liked        = new Set();
let currentCat   = 'all';
let currentSearch = '';

// ---------- Helpers ----------
function badgeColor(b) {
    const map = {
        Organic:      'bg-green-100 text-green-700',
        Local:        'bg-blue-100 text-blue-700',
        Sale:         'bg-red-100 text-red-600',
        New:          'bg-purple-100 text-purple-700',
        'Best Seller':'bg-amber-100 text-amber-700',
    };
    return map[b] || 'bg-slate-100 text-slate-600';
}

function starsHTML(n) {
    let s = '';
    for (let i = 1; i <= 5; i++)
        s += `<i class="fa-${i <= n ? 'solid' : 'regular'} fa-star text-xs"></i>`;
    return s;
}

// ---------- Render ----------
function renderProducts(list) {
    const grid  = document.getElementById('product-grid');
    const noRes = document.getElementById('no-results');

    document.getElementById('product-count').textContent =
        `Showing ${list.length} item${list.length !== 1 ? 's' : ''}`;

    if (!list.length) { grid.innerHTML = ''; noRes.classList.remove('hidden'); return; }
    noRes.classList.add('hidden');

    grid.innerHTML = list.map(p => `
        <div class="product-card bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 relative" data-cat="${p.cat}">
            ${p.badge ? `<span class="absolute top-3 left-3 z-10 text-xs font-bold px-2 py-0.5 rounded-full ${badgeColor(p.badge)}">${p.badge}</span>` : ''}
            <button class="heart-btn absolute top-3 right-3 z-10 text-slate-300 ${liked.has(p.id) ? 'liked' : ''} cursor-pointer"
                    onclick="toggleLike('${p.id}', this)">
                <i class="fa-${liked.has(p.id) ? 'solid' : 'regular'} fa-heart text-xl"></i>
            </button>
            <div class="overflow-hidden h-44 bg-slate-50 flex items-center justify-center">
                <img class="w-full h-full object-cover hover:scale-105 transition duration-300" src="${p.img}" alt="${p.name}">
            </div>
            <div class="p-4">
                <p class="font-bold text-sm text-slate-800 mb-1 leading-snug">${p.name}</p>
                <div class="flex items-center gap-1 mb-1 stars">${starsHTML(p.rating)} <span class="text-xs text-slate-400 font-normal ml-1">(${p.reviews})</span></div>
                <p class="text-xs mb-3 font-semibold ${p.inStock ? 'text-green-500' : 'text-red-400'}">
                    <i class="fa-solid fa-circle-${p.inStock ? 'check' : 'xmark'} mr-1"></i>${p.inStock ? 'In Stock' : 'Out of Stock'}
                </p>
                <div class="flex items-center justify-between gap-2">
                    <p class="font-black text-lg text-slate-800">$${p.price.toFixed(2)}</p>
                    ${p.inStock
                        ? `<button onclick="addToCart('${p.id}')" class="add-btn flex items-center gap-1.5 px-3 py-2 rounded-xl text-white text-xs font-bold cursor-pointer transition" style="background:var(--green)">
                               <i class="fa-solid fa-plus"></i> Add
                           </button>`
                        : `<button disabled class="px-3 py-2 rounded-xl text-slate-400 text-xs font-bold bg-slate-100 cursor-not-allowed">Unavailable</button>`}
                </div>
            </div>
        </div>
    `).join('');
}

// ---------- Like / Wishlist ----------
function toggleLike(id, el) {
    if (liked.has(id)) {
        liked.delete(id);
        el.classList.remove('liked');
        el.innerHTML = '<i class="fa-regular fa-heart text-xl"></i>';
    } else {
        liked.add(id);
        el.classList.add('liked');
        el.innerHTML = '<i class="fa-solid fa-heart text-xl"></i>';
        showToast('💚 Added to wishlist');
    }
}

// ---------- Filter ----------
function filterProducts(q) {
    currentSearch = q.toLowerCase();
    applyFilters();
}

function filterCat(cat, btn) {
    currentCat = cat;
    document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    applyFilters();
}

function applyFilters() {
    let list = apiProducts;
    if (currentCat !== 'all') list = list.filter(p => p.cat === currentCat);
    if (currentSearch)        list = list.filter(p => p.name.toLowerCase().includes(currentSearch));
    renderProducts(list);
}

// ---------- Bootstrap: fetch from API or fall back ----------
function loadProducts() {
    fetch('http://localhost:5000/api/products')
        .then(r => r.json())
        .then(d => {
            apiProducts = d.products.map(p => ({
                id:      p._id,
                name:    p.name,
                price:   p.price,
                img:     p.img,
                cat:     p.category,
                badge:   p.badge,
                rating:  p.rating,
                reviews: p.reviews,
                inStock: p.inStock,
            }));
            renderProducts(apiProducts);
        })
        .catch(() => {
            apiProducts = PRODUCTS_FALLBACK;
            renderProducts(PRODUCTS_FALLBACK);
        });
}