import * as React from 'react';
import { db } from '@/lib/db';
import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import Link from 'next/link';

export default async function BrandsIndexPage() {
  const brands = await db.brand.findMany();

  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans text-left">
      <AnnouncementBar />
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-16 w-full space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] tracking-[0.3em] text-[#FF4D00] uppercase font-black block">
            Partner Catalog
          </span>
          <h1 className="text-3xl sm:text-4xl font-light uppercase tracking-widest text-white">
            Detailing Partner Brands
          </h1>
          <div className="w-12 h-[2px] bg-[#FF4D00] mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {brands.map((b) => (
            <Link key={b.id} href={`/brands/${b.slug}`}>
              <div className="group border border-white/5 bg-[#0a0a0a] rounded-2xl p-6 flex flex-col items-center justify-center space-y-4 hover:border-[#FF4D00]/50 transition-all duration-300 min-h-[160px] text-center">
                {b.logoUrl ? (
                  <img src={b.logoUrl} alt={b.name} className="h-10 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500" />
                ) : (
                  <span className="text-lg font-black uppercase tracking-widest text-zinc-600 group-hover:text-[#FF4D00] transition-colors">{b.name}</span>
                )}
                <span className="text-[8px] uppercase tracking-wider text-zinc-500 font-bold block">View catalog</span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
export const dynamic = 'force-dynamic';
