'use client';

import * as React from 'react';
import { PRODUCTS, Product } from '../constants/products';
import { ProductCard } from './ProductCard';
import { motion } from 'framer-motion';

interface RelatedProductsProps {
  currentProduct: Product;
}

export function RelatedProducts({ currentProduct }: RelatedProductsProps) {
  const recommendations = React.useMemo(() => {
    return PRODUCTS.filter(
      (p) => p.id !== currentProduct.id && (p.category === currentProduct.category || p.brand === currentProduct.brand)
    ).slice(0, 4);
  }, [currentProduct]);

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6 pt-12 border-t border-white/5">
      <div className="text-left space-y-1">
        <span className="text-[9px] tracking-[0.3em] text-[#FF4D00] uppercase font-bold">
          Technical Combos
        </span>
        <h2 className="text-xl sm:text-2xl font-light uppercase tracking-wider text-white">
          Frequently Bought Together
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
export default RelatedProducts;
