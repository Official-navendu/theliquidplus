'use client';

import * as React from 'react';
import { FilterState } from '../types/filters';
import { PRODUCTS, Product } from '../constants/products';
import { ProductCard } from './ProductCard';
import { FilterSidebar } from './FilterSidebar';
import { ProductSkeleton } from './ProductSkeleton';
import { Grid, List, SlidersHorizontal, Search } from 'lucide-react';
import { SearchOverlay } from './SearchOverlay';
import { getStorefrontProductsAction } from '../actions/storefront';

const DEFAULT_FILTERS: FilterState = {
  categories: [],
  brands: [],
  priceRange: [0, 15000],
  inStockOnly: false,
  productTypes: [],
  minRating: 0,
};

interface ShopLayoutProps {
  initialCategory?: string;
  initialBrand?: string;
  initialCollection?: string;
}

export function ShopLayout({ initialCategory, initialBrand, initialCollection }: ShopLayoutProps) {
  const [productsList, setProductsList] = React.useState<Product[]>(PRODUCTS);
  const [filters, setFilters] = React.useState<FilterState>({
    ...DEFAULT_FILTERS,
    categories: initialCategory ? [initialCategory] : [],
    brands: initialBrand ? [initialBrand] : [],
  });
  
  const [sortBy, setSortBy] = React.useState<string>('featured');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadLive() {
      try {
        const res = await getStorefrontProductsAction();
        if (res.success && res.data) {
          setProductsList(res.data);
        }
      } catch (err) {
        console.error('Failed to load dynamic store products', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadLive();
  }, []);

  // Extract unique categories and brands for filter options
  const categoriesList = React.useMemo(() => Array.from(new Set(productsList.map((p) => p.category))), [productsList]);
  const brandsList = React.useMemo(() => Array.from(new Set(productsList.map((p) => p.brand))), [productsList]);

  const filteredProducts = React.useMemo(() => {
    let result = [...productsList];

    // Filter by Initial Collection if provided
    if (initialCollection) {
      result = result.filter((p) => p.collections?.includes(initialCollection));
    }

    // Apply categories filter
    if (filters.categories.length > 0) {
      result = result.filter((p) => filters.categories.includes(p.category));
    }

    // Apply brands filter
    if (filters.brands.length > 0) {
      result = result.filter((p) => filters.brands.includes(p.brand));
    }

    // Apply product types filter
    if (filters.productTypes.length > 0) {
      result = result.filter((p) => filters.productTypes.includes(p.productType));
    }

    // Apply price range filter
    result = result.filter((p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);

    // Apply stock filter
    if (filters.inStockOnly) {
      result = result.filter((p) => p.inStock);
    }

    // Apply rating filter
    if (filters.minRating > 0) {
      result = result.filter((p) => p.rating >= filters.minRating);
    }

    // Apply Sort Logic
    if (sortBy === 'price-low-high') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high-low') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    return result;
  }, [productsList, filters, sortBy, initialCollection]);

  const handleClearAll = () => {
    setFilters(DEFAULT_FILTERS);
  };

  return (
    <div className="bg-black text-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Upper Shop controls bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/5 pb-6 mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-light uppercase tracking-wider">
              {initialCollection ? `${initialCollection.replace('-', ' ')} Collection` : initialCategory ? `${initialCategory}` : initialBrand ? `${initialBrand}` : 'All Products'}
            </h1>
            <p className="text-[10px] text-zinc-500 tracking-wider uppercase mt-1">
              Showing {filteredProducts.length} of {productsList.length} products
            </p>
          </div>

          <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end">
            {/* Search overlay launcher */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center space-x-2 text-zinc-400 hover:text-white border border-white/10 px-4 py-2 text-[10px] tracking-wider uppercase bg-[#0a0a0a] rounded transition-all"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Search Catalog</span>
            </button>

            {/* Mobile filter launcher */}
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="lg:hidden flex items-center space-x-2 border border-white/10 px-4 py-2 text-[10px] tracking-wider uppercase rounded"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Filters</span>
            </button>

            {/* View layout selectors */}
            <div className="hidden md:flex items-center space-x-2 border border-white/10 p-1 bg-[#0a0a0a]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-all ${viewMode === 'grid' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}
                aria-label="Grid view"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded transition-all ${viewMode === 'list' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Sort options */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#0a0a0a] border border-white/10 text-white text-[10px] tracking-wider uppercase px-4 py-2 focus:ring-0 outline-none rounded"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Master shop dashboard grids */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filter for Desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <FilterSidebar
              filters={filters}
              onChange={setFilters}
              onClear={handleClearAll}
              categoriesList={categoriesList}
              brandsList={brandsList}
            />
          </div>

          {/* Product Grid section */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 border border-white/5 bg-[#0a0a0a] rounded-xl text-center space-y-4">
                <span className="text-4xl">🔎</span>
                <h3 className="text-sm font-semibold tracking-widest uppercase text-zinc-300">
                  No products found
                </h3>
                <p className="text-xs text-zinc-500 max-w-xs font-light">
                  No items match the selected filters. Try clearing filters or altering your preferences.
                </p>
                <button
                  onClick={handleClearAll}
                  className="bg-[#FF4D00] text-black text-[10px] tracking-widest uppercase font-bold px-6 py-3 hover:bg-[#FF4D00]/90 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'
                    : 'flex flex-col space-y-6'
                }
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mobile filter panel drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden flex justify-end">
          <div className="w-80 bg-black h-full border-l border-white/10 overflow-y-auto p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-xs font-bold uppercase tracking-widest">Mobile Filters</span>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="text-xs text-zinc-500 hover:text-white"
                >
                  Close
                </button>
              </div>
              <FilterSidebar
                filters={filters}
                onChange={setFilters}
                onClear={handleClearAll}
                categoriesList={categoriesList}
                brandsList={brandsList}
              />
            </div>
            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full bg-[#FF4D00] text-black py-3 text-[10px] tracking-widest font-bold uppercase"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Instant Search modal overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
export default ShopLayout;
