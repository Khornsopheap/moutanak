import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Store, 
  Receipt, 
  Activity, 
  Check, 
  X, 
  Sliders, 
  Search, 
  Eye, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  ArrowLeft,
  Settings,
  XCircle,
  ThumbsUp,
  SlidersHorizontal,
  FolderLock
} from 'lucide-react';

interface AdminPortalProps {
  onBackToStore: () => void;
  onApproveSuccess: (sellerName: string, storeName: string) => void;
}

export default function AdminPortal({ onBackToStore, onApproveSuccess }: AdminPortalProps) {
  const [requests, setRequests] = useState<any[]>([]);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [rejectionNote, setRejectionNote] = useState('');
  const [adminStats, setAdminStats] = useState({
    activeSellers: 1580,
    pendingReviews: 0,
    totalOrders: 44128,
    totalPayouts: 8200000,
  });

  // Load from local storage
  const loadRequests = () => {
    const listJson = localStorage.getItem('seller_requests');
    let loaded: any[] = [];
    if (listJson) {
      loaded = JSON.parse(listJson);
    } else {
      // Seed some mock requests if empty for demo purposes
      loaded = [
        {
          id: 1101,
          sellerName: 'Vanna Sok',
          email: 'vannasok@kampotfarm.kh',
          phone: '12999888',
          dob: '1988-04-12',
          storeName: "Vanna's Spicy Farm",
          category: 'Vegetables & Herbs',
          province: 'Kampot Province',
          tin: 'K000-1234567',
          businessReg: 'Individual Sourced Farmer',
          stockVolume: '200 - 500 kg / Month',
          abaAccount: '000128481',
          abaName: 'Vanna Sok',
          description: 'Family-run organic spice farm in Kampot, specializing in geographically protected black pepper and chili.',
          status: 'pending',
          submittedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        },
        {
          id: 1102,
          sellerName: 'Dara Chhan',
          email: 'dara.chhan@weave.kh',
          phone: '17234567',
          dob: '1992-07-30',
          storeName: 'The Khmer Traditional Weaver',
          category: 'Artisan Crafts',
          province: 'Siem Reap',
          tin: 'K000-6543210',
          businessReg: 'CamReg-99815-MOC',
          stockVolume: '50 - 200 kg / Month',
          wingAccount: '017234567',
          description: 'Traditional Khmer silk weaving cooperative matching standard 3rd generation custom artisans.',
          status: 'pending',
          submittedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        },
        {
          id: 1103,
          sellerName: 'Lyna Pech',
          email: 'lyna.pech@jasmine.kh',
          phone: '99456789',
          dob: '1985-01-15',
          storeName: 'Gold Jasmine Cooperative',
          category: 'Organic Grains & Spices',
          province: 'Battambang',
          tin: 'K000-7778881',
          businessReg: 'CamReg-123485-MOC',
          stockVolume: 'More than 1 Tonne / Month',
          abaAccount: '000777012',
          abaName: 'Lyna Pech',
          description: 'Battambang grain cooperative supplying premium Jasmine Rice and clean grains to all city grids.',
          status: 'approved',
          submittedAt: new Date(Date.now() - 3600000 * 72).toISOString(),
        }
      ];
      localStorage.setItem('seller_requests', JSON.stringify(loaded));
    }
    setRequests(loaded);

    // Calculate dynamic stats
    const pendCount = loaded.filter(r => r.status === 'pending').length;
    const apprCount = loaded.filter(r => r.status === 'approved').length;
    setAdminStats({
      activeSellers: 1580 + apprCount,
      pendingReviews: pendCount,
      totalOrders: 44128,
      totalPayouts: 8200000,
    });
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleDecision = (id: number, newStatus: 'approved' | 'rejected') => {
    const note = newStatus === 'approved' ? 'Verified and approved by Administrator.' : (rejectionNote || 'TIN or identity document blurry.');
    
    // Update local Requests state & local storage
    const updated = requests.map(r => {
      if (r.id === id) {
        return { ...r, status: newStatus, decisionNote: note, reviewedAt: new Date().toISOString() };
      }
      return r;
    });

    localStorage.setItem('seller_requests', JSON.stringify(updated));
    setRequests(updated);

    // Update global current seller status if this matches current user
    const target = requests.find(r => r.id === id);
    if (target) {
      localStorage.setItem('seller_status', newStatus);
      localStorage.setItem('seller_denial_note', note);
      
      // Update stats instantly
      const pendCount = updated.filter(r => r.status === 'pending').length;
      const apprCount = updated.filter(r => r.status === 'approved').length;
      setAdminStats(prev => ({
        ...prev,
        pendingReviews: pendCount,
        activeSellers: 1580 + apprCount
      }));

      // Trigger beautiful animations success popup if approved!
      if (newStatus === 'approved') {
        onApproveSuccess(target.sellerName, target.storeName);
      } else {
        alert(`Application rejected. Reason note sent to ${target.sellerName}.`);
      }
    }

    setSelectedRequest(null);
    setRejectionNote('');
    loadRequests();
  };

  // Filter requests
  const filtered = requests.filter(r => {
    const matchesFilter = filter === 'all' || r.status === filter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || 
      r.sellerName.toLowerCase().includes(q) || 
      r.storeName.toLowerCase().includes(q) || 
      r.province.toLowerCase().includes(q) ||
      (r.tin && r.tin.toLowerCase().includes(q));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f8faf7] font-sans pb-16">
      
      {/* Admin Title bar banner */}
      <div className="bg-slate-900 text-white px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FolderLock className="w-5 h-5 text-emerald-400" />
            <span className="text-[10px] text-emerald-400 tracking-widest font-black uppercase">Moutanak secure system</span>
          </div>
          <h1 className="font-serif font-black text-2xl tracking-normal">Administrator Central Hub</h1>
          <p className="text-xs text-slate-400 mt-1">Review verified land credentials, coordinate TIN references, and approve farmstead requests.</p>
        </div>

        <button 
          onClick={onBackToStore}
          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 font-bold rounded-full text-xs text-white cursor-pointer transition shadow-md shrink-0 flex items-center gap-2 active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Customer Market
        </button>
      </div>

      {/* Stats indicators grid */}
      <div className="mx-[5vw] mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-white border rounded-2xl p-4.5 shadow-xs flex items-center gap-3.5 border-slate-100 hover:border-emerald-200 transition">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800 leading-tight">{adminStats.activeSellers}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Active Stores</p>
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-4.5 shadow-xs flex items-center gap-3.5 border-slate-100 hover:border-orange-200 transition">
          <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-black text-orange-600 leading-tight">{adminStats.pendingReviews}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Pending Reviews</p>
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-4.5 shadow-xs flex items-center gap-3.5 border-slate-100 hover:border-blue-200 transition">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800 leading-tight">{adminStats.totalOrders.toLocaleString()}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Platform Orders</p>
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-4.5 shadow-xs flex items-center gap-3.5 border-slate-100 hover:border-green-200 transition">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800 leading-tight">${(adminStats.totalPayouts / 1000000).toFixed(1)}M</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Total Settle Payouts</p>
          </div>
        </div>

      </div>

      <div className="mx-[5vw] mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* LEFTSIDE: Requests list table & Filters */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-150 shadow-xs overflow-hidden">
            
            {/* Filter and search headers */}
            <div className="p-4 border-b bg-[#fafbfc] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              
              <div className="flex gap-2.5 items-center">
                <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                <div className="flex gap-1 bg-slate-100/85 p-1 rounded-lg">
                  {['all', 'pending', 'approved', 'rejected'].map(st => (
                    <button
                      key={st}
                      onClick={() => setFilter(st)}
                      className={`px-3 py-1 rounded text-[11px] font-bold uppercase tracking-wider transition cursor-pointer ${
                        filter === st 
                          ? 'bg-white text-slate-800 shadow-xs font-black' 
                          : 'text-slate-450 hover:text-slate-700'
                      }`}
                    >
                      {st === 'pending' ? '⏳ ' : ''}
                      {st === 'approved' ? '✅ ' : ''}
                      {st === 'rejected' ? '✖ ' : ''}
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search name, store, TIN..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-8.5 pr-4 py-1.8 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-500 w-full sm:w-48 placeholder-slate-400"
                />
              </div>

            </div>

            {/* List Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-100 text-[10px]">
                    <th className="p-4">Seller Applicant</th>
                    <th className="p-4">Store Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Province</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-16 text-slate-400">
                        <Users className="w-10 h-10 mx-auto text-slate-250 mb-2 stroke-1" />
                        <h4 className="font-bold text-slate-700">No applications registered</h4>
                        <p className="text-[11px]">Choose another filter layout tab.</p>
                      </td>
                    </tr>
                  ) : filtered.map(req => (
                    <tr 
                      key={req.id} 
                      className={`hover:bg-emerald-50/20 transition cursor-pointer ${
                        selectedRequest?.id === req.id ? 'bg-emerald-50/40' : ''
                      }`}
                      onClick={() => setSelectedRequest(req)}
                    >
                      <td className="p-4">
                        <div className="font-bold text-slate-800">{req.sellerName}</div>
                        <div className="text-[10px] text-slate-400">{req.email}</div>
                      </td>
                      <td className="p-4 font-bold text-slate-700">{req.storeName}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 font-semibold text-slate-500 text-[10px] uppercase">
                          {req.category || 'All'}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500">{req.province}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2.5 py-0.8 rounded-full font-black uppercase text-[9px] block text-center max-w-[80px] mx-auto ${
                          req.status === 'approved' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : req.status === 'rejected'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-250 animate-pulse'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedRequest(req); }}
                          className="p-1 px-2 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-600 rounded transition font-bold"
                        >
                          View File
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>

        {/* RIGHTSIDE: Selected request detailed file inspector */}
        <div className="lg:col-span-1">
          {selectedRequest ? (
            <div className="bg-white rounded-2xl border border-slate-150 shadow-sm overflow-hidden animate-slideUp">
              
              <div className="p-4 bg-slate-900 border-b text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-400" />
                  <span className="font-serif font-black text-sm">File Inspector</span>
                </div>
                <button 
                  onClick={() => setSelectedRequest(null)}
                  className="text-slate-400 hover:text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-4 text-xs">
                
                {/* Applicant Bio header */}
                <div className="border-b pb-3.5 space-y-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Seller identity details</p>
                  <h3 className="font-serif font-black text-base text-slate-800">{selectedRequest.sellerName}</h3>
                  <p className="text-slate-400 text-xs font-semibold">TIN: <span className="font-mono text-emerald-700 font-bold">{selectedRequest.tin}</span></p>
                </div>

                {/* Grid details */}
                <div className="grid grid-cols-2 gap-3 pb-3 border-b">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Province:</span>
                    <span className="font-bold text-slate-800">{selectedRequest.province}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Crop category:</span>
                    <span className="font-bold text-slate-800">{selectedRequest.category}</span>
                  </div>
                  <div className="col-span-2 pt-1.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Store Brand Name:</span>
                    <span className="font-serif font-black text-[13px] text-emerald-700 block mt-0.5">{selectedRequest.storeName}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Uploaded Bio:</span>
                    <p className="text-slate-500 italic leading-relaxed pt-1.5 p-2 bg-slate-50 border rounded-lg text-[11px]">
                      "{selectedRequest.description || 'No Bio story provided.'}"
                    </p>
                  </div>
                </div>

                {/* Attachments verify indicator */}
                <div className="border-b pb-3.5 space-y-2">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Secured Credentials Checklist</p>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50/80 px-2 py-1 rounded border">
                      <span className="text-emerald-500 font-bold">✓</span> ID Front verified
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50/80 px-2 py-1 rounded border">
                      <span className="text-emerald-500 font-bold">✓</span> ID Back verified
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50/80 px-2 py-1 rounded border col-span-2">
                      <span className="text-emerald-500 font-bold">✓</span> Selfie with ID facial verified
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50/80 px-2 py-1 rounded border">
                      <span className="text-emerald-500 font-bold">✓</span> TIN Certificate pdf
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50/80 px-2 py-1 rounded border">
                      <span className="text-emerald-500 font-bold">✓</span> Proof residency bill
                    </div>
                  </div>
                </div>

                {/* Settlement Payments info */}
                <div className="bg-[#fcf9f3] p-3 rounded-xl border border-amber-100 flex flex-col gap-1 shadow-xs">
                  <p className="text-[9px] text-amber-800 uppercase font-black tracking-widest leading-none">Settlement payouts credentials</p>
                  <div className="text-slate-700 font-bold text-xs mt-1">
                    {selectedRequest.abaAccount ? (
                      <div>🏦 ABA Bank: <span className="font-mono text-emerald-800">{selectedRequest.abaAccount}</span> ({selectedRequest.abaName})</div>
                    ) : ''}
                    {selectedRequest.aclAccount ? (
                      <div>🏦 ACLEDA: <span className="font-mono text-slate-800">{selectedRequest.aclAccount}</span> ({selectedRequest.aclName})</div>
                    ) : ''}
                    {selectedRequest.wingAccount ? (
                      <div>📱 Wing wallet: <span className="font-mono">{selectedRequest.wingAccount}</span></div>
                    ) : ''}
                  </div>
                </div>

                {/* Action parameters */}
                {selectedRequest.status === 'pending' ? (
                  <div className="space-y-3.5 pt-2">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Decision Note / Rejection Reason</label>
                      <input 
                        type="text" 
                        value={rejectionNote}
                        onChange={e => setRejectionNote(e.target.value)}
                        placeholder="Rejection note (mandatory if rejecting)"
                        className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs outline-none focus:border-red-400 focus:bg-white"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          if (rejectionNote.trim().length === 0) {
                            alert('A rejection reason note is mandatory if rejecting applications.');
                            return;
                          }
                          handleDecision(selectedRequest.id, 'rejected');
                        }}
                        className="flex-1 py-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs transition cursor-pointer uppercase tracking-wider active:scale-95"
                      >
                        Reject Application
                      </button>
                      <button 
                        onClick={() => handleDecision(selectedRequest.id, 'approved')}
                        className="flex-1 py-2.5 rounded-xl bg-[#22c55e] hover:bg-emerald-600 text-white font-bold text-xs transition cursor-pointer shadow-md hover:shadow-lg uppercase tracking-wider active:scale-95"
                      >
                        Approve Store
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 border rounded-xl space-y-1.5">
                    <p className="text-[9px] text-slate-450 uppercase font-bold tracking-widest leading-none">Logged Decision</p>
                    <div className="flex items-center gap-1.5 font-bold">
                      <span className={`w-2 h-2 rounded-full ${selectedRequest.status === 'approved' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <span className="capitalize">{selectedRequest.status}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal font-medium">"{selectedRequest.decisionNote || 'No decision metrics logged.'}"</p>
                  </div>
                )}

              </div>

            </div>
          ) : (
            <div className="border border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-450 bg-white shadow-xs">
              <Eye className="w-12 h-12 mx-auto stroke-1 text-slate-300 mb-3" />
              <h3 className="font-bold text-slate-700 text-sm">Select files to inspect</h3>
              <p className="text-[11px] leading-relaxed">Choose an applicant from the cooperative list to verify regulatory files and submit decisions.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
