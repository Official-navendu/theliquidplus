import * as React from 'react';
import Image from 'next/image';

export const metadata = {
  title: 'Disclaimer | The Liquid Plus Detailing Laboratory',
  description:
    'Review our corporate limitations, product application disclosures, and detailing chemical safety warnings.',
  alternates: {
    canonical: 'https://theliquidplus.com/policies/disclaimer',
  },
};

export default function DisclaimerPage() {
  return (
    <div className="space-y-6 rounded-[24px] border border-zinc-200/85 bg-white p-6 shadow-sm sm:p-10">
      <div className="flex items-center space-x-3 text-[10px] font-black tracking-widest text-[#FF4D00] uppercase">
        <span>Policies & Terms</span>
        <span>•</span>
        <span className="text-zinc-400">Disclaimer</span>
      </div>

      <h1 className="border-b border-zinc-100 pb-4 text-3xl font-light tracking-widest text-zinc-900 uppercase">
        Disclaimer
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
            1. Application Guidance Disclosures
          </h3>
          <p>
            The guides, blogs, and detailing articles provided on this storefront serve general
            educational purposes. Ceramic coatings require specific preparation steps (clay bar
            prep, polishing, alcohol wipedown) and safe ambient conditions. The Liquid Plus is not
            liable for paint defects arising from incorrect installation.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-bold tracking-wider text-zinc-800 uppercase">
            2. Safety Information
          </h3>
          <p>
            Chemical formulas are intended for adult detailing applications. Keep all detailing
            fluids, coatings, and dressings out of reach of children. Wear skin and eye protection
            during coating operations.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-bold tracking-wider text-zinc-800 uppercase">3. Third-Party Links</h3>
          <p>
            Our guides may mention third-party polishing machines, pads, or tools. We do not sponsor
            or take responsibility for the durability of external brand equipment.
          </p>
        </section>
      </div>
    </div>
  );
}
