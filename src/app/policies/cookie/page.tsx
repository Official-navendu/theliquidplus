import * as React from 'react';
import Image from 'next/image';

export const metadata = {
  title: 'Cookie Policy | The Liquid Plus Detailing Laboratory',
  description:
    'Understand how we utilize cookies to customize your catalog preferences and checkout sessions.',
  alternates: {
    canonical: 'https://theliquidplus.com/policies/cookie',
  },
};

export default function CookiePage() {
  return (
    <div className="space-y-6 rounded-[24px] border border-zinc-200/85 bg-white p-6 shadow-sm sm:p-10">
      <div className="flex items-center space-x-3 text-[10px] font-black tracking-widest text-[#FF4D00] uppercase">
        <span>Policies & Terms</span>
        <span>•</span>
        <span className="text-zinc-400">Cookie</span>
      </div>

      <h1 className="border-b border-zinc-100 pb-4 text-3xl font-light tracking-widest text-zinc-900 uppercase">
        Cookie Policy
      </h1>

      <div className="relative mb-6 aspect-[21/9] overflow-hidden rounded-xl bg-zinc-100">
        <Image
          src="/assets/policies-illustration.webp"
          alt="The Liquid Plus Policies Document Illustration"
          fill
          className="object-cover"
        />
      </div>

      <div className="space-y-6 text-xs leading-relaxed font-light text-zinc-600">
        <section className="space-y-2">
          <h3 className="font-bold tracking-wider text-zinc-800 uppercase">1. What are Cookies?</h3>
          <p>
            Cookies are micro text entries placed on your computing system by your browser to
            memorize shopping configurations.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-bold tracking-wider text-zinc-800 uppercase">
            2. Cookie Categories We Deploy
          </h3>
          <p>
            We use necessary session cookies to preserve shopping bag items, memorize login
            sessions, and save active promotional coupons across sessions.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-bold tracking-wider text-zinc-800 uppercase">
            3. Preferences Management
          </h3>
          <p>
            You can configure your browser to block cookies. Note that blocking necessary cookies
            will cause checkout cart functionalities to break.
          </p>
        </section>
      </div>
    </div>
  );
}
