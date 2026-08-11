import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { ShopLayout } from '@/features/catalog/components/ShopLayout';
import { getStorefrontProducts } from '@/features/catalog/services/storefront';

export default async function ShopPage() {
  const products = await getStorefrontProducts();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <AnnouncementBar />
      <Header />
      <main className="flex-grow pt-24 md:pt-28">
        <ShopLayout initialProducts={products} />
      </main>
      <Footer />
    </div>
  );
}
