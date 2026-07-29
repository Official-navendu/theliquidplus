import * as React from 'react';
import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';

export default function PoliciesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 text-left font-sans text-zinc-800">
      <AnnouncementBar />
      <Header />
      <main className="flex-grow pt-28 pb-16">
        <div className="mx-auto max-w-4xl px-6">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
