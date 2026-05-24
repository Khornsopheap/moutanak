import React, { useState } from 'react';
import { 
  SellerRequest, 
  Order, 
  Product, 
  Seller 
} from '../types';
import { 
  Store, 
  Timer, 
  ShoppingCart, 
  DollarSign, 
  Users, 
  TrendingUp, 
  ArrowRight, 
  Check, 
  X,
  Bell,
  Sparkles,
  Search
} from 'lucide-react';

interface DashboardViewProps {
  sellerRequests: SellerRequest[];
  orders: Order[];
  products: Product[];
  sellers: Seller[];
  onDecide: (id: string, status: 'approved' | 'rejected', note: string) => void;
  onNavigate: (pageId: string) => void;
  onViewRequest: (id: string) => void;
}

export default function DashboardView({
  sellerRequests,
  orders,
  products,
  sellers,
  onDecide,
  onNavigate,
  onViewRequest
}: DashboardViewProps) {
  const pendingRequests = sellerRequests.filter(r => r.st === 'pending');
  const activeSellersCount = sellers.filter(s => s.status === 'active').length;
  const totalOrdersCount = orders.length;
  
  // Calculate total earnings
  const completedOrders = orders.filter(o => o.status === 'Completed');
  const totalPayout = completedOrders.reduce((sum, o) => sum + o.total, 0) * 0.90; // 90% goes to sellers after commission

  // SVG Line Chart calculation definitions
  // 6 months of metrics
  const months = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];
  const revenueData = [42, 68, 54, 80, 72, 95]; // in $K
  const ordersData = [1800, 2400, 2100, 3100, 2900, 3800]; // units

  // Category splits for SVG Donut
  const categories = [
    { name: 'Vegetables', value: 28, color: '#22C55E' },
    { name: 'Crafts', value: 22, color: '#F97316' },
    { name: 'Grains', value: 20, color: '#0EA5E9' },
    { name: 'Fruits', value: 14, color: '#EF4444' },
    { name: 'Seafood', value: 10, color: '#A78BFA' },
    { name: 'Other', value: 6, color: '#94A3B8' }
  ];

  // Quick review action handler
  const handleApproveQuick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDecide(id, 'approved', 'Instantly approved via Quick Actions on Dashboard.');
  };

  const handleRejectQuick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const reason = prompt('Please specify rejection reason for this request:');
    if (reason !== null) {
      onDecide(id, 'rejected', reason || 'Rejected during quick dashboard review.');
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-emerald-950 leading-tight">Dashboard Overview</h1>
          <p className="text-sm font-medium text-emerald-700/80 mt-1">
            Moutanak Marketplace Hub &bull; Daily Platform Report
          </p>
        </div>
        <div className="text-xs font-semibold px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-2 self-start sm:self-center shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Platform Status: Live &amp; Operational
        </div>
      </div>

      {/* Grid of 5 Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Stat 1 */}
        <div className="bg-white border border-emerald-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Store className="w-5 h-5" />
          </div>
          <div className="text-2xl font-serif font-black text-emerald-950 mt-1">
            {activeSellersCount + sellerRequests.filter(r => r.st === 'approved').length}
          </div>
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Active Sellers</p>
          <div className="text-[10px] font-medium text-emerald-600 flex items-center gap-1 mt-2">
            <TrendingUp className="w-3 h-3" /> +8% this week
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white border border-emerald-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Timer className="w-5 h-5" />
          </div>
          <div className="text-2xl font-serif font-black text-amber-600 mt-1">
            {pendingRequests.length}
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pending Action</p>
          <div className="text-[10px] font-semibold text-amber-600 flex items-center gap-1 mt-2">
            Needs review soon
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white border border-emerald-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div className="text-2xl font-serif font-black text-sky-950 mt-1">
            {(totalOrdersCount * 1.1).toFixed(0)}K
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Orders</p>
          <div className="text-[10px] font-medium text-sky-500 flex items-center gap-1 mt-2">
            <TrendingUp className="w-3 h-3" /> +12% this month
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-white border border-emerald-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <DollarSign className="w-5 h-5" />
          </div>
          <div className="text-2xl font-serif font-black text-emerald-800 mt-1">
            ${(totalPayout / 1000).toFixed(1)}K
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Seller Payouts</p>
          <div className="text-[10px] font-medium text-emerald-600 flex items-center gap-1 mt-2">
            <TrendingUp className="w-3 h-3" /> +15.2% vs last mth
          </div>
        </div>

        {/* Stat 5 */}
        <div className="bg-white border border-emerald-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group col-span-2 md:col-span-1">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-[13px] text-purple-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <div className="text-2xl font-serif font-black text-slate-950 mt-1">
            520K
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Monthly Visitors</p>
          <div className="text-[10px] font-medium text-purple-600 flex items-center gap-1 mt-2">
            All-time high record
          </div>
        </div>
      </div>

      {/* Visual Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Line Chart: Revenue Trend */}
        <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-emerald-950 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" /> Revenue &amp; Order Volume
              </h3>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-sm uppercase tracking-wider">
                Last 6 Months
              </span>
            </div>
            
            {/* Embedded Responsive SVG Chart */}
            <div className="w-full h-56 relative pt-4">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
                {/* Chart Grid Lines */}
                <line x1="40" y1="20" x2="580" y2="20" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="40" y1="65" x2="580" y2="65" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="40" y1="110" x2="580" y2="110" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="40" y1="155" x2="580" y2="155" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3,3" />

                {/* Left Axis line */}
                <line x1="40" y1="10" x2="40" y2="160" stroke="#E2E8F0" strokeWidth="1.5" />
                
                {/* Revenue area path & stroke */}
                {/* Coordinates maps to scale: x=(index*100 + 60), y=160 - (val/100 * 140) */}
                <path 
                  d="M 60 160 L 60 101 L 160 64 L 260 84 L 360 48 L 460 59 L 560 27 L 560 160 Z" 
                  fill="url(#revGrad)" 
                  opacity="0.3" 
                />
                <path 
                  d="M 60 101 L 160 64 L 260 84 L 360 48 L 460 59 L 560 27" 
                  fill="none" 
                  stroke="#22C55E" 
                  strokeWidth="3" 
                  strokeLinecap="round"
                />

                {/* Orders dotted line (blue) */}
                <path 
                  d="M 60 130 L 160 110 L 260 120 L 360 80 L 460 90 L 560 54" 
                  fill="none" 
                  stroke="#0EA5E9" 
                  strokeWidth="2" 
                  strokeDasharray="4,4"
                  strokeLinecap="round"
                />

                {/* Interactive Points */}
                {[101, 64, 84, 48, 59, 27].map((y, idx) => (
                  <circle key={`p-${idx}`} cx={idx * 100 + 60} cy={y} r="4" fill="#22C55E" stroke="#FFFFFF" strokeWidth="1.5" />
                ))}

                {/* Gradients Definitions */}
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22C55E" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Chart Labels */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] font-bold text-slate-500 pl-11 pr-2 mt-1">
                {months.map((m, idx) => (
                  <span key={idx}>{m}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-6 mt-4 text-[11px] font-medium border-t border-slate-50 pt-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="text-slate-600">Total Monthly Revenue (Max: $95K)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 border-t-2 border-dashed border-sky-500"></span>
              <span className="text-slate-600">Total Order Volume (Max: 3.8K)</span>
            </div>
          </div>
        </div>

        {/* SVG Donut Chart: Category Split */}
        <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-emerald-950">Category Contribution</h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/50 px-2.5 py-0.5 rounded-full">
                By Revenue %
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4 font-medium">Split across core local produce departments.</p>

            {/* SVG Donut circle logic */}
            <div className="flex items-center justify-center py-2">
              <div className="w-36 h-36 relative flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 overflow-visible" viewBox="0 0 42 42">
                  {/* Outer circle segments placeholder */}
                  {/* Segments values: Green (28%), Orange (22%), Sky (20%), Red (14%), Purple (10%), Slate (6%) */}
                  <circle cx="21" cy="21" r="15.915" fill="none" stroke="#E2E8F0" strokeWidth="4.5" />
                  
                  {/* Segment: Vegetables (28%) - dasharray="28 72" offset="100" */}
                  <circle cx="21" cy="21" r="15.915" fill="none" stroke="#22C55E" strokeWidth="5.5" strokeDasharray="28 72" strokeDashoffset="100" />
                  
                  {/* Segment: Crafts (22%) - dasharray="22 78" offset="72" (100 - 28) */}
                  <circle cx="21" cy="21" r="15.915" fill="none" stroke="#F97316" strokeWidth="5.5" strokeDasharray="22 78" strokeDashoffset="72" />

                  {/* Segment: Grains (20%) - dasharray="20 80" offset="50" (72 - 22) */}
                  <circle cx="21" cy="21" r="15.915" fill="none" stroke="#0EA5E9" strokeWidth="5.5" strokeDasharray="20 80" strokeDashoffset="50" />

                  {/* Segment: Fruits (14%) - dasharray="14 86" offset="30" (50 - 20) */}
                  <circle cx="21" cy="21" r="15.915" fill="none" stroke="#EF4444" strokeWidth="5.5" strokeDasharray="14 86" strokeDashoffset="30" />

                  {/* Segment: Seafood (10%) - dasharray="10 90" offset="16" (30 - 14) */}
                  <circle cx="21" cy="21" r="15.915" fill="none" stroke="#A78BFA" strokeWidth="5.5" strokeDasharray="10 90" strokeDashoffset="16" />

                  {/* Segment: Other (6%) - dasharray="6 94" offset="6" (16 - 10) */}
                  <circle cx="21" cy="21" r="15.915" fill="none" stroke="#94A3B8" strokeWidth="5.5" strokeDasharray="6 94" strokeDashoffset="6" />
                </svg>

                {/* Donut Center Label */}
                <div className="absolute text-center">
                  <span className="block text-[#15803D] font-serif font-black text-xl leading-none">95%</span>
                  <span className="text-[8px] font-bold uppercase tracking-wider text-slate-500">Local origin</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 text-[10px] font-bold border-t border-slate-50 pt-3">
            {categories.map((c, i) => (
              <div key={i} className="flex items-center gap-1.5 min-w-0">
                <span className="w-2.5 h-2.5 rounded-xs flex-shrink-0" style={{ backgroundColor: c.color }}></span>
                <span className="text-slate-600 truncate">{c.name} ({c.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actionable items and Live activity row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Requests quick-triage */}
        <div className="bg-white border border-emerald-100 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-5 pb-2">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-emerald-950 text-base flex items-center gap-1.5">
                <span>⌛</span> Pending Seller Applications
              </h3>
              <button 
                onClick={() => onNavigate('sellers')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5 group"
              >
                View all <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-1">Manage awaiting merchants requesting marketplace activation.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-emerald-50/50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Applicant</th>
                  <th className="py-3 px-4">Province</th>
                  <th className="py-3 px-4">TIN No.</th>
                  <th className="py-3 px-4 text-right">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {pendingRequests.length > 0 ? (
                  pendingRequests.slice(0, 3).map((req) => (
                    <tr 
                      key={req.id} 
                      onClick={() => onViewRequest(req.id)}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">
                            {req.fn.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                              {req.fn}
                            </div>
                            <div className="text-[10px] font-medium text-slate-400">{req.sn}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">{req.prov}</td>
                      <td className="py-3 px-4 font-mono font-semibold text-sky-600">{req.tin || '—'}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-1.5" onClick={e => e.stopPropagation()}>
                          <button 
                            onClick={(e) => handleApproveQuick(req.id, e)}
                            className="p-1 px-2.5 bg-emerald-100 text-emerald-800 hover:bg-emerald-500 hover:text-white rounded-lg font-bold text-[10px] transition-colors flex items-center gap-0.5"
                            title="Quick Approve"
                          >
                            <Check className="w-3 h-3" /> Approve
                          </button>
                          <button 
                            onClick={(e) => handleRejectQuick(req.id, e)}
                            className="p-1 px-2 text-rose-100 text-rose-800 hover:bg-rose-500 hover:text-white rounded-lg font-bold text-[10px] transition-colors flex items-center gap-0.5"
                            title="Quick Reject"
                          >
                            <X className="w-3 h-3" /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 px-4 text-center text-slate-400 text-xs">
                      <Sparkles className="w-8 h-8 text-emerald-400/80 mx-auto mb-2 animate-bounce" />
                      All caught up! No pending applications to review.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-50 p-3 bg-slate-50/50 text-[10.5px] font-medium text-emerald-800 flex items-center gap-1.5 justify-center">
            <span>🛡️</span> Only approved merchants can publish products and process student or local trade transactions.
          </div>
        </div>

        {/* Live Admin activity Log */}
        <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-emerald-950 text-base flex items-center gap-2">
              <Bell className="w-4.5 h-4.5 text-amber-500" /> Platform Historical Activity
            </h3>
            <span className="text-[9.5px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full">
              Real-time feed
            </span>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto max-h-60 pr-1 space-y-3">
            {[
              { label: 'Merchant', title: 'Kampong Fresh approved', body: 'Store account and bank credentials activated globally.', time: '10 min ago', status: 'Success' },
              { label: 'Audit', title: 'Security review on Sihanoukville Coastal Store completed', body: 'TIN scan was flagged as illegible, rejection auto-disbursed.', time: '2 hours ago', status: 'Flagged' },
              { label: 'Payout', title: 'System payout disbursement issued', body: 'Admin approved outstanding credit amounts to 24 local grains sellers.', time: '1 day ago', status: 'Success' },
              { label: 'Security', title: 'Administrative settings updated', body: 'Lay Horn modified minimum core commission baseline to 2.00%.', time: '2 days ago', status: 'Audit' },
              { label: 'System', title: 'Products audit trigger completed', body: 'Phka Rumduol Jasmine Rice database stock validated successfully.', time: '4 days ago', status: 'Success' }
            ].map((act, index) => (
              <div key={index} className="flex gap-3 pt-3 first:pt-0 group">
                <div className="flex-shrink-0 mt-0.5">
                  <div className={`w-2.5 h-2.5 rounded-full ring-4 ${
                    act.status === 'Success' ? 'bg-emerald-500 ring-emerald-100' :
                    act.status === 'Flagged' ? 'bg-rose-500 ring-rose-100' : 'bg-sky-500 ring-sky-100'
                  }`} />
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{act.label}</span>
                    <span className="text-[9.5px] font-medium text-slate-400 group-hover:text-emerald-700 transition-colors">{act.time}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-900 leading-tight">
                    {act.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-normal font-medium">{act.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
