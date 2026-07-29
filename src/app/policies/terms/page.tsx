import * as React from 'react';
import Image from 'next/image';

export const metadata = {
  title: 'Terms & Conditions | The Liquid Plus Detailing Laboratory',
  description:
    'Understand the legal conditions governing product applications, online sales, and detailing forum usage.',
  alternates: {
    canonical: 'https://theliquidplus.com/policies/terms',
  },
};

export default function TermsPage() {
  return (
    <div className="space-y-6 rounded-[24px] border border-zinc-200/85 bg-white p-6 shadow-sm sm:p-10">
      <div className="flex items-center space-x-3 text-[10px] font-black tracking-widest text-[#FF4D00] uppercase">
        <span>Policies & Terms</span>
        <span>•</span>
        <span className="text-zinc-400">Terms</span>
      </div>

      <h1 className="border-b border-zinc-100 pb-4 text-3xl font-light tracking-widest text-zinc-900 uppercase">
        Terms & Conditions
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
          <h3 className="font-bold tracking-wider text-zinc-800 uppercase">
            1. Store Usage Conditions
          </h3>
          <p>
            By accessing and purchasing from the storefront, you agree to these legal conditions,
            confirming you have reached the age of majority in your region.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-bold tracking-wider text-zinc-800 uppercase">
            2. Product Guarantee Limits
          </h3>
          <p>
            We supply high-grade, professional-tier detailing formulas. Due to variables in
            application environments, paint preparation, and technician experience, we cannot
            guarantee absolute coating lifespan values.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-bold tracking-wider text-zinc-800 uppercase">
            3. Intellectual Property Rights
          </h3>
          <p>
            All custom designs, laboratory formulas, chemical logos, WebP assets, and text materials
            displayed on this storefront remain the exclusive property of The Liquid Plus.
          </p>
        </section>
      </div>
    </div>
  );
}
