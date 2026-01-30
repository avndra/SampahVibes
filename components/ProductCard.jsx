'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Star } from 'lucide-react';

export default function ProductCard({ product, userPoints = 0 }) {
  const [isMounted, setIsMounted] = useState(false);
  
  // Mock data

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Link href={`/shop/${product._id}`} className="block h-full">
      <div className="group h-full bg-white dark:bg-gray-800 rounded-lg md:rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg hover:border-green-500 transition-all duration-200 flex flex-col relative">
        
        {/* Image Container */}
        <div className="relative aspect-square w-full overflow-hidden bg-gray-100 dark:bg-gray-900">
          <img
            src={product.image || '/icons/default_product.png'}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center"
          />
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
              <span className="bg-black/70 text-white text-xs font-bold px-2 py-1 rounded-full">Habis</span>
            </div>
          )}
          
          {/* Mobile Discount Badge Mockup (Tokopedia Style) */}
          <div className="absolute bottom-0 left-0 right-0 bg-opacity-90 p-1 md:hidden">
             {/* Placeholder for future promo tags */}
          </div>
        </div>

        {/* Content */}
        <div className="p-1.5 md:p-3 flex flex-col flex-1 gap-1">
          {/* Title */}
          <h3 className="text-[11px] md:text-sm font-normal text-gray-900 dark:text-gray-100 line-clamp-2 leading-tight group-hover:text-green-600 dark:group-hover:text-green-400 min-h-[2em]">
            {product.name}
          </h3>

          {/* Price (Points) */}
          <div className="mt-0.5">
            <p className="text-xs md:text-base font-bold text-gray-900 dark:text-white">
              {isMounted ? product.pointsCost.toLocaleString() : product.pointsCost} Poin
            </p>
            {/* Cashback/Discount badge mockup */}
            <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[9px] md:text-[10px] bg-green-100 text-green-700 px-1 rounded font-bold">Cashback</span>
            </div>
          </div>


          

        </div>
      </div>
    </Link>
  );
}