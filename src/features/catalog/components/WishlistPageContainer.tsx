'use client';

import * as React from 'react';
import { useCartStore } from '../hooks/useCartStore';
import { Product } from '../constants/products';
import { Trash2, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function WishlistPageContainer() {
  const { wishlist, removeFromWishlist, addToCart } = useCartStore();

  const handleMoveToCart = (product: Product) => {
    addToCart(product, '500ml', 1);
    removeFromWishlist(product.id);
  };

  return (
    <div className="bg-black text-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        
        {/* Breadcrumbs */}
        <div className="text-[10px] tracking-widest uppercase text-[#B5B5B5] flex items-center space-x-2">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#FF4D00] font-medium">Your Wishlist</span>
        </div>

        <h1 className="text-3xl font-light uppercase tracking-wider text-white">Your Wishlist</h1>

        {wishlist.length === 0 ? (
          <div className="py-20 border border-white/5 bg-[#0a0a0a] rounded-xl text-center flex flex-col items-center justify-center space-y-4">
            <span className="text-4xl">❤️</span>
            <h3 className="text-sm font-semibold tracking-widest uppercase text-[#E5E5E5]">Your Wishlist is Empty</h3>
            <p className="text-xs text-[#B5B5B5] max-w-xs font-light leading-relaxed">
              Bookmark premium detailing formulas and nano coatings to inspect them later.
            </p>
            <Link
              href="/shop"
              className="bg-[#FF4D00] text-white hover:bg-[#E04400] text-[10px] tracking-widest uppercase font-bold px-8 py-3.5 hover:scale-105 hover:shadow-[0_0_15px_rgba(255,77,0,0.45)] transition-all rounded-xl inline-block cursor-pointer"
            >
              Explore Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col space-y-4 relative bg-[#0a0a0a] p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
              >
                {/* Product Image Frame */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#111] rounded-lg">
                  <Image src={product.image} alt={product.name} fill className="object-cover" />

                  {/* Actions overlay */}
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-3 right-3 z-10 bg-black/60 hover:bg-red-500/20 text-[#E5E5E5] hover:text-red-500 p-2 rounded-full border border-white/10 transition-colors cursor-pointer"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Info block */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[9px] uppercase tracking-wider text-[#B5B5B5]">
                    <span>{product.brand}</span>
                    <span>{product.category}</span>
                  </div>
                  <h3 className="text-xs font-semibold text-[#E5E5E5] line-clamp-1">
                    <Link href={`/products/${product.slug}`}>{product.name}</Link>
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center space-x-1 text-[9px] text-[#B5B5B5]">
                    <span className="text-[#FF4D00]">★ ★ ★ ★ ★</span>
                    <span>{product.rating}</span>
                  </div>

                  {/* Price info */}
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xs font-semibold text-white">
                      {product.price.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                    </span>
                    <span className={`text-[8px] uppercase tracking-widest font-black ${product.inStock ? 'text-green-500' : 'text-red-500'}`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>

                {/* Move to Cart CTA */}
                <button
                  disabled={!product.inStock}
                  onClick={() => handleMoveToCart(product)}
                  className="w-full py-3.5 bg-white text-black hover:bg-[#0A0A0A] hover:text-white hover:border-[#FF4D00] border border-white text-[10px] tracking-widest font-black uppercase rounded transition-colors flex items-center justify-center space-x-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>Move to Bag</span>
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
export default WishlistPageContainer;
