import React, { useState } from 'react';
import { Product } from '../types';
import { 
  Plus, 
  Search, 
  Tag, 
  Trash2, 
  Edit3, 
  Check, 
  AlertTriangle,
  X,
  Package,
  Boxes,
  Compass
} from 'lucide-react';

interface ProductsViewProps {
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id' | 'salesCount'>) => void;
  onUpdateProduct: (id: string, updates: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
}

export default function ProductsView({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct
}: ProductsViewProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [isAddFormOpen, setIsAddFormOpen] = useState<boolean>(false);

  // New product form states
  const [newProdName, setNewProdName] = useState<string>('');
  const [newProdSku, setNewProdSku] = useState<string>('');
  const [newProdSeller, setNewProdSeller] = useState<string>('');
  const [newProdCategory, setNewProdCategory] = useState<string>('');
  const [newProdPrice, setNewProdPrice] = useState<string>('');
  const [newProdStock, setNewProdStock] = useState<string>('');

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>('');
  const [editStock, setEditStock] = useState<string>('');

  const categories = Array.from(new Set(products.map(p => p.category)));

  // Filter inventory list
  const filteredProducts = products.filter(p => {
    const searchMatch = !searchTerm || 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sellerName.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = !filterCategory || p.category === filterCategory;
    return searchMatch && categoryMatch;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdSku || !newProdSeller || !newProdCategory || !newProdPrice || !newProdStock) {
      alert('Please fill out all product details.');
      return;
    }

    onAddProduct({
      name: newProdName,
      sku: newProdSku,
      sellerName: newProdSeller,
      category: newProdCategory,
      price: parseFloat(newProdPrice) || 0,
      stock: parseInt(newProdStock) || 0,
      status: parseInt(newProdStock) === 0 ? 'out_of_stock' : (parseInt(newProdStock) < 20 ? 'low_stock' : 'active')
    });

    // Reset fields
    setNewProdName('');
    setNewProdSku('');
    setNewProdSeller('');
    setNewProdCategory('');
    setNewProdPrice('');
    setNewProdStock('');
    setIsAddFormOpen(false);
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setEditPrice(p.price.toString());
    setEditStock(p.stock.toString());
  };

  const saveEdit = (id: string) => {
    const p = parseFloat(editPrice) || 0;
    const s = parseInt(editStock) || 0;
    
    let stateStatus: Product['status'] = 'active';
    if (s === 0) stateStatus = 'out_of_stock';
    else if (s < 25) stateStatus = 'low_stock';

    onUpdateProduct(id, { 
      price: p, 
      stock: s, 
      status: stateStatus 
    });
    setEditingId(null);
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-emerald-950 leading-tight">Product Inventory</h1>
          <p className="text-sm font-medium text-emerald-700/80 mt-1">Audit listed agricultural crops, adjust stock limits, and register entries</p>
        </div>
        <button 
          onClick={() => setIsAddFormOpen(true)}
          className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-full px-5 py-2.5 flex items-center gap-1.5 shadow-sm transition-transform hover:-translate-y-0.5 self-start sm:self-center"
        >
          <Plus className="w-4.5 h-4.5" /> Register Product
        </button>
      </div>

      {/* Grid summarizing Inventory level */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border p-3.5 rounded-xl text-center shadow-2xs">
          <span className="block text-[8.5px] font-black text-slate-400 uppercase tracking-widest">Active catalog size</span>
          <span className="text-xl font-serif font-bold text-slate-800 mt-1 block">{products.length} Items</span>
        </div>
        <div className="bg-white border p-3.5 rounded-xl text-center shadow-2xs">
          <span className="block text-[8.5px] font-black text-slate-400 uppercase tracking-widest">Out of stock</span>
          <span className="text-xl font-serif font-bold text-rose-650 mt-1 block">{products.filter(p => p.stock === 0).length} Items</span>
        </div>
        <div className="bg-white border p-3.5 rounded-xl text-center shadow-2xs">
          <span className="block text-[8.5px] font-black text-slate-400 uppercase tracking-widest">Low stock alerts</span>
          <span className="text-xl font-serif font-bold text-amber-600 mt-1 block">{products.filter(p => p.status === 'low_stock').length} Items</span>
        </div>
        <div className="bg-white border p-3.5 rounded-xl text-center shadow-2xs">
          <span className="block text-[8.5px] font-black text-slate-400 uppercase tracking-widest">Aggregate units stock</span>
          <span className="text-xl font-serif font-bold text-emerald-700 mt-1 block">
            {products.reduce((sum, p) => sum + p.stock, 0).toLocaleString()} Units
          </span>
        </div>
      </div>

      {/* Search and Filters Strip */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-800/60" />
          <input 
            type="text" 
            placeholder="Search crop, commodity name, SKU, or seller cooperative..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-emerald-100 rounded-xl text-xs outline-none focus:border-emerald-500 text-emerald-950 shadow-2xs placeholder:text-slate-400"
          />
        </div>

        <select 
          value={filterCategory} 
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3.5 py-2 bg-white border border-emerald-100 text-xs text-slate-700 font-semibold rounded-xl outline-none focus:border-emerald-500 shadow-2xs min-w-44"
        >
          <option value="">Filter by Category: All</option>
          {categories.map((c, idx) => (
            <option key={idx} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Main Products Table card */}
      <div className="bg-white border border-emerald-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-emerald-50/50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-5">Product SKU Info</th>
                <th className="py-3 px-5">Merchant Store Co-Op</th>
                <th className="py-3 px-5">Category</th>
                <th className="py-3 px-5">Price</th>
                <th className="py-3 px-5">Stock Level</th>
                <th className="py-3 px-5 text-center">Status</th>
                <th className="py-3 px-5 text-right">Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => {
                  const isEditing = editingId === p.id;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg ${p.imageColor || 'bg-emerald-50'} text-slate-700 font-bold flex items-center justify-center font-mono text-xs flex-shrink-0 border border-slate-100`}>
                            {p.sku.split('-')[1]?.substring(0, 2) || 'PR'}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 leading-tight">{p.name}</div>
                            <div className="text-[9.5px] font-mono font-bold text-sky-600 mt-0.5">{p.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 font-semibold text-slate-650">{p.sellerName}</td>
                      <td className="py-3.5 px-5">
                        <span className="text-[9.5px] font-black uppercase text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          <Tag className="w-3 h-3" /> {p.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 font-bold text-slate-800">
                        {isEditing ? (
                          <div className="flex items-center gap-1 max-w-20">
                            <span className="text-slate-400">$</span>
                            <input 
                              type="number" 
                              step="0.01"
                              value={editPrice}
                              onChange={(e) => setEditPrice(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 outline-none p-1 px-1.5 rounded-sm font-semibold text-xs"
                            />
                          </div>
                        ) : (
                          `$${p.price.toFixed(2)}`
                        )}
                      </td>
                      <td className="py-3.5 px-5">
                        {isEditing ? (
                          <input 
                            type="number" 
                            value={editStock}
                            onChange={(e) => setEditStock(e.target.value)}
                            className="w-16 bg-slate-50 border border-slate-200 outline-none p-1 px-1.5 rounded-sm font-semibold text-xs text-center"
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800">{p.stock}</span>
                            {p.stock === 0 && <span className="text-[9px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">Empty</span>}
                            {p.stock > 0 && p.stock < 25 && <span className="text-[9px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded inline-flex items-center gap-0.5"><AlertTriangle className="w-2.5 h-2.5" /> Low</span>}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        <span className={`badge ${
                          p.status === 'active' ? 'bg' : p.status === 'low_stock' ? 'ba' : 'br2'
                        }`}>
                          {p.status === 'active' ? 'Active' : p.status === 'low_stock' ? 'Low Stock' : 'OOS'}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        {isEditing ? (
                          <div className="flex justify-end gap-1.5">
                            <button 
                              onClick={() => saveEdit(p.id)}
                              className="p-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-bold text-[10px] flex items-center gap-0.5 transition-colors shadow-2xs"
                            >
                              <Check className="w-3.5 h-3.5" /> Save
                            </button>
                            <button 
                              onClick={() => setEditingId(null)}
                              className="p-1 px-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-md font-bold text-[10px] flex items-center transition-colors border"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-1.5">
                            <button 
                              onClick={() => startEdit(p)}
                              className="p-1.5 bg-slate-50 text-slate-650 hover:bg-slate-100 rounded-lg border border-slate-150 transition-colors"
                              title="Edit item"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => { if(confirm('Delete product item from store listing permanently?')) onDeleteProduct(p.id); }}
                              className="p-1.5 bg-rose-50/50 text-rose-700 hover:bg-rose-500 hover:text-white rounded-lg border border-rose-100 transition-colors"
                              title="Delete item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 px-5 text-center text-slate-400">
                    No matching product items located.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RENDER ADD PRODUCT FORM OVERLAY MODAL */}
      {isAddFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-emerald-100 overflow-hidden">
            <div className="bg-slate-50 px-5 py-4 border-b border-slate-150 flex items-center justify-between">
              <h2 className="text-sm font-bold font-serif text-emerald-950 flex items-center gap-1.5">
                <Boxes className="w-4.5 h-4.5" /> Register Product Item
              </h2>
              <button 
                onClick={() => setIsAddFormOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-500 flex items-center justify-center border"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Crop / Product Item Title</label>
                <input 
                  type="text" 
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. Cardamom Spices Organic Takeo"
                  className="w-full bg-slate-50 border rounded-lg p-2 text-xs outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Inventory SKU</label>
                  <input 
                    type="text" 
                    value={newProdSku}
                    onChange={(e) => setNewProdSku(e.target.value)}
                    placeholder="e.g. SKU-00100"
                    className="w-full bg-slate-50 border rounded-lg p-2 text-xs outline-none font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Category Tag</label>
                  <select 
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full bg-slate-50 border rounded-lg p-2 text-xs outline-none"
                  >
                    <option value="">Select Category</option>
                    <option value="Spices">Spices</option>
                    <option value="Grains">Grains</option>
                    <option value="Crafts">Crafts</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Origin Seller Cooperative</label>
                <input 
                  type="text" 
                  value={newProdSeller}
                  onChange={(e) => setNewProdSeller(e.target.value)}
                  placeholder="e.g. Vanna's Spicy Farm"
                  className="w-full bg-slate-50 border rounded-lg p-2 text-xs outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Baseline Price ($ USD)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    placeholder="e.g. 15.00"
                    className="w-full bg-slate-50 border rounded-lg p-2 text-xs outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Stock Units Count</label>
                  <input 
                    type="number" 
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    placeholder="e.g. 150"
                    className="w-full bg-slate-50 border rounded-lg p-2 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2 text-xs">
                <button 
                  type="button"
                  onClick={() => setIsAddFormOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-slate-50 text-slate-500 font-bold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors shadow-2xs"
                >
                  Register Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
