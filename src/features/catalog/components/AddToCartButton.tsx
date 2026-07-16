/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element */
'use client';

import * as React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../hooks/useCartStore';
import { toast } from 'sonner';

interface AddToCartButtonProps {
  product: any;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCartStore();

  const handleAdd = () => {
    // Construct the storefront product shape
    const itemToAdd = {
      id: product.id,
      name: product.title || product.name,
      brand: product.brand?.name || product.brand || 'The Liquid Plus',
      category: product.category || 'Detailing Product',
      slug: product.slug,
      price: product.price || 1500,
      compareAtPrice: product.compareAtPrice,
      rating: product.rating || 4.8,
      reviewsCount: product.reviewsCount || 5,
      image: product.image || (product.images?.[0]?.url) || 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600',
      hoverImage: product.hoverImage || (product.images?.[1]?.url) || product.image,
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

    addToCart(itemToAdd as any, '500ml', 1);
    toast.success(`${itemToAdd.name} added to cart!`);
  };

  return (
    <button
      onClick={handleAdd}
      className="flex-grow py-3 bg-[#FF4D00] hover:bg-[#E04400] text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer border-0 flex items-center justify-center space-x-2 w-full"
    >
      <ShoppingCart className="h-4 w-4" />
      <span>Add to Cart</span>
    </button>
  );
}
