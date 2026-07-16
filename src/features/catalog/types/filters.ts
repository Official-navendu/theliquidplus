export interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  inStockOnly: boolean;
  productTypes: string[];
  minRating: number;
}
