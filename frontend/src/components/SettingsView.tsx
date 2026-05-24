import React, { useState } from 'react';
import { PlatformConfig } from '../types';
import { 
  Building, 
  Percent, 
  ShieldCheck, 
  Bell, 
  Check, 
  MapPin, 
  Mail, 
  Phone,
  Power
} from 'lucide-react';

interface SettingsViewProps {
  config: PlatformConfig;
  onSaveConfig: (updated: PlatformConfig) => void;
}

export default function SettingsView({
  config,
  onSaveConfig
}: SettingsViewProps) {
  // Config states initialized from parent props
  const [name, setName] = useState<string>(config.name || 'Moutanak Commerce');
  const [adminEmail, setAdminEmail] = useState<string>(config.adminEmail || 'admin@moutanak.kh');
  const [phone, setPhone] = useState<string>(config.phone || '+855 23 000 000');
  const [defaultLanguage, setDefaultLanguage] = useState<'English' | 'Khmer'>(config.defaultLanguage || 'English');
  const [commissionBase, setCommissionBase] = useState<number>(config.commissionBase || 2.0);
  const [commissionVerified, setCommissionVerified] = useState<number>(config.commissionVerified || 1.5);
  const [commissionPremium, setCommissionPremium] = useState<number>(config.commissionPremium || 1.0);

  // Toggles arrays
  const [requireTin, setRequireTin] = useState<boolean>(config.requireTin);
  const [requireSelfie, setRequireSelfie] = useState<boolean>(config.requireSelfie);
  const [requireAddress, setRequireAddress] = useState<boolean>(config.requireAddress);
  const [autoApprove, setAutoApprove] = useState<boolean>(config.autoApprove);
  const [requireBizReg, setRequireBizReg] = useState<boolean>(config.requireBizReg);

  const [notifyNewSeller, setNotifyNewSeller] = useState<boolean>(config.notifyNewSeller);
  const [notifyApproved, setNotifyApproved] = useState<boolean>(config.notifyApproved);
  const [notifyNewOrder, setNotifyNewOrder] = useState<boolean>(config.notifyNewOrder);
  const [notifyLowStock, setNotifyLowStock] = useState<boolean>(config.notifyLowStock);
  const [notifyDailyEmail, setNotifyDailyEmail] = useState<boolean>(config.notifyDailyEmail);

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      name,
      adminEmail,
      phone,
      defaultLanguage,
      commissionBase,
      commissionVerified,
      commissionPremium,
      requireTin,
      requireSelfie,
      requireAddress,
      autoApprove,
      requireBizReg,
      notifyNewSeller,
      notifyApproved,
      notifyNewOrder,
      notifyLowStock,
      notifyDailyEmail
    });
  };

  return (
    <div className="animate-fade-in space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-emerald-950 leading-tight">Platform Configuration</h1>
          <p className="text-sm font-medium text-emerald-700/80 mt-1">Calibrate marketplace commission baseline rates, security verification rules, and administrative triggers</p>
        </div>
      </div>

      <form onSubmit={handleSaveSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Platform identity details */}
        <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold font-serif text-emerald-950 flex items-center gap-1.5 border-b pb-2.5">
            <Building className="w-4.5 h-4.5 text-emerald-500" /> Platform Corporate Information
          </h3>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-455">Marketplace Portal title</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border rounded-lg p-2 Outline-none focus:bg-white focus:border-emerald-500 font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-455">Audit Admin Support Email</label>
              <input 
                type="email" 
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full bg-slate-50 border rounded-lg p-2 Outline-none focus:bg-white focus:border-emerald-500 font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-455">Helpdesk Phone Contact</label>
              <input 
                type="text" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border rounded-lg p-2 Outline-none focus:bg-white focus:border-emerald-500 font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-450 select-none">Global Default UI Language</label>
              <div className="flex gap-2 font-semibold">
                <button 
                  type="button" 
                  onClick={() => setDefaultLanguage('English')}
                  className={`flex-1 py-2 text-xs border rounded-lg transition-all ${
                    defaultLanguage === 'English' ? 'bg-emerald-600 text-white border-transparent shadow-2xs' : 'bg-slate-50 hover:bg-slate-100 text-slate-650'
                  }`}
                >
                  English Language (EN)
                </button>
                <button 
                  type="button" 
                  onClick={() => setDefaultLanguage('Khmer')}
                  className={`flex-1 py-2 text-xs border rounded-lg transition-all ${
                    defaultLanguage === 'Khmer' ? 'bg-emerald-600 text-white border-transparent shadow-2xs' : 'bg-slate-50 hover:bg-slate-100 text-slate-650'
                  }`}
                >
                  Khmer Language (ខ្មែរ)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Commission baseline scales */}
        <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold font-serif text-emerald-950 flex items-center gap-1.5 border-b pb-2.5">
            <Percent className="w-4.5 h-4.5 text-emerald-500" /> Platform Service Commission baselines
          </h3>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-lg border flex justify-between items-center">
              <div>
                <strong className="block text-slate-900 font-bold font-serif text-xs">Standard Baseline Commission</strong>
                <span className="text-[10px] text-slate-500 font-semibold">Standard on-boarded applicant fee base</span>
              </div>
              <div className="flex items-center gap-1 font-extrabold max-w-20">
                <input 
                  type="number" 
                  step="0.1"
                  value={commissionBase}
                  onChange={(e) => setCommissionBase(parseFloat(e.target.value) || 0)}
                  className="w-12 bg-white rounded border border-slate-300 p-1 font-semibold text-center text-xs"
                />
                <span>%</span>
              </div>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-lg border flex justify-between items-center">
              <div>
                <strong className="block text-slate-900 font-bold font-serif text-xs">Verified Local Business Co-Op</strong>
                <span className="text-[10px] text-slate-500 font-semibold">Commission discount for certified local growers</span>
              </div>
              <div className="flex items-center gap-1 font-extrabold max-w-20">
                <input 
                  type="number" 
                  step="0.1"
                  value={commissionVerified}
                  onChange={(e) => setCommissionVerified(parseFloat(e.target.value) || 0)}
                  className="w-12 bg-white rounded border border-slate-300 p-1 font-semibold text-center text-xs"
                />
                <span>%</span>
              </div>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-lg border flex justify-between items-center">
              <div>
                <strong className="block text-slate-900 font-bold font-serif text-xs">Premium Partner Co-Op rate</strong>
                <span className="text-[10px] text-slate-500 font-semibold">Special partner discount threshold (sales &gt; 1000 units)</span>
              </div>
              <div className="flex items-center gap-1 font-extrabold max-w-20">
                <input 
                  type="number" 
                  step="0.1"
                  value={commissionPremium}
                  onChange={(e) => setCommissionPremium(parseFloat(e.target.value) || 0)}
                  className="w-12 bg-white rounded border border-slate-300 p-1 font-semibold text-center text-xs"
                />
                <span>%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Security & Verification Constraints Toggles */}
        <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold font-serif text-emerald-950 flex items-center gap-1.5 border-b pb-2.5">
            <ShieldCheck className="w-4.5 h-4.5 text-emerald-500" /> Administrative Security Constraints
          </h3>

          <div className="space-y-3.5 text-xs text-slate-750 font-semibold select-none">
            <div className="flex items-center justify-between border-b pb-2.5">
              <div>
                <div className="text-slate-900 block font-serif">Require TIN Number registration fields</div>
                <div className="text-[10.5px] text-slate-455 font-medium leading-none">Applicant must input a valid tax identifier</div>
              </div>
              <button 
                type="button"
                onClick={() => setRequireTin(!requireTin)}
                className={`w-9 h-5 rounded-full relative transition-colors ${requireTin ? 'bg-emerald-600' : 'bg-slate-200'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow ${requireTin ? 'left-4.5' : 'left-0.5'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between border-b pb-2.5">
              <div>
                <div className="text-slate-900 block font-serif">Force Selfie matching ID match constraint</div>
                <div className="text-[10.5px] text-slate-455 font-medium leading-none">Instructs seller application review to reject blur selfie cams</div>
              </div>
              <button 
                type="button"
                onClick={() => setRequireSelfie(!requireSelfie)}
                className={`w-9 h-5 rounded-full relative transition-colors ${requireSelfie ? 'bg-emerald-600' : 'bg-slate-200'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow ${requireSelfie ? 'left-4.5' : 'left-0.5'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between border-b pb-2.5">
              <div>
                <div className="text-slate-900 block font-serif">Require official municipal Address Proof scan</div>
                <div className="text-[10.5px] text-slate-455 font-medium leading-none">Valid residential utility bills or certificate documents required</div>
              </div>
              <button 
                type="button"
                onClick={() => setRequireAddress(!requireAddress)}
                className={`w-9 h-5 rounded-full relative transition-colors ${requireAddress ? 'bg-emerald-600' : 'bg-slate-200'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow ${requireAddress ? 'left-4.5' : 'left-0.5'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-slate-900 block font-serif">Require Patent/MOC Corporate business registries</div>
                <div className="text-[10.5px] text-slate-455 font-medium leading-none">Exclusive to registered company growers</div>
              </div>
              <button 
                type="button"
                onClick={() => setRequireBizReg(!requireBizReg)}
                className={`w-9 h-5 rounded-full relative transition-colors ${requireBizReg ? 'bg-emerald-600' : 'bg-slate-200'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow ${requireBizReg ? 'left-4.5' : 'left-0.5'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Card 4: Administrative Notifications channels */}
        <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold font-serif text-emerald-950 flex items-center gap-1.5 border-b pb-2.5">
            <Bell className="w-4.5 h-4.5 text-emerald-500" /> Platform alert presets
          </h3>

          <div className="space-y-3.5 text-xs text-slate-750 font-semibold select-none">
            <div className="flex items-center justify-between border-b pb-2.5">
              <div>
                <div className="text-slate-900 block font-serif">Alert me for New applicants store registrations</div>
                <div className="text-[10.5px] text-slate-455 font-medium leading-none">Auto push alert notification in admin bell header</div>
              </div>
              <button 
                type="button"
                onClick={() => setNotifyNewSeller(!notifyNewSeller)}
                className={`w-9 h-5 rounded-full relative transition-colors ${notifyNewSeller ? 'bg-emerald-600' : 'bg-slate-200'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow ${notifyNewSeller ? 'left-4.5' : 'left-0.5'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between border-b pb-2.5">
              <div>
                <div className="text-slate-900 block font-serif">Alert shoppers when application gets approved</div>
                <div className="text-[10.5px] text-slate-455 font-medium leading-none">System emails automated welcome letters to merchants</div>
              </div>
              <button 
                type="button"
                onClick={() => setNotifyApproved(!notifyApproved)}
                className={`w-9 h-5 rounded-full relative transition-colors ${notifyApproved ? 'bg-emerald-600' : 'bg-slate-200'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow ${notifyApproved ? 'left-4.5' : 'left-0.5'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between border-b pb-2.5">
              <div>
                <div className="text-slate-900 block font-serif">Alert when checkout trade orders are logged</div>
                <div className="text-[10.5px] text-slate-455 font-medium leading-none">Push notify for courier assignation timelines</div>
              </div>
              <button 
                type="button"
                onClick={() => setNotifyNewOrder(!notifyNewOrder)}
                className={`w-9 h-5 rounded-full relative transition-colors ${notifyNewOrder ? 'bg-emerald-600' : 'bg-slate-200'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow ${notifyNewOrder ? 'left-4.5' : 'left-0.5'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-slate-900 block font-serif">Send daily platform financial summary digests</div>
                <div className="text-[10.5px] text-slate-455 font-medium leading-none">Generates email spreadsheets ledger digests inside mailbox</div>
              </div>
              <button 
                type="button"
                onClick={() => setNotifyDailyEmail(!notifyDailyEmail)}
                className={`w-9 h-5 rounded-full relative transition-colors ${notifyDailyEmail ? 'bg-emerald-600' : 'bg-slate-200'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow ${notifyDailyEmail ? 'left-4.5' : 'left-0.5'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Action Board Submit */}
        <div className="md:col-span-2 text-right pt-2.5 border-t">
          <button 
            type="submit"
            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-serif font-black tracking-wide rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 text-xs inline-flex items-center gap-1.5"
          >
            <Check className="w-5 h-5 text-white" strokeWidth={3} /> Save ADMINISTRATIVE Settings Setup
          </button>
        </div>

      </form>
    </div>
  );
}
