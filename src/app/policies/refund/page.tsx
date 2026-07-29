import * as React from 'react';
import Image from 'next/image';

export const metadata = {
  title: 'Refund & Returns Policy | The Liquid Plus Detailing Laboratory',
  description:
    'Learn about our 30-day hassle-free return options and instructions for damaged cargo replacement.',
  alternates: {
    canonical: 'https://theliquidplus.com/policies/refund',
  },
};

export default function RefundPage() {
  return (
    <div className="space-y-6 rounded-[24px] border border-zinc-200/85 bg-white p-6 shadow-sm sm:p-10">
      <div className="flex items-center space-x-3 text-[10px] font-black tracking-widest text-[#FF4D00] uppercase">
        <span>Policies & Terms</span>
        <span>•</span>
        <span className="text-zinc-400">Refund</span>
      </div>

      <h1 className="border-b border-zinc-100 pb-4 text-3xl font-light tracking-widest text-zinc-900 uppercase">
        Refund Policy
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
            1. 30-Day Detailing Guarantee
          </h3>
          <p>
            We offer a premium 30-day hassle-free return window for all unapplied products and
            unused microfiber towels. If you are unsatisfied, return the product in its original
            packaging to receive a full refund.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-bold tracking-wider text-zinc-800 uppercase">
            2. Damaged Cargo Replacements
          </h3>
          <p>
            Coating bottles are fragile quartz/glass elements. If you receive a leaking bottle or
            damaged parcel, contact support within 48 hours with photographic proof for a free
            replacement.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-bold tracking-wider text-zinc-800 uppercase">
            3. Non-Returnable Items
          </h3>
          <p>
            Opened coating compounds, soiled cloths, or customized detailing workshop orders cannot
            be returned due to safety and chemical stability regulations.
          </p>
        </section>
      </div>
    </div>
  );
}
