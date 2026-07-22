/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element */
import * as React from 'react';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import Link from 'next/link';

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
    .map((pc: any) => pc.product)
    .filter((p: any) => p && p.status !== 'ARCHIVED');

  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans text-left">
      <AnnouncementBar />
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full">
        {/* Banner/Header Block */}
        <div className="relative border border-white/5 bg-[#0a0a0a] rounded-3xl overflow-hidden p-8 sm:p-12 mb-12 flex flex-col justify-center min-h-[220px]">
          <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: `url(${category.imageUrl || 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=400'})` }} />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent pointer-events-none" />
          
          <div className="relative z-10 max-w-xl space-y-3">
            <span className="text-[9px] tracking-[0.25em] text-[#FF4D00] uppercase font-black block">Collection Group</span>
            <h1 className="text-3xl sm:text-4xl font-light uppercase tracking-widest text-white leading-tight">{category.name}</h1>
            <p className="text-zinc-400 text-xs leading-relaxed font-light">{category.description || 'Professional automotive detailing products and accessories curated under this collection.'}</p>
          </div>
        </div>

        {/* Product Grid */}
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">{products.length} products found</span>
          </div>

          {products.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-white/10 bg-black/10 rounded-2xl flex flex-col items-center justify-center space-y-3 text-zinc-500">
              <span className="text-[10px] uppercase font-bold tracking-wider">No products currently available in this category.</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {products.map((p: any) => {
                const price = Number(p.variants[0]?.price) || 1500;
                return (
                  <div key={p.id} className="border border-white/5 bg-[#0a0a0a] p-4 rounded-2xl flex flex-col justify-between text-left space-y-3 hover:border-white/20 transition-all duration-300">
                    <div className="aspect-[4/5] bg-black flex items-center justify-center p-2 rounded-xl overflow-hidden relative">
                      <img src={p.images[0]?.url || 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600'} alt={p.title} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="space-y-1">
                      <Link href={`/products/${p.slug}`}>
                        <h3 className="text-xs font-bold text-white hover:text-[#FF4D00] transition-colors truncate">{p.title}</h3>
                      </Link>
                      <span className="text-[#FF4D00] font-num text-xs font-black block">${price.toLocaleString('en-US')}</span>
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
