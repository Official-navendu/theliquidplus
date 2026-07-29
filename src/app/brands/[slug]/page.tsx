import * as React from 'react';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import Link from 'next/link';
import Image from 'next/image';

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
    <div className="flex min-h-screen flex-col bg-black text-left font-sans text-white">
      <AnnouncementBar />
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-grow px-6 py-12">
        {/* Brand details header */}
        <div className="mb-12 flex flex-col items-center space-y-6 rounded-3xl border border-white/5 bg-[#0a0a0a] p-8 text-center sm:flex-row sm:space-y-0 sm:space-x-8 sm:p-12 sm:text-left">
          <div className="relative flex h-20 w-32 items-center justify-center overflow-hidden rounded-xl border border-white/5 bg-black p-3">
            {brand.logoUrl ? (
              <Image
                src={brand.logoUrl}
                alt={brand.name}
                fill
                className="object-contain p-3"
                unoptimized={brand.logoUrl.startsWith('data:')}
              />
            ) : (
              <span className="text-sm font-black tracking-widest text-[#FF4D00] uppercase">
                {brand.name}
              </span>
            )}
          </div>
          <div className="space-y-2">
            <span className="block text-[9px] font-black tracking-[0.25em] text-[#FF4D00] uppercase">
              Official Partner
            </span>
            <h1 className="text-3xl font-light tracking-widest text-white uppercase">
              {brand.name}
            </h1>
            <p className="font-mono text-[10px] tracking-wider text-zinc-500 uppercase">
              Slug: /brands/{brand.slug}
            </p>
          </div>
        </div>

        {/* Product Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <span className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
              {brand.products.length} products found
            </span>
          </div>

          {brand.products.length === 0 ? (
            <div className="flex flex-col items-center justify-center space-y-3 rounded-2xl border border-dashed border-white/10 bg-black/10 py-20 text-center text-zinc-500">
              <span className="text-[10px] font-bold tracking-wider uppercase">
                No products currently cataloged for this brand.
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {brand.products.map((p) => {
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
