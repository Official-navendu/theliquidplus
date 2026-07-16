import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { CheckoutPageContainer } from '@/features/catalog/components/CheckoutPageContainer';

export default function CheckoutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <AnnouncementBar />
      <Header />
      <main className="flex-grow">
        <CheckoutPageContainer />
      </main>
      <Footer />
    </div>
  );
}
export const dynamic = 'force-dynamic';
