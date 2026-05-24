import React, { useState } from 'react';
import { SellerRequest, DocumentItem } from '../types';
import { 
  Check, 
  X, 
  MapPin, 
  Search, 
  Building, 
  User, 
  Calendar, 
  Mail, 
  Phone, 
  FileCheck, 
  AlertCircle, 
  FileText, 
  ExternalLink,
  ChevronLeft,
  DollarSign,
  Briefcase,
  Facebook
} from 'lucide-react';

interface SellerRequestsViewProps {
  sellerRequests: SellerRequest[];
  onDecide: (id: string, status: 'approved' | 'rejected', note: string) => void;
  selectedId: string | null;
  onSelectId: (id: string | null) => void;
}

export default function SellerRequestsView({
  sellerRequests,
  onDecide,
  selectedId,
  onSelectId
}: SellerRequestsViewProps) {
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [adminNote, setAdminNote] = useState<string>('');
  const [activeLightboxImg, setActiveLightboxImg] = useState<string | null>(null);

  // Human clickable labels
  const docTypeLabels: Record<string, string> = {
    id_front: 'National ID Front',
    id_back: 'National ID Back',
    selfie: 'Selfie holding ID Card',
    tin_cert: 'Tax Identification Cert',
    biz_cert: 'MOC Business Reg Cert',
    address_proof: 'Municipal Address Proof',
    store_photo: 'Physical Storefront Cam',
    farm_photo: 'Cooperative Farm Land Shot',
    product_photo: 'Sample Crop Photo'
  };

  // Find inspected request
  const inspectedRequest = sellerRequests.find(r => r.id === selectedId);

  // Filter application dataset
  const filteredRequests = sellerRequests.filter(req => {
    const statusMatch = !filterStatus || req.st === filterStatus;
    const query = searchTerm.toLowerCase();
    const searchMatch = !searchTerm || 
      req.fn.toLowerCase().includes(query) ||
      req.sn.toLowerCase().includes(query) ||
      req.em.toLowerCase().includes(query) ||
      req.tin.toLowerCase().includes(query) ||
      req.prov.toLowerCase().includes(query);
    return statusMatch && searchMatch;
  });

  const handleDecisionSubmit = (id: string, status: 'approved' | 'rejected') => {
    if (status === 'rejected' && !adminNote.trim()) {
      alert('A descriptive rejection reason is required for audit logs.');
      return;
    }
    onDecide(id, status, adminNote.trim() || 'Verified and approved by systemic platform review.');
    setAdminNote('');
  };

  // Render detail view if selected, otherwise render table
  if (inspectedRequest) {
    const s = inspectedRequest;
    const missingDocs = s.docs.filter(d => !d.s).length;
    const hasPayoutMethods = s.aba || s.wing || s.breg;

    return (
      <div className="animate-fade-in space-y-6 pb-12">
        {/* Back Button and Context heading */}
        <div>
          <button 
            onClick={() => { onSelectId(null); setAdminNote(''); }}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-850 bg-white border border-emerald-100 rounded-lg px-3 py-1.5 hover:bg-emerald-50 transition-colors shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Application List
          </button>
        </div>

        {/* Hero Header Card */}
        <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 font-serif font-black text-2xl flex items-center justify-center border-2 border-emerald-300 shadow-sm">
              {s.fn.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-serif font-bold text-emerald-950">{s.sn}</h2>
                {s._src === 'ls' && (
                  <span className="text-[9px] font-bold tracking-wider px-2 py-0.5 bg-sky-100 text-sky-800 rounded-full inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-ping"></span> Live Web Form App
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-slate-500/90 mt-0.5 flex items-center gap-1.5">
                <span>By {s.fn}</span> &bull; <span>Submitted {new Date(s.sub).toLocaleDateString()}</span>
              </p>
              
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 bg-sky-100 text-sky-800 rounded-full uppercase tracking-wider">{s.cat}</span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-full flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {s.prov}
                </span>
                {s.st === 'pending' && <span className="text-[10px] font-black px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full uppercase tracking-wider">Pending Review</span>}
                {s.st === 'approved' && <span className="text-[10px] font-black px-2.5 py-0.5 bg-emerald-500 text-white rounded-full uppercase tracking-wider">Approved</span>}
                {s.st === 'rejected' && <span className="text-[10px] font-black px-2.5 py-0.5 bg-rose-500 text-white rounded-full uppercase tracking-wider">Rejected</span>}
              </div>
            </div>
          </div>
          
          {s.st === 'pending' && (
            <button 
              onClick={() => document.getElementById('decisionCard')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 rounded-full flex items-center gap-1 shadow-sm transition-transform hover:-translate-y-0.5 w-full md:w-auto justify-center"
            >
              Action Application Review
            </button>
          )}
        </div>

        {/* Breakdown details columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main profile stats column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Identity Info */}
            <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-xs">
              <h3 className="text-sm font-bold font-serif text-emerald-950 flex items-center gap-1.5 border-b border-slate-100 pb-3 mb-4">
                <User className="w-4 h-4 text-emerald-600" /> Merchant Identity Profile
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-3">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">Full Legal Name</span>
                  <span className="text-xs font-semibold text-slate-800">{s.fn}</span>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">Date of Birth</span>
                  <span className="text-xs font-semibold text-slate-800">{s.dob || '—'}</span>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 truncate">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">Contact Email</span>
                  <a href={`mailto:${s.em}`} className="text-xs font-semibold text-emerald-700 hover:underline">{s.em}</a>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">Phone Number</span>
                  <span className="text-xs font-semibold text-slate-800">{s.ph ? `+855 ${s.ph}` : '—'}</span>
                </div>
              </div>
            </div>

            {/* Store details */}
            <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-xs">
              <h3 className="text-sm font-bold font-serif text-emerald-950 flex items-center gap-1.5 border-b border-slate-100 pb-3 mb-4">
                <Building className="w-4 h-4 text-emerald-600" /> Retail Store details &amp; Facilities
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-3">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">Registered Store Name</span>
                  <span className="text-xs font-semibold text-slate-800">{s.sn}</span>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">Commodity Category</span>
                  <span className="text-xs font-semibold text-slate-800">{s.cat}</span>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 col-span-2">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">Operational Base Address</span>
                  <span className="text-xs font-semibold text-slate-800">{s.prov} Province, Cambodia</span>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">Patent / TIN Registration Number</span>
                  <span className="text-xs font-mono font-bold text-sky-700">{s.tin || 'Not Registered'}</span>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">Stock volume estimation</span>
                  <span className="text-xs font-semibold text-slate-800">{s.stk || '—'}</span>
                </div>
              </div>

              {/* Bio description */}
              {s.desc && (
                <div className="mt-4 bg-emerald-50/50 rounded-xl p-3.5 border border-emerald-100/50 text-xs text-slate-700 leading-relaxed font-medium">
                  <p className="font-bold text-[10px] text-emerald-700 uppercase mb-1">Corporate Mission</p>
                  {s.desc}
                </div>
              )}

              {/* Bank Account Details */}
              <div className="mt-4 bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Disbursement Channels (Payouts)</span>
                {hasPayoutMethods ? (
                  <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-700">
                    {s.aba && (
                      <div className="bg-white p-2 rounded-lg border border-slate-150">
                        <span className="block text-[9px] font-black text-blue-600">ABA BANK</span>
                        <div className="font-mono mt-0.5">{s.aba}</div>
                        <div className="text-[10px] text-slate-500">{s.abn}</div>
                      </div>
                    )}
                    {s.wing && (
                      <div className="bg-white p-2 rounded-lg border border-slate-150">
                        <span className="block text-[9px] font-black text-emerald-600">WING PAY</span>
                        <div className="font-mono mt-0.5">{s.wing}</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-rose-500 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-4.5 h-4.5" /> No bank account linked
                  </span>
                )}
              </div>

              {/* Social Channels */}
              {s.fb && (
                <div className="mt-3">
                  <a 
                    href={s.fb} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center gap-1.5 text-xs text-sky-600 font-bold hover:underline"
                  >
                    <Facebook className="w-4 h-4 fill-sky-600 text-white" /> View Facebook Page <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Upload Documents View (Inspecting image files) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Documents Grid */}
            <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-xs">
              <h3 className="text-sm font-bold font-serif text-emerald-950 flex items-center gap-1.5 border-b border-slate-100 pb-3 mb-4">
                <FileCheck className="w-4 h-4 text-emerald-600" /> Digital Credentials &amp; Certs
                <span className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full ml-auto ${
                  missingDocs === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {s.docs.filter(d => d.s).length} / {s.docs.length} Provided
                </span>
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {s.docs.map((doc, i) => {
                  const label = docTypeLabels[doc.t] || doc.t || 'Certificate';
                  const available = !!doc.s;

                  return (
                    <div 
                      key={i} 
                      onClick={() => available && setActiveLightboxImg(doc.s)}
                      className={`border rounded-xl overflow-hidden shadow-xs cursor-pointer group bg-slate-50 transition-all ${
                        available ? 'border-emerald-100 hover:border-emerald-400 hover:shadow-xs' : 'border-slate-150 opacity-40 cursor-not-allowed'
                      }`}
                    >
                      {available ? (
                        <div className="h-24 w-full relative overflow-hidden bg-zinc-100">
                          <img 
                            src={doc.s!} 
                            alt={label} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                          />
                          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-[10px] font-bold text-white bg-black/60 px-2 py-0.5 rounded-sm">Zoom</span>
                          </div>
                        </div>
                      ) : (
                        <div className="h-24 w-full flex flex-col items-center justify-center text-slate-400 gap-1 bg-slate-150">
                          <AlertCircle className="w-5 h-5 text-rose-400" />
                          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Missing</span>
                        </div>
                      )}
                      <div className="p-2 bg-white flex items-center justify-between border-t border-slate-50">
                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-wide truncate">{label}</span>
                        {available && <ExternalLink className="w-2.5 h-2.5 text-slate-400" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Decision card */}
            <div id="decisionCard" className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-bold font-serif text-emerald-950 flex items-center gap-1.5 border-b border-slate-100 pb-3">
                <FileText className="w-4 h-4 text-emerald-600" /> Application Audit Ruling
              </h3>

              {s.st === 'pending' ? (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Admin Audit Notation</label>
                    <textarea 
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      placeholder="Specify validation audit statement, tax evaluation summary, or feedback comments for disapproval..."
                      className="w-full min-h-24 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl p-3 text-xs outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => handleDecisionSubmit(s.id, 'approved')}
                      className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors"
                    >
                      <Check className="w-4.5 h-4.5" /> Approve Account
                    </button>
                    <button 
                      onClick={() => handleDecisionSubmit(s.id, 'rejected')}
                      className="py-2.5 px-4 bg-slate-100 text-rose-800 hover:bg-rose-500 hover:text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors border border-rose-100 hover:border-transparent"
                    >
                      <X className="w-4.5 h-4.5" /> Reject Account
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Ruling Logged:</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      s.st === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {s.st}
                    </span>
                    {s.rev && <span className="text-[10px] font-medium text-slate-400 ml-auto">{new Date(s.rev).toLocaleDateString()}</span>}
                  </div>
                  {s.note && (
                    <div className="bg-slate-50 border rounded-xl p-3 text-xs text-slate-700 font-medium leading-relaxed">
                      <span className="block text-[8.5px] font-bold text-slate-400 uppercase mb-1">Ruling Context</span>
                      {s.note}
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* IMAGE LIGHTBOX POPUP */}
        {activeLightboxImg && (
          <div 
            onClick={() => setActiveLightboxImg(null)}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in"
          >
            <button 
              onClick={(e) => { e.stopPropagation(); setActiveLightboxImg(null); }}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center justify-center text-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <img 
              src={activeLightboxImg} 
              alt="Expanded credential" 
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
              onClick={e => e.stopPropagation()}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-emerald-950 leading-tight">Seller Registration Requests</h1>
          <p className="text-sm font-medium text-emerald-700/80 mt-1">Review, approve, or reject new merchant digital applications</p>
        </div>
      </div>

      {/* Filters Hub */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-1.5 flex-wrap">
          <button 
            onClick={() => setFilterStatus('')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
              filterStatus === '' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white border border-emerald-100 text-emerald-950 hover:bg-emerald-50'
            }`}
          >
            All Requests ({sellerRequests.length})
          </button>
          <button 
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
              filterStatus === 'pending' ? 'bg-amber-500 text-white shadow-xs' : 'bg-white border border-emerald-100 text-slate-500 hover:bg-emerald-50'
            }`}
          >
            ⌛ Pending ({sellerRequests.filter(r => r.st === 'pending').length})
          </button>
          <button 
            onClick={() => setFilterStatus('approved')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
              filterStatus === 'approved' ? 'bg-emerald-500 text-white shadow-xs' : 'bg-white border border-emerald-100 text-slate-500 hover:bg-emerald-50'
            }`}
          >
            ✅ Approved ({sellerRequests.filter(r => r.st === 'approved').length})
          </button>
          <button 
            onClick={() => setFilterStatus('rejected')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
              filterStatus === 'rejected' ? 'bg-rose-500 text-white shadow-xs' : 'bg-white border border-emerald-100 text-slate-500 hover:bg-emerald-50'
            }`}
          >
            ❌ Rejected ({sellerRequests.filter(r => r.st === 'rejected').length})
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-800/60" />
          <input 
            type="text" 
            placeholder="Search by store, name, TIN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-1.5 bg-white border border-emerald-100 rounded-full text-xs placeholder:text-slate-400/80 text-emerald-950 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none w-full sm:w-64"
          />
        </div>
      </div>

      {/* Applications Table Card */}
      <div className="bg-white border border-emerald-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-emerald-50/55 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-5">Merchant / Owner Name</th>
                <th className="py-3 px-5">Store Brand Name</th>
                <th className="py-3 px-5">Category</th>
                <th className="py-3 px-5">Region Base</th>
                <th className="py-3 px-5 animate-pulse">TIN Number</th>
                <th className="py-3 px-5">Submitted At</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((req) => (
                  <tr 
                    key={req.id}
                    onClick={() => { onSelectId(req.id); if (req.st === 'pending') setAdminNote(''); }}
                    className="hover:bg-emerald-50/20 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-serif font-bold flex items-center justify-center">
                          {req.fn.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                            {req.fn}
                          </div>
                          <div className="text-[10px] font-medium text-slate-400">{req.em}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-5 font-semibold text-slate-800">{req.sn}</td>
                    <td className="py-3 px-5">
                      <span className="text-[10px] font-bold bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full">
                        {req.cat}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-slate-500 font-semibold">{req.prov}</td>
                    <td className="py-3 px-5 font-mono font-semibold text-sky-600">{req.tin || '—'}</td>
                    <td className="py-3 px-5 text-slate-400 font-medium">
                      {new Date(req.sub).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-3 px-5">
                      <span className={`badge ${
                        req.st === 'approved' ? 'bg' : req.st === 'rejected' ? 'br2' : 'ba'
                      }`}>
                        {req.st === 'approved' ? 'Approved' : req.st === 'rejected' ? 'Rejected' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-right font-bold text-emerald-700 group-hover:underline">
                      Inspect &rarr;
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 px-4 text-center text-slate-400">
                    No matching registration requests located. Please check filter conditions.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
