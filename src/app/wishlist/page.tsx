import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { WishlistPageContainer } from '@/features/catalog/components/WishlistPageContainer';

export default function WishlistPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <AnnouncementBar />
      <Header />
      <main className="flex-grow">
        <WishlistPageContainer />
      </main>
      <Footer />
    </div>
  );
}
