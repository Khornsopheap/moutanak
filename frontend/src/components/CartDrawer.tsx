/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShoppingBag, X, Plus, Minus, Trash2, Lock, Tag } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onStartCheckout: () => void;
  couponCode: string;
  onApplyCoupon: (code: string) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onStartCheckout,
  couponCode,
  onApplyCoupon
}: CartDrawerProps) {
  const [promoInput, setPromoInput] = useState(couponCode);
  const [promoError, setPromoError] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const isCouponValid = couponCode.toUpperCase() === 'FRESH20';
  const discount = isCouponValid ? subtotal * 0.20 : 0;
  const total = subtotal - discount;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoInput.trim().toUpperCase() === 'FRESH20') {
      onApplyCoupon('FRESH20');
      setPromoError('');
    } else {
      setPromoError('Incorrect coupon code or expired.');
    }
  };

  return (
    <>
      {/* Overlay Backdrop */}
      <div 
        id="cart-overlay"
        className={`fixed inset-0 bg-black/45 backdrop-blur-xs z-50 ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />

      {/* Cart Slider Panel */}
      <div 
        id="cart-drawer"
        className={`fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col ${isOpen ? 'open' : ''}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-800">
              My Basket <span className="text-xs font-semibold text-slate-400">({cartItems.length} styles)</span>
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer transition text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Items Container */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 no-scrollbar">
          {cartItems.length === 0 ? (
            <div className="text-center py-24 text-slate-400 flex flex-col items-center">
              <ShoppingBag className="w-12 h-12 text-slate-200 mb-4 stroke-1.5" />
              <p className="font-bold text-slate-700 text-sm">Your basket is empty</p>
              <p className="text-xs text-slate-400 mt-1">Select our organic farm treats above!</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div 
                key={item.product.id} 
                className="flex gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100/50 hover:bg-slate-50/50 transition"
              >
                {/* Image */}
                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                  <img 
                    src={item.product.imageUrl} 
                    alt={item.product.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs text-slate-800 truncate">
                    {item.product.name}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {item.product.sourceFarm} • {item.product.weight} {item.product.unit}
                  </p>
                  <p className="text-xs text-emerald-700 font-bold font-mono mt-1">
                    ${item.product.price.toFixed(2)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col items-end gap-2 justify-between">
                  <button 
                    onClick={() => onRemoveItem(item.product.id)}
                    className="text-slate-400 hover:text-red-500 cursor-pointer p-0.5 rounded transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-1 scale-90">
                    <button 
                      onClick={() => onUpdateQuantity(item.product.id, -1)}
                      className="w-5 h-5 flex items-center justify-center rounded bg-slate-50 hover:bg-slate-100 text-slate-600 cursor-pointer text-[10px]"
                    >
                      <Minus className="w-2.5 h-2.5" />
                    </button>
                    <span className="text-xs font-black text-slate-800 font-mono w-4 text-center">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => onUpdateQuantity(item.product.id, 1)}
                      className="w-5 h-5 flex items-center justify-center rounded bg-slate-50 hover:bg-slate-100 text-slate-600 cursor-pointer text-[10px]"
                    >
                      <Plus className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Area with Promo & Pricing */}
        {cartItems.length > 0 && (
          <div className="px-6 py-5 border-t border-slate-100 bg-slate-50">
            {/* Promo Code Coupon Field */}
            <form onSubmit={handleApplyPromo} className="mb-4">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Have a coupon code?
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Enter FRESH20 (20% off)"
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-400 font-medium text-slate-700"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold font-sans cursor-pointer transition shadow-sm"
                >
                  Apply
                </button>
              </div>
              {isCouponValid && (
                <p className="text-[10px] text-emerald-600 font-extrabold mt-1">
                  🎉 Code FRESH20 active (20% Off Coupon Applied)
                </p>
              )}
              {promoError && (
                <p className="text-[10px] text-red-500 font-semibold mt-1">
                  ⚠️ {promoError}
                </p>
              )}
            </form>

            {/* Calculations */}
            <div className="space-y-1.5 border-t border-slate-200/50 pt-3 text-xs mb-4">
              <div className="flex justify-between items-center text-slate-500 font-medium">
                <span>Subtotal</span>
                <span className="font-mono">${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between items-center text-emerald-600 font-extrabold">
                  <span>Discount (20% Off)</span>
                  <span className="font-mono">-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-slate-500 font-medium">
                <span>Delivery Cargo</span>
                <span className="font-semibold text-emerald-600 uppercase text-[10px]">Calculated later</span>
              </div>
              <div className="flex justify-between items-center text-sm font-black text-slate-800 border-t border-slate-200/40 pt-2.5 mt-2">
                <span>Estimated Sum</span>
                <span className="font-mono text-base">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <button
              onClick={() => {
                onClose();
                onStartCheckout();
              }}
              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm cursor-pointer shadow-lg hover:shadow-emerald-500/15 transition-all flex items-center justify-center gap-2 active:scale-98"
              id="checkout-trigger-btn"
            >
              <Lock className="w-4 h-4 text-emerald-100" />
              Secure Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
