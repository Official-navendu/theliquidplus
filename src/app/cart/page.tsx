import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { CartPageContainer } from '@/features/catalog/components/CartPageContainer';

export default function CartPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <AnnouncementBar />
      <Header />
      <main className="flex-grow">
        <CartPageContainer />
      </main>
      <Footer />
    </div>
  );
}
