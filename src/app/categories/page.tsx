/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element */
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
    <div className="flex flex-col min-h-screen bg-black text-white font-sans text-left">
      <AnnouncementBar />
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-16 w-full space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] tracking-[0.3em] text-[#FF4D00] uppercase font-black block">
            Core Products
          </span>
          <h1 className="text-3xl sm:text-4xl font-light uppercase tracking-widest text-white">
            Product Categories
          </h1>
          <div className="w-12 h-[2px] bg-[#FF4D00] mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/categories/${cat.slug}`}>
              <div className="group relative border border-white/5 bg-[#0a0a0a] rounded-2xl overflow-hidden aspect-[4/3] flex flex-col justify-end p-6 hover:border-[#FF4D00]/50 transition-all duration-300">
                <div className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:scale-115 group-hover:opacity-60 transition-all duration-700 ease-out" style={{ backgroundImage: `url(${cat.imageUrl || 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=400'})` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
                <div className="relative z-10 space-y-1">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white group-hover:text-[#FF4D00] transition-colors">{cat.name}</h3>
                  <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-light block">Explore products</span>
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
