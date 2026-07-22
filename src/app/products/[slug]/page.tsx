/* eslint-disable @typescript-eslint/no-explicit-any, @next/next/no-img-element */
import * as React from 'react';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { Star, Shield, Truck, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { ProductActions } from '@/features/catalog/components/ProductActions';
import { ProductGallery } from '@/components/storefront/ProductGallery';
import { ProductAccordion } from '@/components/storefront/ProductAccordion';

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

function serializeProduct(p: any) {
  if (!p) return null;
  return {
    ...p,
    createdAt: p.createdAt?.toISOString?.() || p.createdAt,
    updatedAt: p.updatedAt?.toISOString?.() || p.updatedAt,
    brand: p.brand
      ? {
          ...p.brand,
          createdAt: p.brand.createdAt?.toISOString?.() || p.brand.createdAt,
          updatedAt: p.brand.updatedAt?.toISOString?.() || p.brand.updatedAt,
        }
      : null,
    productCategories: (p.productCategories || []).map((pc: any) => ({
      ...pc,
      category: pc.category
        ? {
            ...pc.category,
            createdAt: pc.category.createdAt?.toISOString?.() || pc.category.createdAt,
            updatedAt: pc.category.updatedAt?.toISOString?.() || pc.category.updatedAt,
          }
        : null,
    })),
    images: (p.images || []).map((img: any) => ({
      ...img,
      createdAt: img.createdAt?.toISOString?.() || img.createdAt,
      updatedAt: img.updatedAt?.toISOString?.() || img.updatedAt,
    })),
    variants: (p.variants || []).map((v: any) => ({
      ...v,
      price: v.price !== null && v.price !== undefined ? Number(v.price) : 0,
      comparePrice: v.comparePrice !== null && v.comparePrice !== undefined ? Number(v.comparePrice) : null,
      costPrice: v.costPrice !== null && v.costPrice !== undefined ? Number(v.costPrice) : null,
      weight: v.weight !== null && v.weight !== undefined ? Number(v.weight) : null,
      length: v.length !== null && v.length !== undefined ? Number(v.length) : null,
      width: v.width !== null && v.width !== undefined ? Number(v.width) : null,
      height: v.height !== null && v.height !== undefined ? Number(v.height) : null,
      createdAt: v.createdAt?.toISOString?.() || v.createdAt,
      updatedAt: v.updatedAt?.toISOString?.() || v.updatedAt,
      inventoryItem: v.inventoryItem
        ? {
            ...v.inventoryItem,
            createdAt: v.inventoryItem.createdAt?.toISOString?.() || v.inventoryItem.createdAt,
            updatedAt: v.inventoryItem.updatedAt?.toISOString?.() || v.inventoryItem.updatedAt,
          }
        : null,
    })),
    reviews: (p.reviews || []).map((r: any) => ({
      ...r,
      createdAt: r.createdAt?.toISOString?.() || r.createdAt,
      updatedAt: r.updatedAt?.toISOString?.() || r.updatedAt,
      user: r.user
        ? {
            ...r.user,
            createdAt: r.user.createdAt?.toISOString?.() || r.user.createdAt,
            updatedAt: r.user.updatedAt?.toISOString?.() || r.user.updatedAt,
            customerProfile: r.user.customerProfile
              ? {
                  ...r.user.customerProfile,
                  createdAt: r.user.customerProfile.createdAt?.toISOString?.() || r.user.customerProfile.createdAt,
                  updatedAt: r.user.customerProfile.updatedAt?.toISOString?.() || r.user.customerProfile.updatedAt,
                }
              : null,
          }
        : null,
    })),
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = await params;
  const rawProduct = await db.product.findUnique({
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

  if (!rawProduct || rawProduct.status === 'ARCHIVED') {
    notFound();
  }

  const product = serializeProduct(rawProduct);

  const baseVariant = product.variants[0] || {};
  const price = Number(baseVariant.price) || 1500;
  const compareAtPrice = baseVariant.comparePrice ? Number(baseVariant.comparePrice) : undefined;
  const rating = product.reviews.length > 0 ? product.reviews.reduce((acc: number, r: any) => acc + (r.rating || 5), 0) / product.reviews.length : 4.8;

  const firstCategory = product.productCategories?.[0]?.category;
  const categoryIds = product.productCategories.map((pc: any) => pc.categoryId);

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
    <div className="flex flex-col min-h-screen bg-white text-zinc-800 font-sans text-left">
      <AnnouncementBar />
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full">
        {/* Breadcrumbs */}
        <div className="text-[10px] uppercase tracking-wider text-zinc-400 flex items-center space-x-2 mb-8">
          <Link href="/" className="hover:text-[#FF4D00] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#FF4D00] transition-colors">Shop</Link>
          <span>/</span>
          {firstCategory && (
            <>
              <Link href={`/categories/${firstCategory.slug}`} className="hover:text-[#FF4D00] transition-colors">{firstCategory.name}</Link>
              <span>/</span>
            </>
          )}
          <span className="text-zinc-800 font-bold">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-12">
          {/* Images Gallery */}
          <ProductGallery images={product.images} title={product.title} />

          {/* Product Details info */}
          <div className="space-y-6">
            <div className="space-y-2">
              {product.brand && (
                <span className="text-[10px] tracking-[0.25em] text-[#FF4D00] uppercase font-black block">
                  {product.brand.name}
                </span>
              )}
              <h1 className="text-3xl font-light uppercase tracking-widest leading-tight text-zinc-900">
                {product.title}
              </h1>
              
              {/* Ratings */}
              <div className="flex items-center space-x-2 text-xs text-zinc-500 pt-1">
                <div className="flex text-[#FF4D00]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(rating) ? 'fill-current' : 'text-zinc-200'}`} />
                  ))}
                </div>
                <span className="font-bold text-zinc-800">{rating.toFixed(1)}</span>
                <span>({product.reviews.length} reviews)</span>
              </div>
            </div>

            <div className="border-t border-b border-zinc-200/80 py-4 space-y-2 font-num">
              <div className="flex items-center space-x-3">
                <span className="text-2xl font-black text-[#FF4D00]">${price.toLocaleString('en-US')}</span>
                {compareAtPrice && (
                  <span className="text-sm text-zinc-400 line-through">${compareAtPrice.toLocaleString('en-US')}</span>
                )}
              </div>
              <span className="text-[9px] uppercase tracking-wider text-green-600 font-bold block">
                {(baseVariant.inventoryItem?.quantity || 0) > 0 ? '✓ Product is in stock and ready' : '✕ Out of stock / Made to order'}
              </span>
              {price >= 10 && (
                <span className="inline-flex items-center text-[9px] uppercase tracking-wider text-green-600 font-black bg-green-500/10 px-2 py-0.5 rounded-[3px] border border-green-500/20 mt-1">
                  FREE SHIPPING
                </span>
              )}
            </div>

            <div className="text-zinc-650 text-xs leading-relaxed font-light">
              <p>{product.description}</p>
            </div>

            {/* Specifications Details */}
            <div className="bg-zinc-50 border border-zinc-200/80 p-4 rounded-xl space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-[#FF4D00]">Specifications</h4>
              <div className="grid grid-cols-2 gap-4 text-[10px] uppercase tracking-wider">
                <div>
                  <span className="text-zinc-400 block">SKU Code</span>
                  <span className="font-bold text-zinc-800 block mt-0.5">{baseVariant.sku || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block">Volume / Weight</span>
                  <span className="font-bold text-zinc-800 block mt-0.5">{baseVariant.weight ? `${Number(baseVariant.weight)} kg` : 'Standard Bottle'}</span>
                </div>
              </div>
            </div>

            {/* Real Add to Cart / Actions */}
            <div className="pt-2">
              <ProductActions product={product} />
            </div>

            {/* Policy highlights */}
            <div className="grid grid-cols-3 gap-4 border-t border-zinc-200/80 pt-6 text-[9px] uppercase tracking-wider text-zinc-455">
              <div className="flex flex-col items-center text-center space-y-1">
                <Shield className="h-5 w-5 text-[#FF4D00]" />
                <span className="font-bold text-zinc-500">100% Genuine</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-1">
                <Truck className="h-5 w-5 text-[#FF4D00]" />
                <span className="font-bold text-zinc-500">Fast Courier</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-1">
                <RotateCcw className="h-5 w-5 text-[#FF4D00]" />
                <span className="font-bold text-zinc-500">Slick Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Information Accordion */}
        <ProductAccordion description={product.description} reviews={product.reviews} rating={rating} />

        {/* Related Products Grid */}
        {related.length > 0 && (
          <section className="border-t border-zinc-200/80 pt-12 mt-16 space-y-8">
            <h3 className="text-lg font-light uppercase tracking-widest text-zinc-900">
              Related Products
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((rel: any) => {
                const relPrice = Number(rel.variants[0]?.price) || 1200;
                return (
                  <div key={rel.id} className="border border-zinc-200/80 bg-zinc-50/50 p-4 rounded-2xl flex flex-col justify-between text-left space-y-3 hover:border-[#FF4D00]/30 hover:shadow-md transition-all duration-300">
                    <div className="aspect-square bg-white flex items-center justify-center p-2 rounded-xl border border-zinc-100">
                      <img src={rel.images[0]?.url || 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600'} alt={rel.title} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div>
                      <Link href={`/products/${rel.slug}`}>
                        <h4 className="text-xs font-bold text-zinc-800 hover:text-[#FF4D00] transition-colors truncate">{rel.title}</h4>
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
export const revalidate = 300;
