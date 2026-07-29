'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Eye, RefreshCw, Star, X, Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCartStore } from '@/features/catalog/hooks/useCartStore';
import { PRODUCTS, Product } from '@/features/catalog/constants/products';

const tabs = ['Curated', 'Trending Now', 'Essentials'];

interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: string;
  comparePrice?: string;
  rating: number;
  reviewsCount: number;
  image: string;
  onSale: boolean;
  brand: string;
  slug?: string;
}

const fallbackProductsData: Record<string, ProductItem[]> = {
  Curated: [
    {
      id: 'f1',
      name: 'Carbon Shield 9H Ceramic',
      category: 'Ceramic Coating',
      price: '$6,500',
      comparePrice: '$7,500',
      rating: 4.9,
      reviewsCount: 142,
      image: '/spray-bottles.png',
      onSale: true,
      brand: 'The Liquid Plus',
    },
    {
      id: 'f2',
      name: 'Premium Red Microfiber Towel',
      category: 'Microfiber Collection',
      price: '$1,299',
      rating: 4.8,
      reviewsCount: 96,
      image: '/microfiber-1.png',
      onSale: false,
      brand: 'The Liquid Plus',
    },
  ],
  'Trending Now': [],
  Essentials: [],
};

export function FeaturedCollection({
  initialProductsData,
}: {
  initialProductsData?: Record<string, ProductItem[]>;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState('Curated');

  // Quick View State
  const [quickViewProduct, setQuickViewProduct] = React.useState<Product | null>(null);
  const [qvSize, setQvSize] = React.useState('500ml');
  const [qvQty, setQvQty] = React.useState(1);

  // Cart Store Actions
  const {
    wishlist,
    compareList,
    addToCart,
    setMiniCartOpen,
    addToWishlist,
    removeFromWishlist,
    addToCompare,
    removeFromCompare,
  } = useCartStore();

  const sourceData = initialProductsData || fallbackProductsData;
  const products = sourceData[activeTab] || sourceData['Curated'] || [];

  // ESC key listener for Quick View Modal
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setQuickViewProduct(null);
      }
    };
    if (quickViewProduct) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [quickViewProduct]);

  // Action Helpers
  const getFullProduct = (item: ProductItem): Product => {
    const found =
      PRODUCTS.find((p) => p.slug === item.slug) || PRODUCTS.find((p) => p.id === item.id);
    if (found) return found;

    // Fallback Product object if DB ID doesn't exist in local mock constants
    return {
      id: item.id,
      name: item.name,
      brand: item.brand,
      category: item.category,
      slug: item.slug || 'slug',
      price: Number(item.price.replace(/[^0-9.]/g, '')) || 15,
      compareAtPrice: item.comparePrice
        ? Number(item.comparePrice.replace(/[^0-9.]/g, ''))
        : undefined,
      rating: item.rating,
      reviewsCount: item.reviewsCount,
      image: item.image,
      hoverImage: item.image,
      shortDescription: 'Professional grade laboratory formulated surface detailing formula.',
      description: 'Professional grade laboratory formulated surface detailing formula.',
      inStock: true,
      isNew: false,
      isFeatured: true,
      productType: 'liquid',
      collections: [activeTab],
    };
  };

  const handleWishlistToggle = (e: React.MouseEvent, item: ProductItem) => {
    e.preventDefault();
    e.stopPropagation();
    const product = getFullProduct(item);
    const inWishlist = wishlist.some((p) => p.id === product.id);
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.success(`Removed ${product.name} from wishlist.`);
    } else {
      addToWishlist(product);
      toast.success(`Added ${product.name} to wishlist!`);
    }
  };

  const handleCompareToggle = (e: React.MouseEvent, item: ProductItem) => {
    e.preventDefault();
    e.stopPropagation();
    const product = getFullProduct(item);
    const inCompare = compareList.some((p) => p.id === product.id);
    if (inCompare) {
      removeFromCompare(product.id);
      toast.success(`Removed ${product.name} from comparison.`);
    } else {
      if (compareList.length >= 4) {
        toast.warning('You can compare a maximum of 4 products.');
        return;
      }
      addToCompare(product);
      toast.success(`Added ${product.name} to comparison list.`);
    }
  };

  const handleAddToCartAction = (e: React.MouseEvent, item: ProductItem) => {
    e.preventDefault();
    e.stopPropagation();
    const product = getFullProduct(item);
    addToCart(product, '500ml', 1);
    setMiniCartOpen(true);
    toast.success(`Added ${product.name} (500ml) to bag!`);
  };

  const handleQuickViewAction = (e: React.MouseEvent, item: ProductItem) => {
    e.preventDefault();
    e.stopPropagation();
    const product = getFullProduct(item);
    setQvSize('500ml');
    setQvQty(1);
    setQuickViewProduct(product);
  };

  return (
    <section
      id="featured-collection"
      className="border-b border-[#EAEAEA] bg-white py-14 text-[#0A0A0A]"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Header Block */}
        <div className="mx-auto mb-8 max-w-2xl space-y-2 text-center">
          <span className="block text-[8px] font-black tracking-[0.25em] text-[#FF4D00] uppercase">
            Curated Catalog
          </span>
          <h2 className="text-2xl font-light tracking-widest text-[#0A0A0A] uppercase sm:text-3xl">
            Featured Collection
          </h2>
          <div className="mx-auto mt-1 h-[1.5px] w-10 bg-[#FF4D00]" />
        </div>

        {/* Tab Switcher Controls */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-3 border-b border-[#EAEAEA] pb-4 md:gap-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative cursor-pointer pb-2 text-[10px] font-black tracking-[0.2em] uppercase transition-all ${
                activeTab === tab ? 'text-[#FF4D00]' : 'text-[#666666] hover:text-[#0A0A0A]'
              }`}
            >
              <span>{tab}</span>
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 h-[2px] w-full bg-[#FF4D00]"
                />
              )}
            </button>
          ))}
        </div>

        {/* Grid display (4 Products x 2 Rows) */}
        {products.length === 0 ? (
          <div className="mx-auto max-w-lg rounded-[24px] border border-dashed border-zinc-200 bg-zinc-50 px-4 py-16 text-center">
            <p className="text-xs font-light tracking-wide text-zinc-500">
              No products are currently featured in this collection. Please check back soon or visit
              our catalog admin.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => {
              const inWishlist = wishlist.some((p) => p.id === product.id);
              const inCompare = compareList.some((p) => p.id === product.id);

              return (
                <div
                  key={product.id}
                  className="group relative flex flex-col space-y-3 rounded-2xl border border-[#EAEAEA] bg-white p-4 text-left transition-all duration-300 hover:-translate-y-1.5 hover:border-[#FF4D00]/30 hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)]"
                >
                  {/* Absolute click overlay link for Entire Card (z-0) */}
                  <Link
                    href={`/products/${product.slug || 'slug'}`}
                    className="absolute inset-0 z-0 rounded-2xl"
                    aria-label={`View details of ${product.name}`}
                  />

                  {/* Product Image Frame (z-10 relative) */}
                  <div className="hover-zoom pointer-events-none relative z-10 aspect-[4/5] w-full overflow-hidden rounded-xl border border-[#EAEAEA] bg-[#F8F8F8]">
                    {product.onSale && (
                      <span className="absolute top-3 left-3 z-10 rounded-sm bg-[#FF4D00] px-2 py-0.5 text-[8px] font-black tracking-widest text-white uppercase">
                        Sale
                      </span>
                    )}

                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 25vw"
                      className="object-cover"
                      unoptimized={product.image?.startsWith('data:')}
                    />

                    {/* Overlaid Actions Trigger (pointer-events-auto, z-20) */}
                    <div className="pointer-events-auto absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 translate-y-3 items-center space-x-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <button
                        onClick={(e) => handleAddToCartAction(e, product)}
                        className="cursor-pointer rounded-xl border border-[#EAEAEA] bg-white p-2.5 text-black shadow-lg transition-all hover:bg-[#FF4D00] hover:text-white"
                        aria-label="Add to cart"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleQuickViewAction(e, product)}
                        className="cursor-pointer rounded-xl border border-[#EAEAEA] bg-white p-2.5 text-black shadow-lg transition-all hover:bg-[#FF4D00] hover:text-white"
                        aria-label="Quick View"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleCompareToggle(e, product)}
                        className={`cursor-pointer rounded-xl border border-[#EAEAEA] p-2.5 shadow-lg transition-all ${
                          inCompare
                            ? 'bg-[#FF4D00] text-white'
                            : 'bg-white text-black hover:bg-[#FF4D00] hover:text-white'
                        }`}
                        aria-label="Compare"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleWishlistToggle(e, product)}
                        className={`cursor-pointer rounded-xl border border-[#EAEAEA] p-2.5 shadow-lg transition-all ${
                          inWishlist
                            ? 'bg-[#FF4D00] text-white'
                            : 'bg-white text-black hover:bg-[#FF4D00] hover:text-white'
                        }`}
                        aria-label="Add to wishlist"
                      >
                        <Heart className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Product Info (z-10 pointer-events-none) */}
                  <div className="pointer-events-none z-10 space-y-1.5 pt-1">
                    <span className="text-[8px] font-black tracking-[0.2em] text-[#FF4D00] uppercase">
                      {product.brand}
                    </span>
                    <h3 className="line-clamp-1 text-xs font-bold tracking-wide text-[#0A0A0A]">
                      {product.name}
                    </h3>
                    <span className="block text-[9px] tracking-wider text-[#666666] uppercase">
                      {product.category}
                    </span>

                    {/* Rating */}
                    <div className="flex items-center space-x-1 text-[9px] text-[#666666]">
                      <div className="flex text-[#FF4D00]">
                        <Star className="h-3 w-3 fill-current" />
                        <Star className="h-3 w-3 fill-current" />
                        <Star className="h-3 w-3 fill-current" />
                        <Star className="h-3 w-3 fill-current" />
                        <Star className="h-3 w-3 fill-current" />
                      </div>
                      <span className="font-bold">{product.rating}</span>
                      <span className="font-light opacity-70">
                        ({product.reviewsCount} Reviews)
                      </span>
                    </div>

                    {/* Pricing */}
                    <div className="font-num flex items-center space-x-2 pt-1">
                      <span className="text-xs font-black text-[#0A0A0A]">{product.price}</span>
                      {product.comparePrice && (
                        <span className="text-[10px] font-light text-[#666666] line-through">
                          {product.comparePrice}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Premium Glassmorphic Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop click to close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setQuickViewProduct(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Card wrapper */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 grid w-full max-w-3xl grid-cols-1 gap-8 rounded-[28px] border border-zinc-200/80 bg-white/95 p-6 text-left text-zinc-800 shadow-2xl backdrop-blur-xl sm:p-8 md:grid-cols-2"
            >
              {/* Close Button */}
              <button
                onClick={() => setQuickViewProduct(null)}
                className="text-zinc-550 absolute top-4 right-4 z-20 cursor-pointer rounded-full border border-zinc-200 bg-zinc-100 p-1.5 transition-all hover:bg-zinc-200 hover:text-zinc-900"
                aria-label="Close Quick View"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Left Side: Product Gallery */}
              <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-2xl border border-zinc-200/60 bg-zinc-50 p-2">
                <Image
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  fill
                  className="object-cover"
                  unoptimized={quickViewProduct.image?.startsWith('data:')}
                />
              </div>

              {/* Right Side: Product Configuration Info */}
              <div className="flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[8px] font-black tracking-[0.25em] text-[#FF4D00] uppercase">
                    {quickViewProduct.brand}
                  </span>
                  <h2 className="text-lg leading-snug font-black text-zinc-900 uppercase">
                    {quickViewProduct.name}
                  </h2>
                  <span className="block text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                    Category: {quickViewProduct.category}
                  </span>

                  {/* Rating */}
                  <div className="text-zinc-550 flex items-center space-x-1.5 text-[10px]">
                    <div className="flex text-[#FF4D00]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${i < Math.floor(quickViewProduct.rating) ? 'fill-current' : ''}`}
                        />
                      ))}
                    </div>
                    <span className="font-bold">{quickViewProduct.rating}</span>
                    <span>({quickViewProduct.reviewsCount} reviews)</span>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center space-x-3 pt-1">
                    <span className="text-lg font-black text-zinc-900">
                      {quickViewProduct.price.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        maximumFractionDigits: 0,
                      })}
                    </span>
                    {quickViewProduct.compareAtPrice && (
                      <span className="text-xs text-zinc-400 line-through">
                        {quickViewProduct.compareAtPrice.toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          maximumFractionDigits: 0,
                        })}
                      </span>
                    )}
                  </div>

                  <p className="pt-2 text-[10px] leading-relaxed font-light text-zinc-500">
                    {quickViewProduct.shortDescription || quickViewProduct.description}
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Size Config */}
                  <div className="space-y-1 text-xs">
                    <span className="block text-[8px] font-bold tracking-wider text-zinc-400 uppercase">
                      Select Capacity
                    </span>
                    <div className="flex space-x-2">
                      {['500ml', '1 Litre', '5 Litres'].map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setQvSize(sz)}
                          className={`cursor-pointer rounded-lg border px-3 py-1.5 text-[9px] font-black tracking-widest uppercase transition-all ${
                            qvSize === sz
                              ? 'border-[#FF4D00] bg-[#FF4D00]/5 text-[#FF4D00]'
                              : 'text-zinc-650 border-zinc-200 hover:border-zinc-300'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity Control */}
                  <div className="space-y-1 text-xs">
                    <span className="block text-[8px] font-bold tracking-wider text-zinc-400 uppercase">
                      Quantity
                    </span>
                    <div className="flex w-max items-center space-x-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-1">
                      <button
                        type="button"
                        onClick={() => setQvQty(Math.max(1, qvQty - 1))}
                        className="cursor-pointer p-1 text-xs font-black text-zinc-500 hover:text-[#FF4D00]"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-zinc-700">
                        {qvQty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQvQty(qvQty + 1)}
                        className="cursor-pointer p-1 text-xs font-black text-zinc-500 hover:text-[#FF4D00]"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Modal Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        addToCart(quickViewProduct, qvSize, qvQty);
                        setMiniCartOpen(true);
                        setQuickViewProduct(null);
                        toast.success(`Added ${quickViewProduct.name} to cart!`);
                      }}
                      className="cursor-pointer rounded-xl bg-zinc-900 py-3 text-center text-[9px] font-black tracking-widest text-white uppercase transition-all hover:bg-black"
                    >
                      Add To Bag
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        addToCart(quickViewProduct, qvSize, qvQty);
                        setQuickViewProduct(null);
                        router.push('/checkout');
                      }}
                      className="cursor-pointer rounded-xl bg-[#FF4D00] py-3 text-center text-[9px] font-black tracking-widest text-white uppercase transition-all hover:bg-[#E04400]"
                    >
                      Buy Now
                    </button>
                  </div>

                  {/* Actions footer */}
                  <div className="flex items-center justify-between border-t border-zinc-100 pt-3 text-[9px] font-bold tracking-widest text-zinc-400 uppercase">
                    <button
                      type="button"
                      onClick={() => {
                        const inWishlist = wishlist.some((p) => p.id === quickViewProduct.id);
                        if (inWishlist) {
                          removeFromWishlist(quickViewProduct.id);
                          toast.success(`Removed from wishlist.`);
                        } else {
                          addToWishlist(quickViewProduct);
                          toast.success(`Added to wishlist!`);
                        }
                      }}
                      className="cursor-pointer transition-colors hover:text-[#FF4D00]"
                    >
                      {wishlist.some((p) => p.id === quickViewProduct.id)
                        ? '♥ Wishlisted'
                        : '♡ Add Wishlist'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const inCompare = compareList.some((p) => p.id === quickViewProduct.id);
                        if (inCompare) {
                          removeFromCompare(quickViewProduct.id);
                          toast.success('Removed from comparison.');
                        } else {
                          if (compareList.length >= 4) {
                            toast.warning('Max 4 compare items.');
                            return;
                          }
                          addToCompare(quickViewProduct);
                          toast.success('Added to comparison.');
                        }
                      }}
                      className="cursor-pointer transition-colors hover:text-[#FF4D00]"
                    >
                      {compareList.some((p) => p.id === quickViewProduct.id)
                        ? '⇄ Comparing'
                        : '⇄ Compare'}
                    </button>
                    <Link
                      href={`/products/${quickViewProduct.slug}`}
                      onClick={() => setQuickViewProduct(null)}
                      className="text-[#FF4D00] hover:underline"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
export default FeaturedCollection;
