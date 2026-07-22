import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import { Providers } from './providers';
import { SITE_CONFIG } from '@/config/site';
import './globals.css';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.seo.defaultTitle,
    template: SITE_CONFIG.seo.titleTemplate,
  },
  description: SITE_CONFIG.description,
  metadataBase: new URL(SITE_CONFIG.url),
  keywords: [...SITE_CONFIG.seo.keywords],
  authors: [{ name: SITE_CONFIG.name }],
  creator: SITE_CONFIG.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_CONFIG.url,
    title: SITE_CONFIG.seo.defaultTitle,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.seo.defaultTitle,
    description: SITE_CONFIG.description,
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} font-sans min-h-screen bg-[#0A0A0A] text-white antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
