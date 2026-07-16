'use client';

import * as React from 'react';
import { Search, X, CornerDownLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRODUCTS, Product } from '../constants/products';
import Link from 'next/link';
import Image from 'next/image';
import { getStorefrontProductsAction } from '../actions/storefront';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const popularSearches = ['Ceramic', 'Graphene', 'Snow Foam', 'Microfiber', 'Wheel Cleaner'];
const initialRecentSearches = ['9H coating', 'snow foam', 'interior guard'];

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = React.useState('');
  const [recentSearches, setRecentSearches] = React.useState<string[]>(initialRecentSearches);
  const [productsList, setProductsList] = React.useState<Product[]>(PRODUCTS);
  const [results, setResults] = React.useState<Product[]>([]);

  React.useEffect(() => {
    async function loadLive() {
      try {
        const res = await getStorefrontProductsAction();
        if (res.success && res.data) {
          setProductsList(res.data);
        }
      } catch (err) {
        console.error('Failed to load store products for search suggestions', err);
      }
    }
    loadLive();
  }, []);

  React.useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const filtered = productsList.filter(
      (prod) =>
        prod.name.toLowerCase().includes(query.toLowerCase()) ||
        prod.category.toLowerCase().includes(query.toLowerCase()) ||
        prod.brand.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  }, [query, productsList]);

  const handleSelectRecent = (term: string) => {
    setQuery(term);
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/95 flex flex-col pt-24 px-6 sm:px-12 text-white"
        >
          {/* Close Action */}
          <button
            onClick={onClose}
            className="absolute top-8 right-8 text-zinc-400 hover:text-white transition-colors"
            aria-label="Close search"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="max-w-3xl w-full mx-auto space-y-8">
            {/* Search Input Box */}
            <div className="relative border-b border-white/10 pb-4">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search premium products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent border-0 outline-none pl-8 text-xl font-light placeholder-zinc-600 focus:ring-0 text-white"
              />
            </div>

            {/* Results / Suggestion panel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Query Results */}
              <div className="md:col-span-2 space-y-4">
                <span className="text-[10px] tracking-[0.25em] text-[#FF4D00] uppercase font-bold">
                  {query ? `Search Results (${results.length})` : 'Catalog Suggestions'}
                </span>

                {query && results.length === 0 ? (
                  <div className="py-12 text-center border border-white/5 bg-[#0a0a0a] rounded-lg">
                    <span className="text-zinc-500 text-sm">No products match &ldquo;{query}&rdquo;</span>
                  </div>
                ) : results.length > 0 ? (
                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                    {results.slice(0, 5).map((prod) => (
                      <Link
                        key={prod.id}
                        href={`/products/${prod.slug}`}
                        onClick={onClose}
                        className="flex items-center space-x-4 p-3 bg-[#0a0a0a] border border-white/5 rounded-lg hover:border-[#FF4D00]/30 transition-colors group"
                      >
                        <div className="relative h-10 w-10 bg-zinc-900 rounded overflow-hidden flex-shrink-0">
                          <Image src={prod.image} alt={prod.name} fill className="object-cover" />
                        </div>
                        <div className="flex-grow text-left">
                          <h4 className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors line-clamp-1">
                            {prod.name}
                          </h4>
                          <span className="text-[9px] text-[#FF4D00] uppercase font-bold">{prod.category}</span>
                        </div>
                        <CornerDownLeft className="h-3.5 w-3.5 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-zinc-500 leading-relaxed font-light">
                    Start typing to see instant search results for ceramic coatings, quick detailers, wheel care, and microfiber towels.
                  </div>
                )}
              </div>

              {/* Side Panels (Recent & Popular) */}
              <div className="space-y-6">
                
                {/* Popular searches */}
                <div className="space-y-3">
                  <h4 className="text-[10px] tracking-[0.25em] text-white/50 uppercase font-bold">
                    Popular Searches
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleSelectRecent(term)}
                        className="text-[10px] bg-white/5 hover:bg-[#FF4D00]/10 border border-white/10 hover:border-[#FF4D00]/20 text-zinc-300 hover:text-white px-3 py-1.5 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent searches */}
                {recentSearches.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-[10px] tracking-[0.25em] text-white/50 uppercase font-bold">
                        Recent Searches
                      </h4>
                      <button
                        onClick={handleClearRecent}
                        className="text-[9px] hover:underline text-zinc-500 hover:text-white"
                      >
                        Clear
                      </button>
                    </div>
                    <ul className="space-y-2">
                      {recentSearches.map((term) => (
                        <li key={term}>
                          <button
                            onClick={() => handleSelectRecent(term)}
                            className="text-xs text-zinc-400 hover:text-[#FF4D00] transition-colors block text-left"
                          >
                            {term}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
export default SearchOverlay;
