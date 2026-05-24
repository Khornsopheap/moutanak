import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Lock, 
  Store, 
  MapPin, 
  FileText, 
  IdCard, 
  Camera, 
  Check, 
  ArrowLeft, 
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Upload,
  Image as ImageIcon,
  Wallet,
  Settings,
  X
} from 'lucide-react';

interface SellerWizardProps {
  onClose: () => void;
  onSubmit: (formData: any) => void;
}

export default function SellerRegistrationWizard({ onClose, onSubmit }: SellerWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    otp: '',
    storeName: '',
    category: '',
    province: '',
    description: '',
    facebook: '',
    tin: '',
    businessReg: '',
    stockVolume: '',
    abaAccount: '',
    abaName: '',
    aclAccount: '',
    aclName: '',
    wingAccount: '',
    // Simulated upload states to show checklist validation
    docIdFront: true,
    docIdBack: true,
    docSelfie: true,
    docTinCert: true,
    docAddressProof: true,
    docFarmPhoto: true,
    docProductPhotos: true,
    agreeTerms: false,
    agreeAccuracy: false,
    consentData: false,
  });

  const [otpError, setOtpError] = useState('');
  const [passStrength, setPassStrength] = useState({ score: 0, text: 'Blank', color: 'bg-slate-200' });

  // Handle password strength measurement
  const handlePasswordChange = (val: string) => {
    setFormData(prev => ({ ...prev, password: val }));
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/\d/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    let text = 'Blank';
    let color = 'bg-slate-200';
    if (val.length > 0) {
      if (score <= 1) { text = 'Weak'; color = 'bg-red-500'; }
      else if (score === 2) { text = 'Fair'; color = 'bg-orange-500'; }
      else if (score === 3) { text = 'Good'; color = 'bg-yellow-500'; }
      else { text = 'Strong'; color = 'bg-emerald-500'; }
    }
    setPassStrength({ score, text, color });
  };

  const handleNext = () => {
    // Validate current step
    if (currentStep === 1) {
      if (!formData.fullName || !formData.dob || !formData.email || !formData.phone || !formData.password) {
        alert('Please complete all required fields.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match.');
        return;
      }
    } else if (currentStep === 2) {
      if (formData.otp !== '123456') {
        setOtpError('Invalid OTP code. Enter 123456 for testing.');
        return;
      }
      setOtpError('');
    } else if (currentStep === 3) {
      if (!formData.storeName || !formData.category || !formData.province || !formData.description) {
        alert('Please complete all store parameters.');
        return;
      }
      if (formData.description.length < 30) {
        alert('Please enter at least 30 characters for the store description.');
        return;
      }
    } else if (currentStep === 4) {
      if (!formData.tin) {
        alert('TIN registration number is required under Cambodian tax law.');
        return;
      }
    } else if (currentStep === 5) {
      if (!formData.stockVolume) {
        alert('Please specify your approximate monthly stock volume.');
        return;
      }
    } else if (currentStep === 6) {
      if (!formData.abaAccount && !formData.aclAccount && !formData.wingAccount) {
        alert('Please define at least one settlement payout method.');
        return;
      }
    }

    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Last step: review and sign
      if (!formData.agreeTerms || !formData.agreeAccuracy || !formData.consentData) {
        alert('Please confirm all safety covenants and platform terms to proceed.');
        return;
      }
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    const submission = {
      id: Date.now(),
      sellerName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      dob: formData.dob,
      storeName: formData.storeName,
      category: formData.category,
      province: formData.province,
      tin: formData.tin,
      businessReg: formData.businessReg || 'Individual Sourced Farmer',
      stockVolume: formData.stockVolume,
      abaAccount: formData.abaAccount,
      abaName: formData.abaName || formData.fullName,
      aclAccount: formData.aclAccount,
      aclName: formData.aclName,
      wingAccount: formData.wingAccount,
      description: formData.description,
      facebook: formData.facebook,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      userId: 'current_user',
    };

    // Save in LocalStorage request queue
    const oldRequestsJson = localStorage.getItem('seller_requests');
    const oldRequests = oldRequestsJson ? JSON.parse(oldRequestsJson) : [];
    oldRequests.push(submission);
    localStorage.setItem('seller_requests', JSON.stringify(oldRequests));

    // Also update current active register state to reflect pending status
    localStorage.setItem('seller_status', 'pending');
    localStorage.setItem('current_seller_info', JSON.stringify(submission));

    onSubmit(submission);
  };

  // Steps indicators
  const stepsMeta = [
    { title: 'Personal Info', label: 'Step 1' },
    { title: 'SMS OTP Code', label: 'Step 2' },
    { title: 'Store Identity', label: 'Step 3' },
    { title: 'TIN & Legal Documents', label: 'Step 4' },
    { title: 'Product & Farm Proof', label: 'Step 5' },
    { title: 'Settlement Payout', label: 'Step 6' },
    { title: 'Final Review', label: 'Step 7' },
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 leading-normal font-sans text-slate-800">
      <div className="bg-white rounded-[24px] w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-100 animate-scaleUp">
        
        {/* Header decoration */}
        <div className="px-6 py-4.5 bg-[#fcf9f4] border-b border-emerald-50 flex items-center justify-between">
          <div>
            <h3 className="font-serif font-black text-lg text-slate-850">Become an Associated Seller</h3>
            <p className="text-[11px] text-slate-400 font-bold tracking-wider uppercase mt-1">
              {stepsMeta[currentStep - 1].label}: {stepsMeta[currentStep - 1].title}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5 animate-pulse" />
          </button>
        </div>

        {/* Progress horizontal steps indicator bar */}
        <div className="px-6 pt-4 pb-2 bg-[#fcf9f4] border-b border-slate-100">
          <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 no-scrollbar text-xs">
            {stepsMeta.map((s, idx) => (
              <React.Fragment key={idx}>
                <div className="flex items-center gap-1 shrink-0">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                    currentStep === idx + 1 
                      ? 'bg-emerald-500 text-white shadow-sm ring-4 ring-emerald-100' 
                      : currentStep > idx + 1
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    {currentStep > idx + 1 ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                  </div>
                  <span className={`font-semibold hidden sm:inline text-[11px] ${
                    currentStep === idx + 1 ? 'text-slate-850 font-bold' : 'text-slate-400'
                  }`}>{s.title}</span>
                </div>
                {idx < stepsMeta.length - 1 && (
                  <div className={`h-0.5 flex-1 min-w-[12px] rounded ${
                    currentStep > idx + 1 ? 'bg-emerald-400' : 'bg-slate-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
          {/* Sizing line bar container */}
          <div className="h-1 bg-slate-100 rounded-full mt-3 overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Dynamic form inputs viewport wrapper */}
        <div className="overflow-y-auto px-6 py-6 space-y-5 flex-1 max-h-[56vh] no-scrollbar">

          {/* STEP 1: Personal Coordinates */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3.5 text-xs text-emerald-800 font-semibold leading-relaxed flex gap-2">
                <User className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <span>Enter details exactly as they read on your national Identification / passports card. All profiles undergo official regulatory standard reviews.</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block uppercase">Full Name (English / Khmer)</label>
                  <input 
                    type="text" 
                    value={formData.fullName} 
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Sothea Sok" 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100/50 transition font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block uppercase font-sans">Date of Birth</label>
                  <input 
                    type="date" 
                    value={formData.dob} 
                    onChange={e => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-400 focus:bg-white transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block uppercase font-sans">Email Address</label>
                  <input 
                    type="email" 
                    value={formData.email} 
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. sotheasok@example.kh" 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-400 focus:bg-white transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block uppercase font-sans">Cambodian Mobile Phone</label>
                  <div className="flex rounded-xl overflow-hidden border border-slate-200 shadow-xs bg-slate-50">
                    <span className="bg-slate-100 border-r px-3.5 py-2.5 text-xs font-bold text-slate-500">+855</span>
                    <input 
                      type="tel" 
                      value={formData.phone} 
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 1294819" 
                      className="w-full px-3.5 py-2.5 bg-transparent text-xs outline-none focus:bg-white transition font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block uppercase font-sans">Enter password</label>
                  <input 
                    type="password" 
                    value={formData.password}
                    onChange={e => handlePasswordChange(e.target.value)}
                    placeholder="Minimum 8 characters" 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-400 focus:bg-white transition"
                  />
                  <div className="flex gap-1.5 mt-2">
                    {[1, 2, 3, 4].map(b => (
                      <div key={b} className={`h-1 flex-1 rounded ${
                        passStrength.score >= b ? passStrength.color : 'bg-slate-150'
                      }`} />
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold block mt-1">Strength level: <span className="text-slate-600 uppercase">{passStrength.text}</span></p>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block uppercase font-sans">Confirm Password</label>
                  <input 
                    type="password" 
                    value={formData.confirmPassword}
                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Re-enter same passcode" 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-400 focus:bg-white transition"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Phone verification OTP */}
          {currentStep === 2 && (
            <div className="space-y-5 text-center py-6 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                <Phone className="w-6 h-6" />
              </div>
              <div className="space-y-2 max-w-sm mx-auto">
                <h4 className="font-serif font-black text-slate-800 text-lg">Verify Mobile Phone</h4>
                <p className="text-slate-400 text-xs leading-relaxed font-semibold">
                  We have dispatched a six-digit verification code to <span className="text-slate-700 font-bold">{formData.phone || '+855...'}</span>. Enter it now:
                </p>
              </div>
              <div className="flex justify-center flex-col items-center max-w-xs mx-auto">
                <input 
                  type="text" 
                  maxLength={6} 
                  value={formData.otp}
                  onChange={e => setFormData({ ...formData, otp: e.target.value })}
                  placeholder="------" 
                  className="w-40 text-center tracking-[0.5em] px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-lg font-black outline-none focus:border-emerald-500 focus:bg-white transition"
                />
                {otpError ? (
                  <p className="text-red-500 text-[11px] font-bold mt-2.5 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> {otpError}</p>
                ) : (
                  <p className="text-slate-400 text-[10px] mt-2 font-bold leading-normal bg-orange-50 border border-orange-100 text-orange-850 p-2 rounded-lg">
                    ⚠️ Enter demo passcode <span className="font-bold underline">123456</span> to pass step.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Store Parameters */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3.5 text-xs text-emerald-800 font-semibold leading-relaxed flex gap-2">
                <Store className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <span>Establish how your agricultural brand of produce will display on Moutanak. This is visible to all buyers in Cambodia.</span>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block uppercase">Store Display Brand Name</label>
                  <input 
                    type="text" 
                    value={formData.storeName} 
                    onChange={e => setFormData({ ...formData, storeName: e.target.value })}
                    placeholder="e.g. Sothea's organic Kampot Spice Coop" 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-emerald-400 focus:bg-white transition"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 block uppercase">Primary Crop Category</label>
                    <select 
                      value={formData.category} 
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-400 focus:bg-white transition"
                    >
                      <option value="">— Select Category —</option>
                      <option value="Vegetables & Herbs">Vegetables & Herbs</option>
                      <option value="Fresh Fruits">Fresh Fruits</option>
                      <option value="Dairy & Farm-Fresh">Dairy & Farm-Fresh</option>
                      <option value="Organic Grains & Spices">Organic Grains & Spices</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 block uppercase">Farming Origin Province</label>
                    <select 
                      value={formData.province} 
                      onChange={e => setFormData({ ...formData, province: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-400 focus:bg-white transition"
                    >
                      <option value="">— Select Location —</option>
                      <option value="Phnom Penh">Phnom Penh</option>
                      <option value="Siem Reap">Siem Reap</option>
                      <option value="Kandal Province">Kandal Province</option>
                      <option value="Battambang">Battambang</option>
                      <option value="Kampot Province">Kampot Province</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block uppercase">Cooperative / Farm Story Bio</label>
                  <textarea 
                    rows={3} 
                    value={formData.description} 
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Provide details about your farmstead, location coordinates, packaging style, and organic cultivation certification references. Minimum 30 characters."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-400 focus:bg-white transition leading-relaxed"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block uppercase">Facebook Business link <span className="text-[10px] text-slate-400 font-normal lowercase">(recommended)</span></label>
                  <input 
                    type="url" 
                    value={formData.facebook} 
                    onChange={e => setFormData({ ...formData, facebook: e.target.value })}
                    placeholder="e.g. https://facebook.com/sotheafarms" 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-400 focus:bg-white transition"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Documents and TIN */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="rounded-xl border border-orange-100 bg-amber-50/50 p-3.5 text-xs text-amber-800 font-bold leading-normal flex gap-2">
                <FileText className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                <span>Under Cambodian Ministry of Commercial registration requirements, a Tax Identification Number (TIN) is mandatory. Proved documents undergo secure AES hashing.</span>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 block uppercase">Tax Identification Number (TIN)</label>
                    <input 
                      type="text" 
                      value={formData.tin} 
                      onChange={e => setFormData({ ...formData, tin: e.target.value })}
                      placeholder="e.g. K000-1234567" 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-mono text-emerald-800 uppercase outline-none focus:border-emerald-400 focus:bg-white transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 block uppercase">Optional Business Registration (MOC)</label>
                    <input 
                      type="text" 
                      value={formData.businessReg} 
                      onChange={e => setFormData({ ...formData, businessReg: e.target.value })}
                      placeholder="e.g. CamReg-0012351-MOC" 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-400 focus:bg-white transition"
                    />
                  </div>
                </div>

                {/* Simulated file attachments checklist */}
                <div className="space-y-2.5 pt-2">
                  <p className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">Document Attachments Checklist</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    
                    <div className="flex items-center justify-between p-3 border rounded-xl hover:bg-slate-50 transition border-slate-150">
                      <div className="flex items-center gap-2">
                        <IdCard className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-bold">Cambodian ID card (Front)</span>
                      </div>
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">✓ Attached</span>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-xl hover:bg-slate-50 transition border-slate-150">
                      <div className="flex items-center gap-2">
                        <IdCard className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-bold">Cambodian ID card (Back)</span>
                      </div>
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">✓ Attached</span>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-xl hover:bg-slate-50 transition border-slate-150 col-span-1 sm:col-span-2">
                      <div className="flex items-center gap-2">
                        <Camera className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-semibold">Selfie Holding National Identification card</span>
                      </div>
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">✓ Image.jpeg</span>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-xl hover:bg-slate-50 transition border-slate-150">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-semibold">Signed TIN certificate PDF</span>
                      </div>
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">✓ cert_tin.pdf</span>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-xl hover:bg-slate-50 transition border-slate-150">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-semibold">Official proof of residency / utility bill</span>
                      </div>
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">✓ utility_bill.png</span>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          )}

          {/* STEP 5: Product Proof */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3.5 text-xs text-emerald-800 font-semibold leading-relaxed flex gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <span>Submit photos showing active crops, greenhouses, or family-owned storage facilities where produce is harvested.</span>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block uppercase">Cooperative Stock Volume Range</label>
                  <select 
                    value={formData.stockVolume} 
                    onChange={e => setFormData({ ...formData, stockVolume: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-400 focus:bg-white transition"
                  >
                    <option value="">— Select Range —</option>
                    <option value="50 - 200 kg / Month">50 &ndash; 200 kg / Month</option>
                    <option value="200 - 500 kg / Month">200 &ndash; 500 kg / Month</option>
                    <option value="500 kg - 1 Tonne / Month">500 kg &ndash; 1 Tonne / Month</option>
                    <option value="More than 1 Tonne / Month">More than 1 Tonne / Month</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5 pt-2">
                  <div className="border border-dashed border-emerald-300 rounded-xl p-4 bg-emerald-50/20 text-center space-y-2">
                    <Upload className="w-5 h-5 text-emerald-500 mx-auto" />
                    <p className="text-[11px] font-bold text-slate-800">Fresh Crop / Produce Photos</p>
                    <p className="text-[10px] text-slate-400">Min. 3 high-yield harvest photos</p>
                    <span className="inline-block text-[9px] text-emerald-700 bg-emerald-100/50 px-2 py-0.5 rounded font-bold">✓ 4 Files Attached</span>
                  </div>
                  <div className="border border-dashed border-emerald-300 rounded-xl p-4 bg-emerald-50/20 text-center space-y-2">
                    <Upload className="w-5 h-5 text-emerald-500 mx-auto" />
                    <p className="text-[11px] font-bold text-slate-800">Farmsteads / Greenhouse view</p>
                    <p className="text-[10px] text-slate-400">Verifiable land coordinates photo</p>
                    <span className="inline-block text-[9px] text-emerald-700 bg-emerald-100/50 px-2 py-0.5 rounded font-bold">✓ farm_view.jpeg</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Payout Methods */}
          {currentStep === 6 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3.5 text-xs text-emerald-800 font-semibold leading-relaxed flex gap-2">
                <Wallet className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <span>Configure payout credentials to receive direct weekly sales clearance. Name matches must align precisely with your National ID card registration.</span>
              </div>
              
              <div className="space-y-4.5">
                
                {/* ABA Option */}
                <div className="p-4 border rounded-2xl bg-white border-slate-200/80 shadow-xs space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-sky-100 text-sky-800 font-extrabold text-[10px] rounded-lg">ABA</span>
                    <span className="text-xs font-bold text-slate-700">ABA Bank Deposit (Immediate weekly settle)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Account Number</label>
                      <input 
                        type="text" 
                        value={formData.abaAccount} 
                        onChange={e => setFormData({ ...formData, abaAccount: e.target.value })}
                        placeholder="e.g. 000 128 481" 
                        className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs outline-none text-emerald-800 font-black"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Account Title Holder</label>
                      <input 
                        type="text" 
                        value={formData.abaName} 
                        onChange={e => setFormData({ ...formData, abaName: e.target.value })}
                        placeholder="Must match ID registration precisely" 
                        className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs outline-none uppercase font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Acleda option */}
                <div className="p-4 border rounded-2xl bg-white border-slate-200/80 shadow-xs space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-[#fffbeb] text-amber-800 font-extrabold text-[10px] rounded-lg">ACL</span>
                    <span className="text-xs font-medium text-slate-600">ACLEDA Bank ToanChet</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Account Number ID</label>
                      <input 
                        type="text" 
                        value={formData.aclAccount} 
                        onChange={e => setFormData({ ...formData, aclAccount: e.target.value })}
                        placeholder="e.g. 1928-1123491-1" 
                        className="w-full px-3 py-2 bg-transparent border rounded-lg text-xs outline-none font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Name Holder</label>
                      <input 
                        type="text" 
                        value={formData.aclName} 
                        onChange={e => setFormData({ ...formData, aclName: e.target.value })}
                        placeholder="Holder name" 
                        className="w-full px-3 py-2 bg-transparent border rounded-lg text-xs outline-none font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Wing option */}
                <div className="p-3 border rounded-xl bg-slate-50 border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold text-[9px] rounded">WNG</span>
                      <span className="text-xs font-semibold text-slate-600">Wing / TrueMoney mobile wallet</span>
                    </div>
                    <input 
                      type="tel" 
                      value={formData.wingAccount} 
                      onChange={e => setFormData({ ...formData, wingAccount: e.target.value })}
                      placeholder="Linked phone coordinate" 
                      className="px-3 py-1.5 bg-white border rounded text-xs outline-none w-44 text-center font-bold"
                    />
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* STEP 7: Final Review & sign */}
          {currentStep === 7 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3.5 text-xs text-emerald-800 font-semibold leading-relaxed flex gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Review all parameters below. Click submit to dispatch your official business and credential file to standard quality inspection.</span>
              </div>

              {/* Review summary cards box */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-55/40 text-xs">
                <div className="px-4 py-2.5 bg-slate-100 border-b font-bold tracking-wider text-slate-500 text-[10px] uppercase">
                  Application Summary Records
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-center text-slate-600 py-1 border-b">
                    <span>Full Legal Name:</span>
                    <strong className="text-slate-800 font-bold">{formData.fullName}</strong>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 py-1 border-b">
                    <span>Phone Number:</span>
                    <strong className="text-slate-800 font-bold">+855 {formData.phone}</strong>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 py-1 border-b">
                    <span>Email Coordinate:</span>
                    <strong className="text-slate-800 font-bold">{formData.email}</strong>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 py-1 border-b">
                    <span>Store Name:</span>
                    <strong className="text-emerald-700 font-bold">{formData.storeName}</strong>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 py-1 border-b">
                    <span>Crop Category:</span>
                    <strong className="text-slate-800 font-bold">{formData.category}</strong>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 py-1 border-b">
                    <span>TIN Reference:</span>
                    <strong className="text-sky-800 font-mono font-bold">{formData.tin}</strong>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 py-1">
                    <span>Settle Payouts:</span>
                    <strong className="text-slate-800 font-bold">
                      {formData.abaAccount ? 'ABA Bank' : ''}
                      {formData.abaAccount && formData.aclAccount ? ', ' : ''}
                      {formData.aclAccount ? 'ACLEDA' : ''}
                      {formData.wingAccount ? ' (Wing)' : ''}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Checkboxes terms */}
              <div className="space-y-2.5 pt-2">
                <label className="flex gap-3 items-start cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.agreeAccuracy}
                    onChange={e => setFormData({ ...formData, agreeAccuracy: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-500 accent-emerald-500 mt-1 cursor-pointer"
                  />
                  <span className="text-[11px] font-semibold leading-relaxed text-slate-600">
                    I confirm all information and documents uploaded are authentic. I understand that submitting fraudulent records violates Cambodian agricultural trade regulations and yields platform termination.
                  </span>
                </label>
                <label className="flex gap-3 items-start cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.agreeTerms}
                    onChange={e => setFormData({ ...formData, agreeTerms: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-500 accent-emerald-500 mt-1 cursor-pointer"
                  />
                  <span className="text-[11px] font-semibold leading-relaxed text-slate-600">
                    I agree completely to the <span className="text-emerald-600 font-bold hover:underline">Moutanak Sourced Seller Agreement</span>, platform fee guidelines, and standard safety inspections rules.
                  </span>
                </label>
                <label className="flex gap-3 items-start cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.consentData}
                    onChange={e => setFormData({ ...formData, consentData: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-500 accent-emerald-500 mt-1 cursor-pointer"
                  />
                  <span className="text-[11px] font-semibold leading-relaxed text-slate-600">
                    I consent to the processing of personal identification coordinates for credential confirmation purposes.
                  </span>
                </label>
              </div>
            </div>
          )}

        </div>

        {/* Modal actions navigation footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          <button 
            type="button"
            onClick={handlePrev}
            style={{ visibility: currentStep === 1 ? 'hidden' : 'visible' }}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-slate-600 border bg-white hover:bg-slate-50 cursor-pointer transition active:scale-95 duration-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Previous
          </button>
          <button 
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 cursor-pointer transition active:scale-95 duration-200"
          >
            {currentStep === totalSteps ? 'Submit Application' : 'Next Step'} <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
