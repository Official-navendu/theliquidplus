'use client';

import * as React from 'react';
import { Heart, ShoppingBag, RefreshCw, Share2, Shield, Truck, Award, RotateCcw } from 'lucide-react';
import { Product } from '../constants/products';

interface ProductInfoProps {
  product: Product;
}

const sizes = [
  { label: '500ml', multiplier: 1.0 },
  { label: '1 Litre', multiplier: 1.8 },
  { label: '5 Litres', multiplier: 6.5 },
];

export function ProductInfo({ product }: ProductInfoProps) {
  const [selectedSize, setSelectedSize] = React.useState('500ml');
  const [quantity, setQuantity] = React.useState(1);

  const activeSize = sizes.find((s) => s.label === selectedSize) || sizes[0];
  const calculatedPrice = product.price * activeSize.multiplier;
  const calculatedComparePrice = product.compareAtPrice
    ? product.compareAtPrice * activeSize.multiplier
    : undefined;

  const discountPercent = calculatedComparePrice
    ? Math.round(((calculatedComparePrice - calculatedPrice) / calculatedComparePrice) * 100)
    : 0;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Product link copied to clipboard!');
    }
  };

  return (
    <div className="space-y-6 text-white text-left">
      {/* Brand & Breadcrumbs */}
      <div className="space-y-1">
        <span className="text-[10px] tracking-[0.25em] text-[#FF4D00] uppercase font-bold">
          {product.brand}
        </span>
        <h1 className="text-3xl font-light uppercase tracking-wide text-white leading-tight">
          {product.name}
        </h1>
        <div className="flex justify-between items-center text-[10px] text-[#B5B5B5] uppercase tracking-widest pt-1 border-b border-white/5 pb-3">
          <span>Category: {product.category}</span>
          <span>SKU: TLP-{product.id}0{selectedSize[0]}</span>
        </div>
      </div>

      {/* Ratings & Reviews */}
      <div className="flex items-center space-x-2 text-xs">
        <div className="flex items-center text-[#FF4D00] space-x-0.5">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-sm">★</span>
          ))}
        </div>
        <span className="font-semibold text-white">{product.rating}</span>
        <span className="text-[#B5B5B5]">({product.reviewsCount} verified reviews)</span>
      </div>

      {/* Pricing Section */}
      <div className="bg-[#0a0a0a] p-4 border border-white/5 rounded-lg space-y-2">
        <div className="flex items-baseline space-x-3">
          <span className="text-2xl font-bold text-[#FF4D00]">
            {calculatedPrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
          </span>
          {calculatedComparePrice && (
            <>
              <span className="text-sm text-[#B5B5B5] line-through">
                {calculatedComparePrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
              </span>
              <span className="text-[10px] font-black uppercase text-[#FF4D00] bg-[#FF4D00]/10 border border-[#FF4D00]/20 px-2 py-0.5 rounded">
                Save {discountPercent}%
              </span>
            </>
          )}
        </div>
        <div className="text-[10px] text-[#B5B5B5] flex justify-between">
          <span>Inclusive of all taxes</span>
          <span className="text-[#FF4D00] font-semibold">✓ Free Delivery</span>
        </div>
      </div>

      {/* Size Variants selection */}
      <div className="space-y-3">
        <h4 className="text-[10px] tracking-[0.2em] text-[#E5E5E5] uppercase font-bold">Select Size</h4>
        <div className="flex gap-3">
          {sizes.map((size) => (
            <button
              key={size.label}
              onClick={() => setSelectedSize(size.label)}
              className={`flex-1 py-3 text-center border text-xs tracking-wider transition-all uppercase cursor-pointer ${
                selectedSize === size.label
                  ? 'border-[#FF4D00] bg-[#FF4D00]/5 text-white font-bold'
                  : 'border-white/10 hover:border-white/30 text-[#B5B5B5] hover:text-white'
              }`}
            >
              {size.label}
            </button>
          ))}
        </div>
      </div>

      {/* Purchase Section & Quantity */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center border border-white/10 h-12 bg-[#0a0a0a]">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-4 text-[#B5B5B5] hover:text-white bg-transparent border-0 cursor-pointer"
            >
              -
            </button>
            <span className="px-2 text-xs font-semibold text-white min-w-[20px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="px-4 text-[#B5B5B5] hover:text-white bg-transparent border-0 cursor-pointer"
            >
              +
            </button>
          </div>

          {/* Add To Cart */}
          <button
            disabled={!product.inStock}
            className="flex-grow h-12 bg-white text-black hover:bg-[#0A0A0A] hover:text-white hover:border-[#FF4D00] border border-white text-xs tracking-[0.15em] font-black uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer rounded-xl"
          >
            {product.inStock ? 'Add To Cart' : 'Out of Stock'}
          </button>
        </div>

        {/* Buy Now Button */}
        <button
          disabled={!product.inStock}
          className="w-full h-12 bg-[#FF4D00] text-white hover:bg-[#E04400] text-xs tracking-[0.15em] font-black uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(255,77,0,0.3)] cursor-pointer rounded-xl"
        >
          Buy It Now
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center text-[10px] text-[#B5B5B5] uppercase tracking-widest border-t border-b border-white/5 py-3">
        <button className="flex items-center space-x-1.5 hover:text-[#FF4D00] transition-colors bg-transparent border-0 cursor-pointer">
          <Heart className="h-3.5 w-3.5" />
          <span>Add to Wishlist</span>
        </button>
        <button className="flex items-center space-x-1.5 hover:text-[#FF4D00] transition-colors bg-transparent border-0 cursor-pointer">
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Compare</span>
        </button>
        <button
          onClick={handleShare}
          className="flex items-center space-x-1.5 hover:text-[#FF4D00] transition-colors bg-transparent border-0 cursor-pointer"
        >
          <Share2 className="h-3.5 w-3.5" />
          <span>Share Product</span>
        </button>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="flex items-center space-x-2.5 p-3 border border-white/5 bg-[#0a0a0a] rounded-lg">
          <Shield className="h-4 w-4 text-[#FF4D00] flex-shrink-0" />
          <span className="text-[10px] text-[#B5B5B5] uppercase font-semibold">100% Genuine Formula</span>
        </div>
        <div className="flex items-center space-x-2.5 p-3 border border-white/5 bg-[#0a0a0a] rounded-lg">
          <Award className="h-4 w-4 text-[#FF4D00] flex-shrink-0" />
          <span className="text-[10px] text-[#B5B5B5] uppercase font-semibold">Professional Grade</span>
        </div>
        <div className="flex items-center space-x-2.5 p-3 border border-white/5 bg-[#0a0a0a] rounded-lg">
          <Truck className="h-4 w-4 text-[#FF4D00] flex-shrink-0" />
          <span className="text-[10px] text-[#B5B5B5] uppercase font-semibold">Free Express Shipping</span>
        </div>
        <div className="flex items-center space-x-2.5 p-3 border border-white/5 bg-[#0a0a0a] rounded-lg">
          <RotateCcw className="h-4 w-4 text-[#FF4D00] flex-shrink-0" />
          <span className="text-[10px] text-[#B5B5B5] uppercase font-semibold">15-Day Easy Returns</span>
        </div>
      </div>
    </div>
  );
}
export default ProductInfo;
