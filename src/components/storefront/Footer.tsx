'use client';

import * as React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { toast } from 'sonner';

export function Footer() {
  const [email, setEmail] = React.useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      toast.success('Thank you for subscribing to our luxury detailing digest!');
      setEmail('');
    }
  };

  return (
    <footer className="theme-dark border-t border-white/5 bg-[#070707] pt-20 pb-10 text-left text-white">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        {/* 4 Equal Columns Grid */}
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand details & Socials */}
          <div className="space-y-6">
            <Link href="/" className="block">
              <Logo className="h-5 w-auto" />
            </Link>
            <p className="text-xs leading-relaxed font-light tracking-wide text-zinc-400">
              The Liquid Plus designs and synthesizes advanced hydrophobic ceramic nano-coatings and
              bespoke surface detailing solutions for elite automotive collectors and enthusiasts.
            </p>
            <div className="flex items-center space-x-3.5 pt-2">
              <a
                href="https://facebook.com"
                className="text-zinc-500 transition-colors hover:text-[#FF4D00]"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                className="text-zinc-500 transition-colors hover:text-[#FF4D00]"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                className="text-zinc-500 transition-colors hover:text-[#FF4D00]"
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                className="text-zinc-500 transition-colors hover:text-[#FF4D00]"
                aria-label="YouTube"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                  <polyline points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                className="text-zinc-500 transition-colors hover:text-[#FF4D00]"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a
                href="https://pinterest.com"
                className="text-zinc-500 transition-colors hover:text-[#FF4D00]"
                aria-label="Pinterest"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8 22a9 9 0 0 1-1.91-8.3A11.39 11.39 0 0 1 16.5 3.5a10 10 0 0 1 2.8 19.3m-9.5-6.5L12 9a4 4 0 0 1 7.8 1.8c0 2.3-1.1 4.6-3.1 5.3a2 2 0 0 1-2.7-1.8" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-5">
            {/* Heading color set to brand orange */}
            <h3 className="text-[10px] font-black tracking-[0.25em] !text-[#FF4D00] uppercase">
              Quick Links
            </h3>
            <ul className="space-y-3 text-xs font-light text-zinc-400">
              <li>
                <Link href="/" className="transition-colors hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="transition-colors hover:text-white">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/shop#collections" className="transition-colors hover:text-white">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/blog" className="transition-colors hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition-colors hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="transition-colors hover:text-white">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Policies */}
          <div className="space-y-5">
            {/* Heading color set to brand orange */}
            <h3 className="text-[10px] font-black tracking-[0.25em] !text-[#FF4D00] uppercase">
              Policies
            </h3>
            <ul className="space-y-3 text-xs font-light text-zinc-400">
              <li>
                <Link href="/privacy-policy" className="transition-colors hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="transition-colors hover:text-white">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="transition-colors hover:text-white">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="transition-colors hover:text-white">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="transition-colors hover:text-white">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="transition-colors hover:text-white">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-5">
            {/* Heading color set to brand orange */}
            <h3 className="text-[10px] font-black tracking-[0.25em] !text-[#FF4D00] uppercase">
              Newsletter
            </h3>
            <p className="text-xs leading-relaxed font-light tracking-wide text-zinc-400">
              Subscribe to unlock early access to new product formulations and laboratory research
              updates.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2 sm:flex-row">
              <input
                type="email"
                required
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 font-mono text-xs text-white outline-none focus:border-[#FF4D00]"
              />
              <button
                type="submit"
                className="w-full cursor-pointer rounded-lg border-0 bg-[#FF4D00] px-4 py-2 text-[9px] font-black tracking-wider text-white uppercase transition-all hover:bg-[#FF4D00]/80 sm:w-auto"
              >
                Subscribe
              </button>
            </form>
            <div className="mt-1 inline-flex items-center space-x-1.5 rounded-[4px] border border-white/10 bg-white/5 px-2.5 py-1 text-[9px] font-bold tracking-wider text-zinc-400 uppercase">
              <span>Join 10,000+ detailing enthusiasts</span>
            </div>
          </div>
        </div>

        {/* Separator & Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-[9px] font-bold tracking-wider text-zinc-500 uppercase md:flex-row">
          <div>© {new Date().getFullYear()} The Liquid Plus. All Rights Reserved.</div>

          {/* Payment Badges (Clean Typography or Text indicators) */}
          <div className="flex items-center space-x-4 text-[8px] font-black tracking-widest text-zinc-400">
            <span className="rounded border border-white/10 px-1.5 py-0.5">VISA</span>
            <span className="rounded border border-white/10 px-1.5 py-0.5">MASTERCARD</span>
            <span className="rounded border border-white/10 px-1.5 py-0.5">AMEX</span>
            <span className="rounded border border-white/10 px-1.5 py-0.5">PAYPAL</span>
            <span className="rounded border border-white/10 px-1.5 py-0.5">STRIPE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
