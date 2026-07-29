import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { CheckoutPageContainer } from '@/features/catalog/components/CheckoutPageContainer';

export default function CheckoutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <AnnouncementBar />
      <Header />
      <main className="flex-grow bg-zinc-50">
        <CheckoutPageContainer />
      </main>
      <Footer />
    </div>
  );
}
export const dynamic = 'force-dynamic';
