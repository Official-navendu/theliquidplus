import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { ShopLayout } from '@/features/catalog/components/ShopLayout';

export default function ShopPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <AnnouncementBar />
      <Header />
      <main className="flex-grow">
        <ShopLayout />
      </main>
      <Footer />
    </div>
  );
}
