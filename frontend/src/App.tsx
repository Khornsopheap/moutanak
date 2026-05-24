import React, { useState, useEffect } from 'react';
import { 
  db, 
  saveStored 
} from './data';
import { 
  SellerRequest, 
  Seller, 
  Product, 
  Order, 
  User, 
  Review, 
  PaymentPayout, 
  Transaction, 
  PlatformConfig 
} from './types';

// Import View Components
import DashboardView from './components/DashboardView';
import SellerRequestsView from './components/SellerRequestsView';
import SellersView from './components/SellersView';
import ProductsView from './components/ProductsView';
import OrdersView from './components/OrdersView';
import UsersView from './components/UsersView';
import ReviewsView from './components/ReviewsView';
import PaymentsView from './components/PaymentsView';
import TransactionsView from './components/TransactionsView';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';

// Import Icons
import { 
  LayoutDashboard, 
  Users as UsersIcon, 
  FileCheck, 
  Store, 
  ShoppingBag, 
  Receipt, 
  MessageCircle, 
  BadgeDollarSign, 
  FileSpreadsheet, 
  Sliders, 
  Scale, 
  Leaf, 
  Menu, 
  Bell, 
  ChevronDown, 
  Search, 
  X,
  CreditCard,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';

export default function App() {
  // Page routing state
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  // Layout UI states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [activeLanguage, setActiveLanguage] = useState<'EN' | 'KH'>('EN');
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // Toast status state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info' | 'error'>('success');

  // Core Entity Database states (Initialized from LocalStorage persist tags)
  const [sellerRequests, setSellerRequests] = useState<SellerRequest[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [payments, setPayments] = useState<PaymentPayout[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [config, setConfig] = useState<PlatformConfig>({} as PlatformConfig);

  // Trigger values loading to load stored entries
  useEffect(() => {
    setSellerRequests(db.getSellerRequests());
    setSellers(db.getSellers());
    setProducts(db.getProducts());
    setOrders(db.getOrders());
    setUsers(db.getUsers());
    setReviews(db.getReviews());
    setPayments(db.getPayments());
    setTransactions(db.getTransactions());
    setConfig(db.getConfig());
  }, []);

  // Sync state helpers
  const syncAndSetRequests = (data: SellerRequest[]) => {
    setSellerRequests(data);
    db.setSellerRequests(data);
  };

  const syncAndSetSellers = (data: Seller[]) => {
    setSellers(data);
    db.setSellers(data);
  };

  const syncAndSetProducts = (data: Product[]) => {
    setProducts(data);
    db.setProducts(data);
  };

  const syncAndSetOrders = (data: Order[]) => {
    setOrders(data);
    db.setOrders(data);
  };

  const syncAndSetUsers = (data: User[]) => {
    setUsers(data);
    db.setUsers(data);
  };

  const syncAndSetReviews = (data: Review[]) => {
    setReviews(data);
    db.setReviews(data);
  };

  const syncAndSetPayments = (data: PaymentPayout[]) => {
    setPayments(data);
    db.setPayments(data);
  };

  const syncAndSetTransactions = (data: Transaction[]) => {
    setTransactions(data);
    db.setTransactions(data);
  };

  const syncAndSetPlatformConfig = (data: PlatformConfig) => {
    setConfig(data);
    db.setConfig(data);
  };

  // Toast trigger helper
  const triggerToast = (msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // -------------------------------------------------------------
  // ACTION HANDLERS
  // -------------------------------------------------------------

  // Applicant Decision (Approve / Reject)
  const handleSellerRequestDecision = (id: string, status: 'approved' | 'rejected', note: string) => {
    const updated = sellerRequests.map(r => {
      if (r.id === id) {
        return {
          ...r,
          st: status,
          note,
          rev: new Date().toISOString()
        };
      }
      return r;
    });

    syncAndSetRequests(updated);

    const targetRequest = sellerRequests.find(r => r.id === id);

    // If approved, onboard into Sellers list and Users records!
    if (status === 'approved' && targetRequest) {
      // Check if duplicate seller
      const sellerExists = sellers.some(s => s.email === targetRequest.em);
      if (!sellerExists) {
        // Create new seller record
        const newSeller: Seller = {
          id: `SEL-${Math.floor(100 + Math.random() * 900)}`,
          name: targetRequest.fn,
          storeName: targetRequest.sn,
          email: targetRequest.em,
          phone: targetRequest.ph,
          category: targetRequest.cat,
          province: targetRequest.prov,
          tin: targetRequest.tin,
          joinedDate: new Date().toISOString().split('T')[0],
          status: 'active',
          totalProducts: 0,
          totalSales: 0,
          rating: 5.0
        };
        syncAndSetSellers([newSeller, ...sellers]);

        // Create secondary staff user if non-existent
        const userExists = users.some(u => u.email === targetRequest.em);
        if (!userExists) {
          const newUser: User = {
            id: `USR-${Math.floor(100 + Math.random() * 900)}`,
            name: targetRequest.fn,
            email: targetRequest.em,
            role: 'Customer', // Default role for registering merchants
            status: 'Active',
            phone: targetRequest.ph,
            joinedDate: new Date().toISOString().split('T')[0]
          };
          syncAndSetUsers([newUser, ...users]);
        }
      }
    }

    triggerToast(
      status === 'approved' 
        ? `Cooperative store "${targetRequest?.sn || 'Merchant'}" approved and activated!` 
        : `Request from ${targetRequest?.fn || 'Merchant'} has been rejected.`,
      status === 'approved' ? 'success' : 'error'
    );
  };

  // Toggle seller online status
  const handleToggleSellerStatus = (id: string) => {
    const updated = sellers.map(s => {
      if (s.id === id) {
        const nextStatus: Seller['status'] = s.status === 'active' ? 'suspended' : 'active';
        triggerToast(`Merchant store "${s.storeName}" toggled to ${nextStatus}.`, 'info');
        return { ...s, status: nextStatus };
      }
      return s;
    });
    syncAndSetSellers(updated);
  };

  // Add a product item manually in store index
  const handleAddProduct = (newProduct: Omit<Product, 'id' | 'salesCount'>) => {
    const newEntry: Product = {
      ...newProduct,
      id: `PROD-${Math.floor(100 + Math.random() * 900)}`,
      salesCount: 0
    };
    syncAndSetProducts([newEntry, ...products]);
    triggerToast(`Crop item "${newProduct.name}" successfully cataloged!`);
  };

  // Inline update price / stock level
  const handleUpdateProduct = (id: string, updates: Partial<Product>) => {
    const updated = products.map(p => {
      if (p.id === id) {
        return { ...p, ...updates };
      }
      return p;
    });
    syncAndSetProducts(updated);
    triggerToast(`Inventory parameters updated successfully.`);
  };

  // permanent inventory deletion
  const handleDeleteProduct = (id: string) => {
    const updated = products.filter(p => p.id !== id);
    syncAndSetProducts(updated);
    triggerToast(`Product listed item removed from catalog records.`, 'error');
  };

  // Shipping updates
  const handleUpdateOrderStatus = (id: string, status: Order['status']) => {
    const updated = orders.map(o => {
      if (o.id === id) {
        return { ...o, status };
      }
      return o;
    });
    syncAndSetOrders(updated);
    triggerToast(`Order Order #${id} routing queue status updated to ${status}.`);
  };

  // Admin users invitaion
  const handleInviteUser = (newUser: Omit<User, 'id' | 'joinedDate'>) => {
    const newEntry: User = {
      ...newUser,
      id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      joinedDate: new Date().toISOString().split('T')[0]
    };
    syncAndSetUsers([newEntry, ...users]);
    triggerToast(`Administation clearance invite sent to ${newUser.email}.`, 'success');
  };

  // Admin user status lock toggle
  const handleToggleUserStatus = (id: string) => {
    const updated = users.map(u => {
      if (u.id === id) {
        const nextStatus: User['status'] = u.status === 'Active' ? 'Suspended' : 'Active';
        triggerToast(`Access clearance toggled to ${nextStatus} for ${u.name}.`, 'info');
        return { ...u, status: nextStatus };
      }
      return u;
    });
    syncAndSetUsers(updated);
  };

  // Approving customer comment reviews
  const handleUpdateReviewStatus = (id: string, status: Review['status']) => {
    const updated = reviews.map(r => {
      if (r.id === id) {
        return { ...r, status };
      }
      return r;
    });
    syncAndSetReviews(updated);
    triggerToast(`Review audit status verified to ${status}.`);
  };

  const handleDeleteReview = (id: string) => {
    const updated = reviews.filter(r => r.id !== id);
    syncAndSetReviews(updated);
    triggerToast(`Customer review comment scrubbed from database records.`, 'error');
  };

  // Releasing seller payout settlements
  const handleReleasePayout = (id: string) => {
    let releasedAmount = 0;
    let merchant = 'Merchant';

    const updated = payments.map(p => {
      if (p.id === id) {
        releasedAmount = p.amount;
        merchant = p.sellerName;
        return { ...p, status: 'Completed' as const };
      }
      return p;
    });

    syncAndSetPayments(updated);

    // Create a matching ledger transaction log!
    const newTxn: Transaction = {
      id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
      orderId: id,
      amount: releasedAmount,
      customerName: merchant,
      type: 'Payout',
      status: 'Success',
      method: 'ABA Bank', // Match payout method dynamically
      date: new Date().toISOString()
    };
    syncAndSetTransactions([newTxn, ...transactions]);

    triggerToast(`Payout released check of $${releasedAmount.toFixed(2)} disbursed to ${merchant}.`);
  };

  // Setup direct manual transfer settlements
  const handleAddPayout = (newPayout: Omit<PaymentPayout, 'id' | 'date'>) => {
    const newEntry: PaymentPayout = {
      ...newPayout,
      id: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0]
    };
    syncAndSetPayments([newEntry, ...payments]);
    triggerToast(`Manual Payout booked for processing.`);
  };

  // Settings base save
  const handleSaveConfig = (updatedConfig: PlatformConfig) => {
    syncAndSetPlatformConfig(updatedConfig);
    triggerToast(`Platform controls calibrated and saved successfully.`);
  };

  // Notification lists for top bell dropdown
  const pendingNotificationCount = sellerRequests.filter(r => r.st === 'pending').length;

  return (
    <div className="flex h-screen bg-emerald-50/20 text-emerald-950 font-sans overflow-hidden">
      
      {/* 1. SIDEBAR NAVIGATION */}
      <aside 
        className={`bg-white border-r border-emerald-100 flex flex-col justify-between transition-all duration-300 z-30 select-none ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        } fixed md:static inset-y-0 left-0 transform md:transform-none ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Brand header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 shadow-md shadow-emerald-600/30 flex items-center justify-center flex-shrink-0">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              {!isSidebarCollapsed && (
                <div className="leading-tight shrink-0 font-serif translate-y-0.5">
                  <span className="text-lg font-black tracking-wide text-emerald-950">Moutanak</span>
                  <span className="text-xl font-black text-emerald-500">.</span>
                  <span className="block text-[8.5px] font-black uppercase text-slate-400 tracking-wider font-sans">Admin Console</span>
                </div>
              )}
            </div>

            {/* Mobile menu close trigger */}
            <button 
              onClick={() => setIsMobileSidebarOpen(false)}
              className="md:hidden p-1 bg-slate-50 border rounded-lg hover:bg-slate-100 text-slate-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Menus Groups */}
          <div className="py-4 space-y-4 flex-1">
            
            {/* OVERVIEW SECTION */}
            <div className="px-3">
              {!isSidebarCollapsed && (
                <span className="block px-3 text-[9.5px] font-black uppercase tracking-widest text-slate-400 mb-1">Overview</span>
              )}
              <button 
                onClick={() => { setCurrentPage('dashboard'); setSelectedRequestId(null); setIsMobileSidebarOpen(false); }}
                className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-bold text-xs transition-colors ${
                  currentPage === 'dashboard' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-650 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                {!isSidebarCollapsed && <span className="truncate">Dashboard Analytics</span>}
              </button>
            </div>

            {/* MARKETPLACE SECTION */}
            <div className="px-3">
              {!isSidebarCollapsed && (
                <span className="block px-3 text-[9.5px] font-black uppercase tracking-widest text-slate-400 mb-1">Marketplace</span>
              )}
              <div className="space-y-1">
                <button 
                  onClick={() => { setCurrentPage('seller-requests'); setSelectedRequestId(null); setIsMobileSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-xs transition-colors ${
                    currentPage === 'seller-requests' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-650 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <FileCheck className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                    {!isSidebarCollapsed && <span className="truncate">Seller Requests</span>}
                  </div>
                  {!isSidebarCollapsed && pendingNotificationCount > 0 && (
                    <span className="text-[9px] font-black bg-amber-500 text-white rounded-full px-1.5 py-0.5 animate-pulse select-none">
                      {pendingNotificationCount}
                    </span>
                  )}
                </button>

                <button 
                  onClick={() => { setCurrentPage('sellers'); setSelectedRequestId(null); setIsMobileSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-bold text-xs transition-colors ${
                    currentPage === 'sellers' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-650 hover:bg-slate-50'
                  }`}
                >
                  <Store className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                  {!isSidebarCollapsed && <span className="truncate">Sellers Directory</span>}
                </button>

                <button 
                  onClick={() => { setCurrentPage('products'); setSelectedRequestId(null); setIsMobileSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-bold text-xs transition-colors ${
                    currentPage === 'products' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-650 hover:bg-slate-50'
                  }`}
                >
                  <ShoppingBag className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                  {!isSidebarCollapsed && <span className="truncate">Products Catalog</span>}
                </button>

                <button 
                  onClick={() => { setCurrentPage('orders'); setSelectedRequestId(null); setIsMobileSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-bold text-xs transition-colors ${
                    currentPage === 'orders' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-650 hover:bg-slate-50'
                  }`}
                >
                  <Receipt className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                  {!isSidebarCollapsed && <span className="truncate">Customer Orders</span>}
                </button>
              </div>
            </div>

            {/* CUSTOMERS SECTION */}
            <div className="px-3">
              {!isSidebarCollapsed && (
                <span className="block px-3 text-[9.5px] font-black uppercase tracking-widest text-slate-400 mb-1">Customers</span>
              )}
              <div className="space-y-1">
                <button 
                  onClick={() => { setCurrentPage('users'); setSelectedRequestId(null); setIsMobileSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-bold text-xs transition-colors ${
                    currentPage === 'users' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-650 hover:bg-slate-50'
                  }`}
                >
                  <UsersIcon className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                  {!isSidebarCollapsed && <span className="truncate">Platform Accounts</span>}
                </button>

                <button 
                  onClick={() => { setCurrentPage('reviews'); setSelectedRequestId(null); setIsMobileSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-bold text-xs transition-colors ${
                    currentPage === 'reviews' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-650 hover:bg-slate-50'
                  }`}
                >
                  <MessageCircle className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                  {!isSidebarCollapsed && <span className="truncate">Shopper Reviews</span>}
                </button>
              </div>
            </div>

            {/* FINANCE SECTION */}
            <div className="px-3">
              {!isSidebarCollapsed && (
                <span className="block px-3 text-[9.5px] font-black uppercase tracking-widest text-slate-400 mb-1">Finance</span>
              )}
              <div className="space-y-1">
                <button 
                  onClick={() => { setCurrentPage('payments'); setSelectedRequestId(null); setIsMobileSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-bold text-xs transition-colors ${
                    currentPage === 'payments' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-650 hover:bg-slate-50'
                  }`}
                >
                  <BadgeDollarSign className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                  {!isSidebarCollapsed && <span className="truncate">Payout Released</span>}
                </button>

                <button 
                  onClick={() => { setCurrentPage('transactions'); setSelectedRequestId(null); setIsMobileSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-bold text-xs transition-colors ${
                    currentPage === 'transactions' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-650 hover:bg-slate-50'
                  }`}
                >
                  <Scale className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                  {!isSidebarCollapsed && <span className="truncate">Financial Ledger</span>}
                </button>
              </div>
            </div>

            {/* SYSTEM SECTION */}
            <div className="px-3">
              {!isSidebarCollapsed && (
                <span className="block px-3 text-[9.5px] font-black uppercase tracking-widest text-slate-400 mb-1">System</span>
              )}
              <div className="space-y-1">
                <button 
                  onClick={() => { setCurrentPage('reports'); setSelectedRequestId(null); setIsMobileSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-bold text-xs transition-colors ${
                    currentPage === 'reports' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-650 hover:bg-slate-50'
                  }`}
                >
                  <FileSpreadsheet className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                  {!isSidebarCollapsed && <span className="truncate">Spreadsheet Reports</span>}
                </button>

                <button 
                  onClick={() => { setCurrentPage('settings'); setSelectedRequestId(null); setIsMobileSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-bold text-xs transition-colors ${
                    currentPage === 'settings' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-650 hover:bg-slate-50'
                  }`}
                >
                  <Sliders className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                  {!isSidebarCollapsed && <span className="truncate">Platform Settings</span>}
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Foot Language/Collapse actions */}
        <div className="p-4 border-t border-slate-100 space-y-3 shrink-0">
          <div className="flex bg-slate-50 border rounded-lg p-1 text-[11px] font-extrabold select-none">
            <button 
              onClick={() => setActiveLanguage('EN')}
              className={`flex-1 py-1.5 rounded transition-colors ${activeLanguage === 'EN' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-405 hover:bg-slate-100'}`}
            >
              EN
            </button>
            <button 
              onClick={() => setActiveLanguage('KH')}
              className={`flex-1 py-1.5 rounded transition-colors ${activeLanguage === 'KH' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-405 hover:bg-slate-100'}`}
            >
              ខ្មែរ
            </button>
          </div>

          <button 
            type="button"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="w-full text-center py-2 bg-slate-50 hover:bg-slate-100 border rounded-xl text-slate-500 font-bold font-sans text-xs flex items-center justify-center gap-2 transition-all hidden md:flex"
          >
            {isSidebarCollapsed ? (
              <ChevronsRight className="w-4 h-4 text-emerald-700" />
            ) : (
              <>
                <ChevronsLeft className="w-4 h-4 text-emerald-700" /> Collapse Sidebar
              </>
            )}
          </button>
        </div>
      </aside>

      {/* 2. MAIN APPLICATION CONTENT PORT */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        
        {/* TOP COMPACT HEADER BOX */}
        <header className="h-16 shrink-0 bg-white border-b border-emerald-100 flex items-center justify-between px-6 z-20 select-none">
          {/* Mobile menu logo triggers */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 bg-emerald-50 text-emerald-800 rounded-xl"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden md:block text-slate-400 font-mono text-[10.5px]">
              Platform &gt; <strong className="text-emerald-950 font-sans text-xs">{currentPage}</strong>
            </div>
          </div>

          <div className="flex items-center gap-4">
            
            {/* Action Search Bar */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-800/50" />
              <input 
                type="text" 
                placeholder="Global admin lookup store..."
                value={globalSearch}
                onChange={(e) => {
                  setGlobalSearch(e.target.value);
                  // Redirect dynamically to search within corresponding views!
                  if (currentPage !== 'seller-requests' && currentPage !== 'sellers' && currentPage !== 'products') {
                    setCurrentPage('seller-requests');
                  }
                }}
                className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 rounded-full text-xs outline-none w-48 focus:w-60 transition-all font-semibold placeholder:text-slate-400/80 text-emerald-950"
              />
            </div>

            {/* Notifications Bell Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 hover:bg-slate-50 rounded-xl border relative transition-colors text-slate-500"
              >
                <Bell className="w-4.5 h-4.5" />
                {pendingNotificationCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white"></span>
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute top-11 right-0 w-80 bg-white border border-emerald-100 rounded-2xl shadow-xl z-50 overflow-hidden py-1 animate-fade-in">
                  <div className="px-4 py-3 bg-slate-50 border-b flex justify-between items-center text-xs">
                    <span className="font-serif font-black text-emerald-950">Administrative Alerts</span>
                    <button 
                      onClick={() => triggerToast('Alert clears logs successfully.')}
                      className="text-[10px] text-emerald-700 font-extrabold hover:underline"
                    >
                      Dismiss all alerts
                    </button>
                  </div>
                  
                  <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                    {/* Notify item 1 */}
                    {pendingNotificationCount > 0 ? (
                      <div 
                        onClick={() => { setCurrentPage('seller-requests'); setIsNotificationsOpen(false); }}
                        className="p-3.5 hover:bg-emerald-50/15 cursor-pointer flex gap-3 text-xs leading-snug"
                      >
                        <div className="w-7 h-7 bg-amber-100 rounded-lg flex items-center justify-center text-amber-700 font-bold shrink-0">⌛</div>
                        <div>
                          <div className="font-bold text-slate-900">{pendingNotificationCount} Awaiting Reviewers</div>
                          <p className="text-[10px] text-slate-450 mt-0.5">Please audit documents for pending store credentials.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 text-center text-xs text-slate-400">
                        No pending applicant alerts currently.
                      </div>
                    )}

                    {/* Static item 2 */}
                    <div className="p-3.5 hover:bg-emerald-50/15 cursor-pointer flex gap-3 text-xs leading-snug">
                      <div className="w-7 h-7 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-700 shrink-0">🛒</div>
                      <div>
                        <div className="font-bold text-slate-900">44K Order milestone completed</div>
                        <p className="text-[10px] text-slate-450 mt-0.5">Organic product delivery orders cleared the standard verification ledger.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar section */}
            <div className="flex items-center gap-2.5 border-l border-slate-150 pl-3.5 select-none">
              <div className="w-8 h-8 rounded-full bg-emerald-700 border border-emerald-600 text-white font-serif font-bold text-xs flex items-center justify-center shadow-xs">
                LH
              </div>
              <div className="hidden lg:block leading-tight text-left">
                <span className="block text-xs font-serif font-black text-emerald-950">Lay Horn</span>
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Super Administrator</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
            </div>

          </div>
        </header>

        {/* CORE SCROLLABLE CLIENT VIEW AREA */}
        <section className="flex-1 overflow-y-auto px-6 py-6 scroll-smooth bg-emerald-50/5">
          {/* Subpage router board logic */}
          {currentPage === 'dashboard' && (
            <DashboardView 
              sellerRequests={sellerRequests}
              orders={orders}
              products={products}
              sellers={sellers}
              onDecide={handleSellerRequestDecision}
              onNavigate={(p) => setCurrentPage(p)}
              onViewRequest={(id) => { setSelectedRequestId(id); setCurrentPage('seller-requests'); }}
            />
          )}

          {currentPage === 'seller-requests' && (
            <SellerRequestsView 
              sellerRequests={sellerRequests}
              onDecide={handleSellerRequestDecision}
              selectedId={selectedRequestId}
              onSelectId={(id) => setSelectedRequestId(id)}
            />
          )}

          {currentPage === 'sellers' && (
            <SellersView 
              sellers={sellers}
              onToggleStatus={handleToggleSellerStatus}
            />
          )}

          {currentPage === 'products' && (
            <ProductsView 
              products={products}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          )}

          {currentPage === 'orders' && (
            <OrdersView 
              orders={orders}
              onUpdateOrderStatus={handleUpdateOrderStatus}
            />
          )}

          {currentPage === 'users' && (
            <UsersView 
              users={users}
              onInviteUser={handleInviteUser}
              onToggleUserStatus={handleToggleUserStatus}
            />
          )}

          {currentPage === 'reviews' && (
            <ReviewsView 
              reviews={reviews}
              onUpdateReviewStatus={handleUpdateReviewStatus}
              onDeleteReview={handleDeleteReview}
            />
          )}

          {currentPage === 'payments' && (
            <PaymentsView 
              payments={payments}
              onReleasePayout={handleReleasePayout}
              onAddPayout={handleAddPayout}
            />
          )}

          {currentPage === 'transactions' && (
            <TransactionsView 
              transactions={transactions}
            />
          )}

          {currentPage === 'reports' && (
            <ReportsView />
          )}

          {currentPage === 'settings' && (
            <SettingsView 
              config={config}
              onSaveConfig={handleSaveConfig}
            />
          )}
        </section>

      </main>

      {/* 3. FLOAT TOAST NOTIFICATION BOX OVERLAY */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-emerald-950 text-white rounded-full p-2 pl-3 px-5 shadow-2xl z-50 flex items-center gap-2 border border-emerald-800 text-xs font-serif font-black tracking-wide animate-fade-in select-none">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="w-4 h-4 ml-2.5 hover:bg-white/10 rounded-full flex items-center justify-center text-slate-300"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

    </div>
  );
}
