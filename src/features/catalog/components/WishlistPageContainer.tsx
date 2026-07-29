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
    <div className="min-h-screen bg-black py-12 text-white">
      <div className="mx-auto max-w-7xl space-y-8 px-6">
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-[10px] tracking-widest text-[#B5B5B5] uppercase">
          <Link href="/" className="transition-colors hover:text-white">
            Home
          </Link>
          <span>/</span>
          <span className="font-medium text-[#FF4D00]">Your Wishlist</span>
        </div>

        <h1 className="text-3xl font-light tracking-wider text-white uppercase">Your Wishlist</h1>

        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-4 rounded-xl border border-white/5 bg-[#0a0a0a] py-20 text-center">
            <span className="text-4xl">❤️</span>
            <h3 className="text-sm font-semibold tracking-widest text-[#E5E5E5] uppercase">
              Your Wishlist is Empty
            </h3>
            <p className="max-w-xs text-xs leading-relaxed font-light text-[#B5B5B5]">
              Bookmark premium detailing formulas and nano coatings to inspect them later.
            </p>
            <Link
              href="/shop"
              className="inline-block cursor-pointer rounded-xl bg-[#FF4D00] px-8 py-3.5 text-[10px] font-bold tracking-widest text-white uppercase transition-all hover:scale-105 hover:bg-[#E04400] hover:shadow-[0_0_15px_rgba(255,77,0,0.45)]"
            >
              Explore Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {wishlist.map((product) => (
              <div
                key={product.id}
                className="group relative flex flex-col space-y-4 rounded-xl border border-white/5 bg-[#0a0a0a] p-4 transition-colors hover:border-white/10"
              >
                {/* Product Image Frame */}
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-[#111]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    unoptimized={product.image?.startsWith('data:')}
                  />

                  {/* Actions overlay */}
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-3 right-3 z-10 cursor-pointer rounded-full border border-white/10 bg-black/60 p-2 text-[#E5E5E5] transition-colors hover:bg-red-500/20 hover:text-red-500"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Info block */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[9px] tracking-wider text-[#B5B5B5] uppercase">
                    <span>{product.brand}</span>
                    <span>{product.category}</span>
                  </div>
                  <h3 className="line-clamp-1 text-xs font-semibold text-[#E5E5E5]">
                    <Link href={`/products/${product.slug}`}>{product.name}</Link>
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center space-x-1 text-[9px] text-[#B5B5B5]">
                    <span className="text-[#FF4D00]">★ ★ ★ ★ ★</span>
                    <span>{product.rating}</span>
                  </div>

                  {/* Price info */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-semibold text-white">
                      {product.price.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        maximumFractionDigits: 0,
                      })}
                    </span>
                    <span
                      className={`text-[8px] font-black tracking-widest uppercase ${product.inStock ? 'text-green-500' : 'text-red-500'}`}
                    >
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>

                {/* Move to Cart CTA */}
                <button
                  disabled={!product.inStock}
                  onClick={() => handleMoveToCart(product)}
                  className="flex w-full cursor-pointer items-center justify-center space-x-1.5 rounded border border-white bg-white py-3.5 text-[10px] font-black tracking-widest text-black uppercase transition-colors hover:border-[#FF4D00] hover:bg-[#0A0A0A] hover:text-white disabled:opacity-50"
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
