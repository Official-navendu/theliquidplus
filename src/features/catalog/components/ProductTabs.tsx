'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle, ThumbsUp } from 'lucide-react';
import { Product } from '../constants/products';

interface ProductTabsProps {
  product: Product;
}

const tabs = [
  { id: 'desc', label: 'Description' },
  { id: 'specs', label: 'Specifications' },
  { id: 'use', label: 'How to Use' },
  { id: 'formula', label: 'Formula' },
  { id: 'reviews', label: 'Reviews' },
];

const mockReviews = [
  {
    id: 1,
    name: 'Vikram Mehta',
    rating: 5,
    date: '2026-06-15',
    comment: 'Absolutely phenomenal glaze!Swirl scratch marks on my black Audi paint are completely corrected. Highly recommended.',
    verified: true,
    helpful: 24,
  },
  {
    id: 2,
    name: 'Rohit Sharma',
    rating: 5,
    date: '2026-06-08',
    comment: 'The hydrophobic beading water angle is insane. Cured cleanly and easily. Applied on my sports bike rims too.',
    verified: true,
    helpful: 18,
  },
  {
    id: 3,
    name: 'Anita Desai',
    rating: 4,
    date: '2026-05-28',
    comment: 'Very solid professional formula. Requires a clean clay-bar prep beforehand, but outcome is state-of-the-art.',
    verified: true,
    helpful: 8,
  },
];

export function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = React.useState('desc');
  const [helpfulCounts, setHelpfulCounts] = React.useState<Record<number, number>>({});

  const handleHelpful = (id: number) => {
    setHelpfulCounts((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  return (
    <div className="space-y-6 text-white bg-[#0a0a0a] p-6 sm:p-8 border border-white/5 rounded-xl">
      {/* Tabs Header */}
      <div className="flex border-b border-white/5 overflow-x-auto space-x-6 pb-2 scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-xs tracking-[0.25em] uppercase font-bold pb-3 relative transition-colors ${
              activeTab === tab.id ? 'text-[#FF4D00]' : 'text-zinc-500 hover:text-white'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF4D00]"
              />
            )}
          </button>
        ))}
      </div>

      {/* Tabs Content */}
      <div className="pt-4 text-xs sm:text-sm text-zinc-300 font-light leading-relaxed tracking-wide min-h-[150px]">
        {activeTab === 'desc' && (
          <div className="space-y-4">
            <p>{product.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div>
                <h4 className="text-[10px] tracking-widest text-[#FF4D00] uppercase font-bold mb-2">Key Benefits</h4>
                <ul className="list-disc pl-4 space-y-1.5 text-zinc-400">
                  <li>Extreme hydrophobic self-cleaning beading angle</li>
                  <li>Intense deep-gloss color amplification</li>
                  <li>9H mineral surface chemical resistance</li>
                </ul>
              </div>
              <div>
                <h4 className="text-[10px] tracking-widest text-[#FF4D00] uppercase font-bold mb-2">Ideal Surfaces</h4>
                <ul className="list-disc pl-4 space-y-1.5 text-zinc-400">
                  <li>Automotive Clear Coat lacquer</li>
                  <li>Alloy wheels & calipers</li>
                  <li>Gloss wraps & paint protection films</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'specs' && (
          <table className="w-full text-left text-xs uppercase tracking-widest border-collapse">
            <tbody>
              <tr className="border-b border-white/5">
                <td className="py-3 text-zinc-500">Surface Finish</td>
                <td className="py-3 text-zinc-200">High gloss reflective coating</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-3 text-zinc-500">Durability</td>
                <td className="py-3 text-zinc-200">Up to 24 Months</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-3 text-zinc-500">Water Contact Angle</td>
                <td className="py-3 text-zinc-200">115 Degrees Hydrophobic</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-3 text-zinc-500">Coverage</td>
                <td className="py-3 text-zinc-200">15-20 sq.m per 500ml bottle</td>
              </tr>
            </tbody>
          </table>
        )}

        {activeTab === 'use' && (
          <ol className="space-y-4 list-decimal pl-4 text-zinc-400">
            <li>
              <strong className="text-zinc-200">Preparation:</strong> Ensure paint is clean, clay-barred, and polished to remove swirl scratches. Wipe down with panel prep alcohol.
            </li>
            <li>
              <strong className="text-zinc-200">Application:</strong> Pour 6-8 drops of coating onto microfiber applicator block. Wipe onto a 2x2 ft paint section in cross-hatch strokes.
            </li>
            <li>
              <strong className="text-zinc-200">Flashing:</strong> Wait 1-2 minutes until coat rainbows or flashes. Buff away haze immediately with dry edgeless towels.
            </li>
            <li>
              <strong className="text-zinc-200">Curing:</strong> Keep panels dry for 24 hours. Full chemical cure is achieved after 7 days.
            </li>
          </ol>
        )}

        {activeTab === 'formula' && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FF4D00]">Organosilane Compound Core</h4>
            <p>
              A clean solvent-based silica nanotech composition that crosslinks directly with paint lacquer layer molecules, creating a tough mineral ceramic shield. Contains zero silicone fillers, dyes, or wax elements.
            </p>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-8">
            {/* Reviews Breakdown Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center border-b border-white/5 pb-6">
              <div className="text-center space-y-1">
                <span className="text-4xl font-bold">{product.rating}</span>
                <div className="flex justify-center text-[#FF4D00] space-x-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">Overall Score</span>
              </div>

              {/* Progress bars */}
              <div className="md:col-span-2 space-y-2">
                {[
                  { star: 5, pct: '92%' },
                  { star: 4, pct: '6%' },
                  { star: 3, pct: '2%' },
                  { star: 2, pct: '0%' },
                  { star: 1, pct: '0%' },
                ].map((row) => (
                  <div key={row.star} className="flex items-center text-xs text-zinc-400 space-x-2">
                    <span className="w-12">{row.star} Star</span>
                    <div className="flex-grow bg-zinc-900 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#FF4D00] h-full" style={{ width: row.pct }} />
                    </div>
                    <span className="w-8 text-right">{row.pct}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Review Cards list */}
            <div className="space-y-6">
              {mockReviews.map((rev) => (
                <div key={rev.id} className="space-y-3 border-b border-white/5 pb-6 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-zinc-200">{rev.name}</span>
                      {rev.verified && (
                        <span className="flex items-center text-[9px] text-green-500 font-bold uppercase tracking-wider space-x-1">
                          <CheckCircle className="h-3 w-3" />
                          <span>Verified Detailing Partner</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-zinc-500">{rev.date}</span>
                  </div>

                  <div className="flex text-[#FF4D00] space-x-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
                    {rev.comment}
                  </p>

                  <div className="flex items-center space-x-2 text-[10px] text-zinc-500 uppercase tracking-widest pt-1">
                    <span>Was this review helpful?</span>
                    <button
                      onClick={() => handleHelpful(rev.id)}
                      className="flex items-center space-x-1 text-zinc-400 hover:text-[#FF4D00] transition-colors"
                    >
                      <ThumbsUp className="h-3 w-3" />
                      <span>{rev.helpful + (helpfulCounts[rev.id] || 0)}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default ProductTabs;
