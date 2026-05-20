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

function goToSellerRegister() {
    window.location.href = "seller_register.html";
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
document.getElementById("btn-signup").addEventListener("click", async () => {

    const inputs = document.querySelectorAll('#modal input');

    const username = inputs[0].value;
    const email    = inputs[1].value;
    const phone    = inputs[2].value;
    const password = inputs[3].value;

    try {

        const data = await apiFetch('/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                username,
                email,
                phone,
                password
            })
        });

        localStorage.setItem("moutanak_token", data.token);
        showToast("🎉 Account created");

        closeModal();

    } catch (err) {
        console.error(err);
    }
});

document.getElementById("btn-login").addEventListener("click", async () => {

    const username = document.querySelector('#modallogin input[type="text"]').value;

    const password = document.getElementById("login-pwd").value;

    try {

        const data = await apiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                username,
                password
            })
        });

        localStorage.setItem("moutanak_token", data.token);

        localStorage.setItem("moutanak_user", JSON.stringify(data.user));

        updateNavUser(data.user);

        showToast("✅ Login successful");

        closeModalLogin();

    } catch (err) {
        console.error(err);
    }
});

// =============================================
//  NAV — Update after login / restore session
// =============================================
function updateNavUser(user) {

    // hide signup/login buttons
    const signupBtn = document.querySelector('button[onclick="openModal()"]');
    const loginBtn  = document.querySelector('button[onclick="openModalLogin()"]');

    if (signupBtn) signupBtn.style.display = 'none';
    if (loginBtn) loginBtn.style.display = 'none';

    // remove old dropdown if exists
    document.getElementById('nav-user-wrapper')?.remove();

    // create wrapper
    const wrapper = document.createElement('div');

    wrapper.id = 'nav-user-wrapper';

    wrapper.className = 'relative hidden lg:block';

    wrapper.innerHTML = `
    
        <!-- USER ICON -->
        <button onclick="toggleUserMenu()"
            class="w-11 h-11 rounded-full border border-slate-300 bg-white flex items-center justify-center shadow-sm hover:shadow-md transition cursor-pointer">
            
            <i class="fa-solid fa-user text-slate-600 text-lg"></i>
        </button>

        <!-- DROPDOWN -->
        <div id="user-dropdown"
            class="hidden absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50">

            <!-- TOP -->
            <div class="p-5 border-b border-slate-100">
                <p class="font-bold text-slate-800 text-lg">${user.username}</p>
            </div>

            <!-- MENU -->
            <div class="py-2">

                <button onclick="goToProfile()"
                    class="w-full flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition text-slate-700">
                    <i class="fa-regular fa-user text-lg"></i>
                    <span>Profile</span>
                </button>

                <button class="w-full flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition text-slate-700">
                    <i class="fa-regular fa-bell text-lg"></i>
                    <span>Notifications</span>
                </button>

                <button onclick="logoutUser(event)"
                    class="w-full flex items-center gap-3 px-5 py-3 hover:bg-red-50 transition text-red-500">
                    
                    <i class="fa-solid fa-right-from-bracket text-lg"></i>
                    <span>Logout</span>
                </button>

            </div>
        </div>
    `;

    // ADD near seller button
    const sellerBtn = document.querySelector('button[onclick="goToSellerRegister()"]');

    if (sellerBtn) {
        sellerBtn.parentNode.insertBefore(wrapper, sellerBtn.nextSibling);
    }
}

function toggleUserMenu() {

    const menu = document.getElementById('user-dropdown');

    menu.classList.toggle('hidden');
}

function goToProfile() {
    window.location.href = "profile.html";
}

function logoutUser(e) {

    e.stopPropagation();

    localStorage.removeItem('moutanak_token');
    localStorage.removeItem('moutanak_user');

    document.getElementById('nav-user-wrapper')?.remove();

    const signupBtn = document.querySelector('button[onclick="openModal()"]');
    const loginBtn  = document.querySelector('button[onclick="openModalLogin()"]');

    if (signupBtn) signupBtn.style.display = '';
    if (loginBtn) loginBtn.style.display = '';

    showToast('👋 Logged out successfully');
}   showToast('👋 Logged out successfully');

// Restore session on page load
const savedUser = localStorage.getItem('moutanak_user');
if (savedUser) updateNavUser(JSON.parse(savedUser));

document.addEventListener('click', function(event) {

    const wrapper = document.getElementById('nav-user-wrapper');

    if (!wrapper) return;

    if (!wrapper.contains(event.target)) {

        document.getElementById('user-dropdown')
            ?.classList.add('hidden');
    }
});