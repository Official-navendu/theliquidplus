import * as React from 'react';
import Image from 'next/image';

export const metadata = {
  title: 'Privacy Policy | The Liquid Plus Detailing Laboratory',
  description:
    'Learn how we protect, store, and utilize your personal information and transaction details under SSL encryption.',
  alternates: {
    canonical: 'https://theliquidplus.com/policies/privacy',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="space-y-6 rounded-[24px] border border-zinc-200/85 bg-white p-6 shadow-sm sm:p-10">
      <div className="flex items-center space-x-3 text-[10px] font-black tracking-widest text-[#FF4D00] uppercase">
        <span>Policies & Terms</span>
        <span>•</span>
        <span className="text-zinc-400">Privacy</span>
      </div>

      <h1 className="border-b border-zinc-100 pb-4 text-3xl font-light tracking-widest text-zinc-900 uppercase">
        Privacy Policy
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
            1. Data Collection Philosophy
          </h3>
          <p>
            At The Liquid Plus, we respect the privacy of our detailing clients. We gather basic
            contact, billing, and shipping details solely to fulfill transactions, calculate local
            taxes, and dispatch orders.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-bold tracking-wider text-zinc-800 uppercase">
            2. Payment & SSL Security
          </h3>
          <p>
            We do not store credit card credentials, UPI tokens, or payment credentials on our local
            servers. All transactional information is routed through industry-standard payment
            gateways utilizing Secure Sockets Layer (SSL) 256-bit encryption protocols.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-bold tracking-wider text-zinc-800 uppercase">3. Customer Rights</h3>
          <p>
            Under privacy guidelines, you have the right to request access to the personal data we
            store, request modifications, or ask for complete deletion from our detailing catalog
            directory.
          </p>
        </section>
      </div>
    </div>
  );
}
