import React, { useState } from 'react';
import { Transaction } from '../types';
import { 
  Compass, 
  Search, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCcw, 
  DollarSign, 
  CheckCircle2, 
  XOctagon, 
  Clock,
  Briefcase
} from 'lucide-react';

interface TransactionsViewProps {
  transactions: Transaction[];
}

export default function TransactionsView({
  transactions
}: TransactionsViewProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');

  const filteredTxns = transactions.filter(t => {
    const searchMatch = !searchTerm || 
      t.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    const typeMatch = !filterType || t.type === filterType;
    return searchMatch && typeMatch;
  });

  const getTxTypeBadge = (type: Transaction['type']) => {
    switch (type) {
      case 'Purchase': return 'text-emerald-700 bg-emerald-50 border-emerald-100';
      case 'Payout': return 'text-blue-750 bg-blue-50 border-blue-150';
      case 'Refund': return 'text-amber-800 bg-amber-50 border-amber-150';
    }
  };

  const getTxStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'Success': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'Pending': return <Clock className="w-4 h-4 text-amber-500" />;
      case 'Failed': return <XOctagon className="w-4 h-4 text-rose-500" />;
    }
  };

  // Aggregates
  const totalVolume = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalPurchases = transactions.filter(t => t.type === 'Purchase' && t.status === 'Success').reduce((sum, t) => sum + t.amount, 0);
  const totalPayouts = transactions.filter(t => t.type === 'Payout' && t.status === 'Success').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="animate-fade-in space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-emerald-950 leading-tight">Financial Ledger</h1>
          <p className="text-sm font-medium text-emerald-700/80 mt-1">Audit universal purchase transactions, seller payout receipts, and card records</p>
        </div>
      </div>

      {/* Financial aggregates */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-emerald-950 text-emerald-50 p-4.5 rounded-2xl flex items-center justify-between shadow-md">
          <div>
            <span className="block text-[8.5px] font-bold text-emerald-305 uppercase tracking-widest font-serif">Aggregated transaction volumes</span>
            <span className="text-2xl font-serif font-black block mt-0.5">${totalVolume.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <DollarSign className="w-8 h-8 opacity-20 text-emerald-300" />
        </div>

        <div className="bg-white border p-4.5 rounded-2xl flex items-center justify-between shadow-2xs">
          <div>
            <span className="block text-[8.5px] font-bold text-slate-400 uppercase tracking-widest font-serif text-emerald-800">Consumer checkouts value</span>
            <span className="text-xl font-serif font-black block mt-0.5 text-slate-800">${totalPurchases.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <ArrowUpRight className="w-8 h-8 text-emerald-500 bg-emerald-50/50 p-1 rounded-full" />
        </div>

        <div className="bg-white border p-4.5 rounded-2xl flex items-center justify-between shadow-2xs">
          <div>
            <span className="block text-[8.5px] font-bold text-slate-400 uppercase tracking-widest font-serif text-blue-800">Cooperative payouts released</span>
            <span className="text-xl font-serif font-black block mt-0.5 text-slate-800">${totalPayouts.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <ArrowDownLeft className="w-8 h-8 text-blue-500 bg-blue-50/50 p-1 rounded-full" />
        </div>
      </div>

      {/* Constraints criteria controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-800/60" />
          <input 
            type="text" 
            placeholder="Search entries by Transaction ID #... Order ID #... customer, or cooper name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-emerald-100 rounded-xl text-xs outline-none focus:border-emerald-500 text-emerald-950 shadow-2xs placeholder:text-slate-400"
          />
        </div>

        <select 
          value={filterType} 
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3.5 py-2 bg-white border border-emerald-100 text-xs text-slate-700 font-semibold rounded-xl outline-none focus:border-emerald-500 shadow-2xs min-w-44"
        >
          <option value="">Filter Entry Type: All</option>
          <option value="Purchase">🛒 Checkouts (Purchase)</option>
          <option value="Payout">💰 Disbursements (Payout)</option>
          <option value="Refund">↩️ Refunds Issued (Refund)</option>
        </select>
      </div>

      {/* Main ledger database card */}
      <div className="bg-white border border-emerald-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-emerald-50/50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-5">Transaction ID</th>
                <th className="py-3 px-5">Association Reference</th>
                <th className="py-3 px-5">Financial Value</th>
                <th className="py-3 px-5">Entry Type</th>
                <th className="py-3 px-5">Recipient / Source User Name</th>
                <th className="py-3 px-5">Routing Gateway</th>
                <th className="py-3 px-5">Ledger Date Log</th>
                <th className="py-3 px-5 text-center">Settlement Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 [font-size:12px]">
              {filteredTxns.length > 0 ? (
                filteredTxns.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-5 font-mono font-bold text-slate-450">{txn.id}</td>
                    <td className="py-3.5 px-5 font-semibold text-slate-600">Ref: #{txn.orderId}</td>
                    <td className="py-3.5 px-5 font-black text-slate-800">
                      {txn.type === 'Purchase' ? '+' : '-'}${txn.amount.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className={`text-[9px] font-black uppercase tracking-wider border px-2 py-0.5 rounded-full ${getTxTypeBadge(txn.type)}`}>
                        {txn.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 font-semibold text-slate-905">{txn.customerName}</td>
                    <td className="py-3.5 px-5">
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-50 border rounded text-slate-600 font-serif">
                        {txn.method} Gateway
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-slate-450 font-medium">
                      {new Date(txn.date).toLocaleDateString()}{' '}
                      <span className="text-[10px] text-slate-400">
                        {new Date(txn.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-1.5 justify-center font-bold text-xs text-slate-700">
                        {getTxStatusIcon(txn.status)}
                        <span>{txn.status}</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 px-5 text-center text-slate-400">
                    No ledger transactions identified.
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
