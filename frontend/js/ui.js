// =============================================
//  MOUTANAK — UI Utilities
//  js/ui.js
// =============================================

// =============================================
//  TOAST
// =============================================
function showToast(msg) {
    const t = document.getElementById('toast');
    document.getElementById('toast-message').textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), 2500);
}

// =============================================
//  MODALS
// =============================================
function openModal()       { document.getElementById('modal').classList.remove('hidden'); document.getElementById('modal').classList.add('flex'); }
function closeModal()      { document.getElementById('modal').classList.add('hidden');    document.getElementById('modal').classList.remove('flex'); }
function openModalLogin()  { document.getElementById('modallogin').classList.remove('hidden'); document.getElementById('modallogin').classList.add('flex'); }
function closeModalLogin() { document.getElementById('modallogin').classList.add('hidden');    document.getElementById('modallogin').classList.remove('flex'); }

// Close modals on backdrop click
document.getElementById('modal').addEventListener('click',      e => { if (e.target === e.currentTarget) closeModal(); });
document.getElementById('modallogin').addEventListener('click', e => { if (e.target === e.currentTarget) closeModalLogin(); });

// =============================================
//  PASSWORD TOGGLE
// =============================================
function togglePwd(id, icon) {
    const inp = document.getElementById(id);
    if (inp.type === 'password') {
        inp.type = 'text';
        icon.className = icon.className.replace('fa-eye', 'fa-eye-slash');
    } else {
        inp.type = 'password';
        icon.className = icon.className.replace('fa-eye-slash', 'fa-eye');
    }
}

// =============================================
//  MOBILE MENU
// =============================================
function toggleMobileMenu() {
    const m    = document.getElementById('mobile-menu');
    const icon = document.getElementById('menu-icon');
    m.classList.toggle('open');
    icon.className = m.classList.contains('open')
        ? 'fa-solid fa-xmark text-slate-600'
        : 'fa-solid fa-bars text-slate-600';
}

// =============================================
//  SEARCH BAR
// =============================================
function toggleSearch() {
    const sb = document.getElementById('search-bar');
    sb.classList.toggle('open');
    if (sb.classList.contains('open')) document.getElementById('search-input').focus();
}

// =============================================
//  SCROLL TO PRODUCTS
// =============================================
function scrollToProducts() {
    document.getElementById('products-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// =============================================
//  SLIDESHOW
// =============================================
let currentSlide = 0;
let slideTimer;
const SLIDE_INTERVAL = 5000;

function goToSlide(n) {
    const slides = document.querySelectorAll('.slide');
    const dots   = document.querySelectorAll('.dot');
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
    resetSlideTimer();
}
function nextSlide() { goToSlide(currentSlide + 1); }
function prevSlide() { goToSlide(currentSlide - 1); }
function resetSlideTimer() {
    clearInterval(slideTimer);
    slideTimer = setInterval(nextSlide, SLIDE_INTERVAL);
}
slideTimer = setInterval(nextSlide, SLIDE_INTERVAL);

// =============================================
//  COUNTDOWN TIMER
// =============================================
let cdSec = 4 * 3600 + 23 * 60 + 59;
setInterval(() => {
    cdSec--;
    if (cdSec < 0) cdSec = 86399;
    const h = Math.floor(cdSec / 3600);
    const m = Math.floor((cdSec % 3600) / 60);
    const s = cdSec % 60;
    document.getElementById('cd-h').textContent = String(h).padStart(2, '0');
    document.getElementById('cd-m').textContent = String(m).padStart(2, '0');
    document.getElementById('cd-s').textContent = String(s).padStart(2, '0');
}, 1000);

// =============================================
//  SELLER PAGE
// =============================================
function openSellerPage()  { document.getElementById('seller-page').classList.remove('hidden'); document.body.style.overflow = 'hidden'; }
function closeSellerPage() { document.getElementById('seller-page').classList.add('hidden');    document.body.style.overflow = 'auto'; }

// =============================================
//  AUTH — Sign Up
// =============================================
document.getElementById('btn-signup').addEventListener('click', async () => {
    const inputs   = document.querySelectorAll('#modal .w-full.lg\\:w-1\\/2 input');
    const username = inputs[0].value.trim();
    const email    = inputs[1].value.trim();
    const phone    = inputs[2].value.trim();
    const password = document.getElementById('signup-pwd').value;

    if (!username || !email || !password) { alert('Please fill in all required fields'); return; }

    const res  = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, phone, password }),
    });
    const data = await res.json();
    if (!res.ok) { alert(data.message); return; }

    localStorage.setItem('moutanak_token', data.token);
    localStorage.setItem('moutanak_user',  JSON.stringify(data.user));
    closeModal();
    showToast(`🌿 Welcome, ${data.user.username}!`);
    updateNavUser(data.user);
});

// =============================================
//  AUTH — Log In
// =============================================
document.getElementById('btn-login').addEventListener('click', async () => {
    const username = document.querySelector('#modallogin input[type="text"]').value.trim();
    const password = document.getElementById('login-pwd').value;

    if (!username || !password) { alert('Please enter username and password'); return; }

    const res  = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) { alert(data.message); return; }

    localStorage.setItem('moutanak_token', data.token);
    localStorage.setItem('moutanak_user',  JSON.stringify(data.user));
    closeModalLogin();
    showToast(`👋 Welcome back, ${data.user.username}!`);
    updateNavUser(data.user);
});

// =============================================
//  NAV — Update after login / restore session
// =============================================
function updateNavUser(user) {
    document.querySelector('button[onclick="openModal()"].hidden.lg\\:flex').style.display = 'none';

    if (!document.getElementById('nav-user-btn')) {
        const btn = document.createElement('button');
        btn.id        = 'nav-user-btn';
        btn.className = 'hidden lg:flex items-center gap-2 border border-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-full text-sm cursor-pointer hover:bg-slate-50 transition';
        btn.innerHTML = `<i class="fa-solid fa-circle-user"></i> ${user.username} <span class="text-xs text-red-400 ml-1" onclick="logoutUser(event)">Logout</span>`;
        document.querySelector('.flex.items-center.gap-2').appendChild(btn);
    }
}

function logoutUser(e) {
    e.stopPropagation();
    localStorage.removeItem('moutanak_token');
    localStorage.removeItem('moutanak_user');
    document.getElementById('nav-user-btn')?.remove();
    document.querySelector('button[onclick="openModal()"].hidden.lg\\:flex').style.display = '';
    showToast('👋 Logged out successfully');
}

// Restore session on page load
const savedUser = localStorage.getItem('moutanak_user');
if (savedUser) updateNavUser(JSON.parse(savedUser));