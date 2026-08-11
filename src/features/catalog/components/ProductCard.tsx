'use client';

import * as React from 'react';
import { Heart, ShoppingCart, Eye, RefreshCw, Star } from 'lucide-react';
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
      className="group relative flex flex-col space-y-4 rounded-xl border border-zinc-200 bg-white p-4 transition-all duration-300 ease-out hover:border-orange-500/60"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Frame */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-zinc-100">
        {/* Badges Container */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {product.compareAtPrice && (
            <span className="rounded-sm bg-[#FF4D00] px-2 py-0.5 text-[8px] font-black tracking-widest text-white uppercase">
              Sale -{discountPercent}%
            </span>
          )}
          {!product.inStock && (
            <span className="rounded-sm border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[8px] font-black tracking-widest text-red-600 uppercase">
              Out of Stock
            </span>
          )}
          {product.isNew && (
            <span className="rounded-sm bg-zinc-900 px-2 py-0.5 text-[8px] font-black tracking-widest text-white uppercase">
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
            className="scale-100 object-cover transition-transform duration-700 ease-out group-hover:scale-103"
            unoptimized={(isHovered ? product.hoverImage : product.image)?.startsWith('data:')}
          />
        </Link>

        {/* Dark bottom vignette overlay */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Overlaid Actions Trigger */}
        <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 translate-y-3 items-center space-x-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            disabled={!product.inStock}
            className="rounded-none border border-zinc-200 bg-white p-2.5 text-zinc-900 shadow-lg transition-colors hover:bg-[#FF4D00] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
          </button>
          <button
            className="rounded-none border border-zinc-200 bg-white p-2.5 text-zinc-900 shadow-lg transition-colors hover:bg-[#FF4D00] hover:text-white"
            aria-label="Quick View"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
          <button
            className="rounded-none border border-zinc-200 bg-white p-2.5 text-zinc-900 shadow-lg transition-colors hover:bg-[#FF4D00] hover:text-white"
            aria-label="Compare"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          <button
            className="rounded-none border border-zinc-200 bg-white p-2.5 text-zinc-900 shadow-lg transition-colors hover:bg-[#FF4D00] hover:text-white"
            aria-label="Add to wishlist"
          >
            <Heart className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[8px] font-bold tracking-[0.2em] text-[#FF4D00] uppercase">
            {product.brand}
          </span>
          <span className="text-[8px] font-medium tracking-wider text-zinc-500 uppercase">
            {product.category}
          </span>
        </div>

        <h3 className="line-clamp-1 cursor-pointer text-xs font-semibold tracking-wide text-zinc-900 transition-colors group-hover:text-[#FF4D00]">
          <Link href={`/products/${product.slug}`}>{product.name}</Link>
        </h3>

        <p className="line-clamp-2 text-[10px] leading-relaxed font-light text-zinc-600">
          {product.shortDescription}
        </p>

        {/* Reviews */}
        <div className="flex items-center space-x-1 text-[9px] text-zinc-500">
          <div className="flex items-center space-x-0.5 text-[#FF4D00]">
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
        <div className="mt-1.5 flex items-center justify-between border-t border-zinc-100 pt-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-zinc-900">
              {product.price.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0,
              })}
            </span>
            {product.compareAtPrice && (
              <span className="text-[10px] text-zinc-400 line-through">
                {product.compareAtPrice.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0,
                })}
              </span>
            )}
          </div>
          <Link
            href={`/products/${product.slug}`}
            className="text-[9px] font-bold tracking-widest text-zinc-900 uppercase transition-colors hover:text-[#FF4D00]"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
export default ProductCard;
