import React, { useState } from 'react';
import { PaymentPayout } from '../types';
import { 
  DollarSign, 
  Search, 
  CreditCard, 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  Plus,
  Coins,
  History,
  ArrowUpRight,
  X
} from 'lucide-react';

interface PaymentsViewProps {
  payments: PaymentPayout[];
  onReleasePayout: (id: string) => void;
  onAddPayout: (payout: Omit<PaymentPayout, 'id' | 'date'>) => void;
}

export default function PaymentsView({
  payments,
  onReleasePayout,
  onAddPayout
}: PaymentsViewProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [isNewPayoutOpen, setIsNewPayoutOpen] = useState<boolean>(false);

  // States for new manual payout release (for cash or check settlements)
  const [payoutSeller, setPayoutSeller] = useState<string>('');
  const [payoutAmount, setPayoutAmount] = useState<string>('');
  const [payoutMethod, setPayoutMethod] = useState<'ABA Bank' | 'Wing Wallet' | 'ACLEDA Bank' | 'Cash'>('ABA Bank');
  const [payoutAccountNo, setPayoutAccountNo] = useState<string>('');
  const [payoutAccountName, setPayoutAccountName] = useState<string>('');

  // Filter lists
  const filteredPayments = payments.filter(p => {
    const searchMatch = !searchTerm || 
      p.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.includes(searchTerm) ||
      p.accountNo.includes(searchTerm);
    const statusMatch = !filterStatus || p.status === filterStatus;
    return searchMatch && statusMatch;
  });

  const getStatusStyle = (status: PaymentPayout['status']) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-50 text-emerald-800 border-emerald-100';
      case 'Pending': return 'bg-amber-50 text-amber-850 border-amber-150 animate-pulse';
      case 'Failed': return 'bg-rose-50 text-rose-800 border-rose-100';
    }
  };

  const calculatePendingSum = () => {
    return payments
      .filter(p => p.status === 'Pending')
      .reduce((sum, p) => sum + p.amount, 0);
  };

  const calculatePaidSum = () => {
    return payments
      .filter(p => p.status === 'Completed')
      .reduce((sum, p) => sum + p.amount, 0);
  };

  const handleManualPayoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payoutSeller || !payoutAmount || !payoutAccountNo) {
      alert('Must specify seller name, payout amount, and target account.');
      return;
    }

    onAddPayout({
      sellerName: payoutSeller,
      amount: parseFloat(payoutAmount) || 0,
      method: payoutMethod,
      accountNo: payoutAccountNo,
      accountName: payoutAccountName || payoutSeller,
      status: 'Pending'
    });

    setPayoutSeller('');
    setPayoutAmount('');
    setPayoutMethod('ABA Bank');
    setPayoutAccountNo('');
    setPayoutAccountName('');
    setIsNewPayoutOpen(false);
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-emerald-950 leading-tight">Seller payouts</h1>
          <p className="text-sm font-medium text-emerald-700/80 mt-1">Audit merchant outstanding balance ledgers and authorize bank transfer disbursements</p>
        </div>
        <button 
          onClick={() => setIsNewPayoutOpen(true)}
          className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-full px-5 py-2.5 flex items-center gap-1.5 shadow-sm transition-transform hover:-translate-y-0.5"
        >
          <Plus className="w-4.5 h-4.5" /> Direct Payout Order
        </button>
      </div>

      {/* Grid summarizing payouts state */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <span className="block text-xl font-serif font-bold text-emerald-950">${calculatePaidSum().toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Released settlements</span>
          </div>
        </div>

        <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-105 text-amber-700 flex items-center justify-center">
            <Coins className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <span className="block text-xl font-serif font-bold text-amber-750">${calculatePendingSum().toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Awaiting disbursement</span>
          </div>
        </div>

        <div className="bg-rose-50/30 border border-rose-100 p-4 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xl font-serif font-bold text-rose-800">
              ${payments.filter(p => p.status === 'Failed').reduce((sum, p) => sum + p.amount, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Held / Failed Transfers</span>
          </div>
        </div>
      </div>

      {/* Select lists conditions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-800/60" />
          <input 
            type="text" 
            placeholder="Search disbursements by ID, seller name, or account catalog..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-emerald-100 rounded-xl text-xs outline-none focus:border-emerald-500 text-emerald-950 shadow-2xs placeholder:text-slate-400"
          />
        </div>

        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3.5 py-2 bg-white border border-emerald-100 text-xs text-slate-700 font-semibold rounded-xl outline-none focus:border-emerald-500 shadow-2xs min-w-44"
        >
          <option value="">Filter Status: All</option>
          <option value="Completed">✅ Completed</option>
          <option value="Pending">⌛ Pending Release</option>
          <option value="Failed">❌ Held / Failed</option>
        </select>
      </div>

      {/* Payout records table card */}
      <div className="bg-white border border-emerald-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-emerald-50/50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-5">Disbursement ID</th>
                <th className="py-3 px-5">Target Merchant Co-Op</th>
                <th className="py-3 px-5">Disbursed Amount</th>
                <th className="py-3 px-5">Disbursement method</th>
                <th className="py-3 px-5">Recipient Account details</th>
                <th className="py-3 px-5">Request Created</th>
                <th className="py-3 px-5 text-center">Transfer status</th>
                <th className="py-3 px-5 text-right">Fund Settlement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-5 font-mono font-bold text-slate-500">{pay.id}</td>
                    <td className="py-3.5 px-5 font-bold text-slate-800">{pay.sellerName}</td>
                    <td className="py-3.5 px-5 font-black text-slate-800">${pay.amount.toFixed(2)}</td>
                    <td className="py-3.5 px-5">
                      <span className="text-[10px] font-bold bg-slate-50 border px-2 py-0.5 rounded-full inline-flex items-center gap-1.5 text-slate-650">
                        <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                        {pay.method}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="font-mono font-bold text-slate-800">{pay.accountNo}</div>
                      <div className="text-[10px] text-slate-400 font-semibold">Holder: {pay.accountName}</div>
                    </td>
                    <td className="py-3.5 px-5 text-slate-450 font-medium">{new Date(pay.date).toLocaleDateString()}</td>
                    <td className="py-3.5 px-5 text-center">
                      <span className={`badge border ${getStatusStyle(pay.status)}`}>
                        {pay.status === 'Completed' ? 'Released' : pay.status === 'Pending' ? 'Pending release' : 'Held / failed'}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      {pay.status !== 'Completed' ? (
                        <button 
                          onClick={() => { if(confirm(`Confirm legal disbursement release of $${pay.amount} to account ${pay.accountNo}?`)) onReleasePayout(pay.id); }}
                          className="py-1 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-serif font-bold text-[10px] rounded-lg inline-flex items-center gap-1 transition-colors shadow-2xs hover:scale-101 border border-emerald-500"
                        >
                          <Send className="w-3 h-3" /> Release Funds
                        </button>
                      ) : (
                        <span className="text-emerald-700 font-black text-[11px] flex justify-end items-center gap-1">
                          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" /> Settled
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 px-5 text-center text-slate-400">
                    No disbursement transactions found under specifications.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE DIRECT PAYOUT DIALOG POPUP */}
      {isNewPayoutOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in animate-dur-200">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-emerald-100 overflow-hidden">
            <div className="bg-slate-50 px-5 py-4 border-b border-slate-150 flex items-center justify-between">
              <h3 className="text-sm font-bold font-serif text-emerald-950 flex items-center gap-1.5 uppercase tracking-wide">
                <Send className="w-4.5 h-4.5" /> Book Bank Payout Transfer
              </h3>
              <button 
                onClick={() => setIsNewPayoutOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-500 flex items-center justify-center border"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleManualPayoutSubmit} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-serif">Recipient store co-op</label>
                <input 
                  type="text" 
                  value={payoutSeller}
                  onChange={(e) => setPayoutSeller(e.target.value)}
                  placeholder="e.g. Traditional Khmer Weaver"
                  className="w-full bg-slate-50 border rounded-lg p-2 text-xs outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-serif">Settle amount ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    placeholder="e.g. 520.00"
                    className="w-full bg-slate-50 border rounded-lg p-2 text-xs outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-serif">Route Channel</label>
                  <select 
                    value={payoutMethod}
                    onChange={(e: any) => setPayoutMethod(e.target.value)}
                    className="w-full bg-slate-50 border text-xs rounded-lg p-2 outline-none font-semibold"
                  >
                    <option value="ABA Bank">ABA Transfer</option>
                    <option value="Wing Wallet">Wing Wallet</option>
                    <option value="ACLEDA Bank">ACLEDA Bank</option>
                    <option value="Cash">Cash / Check</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-serif text-sky-700">Account / phone number</label>
                <input 
                  type="text" 
                  value={payoutAccountNo}
                  onChange={(e) => setPayoutAccountNo(e.target.value)}
                  placeholder="e.g. 000 112 233"
                  className="w-full bg-slate-50 border rounded-lg p-2 text-xs outline-none font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-serif">Legal Account Holder Name</label>
                <input 
                  type="text" 
                  value={payoutAccountName}
                  onChange={(e) => setPayoutAccountName(e.target.value)}
                  placeholder="e.g. Dara Chhan (matches bank credentials)"
                  className="w-full bg-slate-50 border rounded-lg p-2 text-xs outline-none focus:bg-white focus:border-emerald-500 font-serif"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2 text-xs font-serif font-black">
                <button 
                  type="button"
                  onClick={() => setIsNewPayoutOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-slate-50 text-slate-500"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-2xs"
                >
                  Authorize payout settlement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
