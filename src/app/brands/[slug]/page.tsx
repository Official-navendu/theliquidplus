/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element */
import * as React from 'react';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import Link from 'next/link';

interface BrandDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BrandDetailPage({ params }: BrandDetailPageProps) {
  const resolvedParams = await params;
  const brand = await db.brand.findUnique({
    where: { slug: resolvedParams.slug },
    include: {
      products: {
        where: { status: { in: ['ACTIVE', 'DRAFT', 'REVIEW'] } },
        include: {
          images: { orderBy: { sortOrder: 'asc' } },
          variants: true,
        },
      },
    },
  });

  if (!brand) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans text-left">
      <AnnouncementBar />
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full">
        {/* Brand details header */}
        <div className="border border-white/5 bg-[#0a0a0a] rounded-3xl p-8 sm:p-12 mb-12 flex flex-col sm:flex-row items-center sm:space-x-8 text-center sm:text-left space-y-6 sm:space-y-0">
          <div className="h-20 w-32 bg-black border border-white/5 rounded-xl flex items-center justify-center p-3">
            {brand.logoUrl ? (
              <img src={brand.logoUrl} alt={brand.name} className="max-h-full max-w-full object-contain" />
            ) : (
              <span className="text-sm font-black uppercase tracking-widest text-[#FF4D00]">{brand.name}</span>
            )}
          </div>
          <div className="space-y-2">
            <span className="text-[9px] tracking-[0.25em] text-[#FF4D00] uppercase font-black block">Official Partner</span>
            <h1 className="text-3xl font-light uppercase tracking-widest text-white">{brand.name}</h1>
            <p className="text-zinc-500 text-[10px] uppercase tracking-wider font-mono">Slug: /brands/{brand.slug}</p>
          </div>
        </div>

        {/* Product Grid */}
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">{brand.products.length} products found</span>
          </div>

          {brand.products.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-white/10 bg-black/10 rounded-2xl flex flex-col items-center justify-center space-y-3 text-zinc-500">
              <span className="text-[10px] uppercase font-bold tracking-wider">No products currently cataloged for this brand.</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {brand.products.map((p) => {
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
