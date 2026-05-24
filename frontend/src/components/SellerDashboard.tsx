import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Store, 
  Plus, 
  Image as ImageIcon, 
  Activity, 
  Check, 
  DollarSign, 
  AlertTriangle, 
  TrendingUp, 
  ShoppingBag, 
  Star, 
  ChevronRight,
  ArrowRight,
  Sparkles,
  Award,
  Wallet,
  ArrowUpRight,
  PackageCheck,
  X
} from 'lucide-react';

interface SellerDashboardProps {
  onBackToStore: () => void;
  onNavigateToCategory: (cat: string) => void;
}

export default function SellerDashboard({ onBackToStore, onNavigateToCategory }: SellerDashboardProps) {
  const [sellerInfo, setSellerInfo] = useState<any>({
    sellerName: 'Vanna Sok',
    storeName: "Vanna's Spicy Farm",
    category: 'Vegetables & Herbs',
    province: 'Kampot Province',
    description: 'We grow and sell the finest organic vegetables and herbs in Kampot.',
    stockVolume: '200 - 500 kg / Month'
  });

  const [products, setProducts] = useState<any[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);

  // New product form states
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('vegetable');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdStock, setNewProdStock] = useState('');
  const [newProdWeight, setNewProdWeight] = useState('500');
  const [newProdUnit, setNewProdUnit] = useState('g');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdPresetImage, setNewProdPresetImage] = useState('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=500');

  // Preset gorgeous agricultural high-yield crop covers
  const presetCropCovers = [
    { name: '🥦 Fresh Veggies', url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=500' },
    { name: '🌶️ Hot Green Pepper', url: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&q=80&w=500' },
    { name: '🥭 Golden Mangoes', url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=500' },
    { name: '🧅 Fresh Garlic/Onions', url: 'https://images.unsplash.com/photo-1581078426775-8022d14fbed5?auto=format&fit=crop&q=80&w=500' },
    { name: '🥕 Farm Carrots', url: 'https://images.unsplash.com/photo-1444459002951-a2c1be6529a1?auto=format&fit=crop&q=80&w=500' },
    { name: '🥥 Real Coconuts', url: 'https://images.unsplash.com/photo-1551754626-7ed7eedb58b4?auto=format&fit=crop&q=80&w=500' },
  ];

  // Load seller info from registration form if saved in local storage
  const loadSellerData = () => {
    const rawInfo = localStorage.getItem('current_seller_info');
    if (rawInfo) {
      setSellerInfo(JSON.parse(rawInfo));
    }

    // Load seller custom Uploaded products
    const customJson = localStorage.getItem('moutanak_custom_products');
    const customProds = customJson ? JSON.parse(customJson) : [];
    setProducts(customProds);
  };

  useEffect(() => {
    loadSellerData();
  }, []);

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice || !newProdStock || !newProdDesc) {
      alert('Please fill out all product details to list it.');
      return;
    }

    const priceNum = parseFloat(newProdPrice);
    const stockNum = parseInt(newProdStock);

    if (isNaN(priceNum) || priceNum <= 0) {
      alert('Please enter a valid price.');
      return;
    }

    if (isNaN(stockNum) || stockNum < 0) {
      alert('Please enter a valid stock quantity.');
      return;
    }

    const brandNewProduct = {
      id: 'custom_' + Date.now(),
      name: newProdName,
      description: newProdDesc,
      price: priceNum,
      category: newProdCategory,
      imageUrl: newProdPresetImage,
      sourceFarm: sellerInfo.storeName || "Vanna's Spicy Farm",
      location: sellerInfo.province || "Kampot Province",
      inStock: stockNum > 0,
      rating: 5.0, // Brand new gets absolute five-star rating preset
      reviewsCount: 0,
      weight: parseFloat(newProdWeight) || 500,
      unit: newProdUnit,
      stockCount: stockNum
    };

    // Save in custom products list
    const customJson = localStorage.getItem('moutanak_custom_products');
    const customList = customJson ? JSON.parse(customJson) : [];
    customList.unshift(brandNewProduct);
    localStorage.setItem('moutanak_custom_products', JSON.stringify(customList));

    setProducts(customList);

    // Trigger sweet feedback
    setSuccessAnimation(true);
    setTimeout(() => {
      setSuccessAnimation(false);
      setAddModalOpen(false);
      
      // Reset input fields
      setNewProdName('');
      setNewProdPrice('');
      setNewProdStock('');
      setNewProdDesc('');
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#f7faf6] pb-16 font-sans">
      
      {/* Upper banner container */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white px-8 py-7 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 mb-1 bg-white/10 px-3 py-1 rounded-full w-fit">
            <Award className="w-3.5 h-3.5 text-emerald-300" />
            <span className="text-[10px] text-emerald-100 tracking-wider font-extrabold uppercase">certified sourced farmer console</span>
          </div>
          <h1 className="font-serif font-black text-2xl tracking-normal" id="store-title">{sellerInfo.storeName}</h1>
          <p className="text-xs text-emerald-100/70 mt-1 leading-normal">
            Operator: <span className="font-bold underline text-white">{sellerInfo.sellerName}</span> &middot; Location: {sellerInfo.province} &middot; Status: <span className="text-emerald-300 font-bold">Approved Live</span>
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button 
            onClick={() => setAddModalOpen(true)}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 font-bold rounded-full text-xs text-white cursor-pointer transition shadow-md flex items-center gap-1.5 active:scale-95"
            id="seller-add-product-btn"
          >
            <Plus className="w-4 h-4" /> Add Fresh Crop Product
          </button>
          
          <button 
            onClick={onBackToStore}
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 font-bold rounded-full text-xs text-white cursor-pointer transition border border-white/15 flex items-center gap-1.5 active:scale-95"
          >
            🏠 Return to Main Market View
          </button>
        </div>
      </div>

      {/* KPI Stats metrics board */}
      <div className="mx-[5vw] mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border rounded-2xl p-4 flex items-center gap-3.5 border-slate-150 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-serif font-black text-slate-850 leading-tight">$3,241.00</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Your Revenue</p>
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-4 flex items-center gap-3.5 border-slate-150 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-serif font-black text-slate-850 leading-tight">84</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Fulfillments Completed</p>
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-4 flex items-center gap-3.5 border-slate-150 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Star className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-serif font-black text-slate-850 leading-tight">4.91</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Store Average Rating</p>
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-4 flex items-center gap-3.5 border-slate-150 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold font-serif">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-serif font-black text-slate-850 leading-tight">{8 + products.length}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Active Crops Listed</p>
          </div>
        </div>

      </div>

      <div className="mx-[5vw] mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* LEFTSIDE: Your active crop catalog table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-150 shadow-xs overflow-hidden">
            
            <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
              <div>
                <h3 className="font-serif font-black text-sm text-slate-850">Your Direct Crop Shelf</h3>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">All products listed by you are visible for instant checkout purchase.</p>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border px-3 py-1 rounded-full border-emerald-100">
                {products.length} custom crop listed
              </span>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#f0f4f0]/20 text-slate-400 uppercase font-black text-[9px] tracking-wider border-b">
                    <th className="p-4">Crop Cover</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price / Unit</th>
                    <th className="p-4">Simulated Stock</th>
                    <th className="p-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-16 text-center text-slate-400">
                        <ImageIcon className="w-10 h-10 mx-auto text-slate-350 stroke-1 mb-2.5" />
                        <h4 className="font-bold text-slate-700">No custom crops listed yet</h4>
                        <p className="text-[11px] max-w-xs mx-auto">Click "Add Fresh Crop Product" of the banner above to populate your storefront shelf.</p>
                      </td>
                    </tr>
                  ) : (
                    products.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4">
                          <div className="flex items-center gap-3.5">
                            <img src={p.imageUrl} alt={p.name} className="w-11 h-11 object-cover rounded-lg shadow-xs shrink-0 border" />
                            <div>
                              <div className="font-bold text-slate-850">{p.name}</div>
                              <div className="text-[10px] text-slate-400">{p.sourceFarm} &middot; {p.location}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-bold uppercase text-[9px]">
                            {p.category}
                          </span>
                        </td>
                        <td className="p-4 font-extrabold text-slate-800 text-[13px]">${p.price.toFixed(2)}</td>
                        <td className="p-4 font-bold text-slate-500">
                          {p.stockCount !== undefined ? `${p.stockCount} ${p.unit}` : `500 ${p.unit}`}
                        </td>
                        <td className="p-4 text-right">
                          <span className="px-2 py-0.8 rounded-full font-black uppercase text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-100 inline-block">
                            Live on shelf
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>

        {/* RIGHTSIDE: Quick tutorial & Cooperative policies news */}
        <div className="space-y-4">
          
          <div className="bg-[#fdf9f4] rounded-2xl border border-amber-100 p-5 shadow-xs space-y-3 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600 animate-spin" />
              <h4 className="font-serif font-black text-amber-850">Direct Harvest Seller Rules</h4>
            </div>
            
            <p className="text-amber-800/85 leading-relaxed">
              Moutanak cooperative rules require that all crops listed must be hand-harvested within 24 hours of delivery. Keep your simulated stock quantities accurate to avoid distribution delays.
            </p>

            <div className="pt-2 border-t border-amber-100/50 space-y-1.5 flex flex-col">
              <span className="font-bold text-[11px] text-amber-900 uppercase tracking-wider block">Cooperative Benefits</span>
              <span className="text-amber-850 font-medium">✓ Base commission fee of just 2%</span>
              <span className="text-amber-850 font-medium">✓ Immediate ABA bank payouts every Friday</span>
              <span className="text-amber-850 font-medium">✓ Wood reusable hampers support zero packaging waste</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-150 p-5 shadow-xs space-y-3 text-xs">
            <h4 className="font-serif font-black text-slate-800">Support Coordinate Settle</h4>
            <p className="text-slate-400 font-semibold leading-relaxed">
              A dedicated farmstead consultant has been assigned to support {sellerInfo.storeName}. If you need help with shipping weights or certifications, feel free to phone us.
            </p>
            <div className="p-3 bg-slate-50 border rounded-xl flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-xs text-emerald-800">KH</div>
              <div>
                <p className="font-bold text-slate-800">Kiri Hor</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Your Sourced Settle Consultant</p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ADDFORM MODAL DIALOG POPUP */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-55 p-4 animate-scaleUp">
          <div className="bg-white rounded-[24px] w-full max-w-lg shadow-2xl overflow-hidden relative border border-slate-100 flex flex-col">
            
            <div className="px-6 py-4.5 bg-[#fcf9f4] border-b flex items-center justify-between">
              <div>
                <h3 className="font-serif font-black text-lg text-slate-850">Publish Fresh Crop listing</h3>
                <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">Publish to live customer storefront</p>
              </div>
              <button 
                onClick={() => setAddModalOpen(false)}
                className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {successAnimation ? (
              <div className="p-12 text-center space-y-3 py-20 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2.5">
                  <PackageCheck className="w-8 h-8 text-emerald-500 animate-bounce" />
                </div>
                <h4 className="font-serif font-black text-slate-800 text-lg">Crop Published Successfully!</h4>
                <p className="text-xs text-slate-400">Adding your harvest to Moutanak directory shelf index...</p>
              </div>
            ) : (
              <form onSubmit={handleAddProductSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto no-scrollbar">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 block uppercase">Crop Product Name *</label>
                    <input 
                      type="text" 
                      required
                      value={newProdName}
                      onChange={e => setNewProdName(e.target.value)}
                      placeholder="e.g. Sourced Organic Bok Choy" 
                      className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs outline-none focus:bg-white transition font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 block uppercase">Category *</label>
                    <select 
                      value={newProdCategory}
                      onChange={e => setNewProdCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs outline-none focus:bg-white transition"
                    >
                      <option value="vegetable">🥦 Vegetable</option>
                      <option value="fruit">🍎 Fruit</option>
                      <option value="dairy">🥛 Dairy</option>
                      <option value="grain">🌾 Grain</option>
                      <option value="herb">🌿 Herb</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 block uppercase">Price (USD) *</label>
                    <input 
                      type="number" 
                      step="0.01"
                      required
                      value={newProdPrice}
                      onChange={e => setNewProdPrice(e.target.value)}
                      placeholder="e.g. 1.25" 
                      className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs outline-none focus:bg-white transition font-bold text-emerald-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 block uppercase font-sans">Simulated Stock Qty *</label>
                    <div className="flex border rounded-xl overflow-hidden bg-slate-50 text-xs">
                      <input 
                        type="number" 
                        required
                        value={newProdStock}
                        onChange={e => setNewProdStock(e.target.value)}
                        placeholder="e.g. 150" 
                        className="w-full px-3 py-2 bg-transparent outline-none focus:bg-white transition font-bold"
                      />
                      <select 
                        value={newProdUnit}
                        onChange={e => setNewProdUnit(e.target.value)}
                        className="bg-slate-100 border-l px-2 font-bold text-slate-500"
                      >
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                        <option value="bunch">bunch</option>
                        <option value="piece">piece</option>
                        <option value="bottle">bottle</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block uppercase">Category Preset Image Cover</label>
                  <div className="grid grid-cols-3 gap-2">
                    {presetCropCovers.map((cover, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setNewProdPresetImage(cover.url)}
                        className={`p-1 bg-slate-50 hover:bg-slate-100 border rounded-xl text-center space-y-1 text-[9px] font-medium block truncate ${
                          newProdPresetImage === cover.url ? 'ring-2 ring-emerald-500 bg-emerald-50/40 border-emerald-300 font-extrabold' : ''
                        }`}
                      >
                        <img src={cover.url} className="w-full h-11 object-cover rounded-md mb-1 border" />
                        <span>{cover.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block uppercase">Product Description *</label>
                  <textarea 
                    rows={3}
                    required
                    value={newProdDesc}
                    onChange={e => setNewProdDesc(e.target.value)}
                    placeholder="Describe crop attributes (organically cultivated with shade nettings, perfect flavor, etc.)"
                    className="w-full px-4 py-2 bg-slate-50 border rounded-xl text-xs outline-none focus:bg-white transition leading-normal"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition cursor-pointer shadow shadow-emerald-600/10 active:scale-98"
                >
                  Publish Harvest to Directory
                </button>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
