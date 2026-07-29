import * as React from 'react';
import Image from 'next/image';

export const metadata = {
  title: 'Shipping Policy | The Liquid Plus Detailing Laboratory',
  description:
    'Review our express and standard shipping procedures, rates, thresholds, and regional U.S. delivery information.',
  alternates: {
    canonical: 'https://theliquidplus.com/policies/shipping',
  },
};

export default function ShippingPolicyPage() {
  return (
    <div className="space-y-6 rounded-[24px] border border-zinc-200/85 bg-white p-6 shadow-sm sm:p-10">
      <div className="flex items-center space-x-3 text-[10px] font-black tracking-widest text-[#FF4D00] uppercase">
        <span>Policies & Terms</span>
        <span>•</span>
        <span className="text-zinc-400">Shipping</span>
      </div>

      <h1 className="border-b border-zinc-100 pb-4 text-3xl font-light tracking-widest text-zinc-900 uppercase">
        Shipping Policy
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
            1. Order Processing Times
          </h3>
          <p>
            All premium chemical formulas, microfibers, and detailing tools are packaged under
            controlled humidity conditions to preserve quality. Orders are processed within 1 to 2
            business days (excluding weekends and federal holidays) after receiving confirmation.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-bold tracking-wider text-zinc-800 uppercase">
            2. U.S. Shipping Rates & Delivery Estimates
          </h3>
          <p>
            Our store offers flat rate standard and premium express delivery options. Shipping rates
            are dynamically calculated at checkout based on subtotal thresholds:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>Standard U.S. Delivery:</strong> FREE for all orders with a subtotal of $50.00
              or above. For orders under $50.00, a standard charge of $10.00 applies. Est. 4 to 6
              business days.
            </li>
            <li>
              <strong>Express Premium Shipping:</strong> Available on all orders for a flat rate of
              $15.00. Est. 1 to 2 business days.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h3 className="font-bold tracking-wider text-zinc-800 uppercase">
            3. Shipment Confirmation & Tracking
          </h3>
          <p>
            Once your cargo is scanned by our carrier partners, a confirmation email containing
            unique 256-bit encrypted tracking links will be issued to your registered address.
            Please allow 24 hours for tracking services to initialize.
          </p>
        </section>
      </div>
    </div>
  );
}
