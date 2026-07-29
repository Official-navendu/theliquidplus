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
        prod.brand.toLowerCase().includes(query.toLowerCase()),
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
          className="fixed inset-0 z-[100] flex flex-col bg-black/95 px-6 pt-24 text-white sm:px-12"
        >
          {/* Close Action */}
          <button
            onClick={onClose}
            className="absolute top-8 right-8 text-zinc-400 transition-colors hover:text-white"
            aria-label="Close search"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="mx-auto w-full max-w-3xl space-y-8">
            {/* Search Input Box */}
            <div className="relative border-b border-white/10 pb-4">
              <Search className="absolute top-1/2 left-0 h-5 w-5 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search premium products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full border-0 bg-transparent pl-8 text-xl font-light text-white placeholder-zinc-600 outline-none focus:ring-0"
              />
            </div>

            {/* Results / Suggestion panel */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Query Results */}
              <div className="space-y-4 md:col-span-2">
                <span className="text-[10px] font-bold tracking-[0.25em] text-[#FF4D00] uppercase">
                  {query ? `Search Results (${results.length})` : 'Catalog Suggestions'}
                </span>

                {query && results.length === 0 ? (
                  <div className="rounded-lg border border-white/5 bg-[#0a0a0a] py-12 text-center">
                    <span className="text-sm text-zinc-500">
                      No products match &ldquo;{query}&rdquo;
                    </span>
                  </div>
                ) : results.length > 0 ? (
                  <div className="max-h-[350px] space-y-3 overflow-y-auto pr-2">
                    {results.slice(0, 5).map((prod) => (
                      <Link
                        key={prod.id}
                        href={`/products/${prod.slug}`}
                        onClick={onClose}
                        className="group flex items-center space-x-4 rounded-lg border border-white/5 bg-[#0a0a0a] p-3 transition-colors hover:border-[#FF4D00]/30"
                      >
                        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded bg-zinc-900">
                          <Image
                            src={prod.image}
                            alt={prod.name}
                            fill
                            className="object-cover"
                            unoptimized={prod.image?.startsWith('data:')}
                          />
                        </div>
                        <div className="flex-grow text-left">
                          <h4 className="line-clamp-1 text-xs font-semibold text-zinc-200 transition-colors group-hover:text-white">
                            {prod.name}
                          </h4>
                          <span className="text-[9px] font-bold text-[#FF4D00] uppercase">
                            {prod.category}
                          </span>
                        </div>
                        <CornerDownLeft className="h-3.5 w-3.5 text-zinc-600 opacity-0 transition-opacity group-hover:opacity-100" />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs leading-relaxed font-light text-zinc-500">
                    Start typing to see instant search results for ceramic coatings, quick
                    detailers, wheel care, and microfiber towels.
                  </div>
                )}
              </div>

              {/* Side Panels (Recent & Popular) */}
              <div className="space-y-6">
                {/* Popular searches */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold tracking-[0.25em] text-white/50 uppercase">
                    Popular Searches
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleSelectRecent(term)}
                        className="border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] text-zinc-300 transition-colors hover:border-[#FF4D00]/20 hover:bg-[#FF4D00]/10 hover:text-white"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent searches */}
                {recentSearches.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-bold tracking-[0.25em] text-white/50 uppercase">
                        Recent Searches
                      </h4>
                      <button
                        onClick={handleClearRecent}
                        className="text-[9px] text-zinc-500 hover:text-white hover:underline"
                      >
                        Clear
                      </button>
                    </div>
                    <ul className="space-y-2">
                      {recentSearches.map((term) => (
                        <li key={term}>
                          <button
                            onClick={() => handleSelectRecent(term)}
                            className="block text-left text-xs text-zinc-400 transition-colors hover:text-[#FF4D00]"
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
