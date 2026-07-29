import * as React from 'react';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import Link from 'next/link';
import Image from 'next/image';

interface CategoryDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryDetailPage({ params }: CategoryDetailPageProps) {
  const resolvedParams = await params;
  const category = await db.category.findUnique({
    where: { slug: resolvedParams.slug },
    include: {
      productCategories: {
        include: {
          product: {
            include: {
              images: { orderBy: { sortOrder: 'asc' } },
              variants: true,
            },
          },
        },
      },
    },
  });

  if (!category) {
    notFound();
  }

  const products = (category.productCategories || [])
    .map((pc: SafeAny) => pc.product)
    .filter((p: SafeAny) => p && p.status !== 'ARCHIVED');

  return (
    <div className="flex min-h-screen flex-col bg-black text-left font-sans text-white">
      <AnnouncementBar />
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-grow px-6 py-12">
        {/* Banner/Header Block */}
        <div className="relative mb-12 flex min-h-[220px] flex-col justify-center overflow-hidden rounded-3xl border border-white/5 bg-[#0a0a0a] p-8 sm:p-12">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25"
            style={{
              backgroundImage: `url(${category.imageUrl || 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=400'})`,
            }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />

          <div className="relative z-10 max-w-xl space-y-3">
            <span className="block text-[9px] font-black tracking-[0.25em] text-[#FF4D00] uppercase">
              Collection Group
            </span>
            <h1 className="text-3xl leading-tight font-light tracking-widest text-white uppercase sm:text-4xl">
              {category.name}
            </h1>
            <p className="text-xs leading-relaxed font-light text-zinc-400">
              {category.description ||
                'Professional automotive detailing products and accessories curated under this collection.'}
            </p>
          </div>
        </div>

        {/* Product Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <span className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
              {products.length} products found
            </span>
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center space-y-3 rounded-2xl border border-dashed border-white/10 bg-black/10 py-20 text-center text-zinc-500">
              <span className="text-[10px] font-bold tracking-wider uppercase">
                No products currently available in this category.
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {products.map((p: SafeAny) => {
                const price = Number(p.variants[0]?.price) || 1500;
                return (
                  <div
                    key={p.id}
                    className="flex flex-col justify-between space-y-3 rounded-2xl border border-white/5 bg-[#0a0a0a] p-4 text-left transition-all duration-300 hover:border-white/20"
                  >
                    <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-xl bg-black p-2">
                      <Image
                        src={
                          p.images[0]?.url ||
                          'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600'
                        }
                        alt={p.title}
                        fill
                        className="object-contain p-2"
                        unoptimized={(p.images[0]?.url || '').startsWith('data:')}
                      />
                    </div>
                    <div className="space-y-1">
                      <Link href={`/products/${p.slug}`}>
                        <h3 className="truncate text-xs font-bold text-white transition-colors hover:text-[#FF4D00]">
                          {p.title}
                        </h3>
                      </Link>
                      <span className="font-num block text-xs font-black text-[#FF4D00]">
                        ${price.toLocaleString('en-US')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
export const revalidate = 300;
