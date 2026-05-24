/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Star, MapPin, ShoppingCart, HelpCircle } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (prod: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const {
    name,
    description,
    price,
    prevPrice,
    category,
    imageUrl,
    sourceFarm,
    location,
    rating,
    reviewsCount,
    weight,
    unit
  } = product;

  return (
    <div 
      className="product-card bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden group relative transition duration-300"
      id={`product-card-${product.id}`}
    >
      {/* Category micro badge */}
      <span className="absolute top-3 left-3 z-10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg text-emerald-800 bg-white/90 backdrop-blur-xs border border-emerald-100/50">
        {category}
      </span>

      {/* Sale micro badge */}
      {prevPrice && (
        <span className="absolute top-3 right-3 z-10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg text-white bg-orange-500 shadow-md">
          {Math.round(((prevPrice - price) / prevPrice) * 100)}% off
        </span>
      )}

      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Origin farm & Rating */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-1">
          <span className="flex items-center gap-1 text-emerald-700 font-bold">
            <MapPin className="w-3 h-3 text-emerald-500" />
            {location}
          </span>
          <span className="flex items-center gap-0.5 text-amber-500 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
            <Star className="w-3 h-3 fill-amber-500 stroke-amber-500" />
            {rating.toFixed(1)}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-slate-800 text-sm group-hover:text-emerald-700 transition line-clamp-1 mb-1">
          {name}
        </h3>
        
        {/* Description */}
        <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 mb-3">
          {description}
        </p>

        {/* Weight Unit Marker & Farm */}
        <div className="mt-auto mb-3 flex items-center justify-between border-t border-slate-50 pt-2 text-[11px]">
          <span className="font-semibold text-slate-500">
            {sourceFarm}
          </span>
          <span className="bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full">
            {weight} {unit}
          </span>
        </div>

        {/* Price & Action Button */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-slate-900 font-mono">
                ${price.toFixed(2)}
              </span>
              {prevPrice && (
                <span className="text-xs font-semibold text-slate-400 line-through font-mono">
                  ${prevPrice.toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold text-slate-400 capitalize">
              per {unit}
            </span>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            className="add-btn p-2.5 rounded-xl text-white shadow-md cursor-pointer hover:shadow-lg transition duration-300 flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 active:scale-95"
            id={`add-to-cart-btn-${product.id}`}
            title="Add to cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
