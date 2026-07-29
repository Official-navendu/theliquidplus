import * as React from 'react';
import { db } from '@/lib/db';
import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import Link from 'next/link';

export default async function CategoriesIndexPage() {
  const categories = await db.category.findMany({
    where: { parentId: null },
  });

  return (
    <div className="flex min-h-screen flex-col bg-black text-left font-sans text-white">
      <AnnouncementBar />
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-grow space-y-12 px-6 py-16">
        <div className="mx-auto max-w-2xl space-y-3 text-center">
          <span className="block text-[10px] font-black tracking-[0.3em] text-[#FF4D00] uppercase">
            Core Products
          </span>
          <h1 className="text-3xl font-light tracking-widest text-white uppercase sm:text-4xl">
            Product Categories
          </h1>
          <div className="mx-auto mt-2 h-[2px] w-12 bg-[#FF4D00]" />
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/categories/${cat.slug}`}>
              <div className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-2xl border border-white/5 bg-[#0a0a0a] p-6 transition-all duration-300 hover:border-[#FF4D00]/50">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-40 transition-all duration-700 ease-out group-hover:scale-115 group-hover:opacity-60"
                  style={{
                    backgroundImage: `url(${cat.imageUrl || 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=400'})`,
                  }}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="relative z-10 space-y-1">
                  <h3 className="text-sm font-bold tracking-widest text-white uppercase transition-colors group-hover:text-[#FF4D00]">
                    {cat.name}
                  </h3>
                  <span className="block text-[9px] font-light tracking-wider text-zinc-400 uppercase">
                    Explore products
                  </span>
                </div>
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
