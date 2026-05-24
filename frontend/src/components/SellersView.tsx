import React, { useState } from 'react';
import { Seller } from '../types';
import { 
  Building, 
  MapPin, 
  Search, 
  Star, 
  Ban, 
  Check, 
  ShoppingBag, 
  TrendingUp, 
  ShieldCheck, 
  Mail, 
  Phone 
} from 'lucide-react';

interface SellersViewProps {
  sellers: Seller[];
  onToggleStatus: (id: string) => void;
}

export default function SellersView({
  sellers,
  onToggleStatus
}: SellersViewProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterProv, setFilterProv] = useState<string>('');

  // Search logic
  const filteredSellers = sellers.filter(s => {
    const searchMatch = !searchTerm || 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const regionMatch = !filterProv || s.province === filterProv;
    return searchMatch && regionMatch;
  });

  // Unique provinces list for filter dropdown
  const provinces = Array.from(new Set(sellers.map(s => s.province)));

  return (
    <div className="animate-fade-in space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-emerald-950 leading-tight">Registered Sellers</h1>
          <p className="text-sm font-medium text-emerald-700/80 mt-1">Manage active storefront catalogs, inspect ratings, and toggle statuses</p>
        </div>
      </div>

      {/* Grid of quick summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xl font-serif font-bold text-emerald-950">{sellers.length}</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Onboarded Stores</span>
          </div>
        </div>

        <div className="bg-amber-50/40 border border-amber-100 p-4 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
            <Star className="w-5 h-5 fill-amber-500 hover:scale-105 transition-transform" />
          </div>
          <div>
            <span className="block text-xl font-serif font-bold text-slate-900">
              {(sellers.reduce((sum, s) => sum + s.rating, 0) / sellers.length).toFixed(1)} Stars
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Average Customer Rating</span>
          </div>
        </div>

        <div className="bg-sky-50/40 border border-sky-100 p-4 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xl font-serif font-bold text-slate-900">
              {sellers.reduce((sum, s) => sum + s.totalSales, 0).toLocaleString()}
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Aggregated Merchant Sales</span>
          </div>
        </div>
      </div>

      {/* Controls: Search and Region Select */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-800/60" />
          <input 
            type="text" 
            placeholder="Search sellers by legal owner name, brand store, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-emerald-100 rounded-xl text-xs outline-none focus:border-emerald-500 text-emerald-950 shadow-xs placeholder:text-slate-400"
          />
        </div>

        <select 
          value={filterProv} 
          onChange={(e) => setFilterProv(e.target.value)}
          className="px-3.5 py-2 bg-white border border-emerald-100 text-xs text-slate-700 font-semibold rounded-xl outline-none focus:border-emerald-500 shadow-xs min-w-44"
        >
          <option value="">Filter by Province: All</option>
          {provinces.map((p, idx) => (
            <option key={idx} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* Main Sellers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSellers.length > 0 ? (
          filteredSellers.map((s) => (
            <div 
              key={s.id} 
              className={`bg-white border rounded-2xl p-5 shadow-xs transition-all relative flex flex-col justify-between ${
                s.status === 'suspended' ? 'border-rose-100 bg-rose-50/10 opacity-75' : 'border-emerald-100 hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              <div className="space-y-3">
                {/* Header card segment */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-base font-serif font-bold text-emerald-950">{s.storeName}</h3>
                      {s.totalSales > 1000 && (
                        <span className="text-[8px] font-black tracking-widest uppercase bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded flex items-center gap-0.5">
                          <ShieldCheck className="w-3 h-3 text-amber-500" /> Premium
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">Legal Owner: {s.name}</p>
                    <p className="text-[10px] font-bold text-slate-450 mt-1 flex items-center gap-1">
                      <span className="text-sky-600 font-mono">TIN: {s.tin}</span> &bull; <span>Onboarded {s.joinedDate}</span>
                    </p>
                  </div>

                  <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    s.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {s.status}
                  </div>
                </div>

                {/* Rating and categories strip */}
                <div className="flex items-center justify-between border-t border-b border-slate-100 py-2.5 my-3">
                  <div className="flex items-center gap-1 text-xs">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-slate-800">{s.rating}</span>
                    <span className="text-slate-400 text-[10px] font-medium">(Verified Store)</span>
                  </div>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {s.category}
                  </span>
                </div>

                {/* Visual stats panel details */}
                <div className="grid grid-cols-3 gap-2 py-1">
                  <div className="bg-slate-50 p-2 rounded-xl text-center">
                    <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">Active Products</span>
                    <span className="text-sm font-serif font-black text-slate-800">{s.totalProducts}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl text-center">
                    <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">Total Sales</span>
                    <span className="text-sm font-serif font-black text-slate-800">{s.totalSales} units</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl text-center">
                    <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">Region Province</span>
                    <span className="text-xs font-bold text-slate-700 truncate block mt-0.5">{s.province}</span>
                  </div>
                </div>

                {/* Communication details */}
                <div className="space-y-1 text-xs text-slate-500 font-medium pt-2 border-t border-slate-50">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-450" />
                    <span>{s.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-450" />
                    <span>+855 {s.phone}</span>
                  </div>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="mt-4 flex gap-1.5 border-t border-slate-100 pt-3">
                <button 
                  onClick={() => onToggleStatus(s.id)}
                  className={`flex-1 py-1 px-3 text-2xs font-serif font-bold rounded-lg flex items-center justify-center gap-1 border transition-colors ${
                    s.status === 'active' 
                      ? 'bg-rose-50 text-rose-800 border-rose-100 hover:bg-rose-500 hover:text-white hover:border-transparent' 
                      : 'bg-emerald-50 text-emerald-800 border-emerald-100 hover:bg-emerald-600 hover:text-white hover:border-transparent'
                  }`}
                >
                  {s.status === 'active' ? (
                    <>
                      <Ban className="w-3 h-3" /> Suspend Merchant Account
                    </>
                  ) : (
                    <>
                      <Check className="w-3 h-3" /> Activate Merchant Account
                    </>
                  )}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-12 text-slate-400 font-medium">
            No approved merchants found matching specific search criterias.
          </div>
        )}
      </div>
    </div>
  );
}
