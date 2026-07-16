'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

export function Newsletter() {
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1200);
  };

  return (
    <section className="py-20 bg-[#0A0A0A] text-white border-b border-white/5 relative overflow-hidden">
      {/* Background glow lines */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#1A1A1A] to-transparent opacity-40 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-6">
        <div className="space-y-2">
          <span className="text-[10px] tracking-[0.3em] text-[#FF4D00] uppercase font-black block">
            SUBSCRIPTION REGISTRY
          </span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-widest text-white leading-tight">
            JOIN THE LIQUID PLUS COMMUNITY
          </h2>
          <p className="text-xs sm:text-sm text-[#E5E5E5] max-w-md mx-auto font-light leading-relaxed">
            Subscribe to get masterclass detailing guides, new chemical product drops, and exclusive community releases.
          </p>
        </div>

        <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading'}
            className="flex-grow bg-[#1A1A1A] border border-white/10 text-white placeholder-[#B5B5B5] focus:border-[#FF4D00] rounded-xl h-12 text-xs px-4 outline-none transition-all"
            required
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-[#FF4D00] hover:bg-[#E04400] text-white px-8 h-12 text-xs font-black uppercase tracking-widest rounded-xl transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(255,77,0,0.45)] cursor-pointer"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>

        {status === 'success' && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-[#FF4D00] font-bold"
          >
            ✓ Thank you! You have been successfully added to our mailing registry.
          </motion.p>
        )}
      </div>
    </section>
  );
}
export default Newsletter;
