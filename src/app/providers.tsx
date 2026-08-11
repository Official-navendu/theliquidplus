'use client';

import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { MiniCart } from '@/features/catalog/components/MiniCart';
import { CompareDrawer } from '@/features/catalog/components/CompareDrawer';

import { SessionProvider } from 'next-auth/react';

import type { Session } from 'next-auth';

export function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: Session | null;
}) {
  // Creating QueryClient inside a useState hook prevents sharing query cache
  // between users on the server side under Concurrent Features.
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute stale time
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light">
        <QueryClientProvider client={queryClient}>
          {children}
          <MiniCart />
          <CompareDrawer />
          <Toaster
            closeButton
            position="top-right"
            toastOptions={{
              className:
                '!bg-white/85 !backdrop-blur-xl !border-zinc-200/80 !shadow-[0_8px_30px_rgba(0,0,0,0.06)] !p-4 !rounded-2xl !flex !items-center !gap-3 !text-zinc-900 !font-sans',
              style: {
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(228, 228, 231, 0.8)',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.06)',
                borderRadius: '16px',
                color: '#18181b',
              },
              classNames: {
                success: '!border-l-4 !border-l-green-500',
                error: '!border-l-4 !border-l-red-500',
                warning: '!border-l-4 !border-l-amber-500',
                info: '!border-l-4 !border-l-[#FF4D00]',
              },
            }}
          />
        </QueryClientProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
