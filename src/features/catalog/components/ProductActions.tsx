/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element */
'use client';

import * as React from 'react';
import { ShoppingCart, Heart, Plus, Minus } from 'lucide-react';
import { useCartStore } from '../hooks/useCartStore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface ProductActionsProps {
  product: any;
}

export function ProductActions({ product }: ProductActionsProps) {
  const router = useRouter();
  const { addToCart, addToWishlist, wishlist, removeFromWishlist } = useCartStore();
  const [qty, setQty] = React.useState(1);

  const baseVariant = product.variants?.[0] || {};
  const price = Number(baseVariant.price) || Number(product.price) || 1500;
  const compareAtPrice = baseVariant.comparePrice ? Number(baseVariant.comparePrice) : undefined;
  
  const inWishlist = wishlist.some((item) => item.id === product.id);

  const handleIncrement = () => setQty((q) => q + 1);
  const handleDecrement = () => setQty((q) => Math.max(1, q - 1));

  const getMappedItem = () => {
    return {
      id: product.id,
      name: product.title || product.name,
      brand: product.brand?.name || product.brand || 'The Liquid Plus',
      category: product.productCategories?.[0]?.category?.name || product.category || 'Detailing Product',
      slug: product.slug,
      price: price,
      compareAtPrice: compareAtPrice,
      rating: product.rating || 4.8,
      reviewsCount: product.reviewsCount || 5,
      image: product.image || (product.images?.[0]?.url) || 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600',
      hoverImage: product.hoverImage || (product.images?.[1]?.url) || product.image || 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600',
      shortDescription: product.description || '',
      description: product.description || '',
      inStock: true,
      isNew: false,
      isFeatured: false,
      isTrending: false,
      isBestSeller: false,
      productType: 'coating',
      collections: [],
    };
  };

  const handleAddToCart = () => {
    const item = getMappedItem();
    addToCart(item as any, '500ml', qty);
    toast.success(`${qty}x ${item.name} added to cart!`);
  };

  const handleBuyNow = () => {
    const item = getMappedItem();
    addToCart(item as any, '500ml', qty);
    router.push('/checkout');
  };

  const handleWishlistToggle = () => {
    const item = getMappedItem();
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.info('Removed from wishlist');
    } else {
      addToWishlist(item as any);
      toast.success('Added to wishlist');
    }
  };

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center space-x-3 bg-zinc-900 border border-white/5 px-3 py-2 rounded-xl w-fit">
        <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold mr-2">Qty</span>
        <button
          onClick={handleDecrement}
          type="button"
          className="p-1 hover:bg-white/5 rounded text-zinc-400 hover:text-white transition-all cursor-pointer border-0 bg-transparent"
        >
          <Minus className="h-3 w-3" />
        </button>
        <span className="font-num text-xs font-bold text-white px-2 min-w-[20px] text-center">{qty}</span>
        <button
          onClick={handleIncrement}
          type="button"
          className="p-1 hover:bg-white/5 rounded text-zinc-400 hover:text-white transition-all cursor-pointer border-0 bg-transparent"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>

      {/* Buttons Block */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
        <button
          onClick={handleAddToCart}
          className="flex-grow py-3 bg-[#FF4D00] hover:bg-[#E04400] text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer border-0 flex items-center justify-center space-x-2"
        >
          <ShoppingCart className="h-4 w-4" />
          <span>Add to Cart</span>
        </button>

        <button
          onClick={handleBuyNow}
          className="flex-grow py-3 bg-white hover:bg-zinc-200 text-black text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer border-0 flex items-center justify-center"
        >
          <span>Buy Now</span>
        </button>

        <button
          onClick={handleWishlistToggle}
          className={`p-3 border rounded-xl transition-all cursor-pointer flex items-center justify-center ${
            inWishlist
              ? 'bg-[#FF4D00]/10 border-[#FF4D00]/30 text-[#FF4D00]'
              : 'bg-zinc-900 border-white/10 hover:border-white text-white'
          }`}
          title="Toggle Wishlist"
        >
          <Heart className={`h-4 w-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>
      </div>
    </div>
  );
}
