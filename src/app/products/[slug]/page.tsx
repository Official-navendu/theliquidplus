import * as React from 'react';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { Star, Shield, Truck, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
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

function serializeProduct(p: SafeAny) {
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
    productCategories: (p.productCategories || []).map((pc: SafeAny) => ({
      ...pc,
      category: pc.category
        ? {
            ...pc.category,
            createdAt: pc.category.createdAt?.toISOString?.() || pc.category.createdAt,
            updatedAt: pc.category.updatedAt?.toISOString?.() || pc.category.updatedAt,
          }
        : null,
    })),
    images: (p.images || []).map((img: SafeAny) => ({
      ...img,
      createdAt: img.createdAt?.toISOString?.() || img.createdAt,
      updatedAt: img.updatedAt?.toISOString?.() || img.updatedAt,
    })),
    variants: (p.variants || []).map((v: SafeAny) => ({
      ...v,
      price: v.price !== null && v.price !== undefined ? Number(v.price) : 0,
      comparePrice:
        v.comparePrice !== null && v.comparePrice !== undefined ? Number(v.comparePrice) : null,
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
    reviews: (p.reviews || []).map((r: SafeAny) => ({
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
                  createdAt:
                    r.user.customerProfile.createdAt?.toISOString?.() ||
                    r.user.customerProfile.createdAt,
                  updatedAt:
                    r.user.customerProfile.updatedAt?.toISOString?.() ||
                    r.user.customerProfile.updatedAt,
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
  const rating =
    product.reviews.length > 0
      ? product.reviews.reduce((acc: number, r: SafeAny) => acc + (r.rating || 5), 0) /
        product.reviews.length
      : 4.8;

  const firstCategory = product.productCategories?.[0]?.category;
  const categoryIds = product.productCategories.map((pc: SafeAny) => pc.categoryId);

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
    <div className="flex min-h-screen flex-col bg-white text-left font-sans text-zinc-800">
      <AnnouncementBar />
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-grow px-6 py-12">
        {/* Breadcrumbs */}
        <div className="mb-8 flex items-center space-x-2 text-[10px] tracking-wider text-zinc-400 uppercase">
          <Link href="/" className="transition-colors hover:text-[#FF4D00]">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="transition-colors hover:text-[#FF4D00]">
            Shop
          </Link>
          <span>/</span>
          {firstCategory && (
            <>
              <Link
                href={`/categories/${firstCategory.slug}`}
                className="transition-colors hover:text-[#FF4D00]"
              >
                {firstCategory.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="font-bold text-zinc-800">{product.title}</span>
        </div>

        <div className="mb-12 grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          {/* Images Gallery */}
          <ProductGallery images={product.images} title={product.title} />

          {/* Product Details info */}
          <div className="space-y-6">
            <div className="space-y-2">
              {product.brand && (
                <span className="block text-[10px] font-black tracking-[0.25em] text-[#FF4D00] uppercase">
                  {product.brand.name}
                </span>
              )}
              <h1 className="text-3xl leading-tight font-light tracking-widest text-zinc-900 uppercase">
                {product.title}
              </h1>

              {/* Ratings */}
              <div className="flex items-center space-x-2 pt-1 text-xs text-zinc-500">
                <div className="flex text-[#FF4D00]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${i < Math.round(rating) ? 'fill-current' : 'text-zinc-200'}`}
                    />
                  ))}
                </div>
                <span className="font-bold text-zinc-800">{rating.toFixed(1)}</span>
                <span>({product.reviews.length} reviews)</span>
              </div>
            </div>

            <div className="font-num space-y-2 border-t border-b border-zinc-200/80 py-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl font-black text-[#FF4D00]">
                  ${price.toLocaleString('en-US')}
                </span>
                {compareAtPrice && (
                  <span className="text-sm text-zinc-400 line-through">
                    ${compareAtPrice.toLocaleString('en-US')}
                  </span>
                )}
              </div>
              <span className="block text-[9px] font-bold tracking-wider text-green-600 uppercase">
                {(baseVariant.inventoryItem?.quantity || 0) > 0
                  ? '✓ Product is in stock and ready'
                  : '✕ Out of stock / Made to order'}
              </span>
              {price >= 10 && (
                <span className="mt-1 inline-flex items-center rounded-[3px] border border-green-500/20 bg-green-500/10 px-2 py-0.5 text-[9px] font-black tracking-wider text-green-600 uppercase">
                  FREE SHIPPING
                </span>
              )}
            </div>

            <div className="text-zinc-650 text-xs leading-relaxed font-light">
              <p>{product.description}</p>
            </div>

            {/* Specifications Details */}
            <div className="space-y-3 rounded-xl border border-zinc-200/80 bg-zinc-50 p-4">
              <h4 className="text-[10px] font-black tracking-widest text-[#FF4D00] uppercase">
                Specifications
              </h4>
              <div className="grid grid-cols-2 gap-4 text-[10px] tracking-wider uppercase">
                <div>
                  <span className="block text-zinc-400">SKU Code</span>
                  <span className="mt-0.5 block font-bold text-zinc-800">
                    {baseVariant.sku || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="block text-zinc-400">Volume / Weight</span>
                  <span className="mt-0.5 block font-bold text-zinc-800">
                    {baseVariant.weight ? `${Number(baseVariant.weight)} kg` : 'Standard Bottle'}
                  </span>
                </div>
              </div>
            </div>

            {/* Real Add to Cart / Actions */}
            <div className="pt-2">
              <ProductActions product={product} />
            </div>

            {/* Policy highlights */}
            <div className="text-zinc-455 grid grid-cols-3 gap-4 border-t border-zinc-200/80 pt-6 text-[9px] tracking-wider uppercase">
              <div className="flex flex-col items-center space-y-1 text-center">
                <Shield className="h-5 w-5 text-[#FF4D00]" />
                <span className="font-bold text-zinc-500">100% Genuine</span>
              </div>
              <div className="flex flex-col items-center space-y-1 text-center">
                <Truck className="h-5 w-5 text-[#FF4D00]" />
                <span className="font-bold text-zinc-500">Fast Courier</span>
              </div>
              <div className="flex flex-col items-center space-y-1 text-center">
                <RotateCcw className="h-5 w-5 text-[#FF4D00]" />
                <span className="font-bold text-zinc-500">Slick Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Information Accordion */}
        <ProductAccordion
          description={product.description}
          reviews={product.reviews}
          rating={rating}
        />

        {/* Related Products Grid */}
        {related.length > 0 && (
          <section className="mt-16 space-y-8 border-t border-zinc-200/80 pt-12">
            <h3 className="text-lg font-light tracking-widest text-zinc-900 uppercase">
              Related Products
            </h3>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {related.map((rel: SafeAny) => {
                const relPrice = Number(rel.variants[0]?.price) || 1200;
                return (
                  <div
                    key={rel.id}
                    className="flex flex-col justify-between space-y-3 rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-4 text-left transition-all duration-300 hover:border-[#FF4D00]/30 hover:shadow-md"
                  >
                    <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-zinc-100 bg-white p-2">
                      <Image
                        src={
                          rel.images[0]?.url ||
                          'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600'
                        }
                        alt={rel.title}
                        fill
                        className="object-contain p-2"
                        unoptimized={(rel.images[0]?.url || '').startsWith('data:')}
                      />
                    </div>
                    <div>
                      <Link href={`/products/${rel.slug}`}>
                        <h4 className="truncate text-xs font-bold text-zinc-800 transition-colors hover:text-[#FF4D00]">
                          {rel.title}
                        </h4>
                      </Link>
                      <span className="font-num mt-1 block text-xs font-black text-[#FF4D00]">
                        ${relPrice.toLocaleString('en-US')}
                      </span>
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
