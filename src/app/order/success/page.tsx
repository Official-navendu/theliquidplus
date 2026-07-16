import * as React from 'react';
import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { OrderSuccessPageContainer } from '@/features/catalog/components/OrderSuccessPageContainer';

export default function OrderSuccessPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <AnnouncementBar />
      <Header />
      <main className="flex-grow">
        <React.Suspense fallback={
          <div className="bg-black min-h-screen flex items-center justify-center text-center">
            <span className="text-zinc-500 text-xs tracking-wider uppercase">Verifying transaction...</span>
          </div>
        }>
          <OrderSuccessPageContainer />
        </React.Suspense>
      </main>
      <Footer />
    </div>
  );
}
export const dynamic = 'force-dynamic';
