import * as React from 'react';
import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'About Us | The Liquid Plus Detailing Laboratory',
  description:
    'Discover the heritage of The Liquid Plus. We formulate professional-grade ceramic coatings, gloss enhancers, and interior protective shields for luxury automotive collectors worldwide.',
  openGraph: {
    title: 'About Us | The Liquid Plus',
    description:
      'Discover the heritage of The Liquid Plus. We formulate professional-grade ceramic coatings, gloss enhancers, and interior protective shields.',
    url: 'https://theliquidplus.com/about',
    images: [{ url: '/assets/about-studio.webp' }],
  },
  alternates: {
    canonical: 'https://theliquidplus.com/about',
  },
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 text-left font-sans text-zinc-800">
      <AnnouncementBar />
      <Header />

      <main className="flex-grow space-y-16 pt-24 pb-16">
        {/* Hero Section */}
        <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2">
          <div className="space-y-6">
            <span className="block text-[10px] font-black tracking-[0.3em] text-[#FF4D00] uppercase">
              Our Laboratory Heritage
            </span>
            <h1 className="text-3xl leading-tight font-light tracking-widest text-zinc-900 uppercase sm:text-5xl">
              Pioneering Automotive Protection
            </h1>
            <p className="text-zinc-650 text-sm leading-relaxed font-light">
              Founded at the intersection of material science and automotive perfection, The Liquid
              Plus is dedicated to engineering the absolute highest standards of surface coatings.
              Every formula is meticulously developed inside our advanced laboratories to defend
              high-end automobiles from environmental degradation while enhancing paint depth.
            </p>
            <p className="text-zinc-650 text-sm leading-relaxed font-light">
              From our flagship 9H quartz coatings to custom dual-pile microfiber formulations, we
              prioritize optical clarity, hydrophobic durability, and ease of application. We do not
              manufacture consumer detailing sprays; we build enterprise-grade surface barriers.
            </p>
            <div className="pt-4">
              <Link
                href="/shop"
                className="inline-block rounded-xl bg-zinc-950 px-8 py-4 text-[10px] font-black tracking-widest text-white uppercase transition-all hover:scale-[1.02] hover:bg-zinc-900"
              >
                Explore Lab Formulas
              </Link>
            </div>
          </div>

          {/* Interactive Image Frame */}
          <div className="border-zinc-250/50 relative aspect-[16/10] overflow-hidden rounded-[28px] border bg-zinc-200 shadow-lg">
            <Image
              src="/assets/about-studio.webp"
              alt="The Liquid Plus Professional Detailing Laboratory Studio"
              fill
              className="object-cover"
              priority
            />
          </div>
        </section>

        {/* Philosophy Block */}
        <section className="border-t border-b border-zinc-200/80 bg-white py-16">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 md:grid-cols-3">
            <div className="space-y-3">
              <h3 className="text-xs font-black tracking-widest text-zinc-900 uppercase">
                01. Precision Formulation
              </h3>
              <p className="text-[11px] leading-relaxed font-light text-zinc-500">
                We utilize inorganic silica chemistry to create three-dimensional crystal structures
                that cross-link on raw clear coats, ensuring chemical resistances and extreme paint
                slickness.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-xs font-black tracking-widest text-zinc-900 uppercase">
                02. Microfiber Engineering
              </h3>
              <p className="text-[11px] leading-relaxed font-light text-zinc-500">
                Our towel fibers are split at microscopic scales and woven in dense structures to
                pick up residue without introducing micromarring or swirling on delicate soft
                paints.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-xs font-black tracking-widest text-zinc-900 uppercase">
                03. Professional Trust
              </h3>
              <p className="text-[11px] leading-relaxed font-light text-zinc-500">
                Trusted by concours judges, detailing boutiques, and premium transport operations in
                over forty countries to maintain surface values.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
