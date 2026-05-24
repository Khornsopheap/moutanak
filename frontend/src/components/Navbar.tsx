/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Leaf, 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  Store, 
  User,
  MapPin,
  HelpCircle
} from 'lucide-react';

interface NavbarProps {
  cartItemsCount: number;
  onOpenCart: () => void;
  onOpenJoin: () => void;
  onOpenSeller: () => void;
  currentSearch: string;
  onSearchChange: (val: string) => void;
  activeCategory: string;
  onCategorySelect: (cat: string) => void;
  isInCheckout: boolean;
  onGoToStore: () => void;
}

export default function Navbar({
  cartItemsCount,
  onOpenCart,
  onOpenJoin,
  onOpenSeller,
  currentSearch,
  onSearchChange,
  activeCategory,
  onCategorySelect,
  isInCheckout,
  onGoToStore
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <nav className="sticky top-0 z-40 mt-4 px-[5vw]">
      <div className="flex justify-between items-center px-5 border border-slate-200/80 rounded-full py-2.5 bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        
        {/* Logo */}
        <button 
          onClick={onGoToStore}
          className="flex items-center gap-2 group cursor-pointer text-left"
          id="nav-logo-btn"
        >
          <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white scale-95 group-hover:scale-100 transition duration-300">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <span 
              className="font-bold text-xl block leading-none font-serif text-emerald-700 hover:text-emerald-500 transition"
            >
              Moutanak
            </span>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block mt-0.5">
              Farm to Door
            </span>
          </div>
        </button>

        {/* Navigation Categories/Links (Hidden if in checkout, or styled nicely) */}
        {!isInCheckout && (
          <div className="hidden lg:flex items-center gap-8">
            <button
              onClick={() => {
                onGoToStore();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-slate-650 hover:text-emerald-600 font-bold text-sm transition cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => {
                onGoToStore();
                setTimeout(() => {
                  document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }}
              className="text-slate-655 hover:text-emerald-600 font-bold text-sm transition cursor-pointer"
            >
              Products
            </button>
            <button
              onClick={() => {
                onGoToStore();
                setTimeout(() => {
                  document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }}
              className="text-slate-655 hover:text-emerald-600 font-bold text-sm transition cursor-pointer"
            >
              Categories
            </button>
            <button
              onClick={() => {
                onGoToStore();
                setTimeout(() => {
                  document.getElementById('promo-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }}
              className="text-slate-655 hover:text-emerald-600 font-bold text-sm transition cursor-pointer"
            >
              Deals
            </button>
            <button
              onClick={() => {
                onGoToStore();
                setTimeout(() => {
                  document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }}
              className="text-slate-655 hover:text-emerald-600 font-bold text-sm transition cursor-pointer"
            >
              Contact
            </button>
          </div>
        )}

        {/* Global Search and Interactive Controls */}
        <div className="flex items-center gap-3">
          
          {/* Dynamic Search Bar (Integrated to nav row) */}
          {!isInCheckout && (
            <div 
              className={`relative hidden md:flex items-center rounded-full border transition duration-300 px-3 py-1.5 bg-slate-50 ${
                searchFocused ? 'border-emerald-500 ring-2 ring-emerald-100 bg-white w-64' : 'border-slate-200 w-48'
              }`}
            >
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <input
                type="text"
                value={currentSearch}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search fresh harvest..."
                className="bg-transparent text-xs outline-none w-full text-slate-800 placeholder-slate-400 font-medium"
              />
              {currentSearch && (
                <button 
                  onClick={() => onSearchChange('')}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {/* Become a Seller Link */}
          <button 
            onClick={onOpenSeller}
            className="hidden lg:flex items-center gap-2 border border-slate-200/80 text-slate-600 font-semibold px-4.5 py-2 rounded-full text-xs cursor-pointer hover:bg-slate-50 hover:text-emerald-600 transition"
            id="nav-become-seller"
          >
            <Store className="w-3.5 h-3.5" />
            Sell Fresh Produce
          </button>

          {/* User Portal Trigger */}
          <button 
            onClick={onOpenJoin}
            className="hidden lg:flex items-center gap-1.5 text-white font-semibold px-5 py-2 rounded-full text-xs cursor-pointer transition shadow-md bg-emerald-500 hover:bg-emerald-600"
            id="nav-sign-up-btn"
          >
            <User className="w-3.5 h-3.5" />
            Customer Portal
          </button>

          {/* Shopping basket trigger */}
          <button 
            onClick={onOpenCart}
            className="relative w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 hover:bg-slate-50 transition text-slate-600 hover:text-emerald-600 cursor-pointer shadow-sm bg-white"
            aria-label="Toggle shopping cart"
            id="nav-cart-btn"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartItemsCount > 0 && (
              <span 
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-[10px] font-black flex items-center justify-center bg-emerald-500 animate-pulse"
              >
                {cartItemsCount}
              </span>
            )}
          </button>

          {/* Mobile responsive toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 cursor-pointer text-slate-600 hover:bg-slate-50"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown Panel */}
      <div 
        id="mobile-menu"
        className={`lg:hidden bg-white/98 backdrop-blur-md rounded-2xl mx-2 mt-2 border border-slate-200/80 p-5 space-y-4 shadow-xl ${
          mobileMenuOpen ? 'open' : ''
        }`}
      >
        {!isInCheckout && (
          <div className="relative">
            <input
              type="text"
              value={currentSearch}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search fresh harvest..."
              className="w-full border border-slate-200 bg-slate-50 rounded-full py-2.5 px-4 pr-10 outline-none text-xs text-slate-800"
            />
            <Search className="absolute right-4 top-3 text-slate-400 w-4 h-4" />
          </div>
        )}
        
        <div className="flex flex-col gap-2 font-medium text-slate-700">
          <button 
            onClick={() => { onGoToStore(); setMobileMenuOpen(false); }}
            className="py-2.5 border-b border-slate-100 text-left hover:text-emerald-500 text-sm font-semibold"
          >
            🏠 Home & Produce Market
          </button>
          <button 
            onClick={() => { onOpenSeller(); setMobileMenuOpen(false); }}
            className="py-2.5 border-b border-slate-100 text-left hover:text-emerald-500 text-sm"
          >
            🚜 Sell Fresh Produce
          </button>
          <button 
            onClick={() => { onOpenJoin(); setMobileMenuOpen(false); }}
            className="py-2.5 border-b border-slate-100 text-left hover:text-emerald-500 text-sm"
          >
            🔑 customer Portal & Registration
          </button>
        </div>
      </div>
    </nav>
  );
}
