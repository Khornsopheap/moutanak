import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  TrendingUp, 
  FileText, 
  Download, 
  Sparkles,
  RefreshCw,
  Award,
  AlertTriangle
} from 'lucide-react';

export default function ReportsView() {
  const [reportYear, setReportYear] = useState<string>('2026');
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [compiledReport, setCompiledReport] = useState<string | null>(null);

  // Simulated spreadsheet report database columns
  const reportDb = [
    { month: 'May 2026', signups: 1420, orders: 3800, revenue: 95000.00, commissions: 1900.00, avgBasket: 25.00 },
    { month: 'Apr 2026', signups: 1250, orders: 2900, revenue: 72000.00, commissions: 1440.00, avgBasket: 24.80 },
    { month: 'Mar 2026', signups: 1680, orders: 3100, revenue: 80000.00, commissions: 1600.00, avgBasket: 25.80 },
    { month: 'Feb 2026', signups: 1100, orders: 2100, revenue: 54000.00, commissions: 1080.00, avgBasket: 25.70 },
    { month: 'Jan 2026', signups: 1350, orders: 2400, revenue: 68000.00, commissions: 1360.00, avgBasket: 28.30 },
    { month: 'Dec 2025', signups: 980, orders: 1800, revenue: 42000.00, commissions: 840.00, avgBasket: 23.35 }
  ];

  const handleCompileReport = () => {
    setIsCompiling(true);
    setTimeout(() => {
      setIsCompiling(false);
      setCompiledReport(`
MOUTANAK MARKETPLACE INSIGHTS REPORT - audit compile 2026-05-24
------------------------------------------------------------------
COOPERATIVE PERFORMANCE OUTLOOK:
- Kampot Spicy cooperatives are leading platform growth by +20% year-on-year, driven by organic black pepper and chili sales.
- Takeo Handwoven Silk Weaver accounts for 68% of the Crafts revenue category split but exhibits highly constrained inventory levels. 

INVENTORY ALERTS & RISKS:
- Fruits department (Mango, Longan) has identified critical low-stock thresholds (less than 25 units total currently). 
- Seafood logistics out of Sihanoukville Coastal require additional compliance reviews due to localized tax registration (TIN) constraints.

FINANCIAL RECONCILIATIONS:
- Monthly commission net accrual: $1,900.00 this month, validating a platform-wide 2.00% base commission.
- Average shopper basket order totals stabilized at $25.00 with credit transactions accounting for 72% of checkout gateways.
      `);
    }, 1200);
  };

  const handleExportCSV = () => {
    const headers = ['Month', 'New Shoppers', 'Total Sales Orders', 'Total Revenue ($)', 'Net Commissions Earned ($)', 'Average Basket Checkout ($)'];
    const rows = reportDb.map(r => [r.month, r.signups, r.orders, r.revenue, r.commissions, r.avgBasket]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(line => line.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `moutanak_metrics_report_${reportYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="animate-fade-in space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-emerald-950 leading-tight">System Analytics Reports</h1>
          <p className="text-sm font-medium text-emerald-700/80 mt-1">Review aggregated platform indices, compile automated seller audits, and export ledgers</p>
        </div>
      </div>

      {/* Spreadsheet grid metrics summary details */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Select Financial Year:</span>
          <select 
            value={reportYear} 
            onChange={(e) => setReportYear(e.target.value)}
            className="px-3.5 py-1.5 bg-white border border-emerald-100 text-xs text-slate-700 font-bold rounded-xl outline-none focus:border-emerald-500 shadow-2xs"
          >
            <option value="2026">Financial Year 2026</option>
            <option value="2025">Financial Year 2025</option>
          </select>
        </div>

        <button 
          onClick={handleExportCSV}
          className="text-xs font-bold text-emerald-800 bg-white border border-emerald-100 hover:bg-emerald-50 rounded-xl px-4 py-2 flex items-center gap-1.5 shadow-2xs transition-all hover:-translate-y-0.2"
        >
          <Download className="w-4 h-4" /> Export Spreadsheet CSV
        </button>
      </div>

      {/* Main spreadsheets table ledger sheet */}
      <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold font-serif text-emerald-950 flex items-center gap-1.5 border-b pb-2.5">
          <FileSpreadsheet className="w-4.5 h-4.5 text-emerald-500" /> Monthly Settlement Spreadsheets Ledger
        </h3>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b text-[9px] font-bold uppercase tracking-widest text-slate-450">
                <th className="py-2.5 px-4">Financial Month</th>
                <th className="py-2.5 px-4">New Shopper Signups</th>
                <th className="py-2.5 px-4">Total Sales Orders</th>
                <th className="py-2.5 px-4">Gross Revenue checkouts</th>
                <th className="py-2.5 px-4 text-emerald-800">Net platform commissions (2%)</th>
                <th className="py-2.5 px-4">Average basket size ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {reportDb.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/55 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{item.month}</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">{item.signups.toLocaleString()} users</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">{item.orders.toLocaleString()} trades</td>
                  <td className="py-3 px-4 font-black text-slate-900">${item.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="py-3 px-4 font-black text-emerald-700">${item.commissions.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">${item.avgBasket.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dynamic Report Insights generator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Core diagnostic insights box */}
        <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-serif text-emerald-950 flex items-center gap-1.5">
              <Sparkles className="w-4.5 h-4.5 text-amber-500 animate-pulse" /> Diagnostic Business Insights Audit
            </h3>
            <button 
              onClick={handleCompileReport}
              disabled={isCompiling}
              className="text-2xs font-serif font-black uppercase text-emerald-850 hover:bg-emerald-50 px-3 py-1 rounded bg-slate-50 border border-slate-200 flex items-center gap-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${isCompiling ? 'animate-spin' : ''}`} />
              {isCompiling ? 'Compiling...' : 'Trigger compiled audit'}
            </button>
          </div>

          <p className="text-xs text-slate-450 font-medium leading-relaxed">
            Generate an automated platform-wide diagnostics report to audit top performing co-ops, regional trade insights, and inventory warning levels.
          </p>

          {compiledReport ? (
            <div className="bg-emerald-50/45 border border-emerald-100 rounded-xl p-4 text-xs font-mono text-emerald-950 leading-relaxed font-semibold whitespace-pre-line animate-fade-in">
              {compiledReport}
            </div>
          ) : (
            <div className="bg-slate-50 border border-dashed rounded-xl p-8 text-center text-slate-400 text-xs">
              Click the Compile button to generate deep administrative audit diagnostic logs.
            </div>
          )}
        </div>

        {/* Categories rank listings */}
        <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold font-serif text-emerald-950 flex items-center gap-1.5 border-b pb-2.5">
            <Award className="w-4.5 h-4.5 text-emerald-500 font-semibold" /> Cooperative Star Performers (May)
          </h3>

          <div className="space-y-3 font-semibold text-xs text-slate-650">
            <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl">
              <div>
                <strong className="text-slate-900 block font-serif text-xs">Kampot Spicy Farm</strong>
                <span className="text-[10px] text-slate-450 font-semibold">Province: Kampot &bull; Spices category</span>
              </div>
              <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full inline-flex items-center gap-0.5">+24.0% sales growth</span>
            </div>

            <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl">
              <div>
                <strong className="text-slate-900 block font-serif text-xs">The Traditional Khmer Weaver</strong>
                <span className="text-[10px] text-slate-455 font-semibold">Province: Takeo &bull; Crafts category</span>
              </div>
              <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full inline-flex items-center gap-0.5">Rating: 4.9 Stars</span>
            </div>

            <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl">
              <div>
                <strong className="text-slate-900 block font-serif text-xs">Gold Jasmine Rice Cooperative</strong>
                <span className="text-[10px] text-slate-455 font-semibold">Province: Battambang &bull; Grains category</span>
              </div>
              <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full inline-flex items-center gap-0.5">840 units sold</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
