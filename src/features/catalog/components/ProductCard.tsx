'use client';

import * as React from 'react';
import { Heart, ShoppingBag, Eye, RefreshCw, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../constants/products';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  const discountPercent = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div
      className="group flex flex-col space-y-4 relative bg-[#0a0a0a] p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Frame */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#111] rounded-lg">
        
        {/* Badges Container */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {product.compareAtPrice && (
            <span className="bg-[#FF4D00] text-black text-[8px] font-black tracking-widest uppercase px-2 py-0.5 rounded-sm">
              Sale -{discountPercent}%
            </span>
          )}
          {!product.inStock && (
            <span className="bg-red-500/20 text-red-500 border border-red-500/30 text-[8px] font-black tracking-widest uppercase px-2 py-0.5 rounded-sm">
              Out of Stock
            </span>
          )}
          {product.isNew && (
            <span className="bg-white text-black text-[8px] font-black tracking-widest uppercase px-2 py-0.5 rounded-sm">
              New
            </span>
          )}
        </div>

        {/* Primary & Hover Images */}
        <Link href={`/products/${product.slug}`} className="block h-full w-full">
          <Image
            src={isHovered ? product.hoverImage : product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out scale-100 group-hover:scale-103"
          />
        </Link>

        {/* Dark bottom vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

        {/* Overlaid Actions Trigger */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button
            disabled={!product.inStock}
            className="bg-white text-black hover:bg-[#FF4D00] hover:text-black p-2.5 rounded-none transition-colors border border-white/10 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Add to cart"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
          </button>
          <button className="bg-white text-black hover:bg-[#FF4D00] hover:text-black p-2.5 rounded-none transition-colors border border-white/10 shadow-lg" aria-label="Quick View">
            <Eye className="h-3.5 w-3.5" />
          </button>
          <button className="bg-white text-black hover:bg-[#FF4D00] hover:text-black p-2.5 rounded-none transition-colors border border-white/10 shadow-lg" aria-label="Compare">
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          <button className="bg-white text-black hover:bg-[#FF4D00] hover:text-black p-2.5 rounded-none transition-colors border border-white/10 shadow-lg" aria-label="Add to wishlist">
            <Heart className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-[8px] tracking-[0.2em] text-[#FF4D00] uppercase font-bold">
            {product.brand}
          </span>
          <span className="text-[8px] tracking-wider text-[#B5B5B5] uppercase font-medium">
            {product.category}
          </span>
        </div>

        <h3 className="text-xs font-semibold tracking-wide text-[#E5E5E5] group-hover:text-white transition-colors cursor-pointer line-clamp-1">
          <Link href={`/products/${product.slug}`}>{product.name}</Link>
        </h3>
        
        <p className="text-[10px] text-[#E5E5E5] font-light leading-relaxed line-clamp-2">
          {product.shortDescription}
        </p>

        {/* Reviews */}
        <div className="flex items-center space-x-1 text-[9px] text-[#B5B5B5]">
          <div className="flex items-center text-[#FF4D00] space-x-0.5">
            <Star className="h-2.5 w-2.5 fill-current" />
            <Star className="h-2.5 w-2.5 fill-current" />
            <Star className="h-2.5 w-2.5 fill-current" />
            <Star className="h-2.5 w-2.5 fill-current" />
            <Star className="h-2.5 w-2.5 fill-current" />
          </div>
          <span>{product.rating}</span>
          <span className="opacity-75">({product.reviewsCount} Reviews)</span>
        </div>

        {/* Pricing & CTA */}
        <div className="flex items-center justify-between pt-1 border-t border-white/5 mt-1.5">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-white">{product.price.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}</span>
            {product.compareAtPrice && (
              <span className="text-[10px] text-[#B5B5B5] line-through">
                {product.compareAtPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
              </span>
            )}
          </div>
          <Link
            href={`/products/${product.slug}`}
            className="text-[9px] tracking-widest uppercase font-bold text-white hover:text-[#FF4D00] transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
export default ProductCard;
