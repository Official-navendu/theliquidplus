import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { ShopLayout } from '@/features/catalog/components/ShopLayout';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const brandMap: Record<string, { name: string; desc: string; banner: string }> = {
  'liquid-plus-professional': {
    name: 'Liquid Plus Professional',
    desc: 'High-concentration chemical products engineered for commercial detailers and ceramic coaters.',
    banner: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=1200',
  },
  'liquid-plus-core': {
    name: 'Liquid Plus Core',
    desc: 'Premium routine maintenance washing liquids, quick detailers, and glass cleaning sprays.',
    banner: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?q=80&w=1200',
  },
  'liquid-plus-accessories': {
    name: 'Liquid Plus Accessories',
    desc: 'Edgeless microfibers, plush buffing towels, and soft applicator block tools.',
    banner: 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=1200',
  },
};

export default async function BrandPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const brand = brandMap[slug];

  if (!brand) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <AnnouncementBar />
      <Header />
      <main className="flex-grow">
        
        {/* Brand Banner */}
        <div className="relative h-60 w-full flex items-center justify-center overflow-hidden border-b border-white/5 bg-[#050505]">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 blur-sm scale-105"
            style={{ backgroundImage: `url(${brand.banner})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
          
          <div className="relative z-20 text-center space-y-2 px-6">
            <span className="text-[9px] tracking-[0.3em] text-white uppercase font-bold">Lab Brand</span>
            <h1 className="text-3xl md:text-4xl font-light uppercase tracking-widest text-white">
              {brand.name}
            </h1>
            <p className="text-xs text-[#E5E5E5] max-w-md mx-auto font-light leading-relaxed">
              {brand.desc}
            </p>
          </div>
        </div>

        <ShopLayout initialBrand={brand.name} />

      </main>
      <Footer />
    </div>
  );
}
export const dynamicParams = true;
