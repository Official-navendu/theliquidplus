'use client';

import * as React from 'react';

const brands = [
  'CarPro', 'Gyeon', 'Koch Chemie', 'Chemical Guys', 'Meguiars', 'Rupes', 'Sonax'
];

export function TrustedBrands({ brandsData }: { brandsData?: string[] }) {
  const list = brandsData && brandsData.length > 0 ? brandsData : brands;

  return (
    <section className="py-14 bg-[#F8F8F8] text-[#0A0A0A] border-b border-[#EAEAEA] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-6 text-center">
        <span className="text-[9px] tracking-[0.25em] text-[#666666] uppercase font-black">
          Trusted Global detaliers
        </span>
      </div>

      <div className="flex whitespace-nowrap overflow-hidden relative w-full">
        {/* Infinite scrolling brands */}
        <div className="flex animate-marquee-brands space-x-16">
          {list.map((brand, i) => (
            <span
              key={i}
              className="text-lg font-black uppercase tracking-widest text-[#666666] hover:text-[#FF4D00] transition-colors duration-300 select-none cursor-default"
            >
              {brand}
            </span>
          ))}
        </div>
        <div className="flex animate-marquee-brands space-x-16 ml-16" aria-hidden="true">
          {list.map((brand, i) => (
            <span
              key={i}
              className="text-lg font-black uppercase tracking-widest text-[#666666] hover:text-[#FF4D00] transition-colors duration-300 select-none cursor-default"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee-brands {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-brands {
          display: flex;
          animation: marquee-brands 20s linear infinite;
        }
      `}</style>
    </section>
  );
}
export default TrustedBrands;
