'use client';

import ProductCard from '@/components/ProductCard';
import { ChevronRight } from 'lucide-react';

export default function ProductCarousel({ title, products, userPoints = 0 }) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-black text-gray-800 dark:text-white">{title}</h2>
        <a href="#" className="flex items-center text-green-600 dark:text-green-400 font-bold">
          Lihat Semua <ChevronRight className="h-5 w-5" />
        </a>
      </div>
      <div className="flex overflow-x-auto space-x-6 pb-4 -mx-4 px-4">
        {products.map((product) => (
          <div key={product._id} className="flex-shrink-0 w-72">
            <ProductCard product={product} userPoints={userPoints} />
          </div>
        ))}
      </div>
    </div>
  );
}
