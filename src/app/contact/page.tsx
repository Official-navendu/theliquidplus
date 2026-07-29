import * as React from 'react';
import { AnnouncementBar } from '@/components/storefront/AnnouncementBar';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import Image from 'next/image';

export const metadata = {
  title: 'Contact Us | The Liquid Plus Detailing Support',
  description:
    'Reach out to The Liquid Plus detailing engineers. Contact us for wholesale inquiries, product consultation, custom orders, or shipping assistance.',
  openGraph: {
    title: 'Contact Us | The Liquid Plus',
    description: 'Reach out to The Liquid Plus detailing engineers for support and inquiries.',
    url: 'https://theliquidplus.com/contact',
    images: [{ url: '/assets/contact-workshop.webp' }],
  },
  alternates: {
    canonical: 'https://theliquidplus.com/contact',
  },
};

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 text-left font-sans text-zinc-800">
      <AnnouncementBar />
      <Header />

      <main className="flex-grow pt-24 pb-16">
        <div className="mx-auto max-w-7xl space-y-12 px-6">
          {/* Header text */}
          <div className="mx-auto max-w-2xl space-y-2 text-center">
            <span className="block text-[10px] font-black tracking-[0.3em] text-[#FF4D00] uppercase">
              Get in Touch
            </span>
            <h1 className="text-3xl font-light tracking-widest text-zinc-900 uppercase sm:text-4xl">
              Contact Support
            </h1>
            <div className="mx-auto mt-1 h-[1.5px] w-10 bg-[#FF4D00]" />
          </div>

          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            {/* Left side info cards */}
            <div className="space-y-6 lg:col-span-5">
              <div className="space-y-6 rounded-[24px] border border-zinc-200/80 bg-white p-6 shadow-sm sm:p-8">
                <h3 className="border-b border-zinc-100 pb-2 text-xs font-black tracking-widest text-zinc-900 uppercase">
                  Support Channels
                </h3>
                <div className="space-y-4 text-xs">
                  <div>
                    <span className="block text-[8px] font-bold tracking-wider text-zinc-400 uppercase">
                      General Inquiries
                    </span>
                    <span className="font-bold text-zinc-800">support@theliquidplus.com</span>
                  </div>
                  <div>
                    <span className="block text-[8px] font-bold tracking-wider text-zinc-400 uppercase">
                      Wholesale & Distribution
                    </span>
                    <span className="font-bold text-zinc-800">partners@theliquidplus.com</span>
                  </div>
                  <div>
                    <span className="block text-[8px] font-bold tracking-wider text-zinc-400 uppercase">
                      Phone Consultations
                    </span>
                    <span className="font-bold text-zinc-800">+1 (800) 555-GLOSS (4567)</span>
                  </div>
                  <div>
                    <span className="block text-[8px] font-bold tracking-wider text-zinc-400 uppercase">
                      Operating Hours
                    </span>
                    <p className="text-zinc-550 mt-0.5 leading-relaxed">
                      Monday – Friday: 9:00 AM – 6:00 PM EST
                      <br />
                      Saturday: 10:00 AM – 4:00 PM EST
                    </p>
                  </div>
                </div>
              </div>

              {/* Image Frame */}
              <div className="border-zinc-250/50 relative aspect-[16/10] overflow-hidden rounded-[24px] border bg-zinc-200 shadow-sm">
                <Image
                  src="/assets/contact-workshop.webp"
                  alt="The Liquid Plus Luxury Garage Detailing Workshop"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Right side form */}
            <div className="space-y-6 rounded-[24px] border border-zinc-200/80 bg-white p-6 shadow-sm sm:p-8 lg:col-span-7">
              <h3 className="border-b border-zinc-100 pb-2 text-xs font-black tracking-widest text-zinc-900 uppercase">
                Send an Inquiry
              </h3>
              <form className="space-y-4 text-xs">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold tracking-wider text-zinc-400 uppercase">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-xs text-zinc-800 transition-all outline-none focus:border-[#FF4D00] focus:bg-white"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold tracking-wider text-zinc-400 uppercase">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-xs text-zinc-800 transition-all outline-none focus:border-[#FF4D00] focus:bg-white"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-bold tracking-wider text-zinc-400 uppercase">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-xs text-zinc-800 transition-all outline-none focus:border-[#FF4D00] focus:bg-white"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-bold tracking-wider text-zinc-400 uppercase">
                    Inquiry Subject
                  </label>
                  <select className="w-full cursor-pointer rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-xs text-zinc-800 transition-all outline-none focus:border-[#FF4D00] focus:bg-white">
                    <option>Product Application Advice</option>
                    <option>Bulk Order Inquiry</option>
                    <option>Shipping / Order Tracking Support</option>
                    <option>Other / Custom Coating Formula</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-bold tracking-wider text-zinc-400 uppercase">
                    Message Details
                  </label>
                  <textarea
                    rows={4}
                    className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-xs text-zinc-800 transition-all outline-none focus:border-[#FF4D00] focus:bg-white"
                    placeholder="Describe your application requirements..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="cursor-pointer rounded-xl bg-[#FF4D00] px-8 py-3.5 text-[10px] font-black tracking-widest text-white uppercase transition-all hover:bg-[#E04400] hover:shadow-md"
                >
                  Submit Inquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
