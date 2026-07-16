import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { PRODUCTS } from '@/features/catalog/constants/products';
import { ProductGallery } from '@/features/catalog/components/ProductGallery';
import { ProductInfo } from '@/features/catalog/components/ProductInfo';
import { ProductTabs } from '@/features/catalog/components/ProductTabs';
import { RelatedProducts } from '@/features/catalog/components/RelatedProducts';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // Align custom user criteria (slug fallback check)
  const product = PRODUCTS.find(
    (p) =>
      p.slug === slug ||
      (slug === 'ultimate-ceramic-coating' && p.slug === 'ultimate-ceramic-coating-9h')
  );

  if (!product) {
    notFound();
  }

  // Generate 8+ detailed visual gallery images
  const galleryImages = [
    product.image,
    product.hoverImage,
    'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=600',
    'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?q=80&w=600',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600',
    'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?q=80&w=600',
    'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=600',
    'https://images.unsplash.com/photo-1627124718133-0112dec7a6a4?q=80&w=600',
  ];

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <AnnouncementBar />
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-8 w-full space-y-12">
        {/* Breadcrumb Navigation */}
        <div className="text-[10px] tracking-widest uppercase text-zinc-500 flex items-center space-x-2">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-[#FF4D00] font-medium">{product.name}</span>
        </div>

        {/* Master Details Split Screen Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Product Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery images={galleryImages} />
          </div>

          {/* Right Column: Product Information & Checkout Card */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Tab specifications and reviews */}
        <ProductTabs product={product} />

        {/* Related Product Grid recommendations */}
        <RelatedProducts currentProduct={product} />
      </main>

      <Footer />
    </div>
  );
}
export const dynamicParams = true;
export const dynamic = 'force-static';

export async function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}
