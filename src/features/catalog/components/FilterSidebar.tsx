'use client';

import * as React from 'react';
import { FilterState } from '../types/filters';

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onClear: () => void;
  categoriesList: string[];
  brandsList: string[];
}

export function FilterSidebar({
  filters,
  onChange,
  onClear,
  categoriesList,
  brandsList,
}: FilterSidebarProps) {
  
  const handleCategoryToggle = (category: string) => {
    const nextCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    onChange({ ...filters, categories: nextCategories });
  };

  const handleBrandToggle = (brand: string) => {
    const nextBrands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    onChange({ ...filters, brands: nextBrands });
  };

  const handleProductTypeToggle = (type: string) => {
    const nextTypes = filters.productTypes.includes(type)
      ? filters.productTypes.filter((t) => t !== type)
      : [...filters.productTypes, type];
    onChange({ ...filters, productTypes: nextTypes });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    onChange({ ...filters, priceRange: [filters.priceRange[0], val] });
  };

  const handleStockToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, inStockOnly: e.target.checked });
  };

  const handleRatingChange = (rating: number) => {
    onChange({ ...filters, minRating: rating === filters.minRating ? 0 : rating });
  };

  return (
    <div className="space-y-8 bg-[#F8F8F8] p-6 border border-[#EAEAEA] rounded-xl text-black">
      
      {/* Header and Clear Filters */}
      <div className="flex justify-between items-center border-b border-[#EAEAEA] pb-4">
        <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-[#0A0A0A]">Filters</h3>
        <button
          onClick={onClear}
          className="text-[9px] tracking-wider uppercase font-bold text-[#0A0A0A] hover:text-[#FF4D00] transition-colors cursor-pointer bg-transparent border-0"
        >
          Clear All
        </button>
      </div>

      {/* Category filter list */}
      <div className="space-y-3">
        <h4 className="text-[10px] tracking-[0.25em] text-[#0A0A0A] uppercase font-black">Categories</h4>
        <ul className="space-y-2">
          {categoriesList.map((cat) => (
            <li key={cat} className="flex items-center space-x-2.5">
              <input
                type="checkbox"
                id={`cat-${cat}`}
                checked={filters.categories.includes(cat)}
                onChange={() => handleCategoryToggle(cat)}
                className="h-3.5 w-3.5 rounded border-[#EAEAEA] bg-white text-[#FF4D00] focus:ring-0 focus:ring-offset-0 accent-[#FF4D00] cursor-pointer"
              />
              <label
                htmlFor={`cat-${cat}`}
                className={`text-xs cursor-pointer hover:text-[#FF4D00] select-none transition-colors font-medium ${
                  filters.categories.includes(cat) ? 'text-[#FF4D00] font-bold' : 'text-[#0A0A0A]'
                }`}
              >
                {cat}
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Brand Filter */}
      <div className="space-y-3">
        <h4 className="text-[10px] tracking-[0.25em] text-[#0A0A0A] uppercase font-black">Brands</h4>
        <ul className="space-y-2">
          {brandsList.map((brand) => (
            <li key={brand} className="flex items-center space-x-2.5">
              <input
                type="checkbox"
                id={`brand-${brand}`}
                checked={filters.brands.includes(brand)}
                onChange={() => handleBrandToggle(brand)}
                className="h-3.5 w-3.5 rounded border-[#EAEAEA] bg-white text-[#FF4D00] focus:ring-0 focus:ring-offset-0 accent-[#FF4D00] cursor-pointer"
              />
              <label
                htmlFor={`brand-${brand}`}
                className={`text-xs cursor-pointer hover:text-[#FF4D00] select-none transition-colors font-medium ${
                  filters.brands.includes(brand) ? 'text-[#FF4D00] font-bold' : 'text-[#0A0A0A]'
                }`}
              >
                {brand}
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Slider */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="text-[10px] tracking-[0.25em] text-[#0A0A0A] uppercase font-black">Max Price</h4>
          <span className="text-xs text-[#FF4D00] font-bold">
            {filters.priceRange[1].toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="15000"
          step="500"
          value={filters.priceRange[1]}
          onChange={handlePriceChange}
          className="w-full h-1 bg-[#EAEAEA] rounded-lg appearance-none cursor-pointer accent-[#FF4D00]"
        />
        <div className="flex justify-between text-[9px] text-[#0A0A0A] font-bold">
          <span>$0</span>
          <span>$15,000</span>
        </div>
      </div>

      {/* Availability */}
      <div className="space-y-3">
        <h4 className="text-[10px] tracking-[0.25em] text-[#0A0A0A] uppercase font-black">Availability</h4>
        <div className="flex items-center space-x-2.5">
          <input
            type="checkbox"
            id="stock-only"
            checked={filters.inStockOnly}
            onChange={handleStockToggle}
            className="h-3.5 w-3.5 rounded border-[#EAEAEA] bg-white text-[#FF4D00] focus:ring-0 focus:ring-offset-0 accent-[#FF4D00] cursor-pointer"
          />
          <label
            htmlFor="stock-only"
            className={`text-xs cursor-pointer hover:text-[#FF4D00] select-none transition-colors font-medium ${
              filters.inStockOnly ? 'text-[#FF4D00] font-bold' : 'text-[#0A0A0A]'
            }`}
          >
            In Stock Only
          </label>
        </div>
      </div>

      {/* Product Type */}
      <div className="space-y-3">
        <h4 className="text-[10px] tracking-[0.25em] text-[#0A0A0A] uppercase font-black">Product Form</h4>
        <ul className="space-y-2">
          {['liquid', 'coating', 'accessory', 'kit'].map((type) => (
            <li key={type} className="flex items-center space-x-2.5">
              <input
                type="checkbox"
                id={`type-${type}`}
                checked={filters.productTypes.includes(type)}
                onChange={() => handleProductTypeToggle(type)}
                className="h-3.5 w-3.5 rounded border-[#EAEAEA] bg-white text-[#FF4D00] focus:ring-0 focus:ring-offset-0 accent-[#FF4D00] cursor-pointer"
              />
              <label
                htmlFor={`type-${type}`}
                className={`text-xs cursor-pointer hover:text-[#FF4D00] select-none transition-colors font-medium capitalize ${
                  filters.productTypes.includes(type) ? 'text-[#FF4D00] font-bold' : 'text-[#0A0A0A]'
                }`}
              >
                {type}
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Rating Filter */}
      <div className="space-y-3">
        <h4 className="text-[10px] tracking-[0.25em] text-[#0A0A0A] uppercase font-black">Min Rating</h4>
        <div className="flex items-center space-x-2">
          {[4.5, 4.7, 4.9].map((val) => (
            <button
              key={val}
              onClick={() => handleRatingChange(val)}
              className={`text-[10px] px-2.5 py-1.5 border transition-all font-bold cursor-pointer rounded ${
                filters.minRating === val
                  ? 'bg-[#FF4D00] border-[#FF4D00] text-white'
                  : 'bg-white border-[#EAEAEA] text-[#0A0A0A] hover:border-[#FF4D00] hover:text-[#FF4D00]'
              }`}
            >
              ★ {val}+
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
export default FilterSidebar;
