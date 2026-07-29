'use client';

import * as React from 'react';
import { Heart, RefreshCw, Share2, Shield, Truck, Award, RotateCcw } from 'lucide-react';
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
    <div className="space-y-6 text-left text-white">
      {/* Brand & Breadcrumbs */}
      <div className="space-y-1">
        <span className="text-[10px] font-bold tracking-[0.25em] text-[#FF4D00] uppercase">
          {product.brand}
        </span>
        <h1 className="text-3xl leading-tight font-light tracking-wide text-white uppercase">
          {product.name}
        </h1>
        <div className="flex items-center justify-between border-b border-white/5 pt-1 pb-3 text-[10px] tracking-widest text-[#B5B5B5] uppercase">
          <span>Category: {product.category}</span>
          <span>
            SKU: TLP-{product.id}0{selectedSize[0]}
          </span>
        </div>
      </div>

      {/* Ratings & Reviews */}
      <div className="flex items-center space-x-2 text-xs">
        <div className="flex items-center space-x-0.5 text-[#FF4D00]">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-sm">
              ★
            </span>
          ))}
        </div>
        <span className="font-semibold text-white">{product.rating}</span>
        <span className="text-[#B5B5B5]">({product.reviewsCount} verified reviews)</span>
      </div>

      {/* Pricing Section */}
      <div className="space-y-2 rounded-lg border border-white/5 bg-[#0a0a0a] p-4">
        <div className="flex items-baseline space-x-3">
          <span className="text-2xl font-bold text-[#FF4D00]">
            {calculatedPrice.toLocaleString('en-IN', {
              style: 'currency',
              currency: 'INR',
              maximumFractionDigits: 0,
            })}
          </span>
          {calculatedComparePrice && (
            <>
              <span className="text-sm text-[#B5B5B5] line-through">
                {calculatedComparePrice.toLocaleString('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  maximumFractionDigits: 0,
                })}
              </span>
              <span className="rounded border border-[#FF4D00]/20 bg-[#FF4D00]/10 px-2 py-0.5 text-[10px] font-black text-[#FF4D00] uppercase">
                Save {discountPercent}%
              </span>
            </>
          )}
        </div>
        <div className="flex justify-between text-[10px] text-[#B5B5B5]">
          <span>Inclusive of all taxes</span>
          <span className="font-semibold text-[#FF4D00]">✓ Free Delivery</span>
        </div>
      </div>

      {/* Size Variants selection */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-bold tracking-[0.2em] text-[#E5E5E5] uppercase">
          Select Size
        </h4>
        <div className="flex gap-3">
          {sizes.map((size) => (
            <button
              key={size.label}
              onClick={() => setSelectedSize(size.label)}
              className={`flex-1 cursor-pointer border py-3 text-center text-xs tracking-wider uppercase transition-all ${
                selectedSize === size.label
                  ? 'border-[#FF4D00] bg-[#FF4D00]/5 font-bold text-white'
                  : 'border-white/10 text-[#B5B5B5] hover:border-white/30 hover:text-white'
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
          <div className="flex h-12 items-center border border-white/10 bg-[#0a0a0a]">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="cursor-pointer border-0 bg-transparent px-4 text-[#B5B5B5] hover:text-white"
            >
              -
            </button>
            <span className="min-w-[20px] px-2 text-center text-xs font-semibold text-white">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="cursor-pointer border-0 bg-transparent px-4 text-[#B5B5B5] hover:text-white"
            >
              +
            </button>
          </div>

          {/* Add To Cart */}
          <button
            disabled={!product.inStock}
            className="h-12 flex-grow cursor-pointer rounded-xl border border-white bg-white text-xs font-black tracking-[0.15em] text-black uppercase transition-all duration-300 hover:border-[#FF4D00] hover:bg-[#0A0A0A] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {product.inStock ? 'Add To Cart' : 'Out of Stock'}
          </button>
        </div>

        {/* Buy Now Button */}
        <button
          disabled={!product.inStock}
          className="h-12 w-full cursor-pointer rounded-xl bg-[#FF4D00] text-xs font-black tracking-[0.15em] text-white uppercase transition-all duration-300 hover:scale-[1.02] hover:bg-[#E04400] hover:shadow-[0_0_15px_rgba(255,77,0,0.3)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Buy It Now
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between border-t border-b border-white/5 py-3 text-[10px] tracking-widest text-[#B5B5B5] uppercase">
        <button className="flex cursor-pointer items-center space-x-1.5 border-0 bg-transparent transition-colors hover:text-[#FF4D00]">
          <Heart className="h-3.5 w-3.5" />
          <span>Add to Wishlist</span>
        </button>
        <button className="flex cursor-pointer items-center space-x-1.5 border-0 bg-transparent transition-colors hover:text-[#FF4D00]">
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Compare</span>
        </button>
        <button
          onClick={handleShare}
          className="flex cursor-pointer items-center space-x-1.5 border-0 bg-transparent transition-colors hover:text-[#FF4D00]"
        >
          <Share2 className="h-3.5 w-3.5" />
          <span>Share Product</span>
        </button>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="flex items-center space-x-2.5 rounded-lg border border-white/5 bg-[#0a0a0a] p-3">
          <Shield className="h-4 w-4 flex-shrink-0 text-[#FF4D00]" />
          <span className="text-[10px] font-semibold text-[#B5B5B5] uppercase">
            100% Genuine Formula
          </span>
        </div>
        <div className="flex items-center space-x-2.5 rounded-lg border border-white/5 bg-[#0a0a0a] p-3">
          <Award className="h-4 w-4 flex-shrink-0 text-[#FF4D00]" />
          <span className="text-[10px] font-semibold text-[#B5B5B5] uppercase">
            Professional Grade
          </span>
        </div>
        <div className="flex items-center space-x-2.5 rounded-lg border border-white/5 bg-[#0a0a0a] p-3">
          <Truck className="h-4 w-4 flex-shrink-0 text-[#FF4D00]" />
          <span className="text-[10px] font-semibold text-[#B5B5B5] uppercase">
            Free Express Shipping
          </span>
        </div>
        <div className="flex items-center space-x-2.5 rounded-lg border border-white/5 bg-[#0a0a0a] p-3">
          <RotateCcw className="h-4 w-4 flex-shrink-0 text-[#FF4D00]" />
          <span className="text-[10px] font-semibold text-[#B5B5B5] uppercase">
            15-Day Easy Returns
          </span>
        </div>
      </div>
    </div>
  );
}
export default ProductInfo;
