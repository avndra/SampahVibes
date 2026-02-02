'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { useAppContext } from '@/context/AppContext';
import { Loader2, Search, SlidersHorizontal, Filter, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';


export default function ShopPage() {
  const { user } = useAppContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Categories derived from products
  const categories = ['all', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredSubset = products.filter(p => p.featured).slice(0, 6);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pb-20">

      {/* Mobile Sticky Header (Search) */}
      <div className="md:hidden fixed top-16 left-0 right-0 z-40 bg-white dark:bg-gray-900 px-4 py-3 shadow-sm border-b border-gray-100 dark:border-gray-800">
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari di Toko..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

        </div>
        {/* Mobile Quick Filters (Horizontal Scroll) */}
        <div className="flex gap-2 overflow-x-auto mt-3 pb-1 no-scrollbar relative z-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium border transition-colors
                  ${selectedCategory === cat
                  ? 'bg-green-100 text-green-700 border-green-200'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
            >
              {cat === 'all' ? 'Semua' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>


      </div>

      <div className="container mx-auto px-4 md:pt-4 pt-[120px]"> {/* Added padding-top for mobile sticky header offset */}

        {/* Hero Banner (Responsive) */}
        <div className="mb-8">
          <div className="relative w-full h-48 md:h-80 rounded-2xl overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-white-600 opacity-90 mix-blend-multiply z-10" />
            <img
              src="images/indonature.jpg"
              alt="Hero Banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center px-4 md:px-16">
              <div className="max-w-2xl text-white">
                <h1 className="text-lg md:text-4xl font-extrabold mb-1 md:mb-2 drop-shadow-md leading-tight">
                  Tukarkan Sampahmu,<br className="hidden md:block" /> Dapatkan Hadiah Impian!
                </h1>
                <p className="text-xs md:text-lg font-medium text-green-50 opacity-90 mb-2 md:mb-6 max-w-lg drop-shadow line-clamp-3 md:line-clamp-none">
                  Kumpulkan poin dari setiap sampah yang kamu daur ulang dan tukarkan dengan voucher, elektronik, dan produk ramah lingkungan.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile "Slider" (Horizontal Scroll) for Featured - Satisfying "slider ke kanan/kiri" request */}
        <div className="md:hidden mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-800">Pilihan Spesial</h3>
            <span className="text-xs text-green-600 font-bold">Lihat Semua</span>
          </div>
          <div className="flex overflow-x-auto gap-3 pb-2 -mx-4 px-4 no-scrollbar snap-x">
            {featuredSubset.map(product => (
              <div key={product._id} className="w-[130px] flex-shrink-0 snap-center">
                <ProductCard product={product} userPoints={user?.totalPoints} />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Filters (Desktop Only) */}
          <aside className="hidden md:block w-64 flex-shrink-0 space-y-6 relative">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filter
              </h2>
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-gray-500">Kategori</h3>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <div key={cat} className="flex items-center gap-2">
                      <input
                        type="radio"
                        id={`desktop-${cat}`}
                        name="category-desktop"
                        checked={selectedCategory === cat}
                        onChange={() => setSelectedCategory(cat)}
                        className="text-green-600 focus:ring-green-500"
                      />
                      <label htmlFor={`desktop-${cat}`} className="text-sm capitalize cursor-pointer hover:text-green-600">
                        {cat === 'all' ? 'Semua Kategori' : cat}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Desktop Header / Sort */}
            <div className="hidden md:flex items-center justify-between mb-4">
              <div className="text-sm text-gray-500">
                Menampilkan <strong>{filteredProducts.length}</strong> produk
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Urutkan:</span>
                <button className="text-sm font-bold flex items-center gap-1">
                  Paling Sesuai <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mobile Section Title for Main Grid */}
            <div className="md:hidden mb-3">
              <h3 className="font-bold text-gray-800">Semua Produk</h3>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-green-500" />
              </div>
            ) : (
              /* Grid 3 columns on mobile to be dense ("padat") */
              <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4">
                {filteredProducts.map((product) => (
                  <div key={product._id} className="h-auto">
                    <ProductCard product={product} userPoints={user?.totalPoints} />
                  </div>
                ))}
                {filteredProducts.length === 0 && (
                  <div className="col-span-full text-center py-20 text-gray-500">
                    Tidak ada produk yang ditemukan.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}