'use client';

import * as React from 'react';
import { ShoppingCart, Heart, Plus, Minus } from 'lucide-react';
import { useCartStore } from '../hooks/useCartStore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface ProductActionsProps {
  product: SafeAny;
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
      category:
        product.productCategories?.[0]?.category?.name || product.category || 'Detailing Product',
      slug: product.slug,
      price: price,
      compareAtPrice: compareAtPrice,
      rating: product.rating || 4.8,
      reviewsCount: product.reviewsCount || 5,
      image:
        product.image ||
        product.images?.[0]?.url ||
        'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600',
      hoverImage:
        product.hoverImage ||
        product.images?.[1]?.url ||
        product.image ||
        'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600',
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
    addToCart(item as SafeAny, '500ml', qty);
    toast.success(`${qty}x ${item.name} added to cart!`);
  };

  const handleBuyNow = () => {
    const item = getMappedItem();
    addToCart(item as SafeAny, '500ml', qty);
    router.push('/checkout');
  };

  const handleWishlistToggle = () => {
    const item = getMappedItem();
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.info('Removed from wishlist');
    } else {
      addToWishlist(item as SafeAny);
      toast.success('Added to wishlist');
    }
  };

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex w-fit items-center space-x-3 rounded-xl border border-zinc-200/80 bg-zinc-50 px-3 py-2">
        <span className="mr-2 text-[9px] font-bold tracking-wider text-zinc-500 uppercase">
          Qty
        </span>
        <button
          onClick={handleDecrement}
          type="button"
          className="cursor-pointer rounded border-0 bg-transparent p-1 text-zinc-400 transition-all hover:bg-zinc-100 hover:text-zinc-800"
        >
          <Minus className="h-3 w-3" />
        </button>
        <span className="font-num min-w-[20px] px-2 text-center text-xs font-bold text-zinc-800">
          {qty}
        </span>
        <button
          onClick={handleIncrement}
          type="button"
          className="cursor-pointer rounded border-0 bg-transparent p-1 text-zinc-400 transition-all hover:bg-zinc-100 hover:text-zinc-800"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>

      {/* Buttons Block */}
      <div className="flex flex-col items-stretch gap-3 pt-2 sm:flex-row sm:items-center">
        <button
          onClick={handleAddToCart}
          className="flex flex-grow cursor-pointer items-center justify-center space-x-2 rounded-xl border-0 bg-[#FF4D00] py-3 text-[10px] font-black tracking-widest text-white uppercase shadow-sm transition-all hover:bg-[#E04400]"
        >
          <ShoppingCart className="h-4 w-4" />
          <span>Add to Cart</span>
        </button>

        <button
          onClick={handleBuyNow}
          className="flex flex-grow cursor-pointer items-center justify-center rounded-xl border-0 bg-zinc-900 py-3 text-[10px] font-black tracking-widest text-white uppercase shadow-sm transition-all hover:bg-black"
        >
          <span>Buy Now</span>
        </button>

        <button
          onClick={handleWishlistToggle}
          className={`flex cursor-pointer items-center justify-center rounded-xl border p-3 transition-all ${
            inWishlist
              ? 'border-[#FF4D00]/30 bg-[#FF4D00]/10 text-[#FF4D00]'
              : 'border-zinc-200/80 bg-zinc-50 text-zinc-700 hover:border-zinc-400'
          }`}
          title="Toggle Wishlist"
        >
          <Heart className={`h-4 w-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>
      </div>
    </div>
  );
}
