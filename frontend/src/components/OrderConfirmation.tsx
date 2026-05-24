/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { 
  CheckCircle, 
  MapPin, 
  Clock, 
  Sparkles, 
  ShoppingBag, 
  ArrowRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { Order } from '../types';

interface OrderConfirmationProps {
  order: Order;
  onGoHome: () => void;
}

export default function OrderConfirmation({ order, onGoHome }: OrderConfirmationProps) {
  const [activeStep, setActiveStep] = useState(1);

  // Simple interval to simulate real-time packing progress
  useEffect(() => {
    const t = setInterval(() => {
      setActiveStep(prev => (prev < 4 ? prev + 1 : prev));
    }, 5000); // Transitions to next milestone step every 5 seconds for simulation demonstration
    return () => clearInterval(t);
  }, []);

  const {
    id: orderId,
    items,
    deliveryInfo,
    paymentDetails,
    taxAmount,
    deliveryFee,
    discountAmount,
    totalAmount,
    orderDate
  } = order;

  return (
    <div className="mx-[5vw] my-12 max-w-2xl mx-auto">
      <div 
        className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xl text-center space-y-6 relative overflow-hidden"
        id="order-confirmation-receipt"
      >
        {/* Confetti sparkle backgrounds details */}
        <div className="absolute top-0 inset-x-0 h-2 bg-emerald-500" />
        <div className="absolute top-6 left-6 text-emerald-200 animate-bounce">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="absolute top-12 right-12 text-emerald-200 animate-pulse">
          <Sparkles className="w-5 h-5" />
        </div>

        {/* Big Success Tick */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600 scale-100 animate-scaleIn">
          <CheckCircle className="w-10 h-10 stroke-[2.5]" />
        </div>

        <div>
          <span className="text-[10px] uppercase font-black tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Receipt Authenticated Successfully
          </span>
          <h1 className="text-3xl font-black text-slate-800 font-serif mt-3">
            Thank you for your order!
          </h1>
          <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">
            Your support brings immediate food security and fair compensation to local agricultural farmers in Cambodia.
          </p>
        </div>

        {/* Order Details Mini-Card */}
        <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 text-xs flex justify-between items-center text-left max-w-md mx-auto">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order Receipt ID</p>
            <p className="font-mono font-bold text-sm text-slate-800 mt-0.5">{orderId}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order Transacted</p>
            <p className="font-semibold text-slate-700 mt-0.5">{new Date(orderDate).toLocaleTimeString()}</p>
          </div>
        </div>

        {/* Dynamic Dispatch Milestone Stepper Tracker */}
        <div className="pt-4 border-t border-slate-100 text-left max-w-md mx-auto">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-5 flex items-center gap-1.5 justify-center">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            Live Dispatch Progress Simulator (Reactivity Demo)
          </h3>
          
          <div className="space-y-4 font-sans">
            {/* Step 1 */}
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  activeStep >= 1 ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  {activeStep > 1 ? '✓' : '1'}
                </div>
                <div className={`w-0.5 h-6 ${activeStep > 1 ? 'bg-emerald-500' : 'bg-slate-200'}`} />
              </div>
              <div>
                <p className={`text-xs font-bold leading-none ${activeStep >= 1 ? 'text-slate-800' : 'text-slate-400'}`}>Order Registered & Approved</p>
                <p className="text-[10px] text-slate-400 mt-1">Payment verified and logged.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  activeStep >= 2 ? 'bg-emerald-500 text-white animate-pulse' : 'bg-slate-100 text-slate-400'
                }`}>
                  {activeStep > 2 ? '✓' : '2'}
                </div>
                <div className={`w-0.5 h-6 ${activeStep > 2 ? 'bg-emerald-500' : 'bg-slate-200'}`} />
              </div>
              <div>
                <p className={`text-xs font-bold leading-none ${activeStep >= 2 ? 'text-slate-800' : 'text-slate-400'}`}>Farm Fresh Packing</p>
                <p className="text-[10px] text-slate-400 mt-1">Fresh organic stocks cataloged and bundled in reusable eco-crates.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  activeStep >= 3 ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  {activeStep > 3 ? '✓' : '3'}
                </div>
                <div className={`w-0.5 h-6 ${activeStep > 3 ? 'bg-emerald-500' : 'bg-slate-200'}`} />
              </div>
              <div>
                <p className={`text-xs font-bold leading-none ${activeStep >= 3 ? 'text-slate-800' : 'text-slate-400'}`}>Courier In Transit</p>
                <p className="text-[10px] text-slate-400 mt-1">Refrigerated box motorcycle picked up and routing coordinates calculated.</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-slate-100 text-slate-400">
                {activeStep >= 4 ? (
                  <span className="w-full h-full rounded-full bg-emerald-500 text-white flex items-center justify-center">✓</span>
                ) : '4'}
              </div>
              <div>
                <p className={`text-xs font-bold leading-none ${activeStep >= 4 ? 'text-slate-800' : 'text-slate-400'}`}>Arrived & Delivered</p>
                <p className="text-[10px] text-slate-400 mt-1">Left at specified location with fresh guarantee confirmation.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cost and Recipient overview */}
        <div className="pt-6 border-t border-slate-100 text-left space-y-4 max-w-md mx-auto">
          {/* Recipient Details */}
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-500" />
              Rider Shipping Target
            </h4>
            <p className="font-bold text-xs text-slate-750 mt-1">{deliveryInfo.fullName} ({deliveryInfo.phone})</p>
            <p className="text-slate-500 text-xs mt-0.5">{deliveryInfo.address}, {deliveryInfo.cityPreset}</p>
          </div>

          {/* Checkout item listings mini */}
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 mb-2">
              <ShoppingBag className="w-3 h-3 text-emerald-500" />
              Sourced Items ({items.length})
            </h4>
            <div className="space-y-1.5 text-xs text-slate-600">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between">
                  <span>{item.product.name} <span className="text-slate-400 font-medium">x{item.quantity}</span></span>
                  <span className="font-mono font-semibold">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between pt-1 border-t border-slate-150 text-slate-400 text-[11px]">
                <span>Logistics Cargo fee</span>
                <span className="font-mono">${deliveryFee.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 text-[11px] font-semibold">
                  <span>Promo Saving (FRESH20)</span>
                  <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-slate-800 pt-1.5 border-t border-slate-200 text-sm">
                <span>Paid Total Amount</span>
                <span className="font-mono text-emerald-700">${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Confirm Trigger Button */}
        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.print()}
            className="px-5 py-2.5 rounded-full border border-slate-200 text-slate-600 font-bold text-xs cursor-pointer hover:bg-slate-50 transition flex items-center gap-1.5 justify-center"
          >
            <FileText className="w-3.5 h-3.5" />
            Print Invoice
          </button>
          
          <button
            onClick={onGoHome}
            className="px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs cursor-pointer transition flex items-center gap-1.5 justify-center shadow-md shadow-emerald-500/10 active:scale-95"
            id="back-to-market-btn"
          >
            Back to Produce Market
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
