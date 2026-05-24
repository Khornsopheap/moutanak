import React, { useState } from 'react';
import { Order, OrderItem } from '../types';
import { 
  ShoppingBag, 
  Search, 
  MapPin, 
  Compass, 
  Eye, 
  CheckCircle, 
  TrendingUp, 
  Check, 
  X,
  CreditCard,
  FileSpreadsheet
} from 'lucide-react';

interface OrdersViewProps {
  orders: Order[];
  onUpdateOrderStatus: (id: string, status: Order['status']) => void;
}

export default function OrdersView({
  orders,
  onUpdateOrderStatus
}: OrdersViewProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Filter orders
  const filteredOrders = orders.filter(o => {
    const searchMatch = !searchTerm || 
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.id.includes(searchTerm) ||
      o.sellerName.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = !filterStatus || o.status === filterStatus;
    return searchMatch && statusMatch;
  });

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-50 text-emerald-800 border-emerald-100';
      case 'Pending': return 'bg-amber-50 text-amber-800 border-amber-150';
      case 'Shipped': return 'bg-blue-50 text-blue-850 border-blue-150';
      case 'Cancelled': return 'bg-rose-50 text-rose-800 border-rose-100';
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-emerald-950 leading-tight">Customer Orders</h1>
          <p className="text-sm font-medium text-emerald-700/80 mt-1">Track marketplace checkout flows, inspect item receipts, and manage shipping queues</p>
        </div>
      </div>

      {/* Highlights metrics strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border p-4 rounded-xl shadow-2xs text-center">
          <span className="block text-[8.5px] font-bold text-slate-400 uppercase tracking-widest">Aggregated checkout</span>
          <span className="text-lg font-bold text-slate-800 block mt-1">{orders.length} orders</span>
        </div>
        <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-xl text-center">
          <span className="block text-[8.5px] font-bold text-slate-500 uppercase tracking-widest">Awaiting Courier</span>
          <span className="text-lg font-bold text-amber-700 block mt-1">{orders.filter(o => o.status === 'Pending').length} pending</span>
        </div>
        <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl text-center">
          <span className="block text-[8.5px] font-bold text-slate-500 uppercase tracking-widest">En route shipped</span>
          <span className="text-lg font-bold text-blue-700 block mt-1">{orders.filter(o => o.status === 'Shipped').length} shipped</span>
        </div>
        <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl text-center">
          <span className="block text-[8.5px] font-bold text-slate-500 uppercase tracking-widest">Completed trades</span>
          <span className="text-lg font-bold text-emerald-700 block mt-1">{orders.filter(o => o.status === 'Completed').length} orders</span>
        </div>
      </div>

      {/* Filter and Control triggers */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-800/60" />
          <input 
            type="text" 
            placeholder="Search bookings by Order ID #... buyer name, or seller brand..."
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
          <option value="Pending">⌛ Pending</option>
          <option value="Shipped">📦 Shipped</option>
          <option value="Completed">✅ Completed</option>
          <option value="Cancelled">❌ Cancelled</option>
        </select>
      </div>

      {/* Main layout contents columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Orders list container */}
        <div className={`${selectedOrder ? 'lg:col-span-7' : 'lg:col-span-12'} bg-white border border-emerald-100 rounded-2xl shadow-sm overflow-hidden transition-all duration-300`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-emerald-50/50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Basket size</th>
                  <th className="py-3 px-4">Total Price</th>
                  <th className="py-3 px-4">Cooperative</th>
                  <th className="py-3 px-4">Booking Date</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-[12px]">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((o) => (
                    <tr 
                      key={o.id} 
                      onClick={() => setSelectedOrder(o)}
                      className={`hover:bg-emerald-50/20 cursor-pointer transition-colors ${
                        selectedOrder?.id === o.id ? 'bg-emerald-50/40' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-serif font-bold text-emerald-800">#{o.id}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{o.customerName}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{o.province}</div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-600">{o.itemsCount} items</td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">${o.total.toFixed(2)}</td>
                      <td className="py-3.5 px-4 text-slate-500 font-semibold">{o.sellerName}</td>
                      <td className="py-3.5 px-4 text-slate-450 font-medium">{new Date(o.date).toLocaleDateString()}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`badge border ${getStatusBadge(o.status)}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-emerald-800 group-hover:underline">
                        Receipt
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-12 px-4 text-center text-slate-400">
                      No matching checkout orders historical books found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Order Detailed Drawer inspector */}
        {selectedOrder && (
          <div className="lg:col-span-5 bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm space-y-4 animate-fade-in self-start relative">
            <button 
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-xs font-bold bg-slate-100 hover:bg-slate-200 border rounded-lg px-2 py-1 text-slate-500 transition-colors"
            >
              Close
            </button>
            
            {/* Header info */}
            <div>
              <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">Order Invoice</span>
              <h3 className="text-lg font-serif font-black text-emerald-950 mt-2">Order #{selectedOrder.id}Receipt</h3>
              <p className="text-[11px] font-medium text-slate-400">Placed on {new Date(selectedOrder.date).toLocaleString()}</p>
            </div>

            {/* Status controller board */}
            <div className="bg-slate-50 border rounded-xl p-3.5 space-y-2.5">
              <span className="block text-[8.5px] font-bold text-slate-400 uppercase tracking-widest">Update Order Shipping Queue</span>
              
              <div className="grid grid-cols-2 gap-1.5 text-2xs font-bold font-serif">
                <button 
                  onClick={() => { onUpdateOrderStatus(selectedOrder.id, 'Shipped'); setSelectedOrder(prev => prev ? {...prev, status: 'Shipped'} : null); }}
                  className="py-1.5 bg-blue-50 text-blue-800 hover:bg-blue-600 hover:text-white rounded border border-blue-100 transition-colors"
                >
                  🚚 Set Shipped
                </button>
                <button 
                  onClick={() => { onUpdateOrderStatus(selectedOrder.id, 'Completed'); setSelectedOrder(prev => prev ? {...prev, status: 'Completed'} : null); }}
                  className="py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-600 hover:text-white rounded border border-emerald-100 transition-colors"
                >
                  ✅ Set Completed
                </button>
                <button 
                  onClick={() => { onUpdateOrderStatus(selectedOrder.id, 'Pending'); setSelectedOrder(prev => prev ? {...prev, status: 'Pending'} : null); }}
                  className="py-1.5 bg-amber-50 text-amber-800 hover:bg-amber-600 hover:text-white rounded border border-amber-100 transition-colors"
                >
                  ⌛ Set Pending
                </button>
                <button 
                  onClick={() => { onUpdateOrderStatus(selectedOrder.id, 'Cancelled'); setSelectedOrder(prev => prev ? {...prev, status: 'Cancelled'} : null); }}
                  className="py-1.5 bg-rose-50 text-rose-800 hover:bg-rose-600 hover:text-white rounded border border-rose-100 transition-colors"
                >
                  ❌ Set Cancelled
                </button>
              </div>
            </div>

            {/* Customer Details segment */}
            <div className="space-y-1 text-xs text-slate-600 font-medium">
              <span className="block text-[8.5px] font-bold text-slate-455 uppercase tracking-widest mb-1">Customer Delivery Coordinates</span>
              <div><strong className="text-slate-800">Receiver name:</strong> {selectedOrder.customerName}</div>
              <div><strong className="text-slate-800">Province location:</strong> {selectedOrder.province} Province</div>
              <div><strong className="text-slate-800">Phone record:</strong> +855 {selectedOrder.phone}</div>
            </div>

            {/* Merchant Details segment */}
            <div className="space-y-1 text-xs text-slate-600 font-medium pt-3 border-t border-slate-50">
              <span className="block text-[8.5px] font-bold text-slate-455 uppercase tracking-widest mb-1">Assigned Seller Co-op</span>
              <div><strong className="text-slate-800">Store Brand:</strong> {selectedOrder.sellerName}</div>
            </div>

            {/* Items Bought details ledger list */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <span className="block text-[8.5px] font-bold text-slate-400 uppercase tracking-widest">Receipt Items Details</span>
              
              <div className="space-y-2.5 max-h-44 overflow-y-auto pr-1">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start text-xs font-semibold hover:bg-slate-50 p-1.5 rounded transition-colors group">
                    <div className="max-w-xs">
                      <div className="text-slate-800 leading-normal group-hover:text-emerald-700 transition-colors">{item.name}</div>
                      <div className="text-[10px] text-slate-400 font-medium mt-0.5">Qty {item.qty} &bull; ${item.price.toFixed(2)} each</div>
                    </div>
                    <span className="text-slate-800 font-bold">${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Dynamic calculations values */}
              <div className="border-t border-slate-100 pt-3 space-y-1.5 font-bold text-xs text-slate-600">
                <div className="flex justify-between font-normal text-slate-450">
                  <span>Subtotal Amount</span>
                  <span>${selectedOrder.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-normal text-slate-450">
                  <span>Delivery (Phnom Penh express)</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between text-emerald-950 text-sm border-t border-dashed border-slate-150 pt-2 font-black font-serif">
                  <span className="flex items-center gap-1"><CreditCard className="w-4 h-4 text-emerald-600" strokeWidth={2.5} /> Net Total</span>
                  <span>${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
