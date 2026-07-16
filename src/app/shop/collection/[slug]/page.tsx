import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { ShopLayout } from '@/features/catalog/components/ShopLayout';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const collectionMap: Record<string, { key: string; name: string; desc: string; banner: string }> = {
  'nano-tech': {
    key: 'nano-tech',
    name: 'Nano-Tech Series',
    desc: 'Advanced organosilane nano-ceramic products engineered at the molecular level for ultimate paint hardness.',
    banner: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=1200',
  },
  'best-sellers': {
    key: 'best-sellers',
    name: 'Best Sellers Collection',
    desc: 'The detailing products trusted and utilized daily by professional detailers worldwide.',
    banner: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?q=80&w=1200',
  },
};

export default async function CollectionPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const collection = collectionMap[slug];

  if (!collection) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <AnnouncementBar />
      <Header />
      <main className="flex-grow">
        
        {/* Collection Banner */}
        <div className="relative h-60 w-full flex items-center justify-center overflow-hidden border-b border-white/5 bg-[#050505]">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 blur-sm scale-105"
            style={{ backgroundImage: `url(${collection.banner})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
          
          <div className="relative z-20 text-center space-y-2 px-6">
            <span className="text-[9px] tracking-[0.3em] text-white uppercase font-bold">Featured Collection</span>
            <h1 className="text-3xl md:text-4xl font-light uppercase tracking-widest text-white">
              {collection.name}
            </h1>
            <p className="text-xs text-[#E5E5E5] max-w-md mx-auto font-light leading-relaxed">
              {collection.desc}
            </p>
          </div>
        </div>

        <ShopLayout initialCollection={collection.key} />

      </main>
      <Footer />
    </div>
  );
}
export const dynamicParams = true;
