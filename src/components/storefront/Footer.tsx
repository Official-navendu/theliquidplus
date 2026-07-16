/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element */
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
    <footer className="theme-dark bg-[#070707] text-white border-t border-white/5 pt-20 pb-10 text-left">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* 4 Equal Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand details & Socials */}
          <div className="space-y-6">
            <Link href="/" className="block">
              <Logo className="h-5 w-auto" />
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed font-light tracking-wide">
              The Liquid Plus designs and synthesizes advanced hydrophobic ceramic nano-coatings and bespoke surface detailing solutions for elite automotive collectors and enthusiasts.
            </p>
            <div className="flex items-center space-x-3.5 pt-2">
              <a href="https://facebook.com" className="text-zinc-500 hover:text-[#FF4D00] transition-colors" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="https://instagram.com" className="text-zinc-500 hover:text-[#FF4D00] transition-colors" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="https://twitter.com" className="text-zinc-500 hover:text-[#FF4D00] transition-colors" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="https://youtube.com" className="text-zinc-500 hover:text-[#FF4D00] transition-colors" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polyline points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
              </a>
              <a href="https://linkedin.com" className="text-zinc-500 hover:text-[#FF4D00] transition-colors" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="https://pinterest.com" className="text-zinc-500 hover:text-[#FF4D00] transition-colors" aria-label="Pinterest" target="_blank" rel="noopener noreferrer">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 22a9 9 0 0 1-1.91-8.3A11.39 11.39 0 0 1 16.5 3.5a10 10 0 0 1 2.8 19.3m-9.5-6.5L12 9a4 4 0 0 1 7.8 1.8c0 2.3-1.1 4.6-3.1 5.3a2 2 0 0 1-2.7-1.8"/></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-5">
            <h3 className="text-[10px] font-black tracking-[0.25em] uppercase text-[#FF4D00]">
              Quick Links
            </h3>
            <ul className="space-y-3 text-xs text-zinc-400 font-light">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
              </li>
              <li>
                <Link href="/shop#collections" className="hover:text-white transition-colors">Collections</Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
              </li>
              <li>
                <Link href="/faqs" className="hover:text-white transition-colors">FAQs</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Policies */}
          <div className="space-y-5">
            <h3 className="text-[10px] font-black tracking-[0.25em] uppercase text-[#FF4D00]">
              Policies
            </h3>
            <ul className="space-y-3 text-xs text-zinc-400 font-light">
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-white transition-colors">Shipping Policy</Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-5">
            <h3 className="text-[10px] font-black tracking-[0.25em] uppercase text-[#FF4D00]">
              Newsletter
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-light tracking-wide">
              Subscribe to unlock early access to new product formulations and laboratory research updates.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-white/10 text-white px-3 py-2 rounded-lg outline-none focus:border-[#FF4D00] text-xs font-mono"
              />
              <button
                type="submit"
                className="bg-[#FF4D00] hover:bg-[#FF4D00]/80 text-white font-black uppercase text-[9px] tracking-wider px-4 py-2 rounded-lg transition-all border-0 cursor-pointer w-full sm:w-auto"
              >
                Subscribe
              </button>
            </form>
            <div className="inline-flex items-center space-x-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-[4px] mt-1 text-[9px] uppercase tracking-wider text-zinc-400 font-bold">
              <span>Join 10,000+ detailing enthusiasts</span>
            </div>
          </div>

        </div>

        {/* Separator & Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[9px] uppercase tracking-wider text-zinc-500 font-bold">
          <div>
            © {new Date().getFullYear()} The Liquid Plus. All Rights Reserved.
          </div>
          
          {/* Payment Badges (Clean Typography or Text indicators) */}
          <div className="flex items-center space-x-4 text-[8px] font-black tracking-widest text-zinc-400">
            <span className="border border-white/10 px-1.5 py-0.5 rounded">VISA</span>
            <span className="border border-white/10 px-1.5 py-0.5 rounded">MASTERCARD</span>
            <span className="border border-white/10 px-1.5 py-0.5 rounded">AMEX</span>
            <span className="border border-white/10 px-1.5 py-0.5 rounded">PAYPAL</span>
            <span className="border border-white/10 px-1.5 py-0.5 rounded">STRIPE</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
export default Footer;
