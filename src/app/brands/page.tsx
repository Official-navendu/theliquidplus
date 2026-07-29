import * as React from 'react';
import { db } from '@/lib/db';
import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import Link from 'next/link';
import Image from 'next/image';

export default async function BrandsIndexPage() {
  const brands = await db.brand.findMany();

  return (
    <div className="flex min-h-screen flex-col bg-black text-left font-sans text-white">
      <AnnouncementBar />
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-grow space-y-12 px-6 py-16">
        <div className="mx-auto max-w-2xl space-y-3 text-center">
          <span className="block text-[10px] font-black tracking-[0.3em] text-[#FF4D00] uppercase">
            Partner Catalog
          </span>
          <h1 className="text-3xl font-light tracking-widest text-white uppercase sm:text-4xl">
            Detailing Partner Brands
          </h1>
          <div className="mx-auto mt-2 h-[2px] w-12 bg-[#FF4D00]" />
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {brands.map((b) => (
            <Link key={b.id} href={`/brands/${b.slug}`}>
              <div className="group flex min-h-[160px] flex-col items-center justify-center space-y-4 rounded-2xl border border-white/5 bg-[#0a0a0a] p-6 text-center transition-all duration-300 hover:border-[#FF4D00]/50">
                {b.logoUrl ? (
                  <div className="relative h-10 w-28">
                    <Image
                      src={b.logoUrl}
                      alt={b.name}
                      fill
                      className="object-contain grayscale filter transition-all duration-500 group-hover:grayscale-0"
                      unoptimized={b.logoUrl.startsWith('data:')}
                    />
                  </div>
                ) : (
                  <span className="text-lg font-black tracking-widest text-zinc-600 uppercase transition-colors group-hover:text-[#FF4D00]">
                    {b.name}
                  </span>
                )}
                <span className="block text-[8px] font-bold tracking-wider text-zinc-500 uppercase">
                  View catalog
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
export const revalidate = 300;
