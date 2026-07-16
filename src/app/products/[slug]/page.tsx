/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element */
import * as React from 'react';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { Star, Shield, Truck, RotateCcw, Heart } from 'lucide-react';
import Link from 'next/link';
import { ProductActions } from '@/features/catalog/components/ProductActions';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps) {
  const resolvedParams = await params;
  const product = await db.product.findUnique({
    where: { slug: resolvedParams.slug },
  });

  if (!product) return {};

  const seo = await db.seoMetadata.findUnique({
    where: {
      entityType_entityId: {
        entityType: 'PRODUCT',
        entityId: product.id,
      },
    },
  });

  return {
    title: seo?.metaTitle || `${product.title} | The Liquid Plus`,
    description: seo?.metaDescription || product.description || '',
    openGraph: {
      title: product.title,
      description: product.description || '',
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = await params;
  const product = await db.product.findUnique({
    where: { slug: resolvedParams.slug },
    include: {
      productCategories: {
        include: {
          category: true,
        },
      },
      brand: true,
      images: { orderBy: { sortOrder: 'asc' } },
      variants: { include: { inventoryItem: true } },
      reviews: {
        where: { status: 'APPROVED' },
        include: { user: { include: { customerProfile: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!product || product.status === 'ARCHIVED') {
    notFound();
  }

  const baseVariant = product.variants[0] || {};
  const price = Number(baseVariant.price) || 1500;
  const compareAtPrice = baseVariant.comparePrice ? Number(baseVariant.comparePrice) : undefined;
  const rating = product.reviews.length > 0 ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length : 4.8;

  const firstCategory = product.productCategories?.[0]?.category;
  const categoryIds = product.productCategories.map((pc) => pc.categoryId);

  // Query related products from same category
  const related = await db.product.findMany({
    where: {
      productCategories: {
        some: {
          categoryId: { in: categoryIds },
        },
      },
      id: { not: product.id },
      status: 'ACTIVE',
    },
    take: 4,
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      variants: true,
    },
  });

  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans text-left">
      <AnnouncementBar />
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full">
        {/* Breadcrumbs */}
        <div className="text-[10px] uppercase tracking-wider text-zinc-500 flex items-center space-x-2 mb-8">
          <Link href="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-white">Shop</Link>
          <span>/</span>
          {firstCategory && (
            <>
              <Link href={`/categories/${firstCategory.slug}`} className="hover:text-white">{firstCategory.name}</Link>
              <span>/</span>
            </>
          )}
          <span className="text-zinc-300 font-bold">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-20">
          {/* Images Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[4/5] bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden flex items-center justify-center p-4">
              <img
                src={product.images[0]?.url || 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600'}
                alt={product.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.slice(0, 4).map((img: any, idx: number) => (
                  <div key={idx} className="relative aspect-square bg-zinc-900 border border-white/5 rounded-xl overflow-hidden flex items-center justify-center p-2 cursor-pointer">
                    <img src={img.url} alt={`Gallery ${idx}`} className="max-h-full max-w-full object-contain" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details info */}
          <div className="space-y-6">
            <div className="space-y-2">
              {product.brand && (
                <span className="text-[10px] tracking-[0.25em] text-[#FF4D00] uppercase font-black block">
                  {product.brand.name}
                </span>
              )}
              <h1 className="text-3xl font-light uppercase tracking-widest leading-tight text-white">
                {product.title}
              </h1>
              
              {/* Ratings */}
              <div className="flex items-center space-x-2 text-xs text-zinc-400 pt-1">
                <div className="flex text-[#FF4D00]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(rating) ? 'fill-current' : 'text-zinc-800'}`} />
                  ))}
                </div>
                <span className="font-bold text-white">{rating.toFixed(1)}</span>
                <span>({product.reviews.length} reviews)</span>
              </div>
            </div>

            <div className="border-t border-b border-white/5 py-4 space-y-2 font-num">
              <div className="flex items-center space-x-3">
                <span className="text-2xl font-black text-[#FF4D00]">${price.toLocaleString('en-US')}</span>
                {compareAtPrice && (
                  <span className="text-sm text-zinc-500 line-through">${compareAtPrice.toLocaleString('en-US')}</span>
                )}
              </div>
              <span className="text-[9px] uppercase tracking-wider text-green-500 font-bold block">
                {(baseVariant.inventoryItem?.quantity || 0) > 0 ? '✓ Product is in stock and ready' : '✕ Out of stock / Made to order'}
              </span>
              {price >= 10 && (
                <span className="inline-flex items-center text-[9px] uppercase tracking-wider text-green-500 font-black bg-green-500/10 px-2 py-0.5 rounded-[3px] border border-green-500/20 mt-1">
                  FREE SHIPPING
                </span>
              )}
            </div>

            <div className="text-zinc-400 text-xs leading-relaxed font-light">
              <p>{product.description}</p>
            </div>

            {/* Specifications Details */}
            <div className="bg-[#0a0a0a] border border-white/5 p-4 rounded-xl space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-[#FF4D00]">Specifications</h4>
              <div className="grid grid-cols-2 gap-4 text-[10px] uppercase tracking-wider">
                <div>
                  <span className="text-zinc-500 block">SKU Code</span>
                  <span className="font-bold text-white block mt-0.5">{baseVariant.sku || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Volume / Weight</span>
                  <span className="font-bold text-white block mt-0.5">{baseVariant.weight ? `${Number(baseVariant.weight)} kg` : 'Standard Bottle'}</span>
                </div>
              </div>
            </div>

            {/* Real Add to Cart / Actions */}
            <div className="pt-4">
              <ProductActions product={product} />
            </div>

            {/* Policy highlights */}
            <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-6 text-[9px] uppercase tracking-wider text-zinc-500">
              <div className="flex flex-col items-center text-center space-y-1">
                <Shield className="h-5 w-5 text-[#FF4D00]" />
                <span className="font-bold">100% Genuine</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-1">
                <Truck className="h-5 w-5 text-[#FF4D00]" />
                <span className="font-bold">Fast Courier</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-1">
                <RotateCcw className="h-5 w-5 text-[#FF4D00]" />
                <span className="font-bold">Slick Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="border-t border-white/5 pt-12 mb-20 space-y-8">
          <h3 className="text-lg font-light uppercase tracking-widest text-white">
            Customer Reviews ({product.reviews.length})
          </h3>
          <div className="space-y-4">
            {product.reviews.length === 0 ? (
              <div className="py-8 text-center text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
                No reviews yet for this product. Be the first to share your detailing results!
              </div>
            ) : (
              product.reviews.map((rev: any) => {
                const reviewer = rev.user?.customerProfile?.firstName
                  ? `${rev.user.customerProfile.firstName} ${rev.user.customerProfile.lastName || ''}`.trim()
                  : 'Verified Detailer';
                return (
                  <div key={rev.id} className="border border-white/5 bg-[#0a0a0a] p-6 rounded-2xl text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-zinc-300">{reviewer}</span>
                      <span className="text-zinc-500 text-[10px]">{new Date(rev.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex text-[#FF4D00] space-x-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < rev.rating ? 'fill-current' : 'text-zinc-800'}`} />
                      ))}
                    </div>
                    {rev.title && <span className="font-bold text-white block">{rev.title}</span>}
                    <p className="text-zinc-400 leading-relaxed font-light">{rev.comment}</p>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Related Products Grid */}
        {related.length > 0 && (
          <section className="border-t border-white/5 pt-12 space-y-8">
            <h3 className="text-lg font-light uppercase tracking-widest text-white">
              Related Products
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((rel: any) => {
                const relPrice = Number(rel.variants[0]?.price) || 1200;
                return (
                  <div key={rel.id} className="border border-white/5 bg-[#0a0a0a] p-4 rounded-2xl flex flex-col justify-between text-left space-y-3">
                    <div className="aspect-square bg-black flex items-center justify-center p-2 rounded-xl">
                      <img src={rel.images[0]?.url || 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600'} alt={rel.title} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div>
                      <Link href={`/products/${rel.slug}`}>
                        <h4 className="text-xs font-bold text-white hover:text-[#FF4D00] transition-colors truncate">{rel.title}</h4>
                      </Link>
                      <span className="text-[#FF4D00] font-num text-xs font-black block mt-1">${relPrice.toLocaleString('en-US')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
export const dynamic = 'force-dynamic';
