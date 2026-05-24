import React, { useState } from 'react';
import { Review } from '../types';
import { 
  Star, 
  Search, 
  Trash2, 
  Check, 
  AlertOctagon, 
  Flame, 
  MessageCircleOff,
  Percent,
  TrendingDown
} from 'lucide-react';

interface ReviewsViewProps {
  reviews: Review[];
  onUpdateReviewStatus: (id: string, status: Review['status']) => void;
  onDeleteReview: (id: string) => void;
}

export default function ReviewsView({
  reviews,
  onUpdateReviewStatus,
  onDeleteReview
}: ReviewsViewProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterRating, setFilterRating] = useState<number>(0);
  const [filterStatus, setFilterStatus] = useState<string>('');

  // Search logic
  const filteredReviews = reviews.filter(rev => {
    const searchMatch = !searchTerm || 
      rev.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rev.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rev.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const ratingMatch = filterRating === 0 || rev.rating === filterRating;
    const statusMatch = !filterStatus || rev.status === filterStatus;
    
    return searchMatch && ratingMatch && statusMatch;
  });

  // Calculate stats for Rating breakdown
  const ratingDetailsSum = (r: number) => reviews.filter(rev => rev.rating === r).length;
  const ratingDetailsPercent = (r: number) => {
    if (reviews.length === 0) return 0;
    return Math.round((ratingDetailsSum(r) / reviews.length) * 100);
  };

  const getStatusBadge = (status: Review['status']) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-50 text-emerald-800 border-emerald-150';
      case 'Pending': return 'bg-amber-50 text-amber-800 border-amber-150';
      case 'Flagged': return 'bg-rose-50 text-rose-800 border-rose-150';
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-emerald-950 leading-tight">Product Reviews</h1>
          <p className="text-sm font-medium text-emerald-700/80 mt-1">Audit customer shopping comments, flag malicious spam links, and maintain platform trust</p>
        </div>
      </div>

      {/* Rating Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Breakdown bars */}
        <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm lg:col-span-2 space-y-3">
          <h3 className="text-sm font-bold font-serif text-emerald-950 border-b border-slate-55 pb-2.5 flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> Star Rating Frequency Breakdown
          </h3>

          <div className="space-y-2.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const pct = ratingDetailsPercent(star);
              const count = ratingDetailsSum(star);

              return (
                <div key={star} className="flex items-center gap-3 text-xs font-semibold">
                  <div className="flex items-center gap-1 w-12 text-slate-650">
                    <span>{star}</span>
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  </div>
                  
                  {/* Progress bar container */}
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        star >= 4 ? 'bg-emerald-500' : star === 3 ? 'bg-amber-400' : 'bg-rose-500'
                      }`} 
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="w-16 text-right text-slate-400 flex justify-between">
                    <span>{pct}%</span>
                    <span>({count})</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Spam indicators widget */}
        <div className="bg-rose-50/10 border border-rose-100/70 p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-black text-rose-800 uppercase tracking-widest flex items-center gap-1.5 mb-2.5">
              <AlertOctagon className="w-4 h-4 text-rose-600" /> Spam Alert triggers
            </h3>
            <p className="text-xs text-rose-900/75 leading-relaxed font-semibold">
              The automated filter monitors for links (http/https) and spam indicators. Block actions flagged comments instantly to ensure absolute shopper credibility.
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-rose-100/50 flex justify-between items-center text-xs font-bold text-rose-855">
            <span>🔴 High Flagged Spam alert:</span>
            <span>{reviews.filter(r => r.status === 'Flagged').length} reviews in queue</span>
          </div>
        </div>

      </div>

      {/* Constraints, Search and filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-800/60" />
          <input 
            type="text" 
            placeholder="Search reviews by comment keyword, product name, or consumer reviewer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-emerald-100 rounded-xl text-xs outline-none focus:border-emerald-500 text-emerald-950 shadow-2xs placeholder:text-slate-400"
          />
        </div>

        {/* Rating selection */}
        <select 
          value={filterRating} 
          onChange={(e) => setFilterRating(parseInt(e.target.value) || 0)}
          className="px-3.5 py-2 bg-white border border-emerald-100 text-xs text-slate-700 font-semibold rounded-xl outline-none focus:border-emerald-500 shadow-2xs min-w-36"
        >
          <option value="0">All Ratings</option>
          <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
          <option value="4">⭐⭐⭐⭐ 4 Stars</option>
          <option value="3">⭐⭐⭐ 3 Stars</option>
          <option value="2">⭐⭐ 2 Stars</option>
          <option value="1">⭐ 1 Star</option>
        </select>

        {/* Status selection */}
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3.5 py-2 bg-white border border-emerald-100 text-xs text-slate-700 font-semibold rounded-xl outline-none focus:border-emerald-500 shadow-2xs min-w-36"
        >
          <option value="">All Statuses</option>
          <option value="Approved">✅ Approved</option>
          <option value="Pending">⌛ Pending</option>
          <option value="Flagged">❌ Flagged</option>
        </select>
      </div>

      {/* Reviews listing table */}
      <div className="bg-white border border-emerald-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-emerald-50/50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-5">Target Product Item</th>
                <th className="py-3 px-5">Buyer Reviewer</th>
                <th className="py-3 px-5">Customers Rating</th>
                <th className="py-3 px-5">Comment details</th>
                <th className="py-3 px-5 text-center">Audit Status</th>
                <th className="py-3 px-5 text-right">Intermediary Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredReviews.length > 0 ? (
                filteredReviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-slate-800 max-w-xs truncate">{rev.productName}</td>
                    <td className="py-3.5 px-5">
                      <div className="font-semibold text-slate-900">{rev.customerName}</div>
                      <div className="text-[10px] text-slate-400">{new Date(rev.date).toLocaleDateString()}</div>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                            }`} 
                          />
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-slate-650 max-w-sm font-medium leading-relaxed font-serif text-[11px]">
                      {rev.comment}
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <span className={`badge border ${getStatusBadge(rev.status)}`}>
                        {rev.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex justify-end gap-1.5">
                        {rev.status !== 'Approved' && (
                          <button 
                            onClick={() => onUpdateReviewStatus(rev.id, 'Approved')}
                            className="p-1 px-2.5 bg-emerald-50 border border-emerald-100 text-emerald-800 hover:bg-emerald-600 hover:text-white hover:border-transparent rounded font-bold text-[10px] transition-colors"
                            title="Approve review comment"
                          >
                            <Check className="w-3 h-3" /> Approve
                          </button>
                        )}
                        {rev.status !== 'Flagged' && (
                          <button 
                            onClick={() => onUpdateReviewStatus(rev.id, 'Flagged')}
                            className="p-1 px-2.5 bg-rose-50 border border-rose-100 text-rose-800 hover:bg-rose-500 hover:text-white hover:border-transparent rounded font-bold text-[10px] transition-colors"
                            title="Flag comment as spam"
                          >
                            <Flame className="w-3 h-3" /> Spam
                          </button>
                        )}
                        <button 
                          onClick={() => { if(confirm('Delete customer review comment permanently from store books?')) onDeleteReview(rev.id); }}
                          className="p-1 px-1 text-slate-400 hover:text-rose-600 rounded border hover:bg-slate-50 transition-colors"
                          title="Delete review permanently"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 px-5 text-center text-slate-400">
                    No customer product reviews located in database conditions.
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
