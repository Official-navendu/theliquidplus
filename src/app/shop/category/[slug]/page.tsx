import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { ShopLayout } from '@/features/catalog/components/ShopLayout';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const categoryMap: Record<string, { name: string; desc: string; banner: string }> = {
  'ceramic-coatings': {
    name: 'Ceramic Coatings',
    desc: 'Nano-tech molecular sealants for hard crystalline protective layers.',
    banner: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=1200',
  },
  'car-shampoo': {
    name: 'Car Shampoo',
    desc: 'pH-neutral safe high-foaming car wash chemicals.',
    banner: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?q=80&w=1200',
  },
  'interior-care': {
    name: 'Interior Care',
    desc: 'Conditioners and protective sprays for leather, plastic, and vinyl dashboard elements.',
    banner: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200',
  },
  'exterior-care': {
    name: 'Exterior Care',
    desc: 'Slick quick detailers, waxes, clay lubrication, and paint conditioners.',
    banner: 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?q=80&w=1200',
  },
  'glass-care': {
    name: 'Glass Care',
    desc: 'Streak-free window cleaners safe for tint screens.',
    banner: 'https://images.unsplash.com/photo-1605558191976-9a00b77faac0?q=80&w=1200',
  },
  'wheels': {
    name: 'Wheel & Tire Care',
    desc: 'Brake dust iron fallout disintegrators and tyre dressings.',
    banner: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200',
  },
  'accessories': {
    name: 'Accessories',
    desc: 'Edgeless high-GSM microfiber buffing towels and coating applicator blocks.',
    banner: 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=1200',
  },
  'kits': {
    name: 'Detailing Kits',
    desc: 'Comprehensive premium products combos for detailing tasks.',
    banner: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200',
  },
};

export default async function CategoryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const category = categoryMap[slug];

  if (!category) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <AnnouncementBar />
      <Header />
      <main className="flex-grow">
        
        {/* Category Hero Banner */}
        <div className="relative h-60 w-full flex items-center justify-center overflow-hidden border-b border-white/5 bg-[#050505]">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 blur-sm scale-105"
            style={{ backgroundImage: `url(${category.banner})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
          
          <div className="relative z-20 text-center space-y-2 px-6">
            <span className="text-[9px] tracking-[0.3em] text-white uppercase font-bold">Category</span>
            <h1 className="text-3xl md:text-4xl font-light uppercase tracking-widest text-white">
              {category.name}
            </h1>
            <p className="text-xs text-[#E5E5E5] max-w-md mx-auto font-light leading-relaxed">
              {category.desc}
            </p>
          </div>
        </div>

        <ShopLayout initialCategory={category.name} />

      </main>
      <Footer />
    </div>
  );
}
export const dynamicParams = true;
