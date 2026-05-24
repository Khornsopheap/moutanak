/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  DollarSign, 
  Leaf, 
  Flame, 
  Tag,
  Edit2,
  CheckCircle,
  HelpCircle,
  ShoppingBag
} from 'lucide-react';
import { CartItem, DeliveryInfo, PaymentDetails, DeliveryMethod } from '../types';
import { DELIVERY_METHODS, CITY_PRESETS } from '../data';

interface CheckoutFlowProps {
  cartItems: CartItem[];
  couponCode: string;
  onApplyCoupon: (code: string) => void;
  onPlaceOrder: (delivery: DeliveryInfo, payment: PaymentDetails) => void;
  onCancel: () => void;
}

export default function CheckoutFlow({
  cartItems,
  couponCode,
  onApplyCoupon,
  onPlaceOrder,
  onCancel
}: CheckoutFlowProps) {
  // Current step state: 'delivery' | 'payment' | 'review'
  const [step, setStep] = useState<'delivery' | 'payment' | 'review'>('delivery');

  // Input States for Step 1 — Delivery
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [cityPreset, setCityPreset] = useState('pp');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [selectedMethodId, setSelectedMethodId] = useState('dm_eco');
  
  // Validation errors for Step 1
  const [deliveryErrors, setDeliveryErrors] = useState<{ [key: string]: string }>({});

  // Input States for Step 2 — Payment
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card' | 'aba_qr'>('cod');
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [paymentErrors, setPaymentErrors] = useState<{ [key: string]: string }>({});
  
  // ABA Local Mock QR verification simulation
  const [abaPaid, setAbaPaid] = useState(false);
  const [isVerifyingAba, setIsVerifyingAba] = useState(false);

  // Promo discount states
  const [promoInput, setPromoInput] = useState(couponCode);
  const [promoMessage, setPromoMessage] = useState('');

  // Active method details helper
  const activeDeliveryMethod = DELIVERY_METHODS.find(m => m.id === selectedMethodId) || DELIVERY_METHODS[0];

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const deliveryFee = activeDeliveryMethod.cost;
  const isCouponValid = couponCode.toUpperCase() === 'FRESH20';
  const discountAmount = isCouponValid ? subtotal * 0.20 : 0;
  const taxAmount = (subtotal - discountAmount + deliveryFee) * 0.10; // 10% VAT
  const totalAmount = subtotal + deliveryFee - discountAmount + taxAmount;

  // Form Validations
  const validateDelivery = () => {
    const errs: { [key: string]: string } = {};
    if (!fullName.trim()) errs.fullName = 'Full Name is required';
    if (!phone.trim()) errs.phone = 'Phone Number is required';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email address';
    if (!address.trim()) errs.address = 'Delivery destination address is required';
    
    setDeliveryErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validatePayment = () => {
    if (paymentMethod === 'cod') return true;
    if (paymentMethod === 'aba_qr') {
      if (!abaPaid) {
         setPaymentErrors({ qr: 'Please scan and complete payment approval in your mobile app first.' });
         return false;
      }
      return true;
    }

    const errs: { [key: string]: string } = {};
    if (!cardholderName.trim()) errs.cardholderName = 'Cardholder name is required';
    if (!cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) errs.cardNumber = 'Valid 16-digit card number is required';
    if (!expiryDate.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)) errs.expiryDate = 'Expiry date must be MM/YY';
    if (!cvv.match(/^\d{3,4}$/)) errs.cvv = 'CVV code is required (3-4 digits)';

    setPaymentErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step Controls
  const handleProceedToPayment = () => {
    if (validateDelivery()) {
      setStep('payment');
    }
  };

  const handleProceedToReview = () => {
    if (validatePayment()) {
      setStep('review');
    }
  };

  const handleApplyPromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoInput.trim().toUpperCase() === 'FRESH20') {
      onApplyCoupon('FRESH20');
      setPromoMessage('🎉 20% discount applied successfully!');
    } else {
      setPromoMessage('❌ Invalid coupon code.');
    }
  };

  const handleVerifyAbaDeposit = () => {
    setIsVerifyingAba(true);
    setTimeout(() => {
      setIsVerifyingAba(false);
      setAbaPaid(true);
      setPaymentErrors({});
    }, 1500);
  };

  const handleSubmitFinalOrder = () => {
    const delivery: DeliveryInfo = {
      fullName,
      phone,
      email,
      address,
      cityPreset: CITY_PRESETS.find(p => p.id === cityPreset)?.name || cityPreset,
      specialInstructions,
      methodId: selectedMethodId
    };

    const payment: PaymentDetails = {
      method: paymentMethod,
      cardholderName: paymentMethod === 'card' ? cardholderName : undefined,
      cardNumber: paymentMethod === 'card' ? cardNumber : undefined,
      expiryDate: paymentMethod === 'card' ? expiryDate : undefined,
      cvv: paymentMethod === 'card' ? cvv : undefined,
      abaConfirmed: paymentMethod === 'aba_qr' ? abaPaid : undefined
    };

    onPlaceOrder(delivery, payment);
  };

  // Helper formatting for credit card typing
  const formatCardNumberInput = (v: string) => {
    const clean = v.replace(/\D/g, '');
    const groups = clean.match(/.{1,4}/g);
    return groups ? groups.join(' ').substring(0, 19) : clean;
  };

  const formatExpiryInput = (v: string) => {
    const clean = v.replace(/\D/g, '');
    if (clean.length >= 2) {
      return `${clean.substring(0, 2)}/${clean.substring(2, 4)}`;
    }
    return clean;
  };

  return (
    <div className="mx-[5vw] my-10 max-w-5xl lg:mx-auto">
      {/* Title */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 font-serif">Checkout Checkout</h1>
          <p className="text-slate-500 text-sm mt-1">Configure your fresh delivery routes and complete transaction details</p>
        </div>
        <button 
          onClick={onCancel}
          className="flex items-center gap-1.5 border border-slate-200 bg-white hover:bg-slate-50 px-4.5 py-2 rounded-full font-bold text-slate-600 text-xs transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Cancel & Store
        </button>
      </div>

      {/* Stepper Progress Bar */}
      <div className="mb-10 bg-white border border-slate-200/65 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          
          {/* Node 1: Delivery info */}
          <button 
            type="button"
            onClick={() => setStep('delivery')}
            className="flex items-center gap-2 text-left"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition duration-300 ${
              step === 'delivery' ? 'bg-emerald-500 text-white ring-4 ring-emerald-100' : 'bg-emerald-100 text-emerald-700'
            }`}>
              {step !== 'delivery' ? <Check className="w-4 h-4" /> : '1'}
            </div>
            <div>
              <p className="text-xs font-black text-slate-800 leading-none">Shipping</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Address & Speed</p>
            </div>
          </button>

          {/* Separation line 1 */}
          <div className={`flex-1 h-0.5 mx-4 transition-all duration-300 ${step !== 'delivery' ? 'bg-emerald-500' : 'bg-slate-200'}`} />

          {/* Node 2: Payment details */}
          <button 
            type="button"
            onClick={() => { if (validateDelivery()) setStep('payment'); }}
            className="flex items-center gap-2 text-left"
            disabled={!fullName || !address}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition duration-300 ${
              step === 'payment' ? 'bg-emerald-500 text-white ring-4 ring-emerald-100' : 
              step === 'review' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
            }`}>
              {step === 'review' ? <Check className="w-4 h-4" /> : '2'}
            </div>
            <div>
              <p className="text-xs font-black text-slate-800 leading-none">Payment</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Method config</p>
            </div>
          </button>

          {/* Separation line 2 */}
          <div className={`flex-1 h-0.5 mx-4 transition-all duration-300 ${step === 'review' ? 'bg-emerald-500' : 'bg-slate-200'}`} />

          {/* Node 3: Review summary */}
          <button 
            type="button"
            onClick={() => { if (validateDelivery() && validatePayment()) setStep('review'); }}
            className="flex items-center gap-2 text-left"
            disabled={!fullName || !address || (paymentMethod === 'card' && !cardholderName)}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition duration-300 ${
              step === 'review' ? 'bg-emerald-500 text-white ring-4 ring-emerald-100' : 'bg-slate-100 text-slate-400'
            }`}>
              3
            </div>
            <div>
              <p className="text-xs font-black text-slate-800 leading-none">Review</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Final Confirmation</p>
            </div>
          </button>

        </div>
      </div>

      {/* Main Column Breakdown Grid: Left Forms, Right Summary Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Step Forms) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* STEP 1: DELIVERY ADDRESS & SPEED OPTIONS */}
          {step === 'delivery' && (
            <div className="bg-white border border-slate-200/75 rounded-2xl p-6 shadow-xs space-y-5">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                <MapPin className="w-5 h-5 text-emerald-500" />
                1. Delivery & Recipient Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Recipient Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 block">Recipient Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      placeholder="e.g. Sophea Phandara"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-xs outline-none transition ${
                        deliveryErrors.fullName ? 'border-red-400 focus:ring-1 focus:ring-red-100' : 'border-slate-200 focus:border-emerald-400 focus:bg-white'
                      }`}
                    />
                  </div>
                  {deliveryErrors.fullName && <p className="text-[10px] text-red-500 font-bold">{deliveryErrors.fullName}</p>}
                </div>

                {/* Recipient Phone */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 block">Contact Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      placeholder="e.g. +855 12 345 678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-xs outline-none transition ${
                        deliveryErrors.phone ? 'border-red-400 focus:ring-1 focus:ring-red-100' : 'border-slate-200 focus:border-emerald-400 focus:bg-white'
                      }`}
                    />
                  </div>
                  {deliveryErrors.phone && <p className="text-[10px] text-red-500 font-bold">{deliveryErrors.phone}</p>}
                </div>

                {/* Recipient Email */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-slate-600 block">Email Address (Order receipts & progress tracking)</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      placeholder="e.g. sophea.p@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-xs outline-none transition ${
                        deliveryErrors.email ? 'border-red-400 focus:ring-1 focus:ring-red-100' : 'border-slate-200 focus:border-emerald-400 focus:bg-white'
                      }`}
                    />
                  </div>
                  {deliveryErrors.email && <p className="text-[10px] text-red-500 font-bold">{deliveryErrors.email}</p>}
                </div>

                {/* Province/City Selection Preset */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 block">Province or City Hub</label>
                  <select
                    value={cityPreset}
                    onChange={(e) => setCityPreset(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none focus:border-emerald-400 focus:bg-white"
                  >
                    {CITY_PRESETS.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {/* Direct Street Address */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 block">Street Name, House No, Area Address</label>
                  <input
                    type="text"
                    placeholder="e.g. House #45B, Street 310, Boeung Keng Kang I"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-xs outline-none transition ${
                      deliveryErrors.address ? 'border-red-400 focus:ring-1 focus:ring-red-100' : 'border-slate-200 focus:border-emerald-400 focus:bg-white'
                    }`}
                  />
                  {deliveryErrors.address && <p className="text-[10px] text-red-500 font-bold">{deliveryErrors.address}</p>}
                </div>

                {/* Instructions */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-slate-600 block">Driver Delivery Notes / Special instructions (Optional)</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Ring secondary doorbell. Please place fresh vegetables in shaded area if not home."
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-400 focus:bg-white"
                  />
                </div>
              </div>

              {/* Delivery courier shipping method selector */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-500" />
                  Select Delivery Speed & Rate
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {DELIVERY_METHODS.map((method) => {
                    const isSelected = selectedMethodId === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setSelectedMethodId(method.id)}
                        className={`text-left p-4 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                          isSelected 
                            ? 'border-emerald-500 bg-emerald-50/50 shadow-sm' 
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        {/* Selected Indicator Checkmark */}
                        {isSelected && (
                          <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center scale-90">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        )}

                        <div>
                          {/* Title with icon preview mockup */}
                          <div className="flex items-center gap-1.5 mb-1 text-slate-800 font-bold text-xs">
                            {method.icon === 'Leaf' && <Leaf className="w-3.5 h-3.5 text-emerald-500" />}
                            {method.icon === 'Truck' && <Truck className="w-3.5 h-3.5 text-blue-500" />}
                            {method.icon === 'Flame' && <Flame className="w-3.5 h-3.5 text-orange-500" />}
                            <span>{method.name}</span>
                          </div>

                          <p className="text-[10px] text-slate-400 leading-normal mb-3">
                            {method.description}
                          </p>
                        </div>

                        <div className="mt-auto pt-2 border-t border-slate-200/40 flex items-center justify-between">
                          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100/55 px-2 py-0.5 rounded-full">
                            {method.durationText}
                          </span>
                          <span className="text-xs font-black text-slate-800 font-mono">
                            ${method.cost.toFixed(2)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action */}
              <div className="pt-3 flex justify-end">
                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-2 shadow-sm"
                >
                  Configure Payment Details
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PAYMENT METHOD CONFIG */}
          {step === 'payment' && (
            <div className="bg-white border border-slate-200/75 rounded-2xl p-6 shadow-xs space-y-6">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                <CreditCard className="w-5 h-5 text-emerald-500" />
                2. Payment Method Preferences
              </h2>

              {/* Horizonal selection buttons for payment styles */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* 1. COD */}
                <button
                  type="button"
                  onClick={() => { setPaymentMethod('cod'); setPaymentErrors({}); }}
                  className={`p-3.5 rounded-xl border text-center transition cursor-pointer flex items-center gap-2 justify-center font-bold text-xs ${
                    paymentMethod === 'cod' 
                      ? 'border-emerald-500 bg-emerald-50/50 text-emerald-800' 
                      : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  Cash On Delivery
                </button>

                {/* 2. Interactive Card */}
                <button
                  type="button"
                  onClick={() => { setPaymentMethod('card'); setPaymentErrors({}); }}
                  className={`p-3.5 rounded-xl border text-center transition cursor-pointer flex items-center gap-2 justify-center font-bold text-xs ${
                    paymentMethod === 'card' 
                      ? 'border-emerald-500 bg-emerald-50/50 text-emerald-800' 
                      : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  Credit / Debit Card
                </button>

                {/* 3. ABA QR code */}
                <button
                  type="button"
                  onClick={() => { setPaymentMethod('aba_qr'); setPaymentErrors({}); }}
                  className={`p-3.5 rounded-xl border text-center transition cursor-pointer flex items-center gap-2 justify-center font-bold text-xs ${
                    paymentMethod === 'aba_qr' 
                      ? 'border-emerald-500 bg-emerald-50/50 text-emerald-800' 
                      : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  ABA KHQR Transfer
                </button>
              </div>

              {/* Dynamic rendering according to selection */}
              
              {/* Option A: Cash on Delivery Details */}
              {paymentMethod === 'cod' && (
                <div className="p-4 rounded-xl bg-orange-50/60 border border-orange-100 flex gap-3 text-xs leading-relaxed text-orange-700">
                  <span className="text-lg">💵</span>
                  <div>
                    <p className="font-extrabold mb-0.5">Pay safely with Cash on Delivery</p>
                    <p className="text-orange-900/80">No advance payment needed. Simply prepare <span className="font-bold">${totalAmount.toFixed(2)}</span> cash or local scan to hand over to the delivery rider upon cargo arrival.</p>
                  </div>
                </div>
              )}

              {/* Option B: Credit / Debit Card Interactive Configuration */}
              {paymentMethod === 'card' && (
                <div className="space-y-6">
                  {/* Visual Premium Credit Card Rendering */}
                  <div className="w-full max-w-sm mx-auto bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden aspect-[1.6/1]">
                    {/* Artistic organic curves in card background */}
                    <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-emerald-500/10" />
                    <div className="absolute -left-10 -bottom-10 w-36 h-36 rounded-full bg-white/5" />
                    
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <span className="font-serif font-black text-base italic text-emerald-100">Moutanak</span>
                        <p className="text-[8px] uppercase tracking-widest text-emerald-200">Green Visa</p>
                      </div>
                      <div className="w-10 h-7 bg-white/10 rounded-md backdrop-blur-xs flex items-center justify-center font-extrabold text-[10px] uppercase">
                        Visa
                      </div>
                    </div>

                    {/* Sim card gold chip mockup */}
                    <div className="w-10 h-7 rounded-sm bg-amber-400/80 mb-4 border border-amber-500/30 flex flex-col gap-0.5 p-1">
                      <div className="h-full w-full border-t border-b border-amber-600/20" />
                    </div>

                    {/* Card Numbers layout */}
                    <p className="text-base tracking-[0.25em] font-mono text-emerald-50 font-bold min-h-6 mb-4">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </p>

                    {/* Footer */}
                    <div className="flex justify-between items-end border-t border-white/10 pt-3">
                      <div>
                        <p className="text-[7px] uppercase tracking-widest text-emerald-300">Cardholder</p>
                        <p className="text-xs font-bold font-mono uppercase truncate max-w-44 min-h-4">
                          {cardholderName || 'SOPHEA PHANDARA'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[7px] uppercase tracking-widest text-emerald-300">Expiry Date</p>
                        <p className="text-xs font-bold font-mono min-h-4">
                          {expiryDate || 'MM/YY'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Cardholder */}
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-bold text-slate-600 block">Cardholder Name</label>
                      <input
                        type="text"
                        placeholder="e.g. SOPHEA PHANDARA"
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value.toUpperCase())}
                        className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs outline-none transition ${
                          paymentErrors.cardholderName ? 'border-red-400' : 'border-slate-200 focus:border-emerald-400 focus:bg-white'
                        }`}
                      />
                    </div>

                    {/* Card Number */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">Card Number</label>
                      <input
                        type="text"
                        placeholder="4000 1234 5678 9010"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumberInput(e.target.value))}
                        className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs outline-none font-mono transition ${
                          paymentErrors.cardNumber ? 'border-red-400' : 'border-slate-200 focus:border-emerald-400 focus:bg-white'
                        }`}
                      />
                    </div>

                    {/* Expiry & CVV */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 block">Expiry</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(formatExpiryInput(e.target.value))}
                          className={`w-full px-3 py-2.5 bg-slate-50 border rounded-xl text-xs outline-none font-mono text-center transition ${
                            paymentErrors.expiryDate ? 'border-red-400' : 'border-slate-200 focus:border-emerald-400 focus:bg-white'
                          }`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 block">CVV</label>
                        <input
                          type="password"
                          placeholder="•••"
                          maxLength={4}
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                          className={`w-full px-3 py-2.5 bg-slate-50 border rounded-xl text-xs outline-none font-mono text-center transition ${
                            paymentErrors.cvv ? 'border-red-400' : 'border-slate-200 focus:border-emerald-400 focus:bg-white'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                  {Object.keys(paymentErrors).length > 0 && (
                    <div className="p-3 bg-red-50 text-red-500 rounded-xl text-xs font-semibold">
                      Please fix outstanding card details highlighted above.
                    </div>
                  )}
                </div>
              )}

              {/* Option C: ABA / Local Bank QR Transfer Simulator */}
              {paymentMethod === 'aba_qr' && (
                <div className="flex flex-col items-center justify-center p-6 border border-slate-100 rounded-2xl bg-emerald-50/20 text-center">
                  <p className="font-black text-sm text-emerald-800 mb-1">Scan KHQR to Purchase</p>
                  <p className="text-[10px] text-slate-400 mb-5 max-w-xs">Scan using ABA Mobile or any local bank application to verify funds instantly.</p>

                  <div className="relative p-4 bg-white rounded-2xl border border-slate-250/50 shadow-md">
                    {/* KHQR design wrapper */}
                    <div className="w-40 h-40 bg-slate-50 border border-emerald-500/25 flex flex-col items-center justify-center p-2 rounded-xl relative">
                      {/* Generates realistic lookup with lines */}
                      <div className="w-full h-full border border-dashed border-emerald-500/20 flex flex-col items-center justify-center relative">
                        <svg className="w-32 h-32 text-slate-800" viewBox="0 0 100 100">
                          {/* Mock intricate QR pattern */}
                          <rect x="5" y="5" width="25" height="25" fill="currentColor" />
                          <rect x="10" y="10" width="15" height="15" fill="white" />
                          <rect x="12" y="12" width="11" height="11" fill="currentColor" />
                          
                          <rect x="70" y="5" width="25" height="25" fill="currentColor" />
                          <rect x="75" y="10" width="15" height="15" fill="white" />
                          <rect x="77" y="12" width="11" height="11" fill="currentColor" />

                          <rect x="5" y="70" width="25" height="25" fill="currentColor" />
                          <rect x="10" y="75" width="15" height="15" fill="white" />
                          <rect x="12" y="77" width="11" height="11" fill="currentColor" />

                          <rect x="40" y="40" width="20" height="20" fill="currentColor" />
                          <rect x="45" y="45" width="10" height="10" fill="white" />

                          <rect x="40" y="10" width="15" height="5" fill="currentColor" />
                          <rect x="45" y="20" width="10" height="10" fill="currentColor" />
                          <rect x="10" y="40" width="15" height="5" fill="currentColor" />
                          <rect x="25" y="50" width="10" height="5" fill="currentColor" />

                          <rect x="70" y="40" width="15" height="15" fill="currentColor" />
                          <rect x="80" y="60" width="15" height="15" fill="currentColor" />
                          <rect x="45" y="80" width="20" height="10" fill="currentColor" />
                          <rect x="50" y="75" width="5" height="10" fill="currentColor" />
                        </svg>
                        
                        {/* Nested center leaf logo block */}
                        <div className="absolute w-8 h-8 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white scale-90">
                          <Leaf className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                    {abaPaid && (
                      <div className="absolute inset-0 bg-emerald-600/90 rounded-2xl flex flex-col items-center justify-center text-white p-3 font-semibold text-xs gap-1.5 backdrop-blur-xs">
                        <CheckCircle className="w-10 h-10 text-white fill-emerald-500" />
                        <span>Payment Confirmed</span>
                        <p className="text-[9px] text-emerald-100 font-medium">TxID: ABA-38192-A</p>
                      </div>
                    )}
                  </div>

                  <p className="font-mono text-emerald-600 font-bold mt-4 text-xs">
                    Sum: ${totalAmount.toFixed(2)}
                  </p>

                  {!abaPaid ? (
                    <button
                      type="button"
                      onClick={handleVerifyAbaDeposit}
                      disabled={isVerifyingAba}
                      className="mt-4 px-6 py-2 rounded-xl border border-emerald-500 text-emerald-700 hover:bg-emerald-500 hover:text-white font-bold text-xs transition cursor-pointer disabled:opacity-45"
                    >
                      {isVerifyingAba ? 'Checking banking ledger...' : 'Mock: Approve scan simulation'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setAbaPaid(false)}
                      className="mt-4 text-[10px] text-slate-400 underline hover:text-slate-600 cursor-pointer"
                    >
                      Reset scan state
                    </button>
                  )}
                  {paymentErrors.qr && <p className="text-[10px] text-red-550 font-bold mt-3 text-red-500">⚠️ {paymentErrors.qr}</p>}
                </div>
              )}

              {/* Navigation controls */}
              <div className="pt-3 flex justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep('delivery')}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs transition cursor-pointer hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Delivery
                </button>

                <button
                  type="button"
                  onClick={handleProceedToReview}
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-2 shadow-sm"
                >
                  Review Order Details
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: FINAL EDITORIAL REVIEW SCREEN */}
          {step === 'review' && (
            <div className="bg-white border border-slate-200/75 rounded-2xl p-6 shadow-xs space-y-6">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                3. Final Editorial Order Review
              </h2>

              <p className="text-slate-500 text-xs font-medium leading-relaxed">Please inspect recipient delivery guidelines and payment structures before authorizing order execution. Let our local direct farmers lock details safely.</p>

              {/* Review summary cards layout split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                {/* Delivery Information summary */}
                <div className="p-4 rounded-xl border border-slate-200/85 space-y-3 bg-slate-50/50 relative">
                  <button 
                    onClick={() => setStep('delivery')}
                    className="absolute top-3.5 right-3.5 text-emerald-600 hover:text-emerald-800 cursor-pointer p-1 rounded-full hover:bg-emerald-50 transition"
                    title="Edit address info"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                    Delivery Destination
                  </h3>
                  
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <p className="font-extrabold text-slate-800">{fullName}</p>
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-slate-400" /> {phone}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-slate-400" /> {email}
                    </p>
                    <p className="pt-1.5 font-semibold text-slate-700">
                      {address}, {cityPreset}
                    </p>
                    {specialInstructions && (
                      <p className="text-[10px] text-orange-700 font-semibold bg-orange-50 p-2 rounded border border-orange-100/50 block mt-2">
                        💡 Key Instruction: {specialInstructions}
                      </p>
                    )}
                  </div>
                </div>

                {/* Logistics & Payment method summary */}
                <div className="p-4 rounded-xl border border-slate-200/85 space-y-3 bg-slate-50/50 relative">
                  <button 
                    onClick={() => setStep('payment')}
                    className="absolute top-3.5 right-3.5 text-emerald-600 hover:text-emerald-800 cursor-pointer p-1 rounded-full hover:bg-emerald-50 transition"
                    title="Edit payment info"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
                    Logistics & Payment
                  </h3>

                  <div className="space-y-2.5 text-xs text-slate-600">
                    {/* Logistic courier */}
                    <div className="pb-2 border-b border-slate-200/50">
                      <p className="text-[10px] uppercase font-bold text-slate-400">Courier Shipping</p>
                      <p className="font-bold text-slate-800 mt-0.5">{activeDeliveryMethod.name}</p>
                      <p className="text-emerald-700 font-semibold text-[10px] mt-0.5">🚀 {activeDeliveryMethod.durationText} — ${activeDeliveryMethod.cost.toFixed(2)}</p>
                    </div>

                    {/* Funding option */}
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Funding Source</p>
                      <p className="font-bold text-slate-800 mt-0.5 capitalize">
                        {paymentMethod === 'cod' && '💵 Cash on Delivery'}
                        {paymentMethod === 'card' && '💳 VISA / MasterCard'}
                        {paymentMethod === 'aba_qr' && '📲 ABA KHQR Mobile Pay'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Itemized summary review matrix */}
              <div className="pt-3">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-emerald-500" />
                  Cart Manifest Checklist ({cartItems.length} products)
                </h3>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1 no-scrollbar border border-slate-100 rounded-xl p-3 bg-slate-50/20">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-center text-xs text-slate-600 border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                      <div className="flex gap-2.5 items-center">
                        <div className="w-8 h-8 rounded overflow-hidden shrink-0 border border-slate-200">
                          <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 truncate max-w-48 md:max-w-72">{item.product.name}</p>
                          <p className="text-[9px] text-slate-400 font-semibold">{item.product.sourceFarm}</p>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-6 font-mono font-bold">
                        <span className="text-slate-400">Qty: {item.quantity}</span>
                        <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation controls */}
              <div className="pt-3 flex justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep('payment')}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs transition cursor-pointer hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Payment
                </button>

                <button
                  type="button"
                  onClick={handleSubmitFinalOrder}
                  className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-2 shadow-lg hover:shadow-emerald-600/10 active:scale-98"
                  id="final-place-order-btn"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-200" />
                  Authorize & Place Order
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Split Screen Financial Summary Box */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200/75 rounded-2xl p-5 shadow-sm sticky top-28 space-y-4">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2.5">
              Financial Breakdown Summary
            </h2>

            {/* Price list details block */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-500 font-medium">
                <span>Items Subtotal</span>
                <span className="font-mono font-bold">${subtotal.toFixed(2)}</span>
              </div>
              
              {/* Promo code application output */}
              {discountAmount > 0 && (
                <div className="flex justify-between items-center text-emerald-600 font-extrabold">
                  <span>Promo Saving (20%)</span>
                  <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-slate-500 font-medium pb-2 border-b border-slate-150">
                <span className="flex items-center gap-1">
                  Delivery Fee 
                  <span className="text-[9px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.2 rounded-full">
                    {activeDeliveryMethod.icon === 'Leaf' ? 'Saver' : 'Courier'}
                  </span>
                </span>
                <span className="font-mono font-bold">${deliveryFee.toFixed(2)}</span>
              </div>

              {/* Taxation estimate */}
              <div className="flex justify-between items-center text-slate-450 font-medium py-1.5 border-b border-slate-200/40">
                <span className="text-slate-400">VAT (10% state tax)</span>
                <span className="font-mono text-slate-400">${taxAmount.toFixed(2)}</span>
              </div>

              {/* Dynamic overall net total */}
              <div className="flex justify-between items-center font-black text-slate-800 pt-2.5">
                <span className="text-sm uppercase tracking-wider">Net Order Total</span>
                <span className="text-lg font-mono text-emerald-700">${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Active Coupon box code entry inside checkout page as well */}
            <div className="border-t border-slate-150/50 pt-4 mt-2">
              <form onSubmit={handleApplyPromoCode}>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                  Coupon Voucher
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="e.g. FRESH20"
                      className="w-full pl-8 pr-2 py-1.5 bg-slate-50 border border-slate-250/50 rounded-xl text-xs outline-none focus:border-emerald-400 font-medium text-slate-700"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition cursor-pointer border border-emerald-250/20"
                  >
                    Apply
                  </button>
                </div>
                {promoMessage && (
                  <p className="text-[10px] font-semibold mt-1 text-slate-500">
                    {promoMessage}
                  </p>
                )}
              </form>
            </div>

            {/* Safe visual parameters */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-150/40 text-[10px] text-slate-400 leading-normal flex gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Payment pipelines are protected by bank-level 256-bit cryptography algorithms securely. Farm-to-door fresh guarantee assured.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
