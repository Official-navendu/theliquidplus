import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { AccountLayout } from '@/features/catalog/components/AccountLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <AnnouncementBar />
      <Header />
      <main className="flex-grow py-8">
        <AccountLayout>{children}</AccountLayout>
      </main>
      <Footer />
    </div>
  );
}
export const dynamic = 'force-dynamic';
