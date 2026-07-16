'use client';

import * as React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminNavbar } from '@/components/admin/AdminNavbar';
import { AdminLoading } from '@/components/admin/AdminFeedbackPrimitives';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login?callbackUrl=/admin/dashboard');
    } else if (status === 'authenticated' && session?.user?.role !== 'SUPER_ADMIN' && session?.user?.role !== 'ADMIN') {
      router.replace('/account');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <AdminLoading />
      </div>
    );
  }

  // If unauthorized, do not render layout content while redirecting
  if (!session || (session.user?.role !== 'SUPER_ADMIN' && session.user?.role !== 'ADMIN')) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <AdminLoading />
      </div>
    );
  }

  return (
    <div className="dark bg-black text-white min-h-screen flex">
      {/* Sidebar - Desktop and Tablet collapsible */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-h-screen overflow-x-hidden">
        {/* Sticky Header */}
        <AdminNavbar />

        {/* Page Content */}
        <main className="flex-grow p-6 sm:p-8 bg-[#050505] text-left">
          {children}
        </main>
      </div>
    </div>
  );
}
