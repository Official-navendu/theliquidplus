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
  initialProducts?: Product[];
}

export function ShopLayout({
  initialCategory,
  initialBrand,
  initialCollection,
  initialProducts,
}: ShopLayoutProps) {
  const [productsList, setProductsList] = React.useState<Product[]>(initialProducts || PRODUCTS);
  const [filters, setFilters] = React.useState<FilterState>({
    ...DEFAULT_FILTERS,
    categories: initialCategory ? [initialCategory] : [],
    brands: initialBrand ? [initialBrand] : [],
  });

  const [sortBy, setSortBy] = React.useState<string>('featured');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(
    !initialProducts || initialProducts.length === 0,
  );

  React.useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setProductsList(initialProducts);
      setIsLoading(false);
      return;
    }

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
  }, [initialProducts]);

  // Extract unique categories and brands for filter options
  const categoriesList = React.useMemo(
    () => Array.from(new Set(productsList.map((p) => p.category))),
    [productsList],
  );
  const brandsList = React.useMemo(
    () => Array.from(new Set(productsList.map((p) => p.brand))),
    [productsList],
  );

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
    result = result.filter(
      (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1],
    );

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
    <div className="min-h-screen bg-white pt-4 pb-16 text-zinc-900">
      <div className="mx-auto max-w-7xl px-6">
        {/* Upper Shop controls bar */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 border-b border-zinc-200 pb-6 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-light tracking-wider text-zinc-900 uppercase">
              {initialCollection
                ? `${initialCollection.replace('-', ' ')} Collection`
                : initialCategory
                  ? `${initialCategory}`
                  : initialBrand
                    ? `${initialBrand}`
                    : 'All Products'}
            </h1>
            <p className="mt-1 text-[10px] tracking-wider text-zinc-500 uppercase">
              Showing {filteredProducts.length} of {productsList.length} products
            </p>
          </div>

          <div className="flex w-full items-center justify-between space-x-4 md:w-auto md:justify-end">
            {/* Search overlay launcher */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center space-x-2 rounded border border-zinc-200 bg-white px-4 py-2 text-[10px] tracking-wider text-zinc-600 uppercase transition-all hover:border-zinc-300 hover:text-zinc-900"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Search Catalog</span>
            </button>

            {/* Mobile filter launcher */}
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="flex items-center space-x-2 rounded border border-zinc-200 bg-white px-4 py-2 text-[10px] tracking-wider text-zinc-700 uppercase hover:text-zinc-900 lg:hidden"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Filters</span>
            </button>

            {/* View layout selectors */}
            <div className="hidden items-center space-x-2 rounded border border-zinc-200 bg-white p-1 md:flex">
              <button
                onClick={() => setViewMode('grid')}
                className={`rounded p-1.5 transition-all ${viewMode === 'grid' ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-zinc-900'}`}
                aria-label="Grid view"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`rounded p-1.5 transition-all ${viewMode === 'list' ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-zinc-900'}`}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Sort options */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded border border-zinc-200 bg-white px-4 py-2 text-[10px] tracking-wider text-zinc-900 uppercase outline-none focus:ring-0"
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
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar Filter for Desktop */}
          <div className="hidden lg:col-span-1 lg:block">
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
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center space-y-4 rounded-xl border border-zinc-200 bg-zinc-50 py-20 text-center">
                <span className="text-4xl">🔎</span>
                <h3 className="text-sm font-semibold tracking-widest text-zinc-300 uppercase">
                  No products found
                </h3>
                <p className="max-w-xs text-xs font-light text-zinc-500">
                  No items match the selected filters. Try clearing filters or altering your
                  preferences.
                </p>
                <button
                  onClick={handleClearAll}
                  className="bg-[#FF4D00] px-6 py-3 text-[10px] font-bold tracking-widest text-black uppercase transition-colors hover:bg-[#FF4D00]/90"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3'
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
        <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm lg:hidden">
          <div className="flex h-full w-80 flex-col justify-between space-y-6 overflow-y-auto border-l border-white/10 bg-black p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <span className="text-xs font-bold tracking-widest uppercase">Mobile Filters</span>
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
              className="w-full bg-[#FF4D00] py-3 text-[10px] font-bold tracking-widest text-black uppercase"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Instant Search modal overlay */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={productsList}
      />
    </div>
  );
}
export default ShopLayout;
