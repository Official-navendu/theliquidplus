import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { ShopLayout } from '@/features/catalog/components/ShopLayout';
import { getStorefrontProducts } from '@/features/catalog/services/storefront';
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

  const products = await getStorefrontProducts();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <AnnouncementBar />
      <Header />
      <main className="flex-grow">
        {/* Collection Banner */}
        <div className="relative flex h-60 w-full items-center justify-center overflow-hidden border-b border-white/5 bg-[#050505]">
          <div
            className="absolute inset-0 scale-105 bg-cover bg-center opacity-30 blur-sm"
            style={{ backgroundImage: `url(${collection.banner})` }}
          />
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/40 to-transparent" />

          <div className="relative z-20 space-y-2 px-6 text-center">
            <span className="text-[9px] font-bold tracking-[0.3em] text-white uppercase">
              Featured Collection
            </span>
            <h1 className="text-3xl font-light tracking-widest text-white uppercase md:text-4xl">
              {collection.name}
            </h1>
            <p className="mx-auto max-w-md text-xs leading-relaxed font-light text-[#E5E5E5]">
              {collection.desc}
            </p>
          </div>
        </div>

        <ShopLayout initialCollection={collection.key} initialProducts={products} />
      </main>
      <Footer />
    </div>
  );
}
export const dynamicParams = true;
