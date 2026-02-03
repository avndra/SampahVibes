'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import {
   Star,
   Minus,
   Plus,
   Share2,
   Heart,
   ShoppingCart,
   Info,
   ChevronRight,
   MessageSquare,
   MapPin,
   ArrowLeft,
   Truck,
   Navigation
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { redeemProduct } from '@/lib/actions/redeem';
import { useCart } from '@/context/CartContext';
import Modal from '@/components/Modal';
import PurchaseSuccessModal from '@/components/PurchaseSuccessModal';

export default function ProductDetailClient({ product, userPoints, isLoggedIn }) {
   const router = useRouter();
   const { addToCart, loading: cartLoading } = useCart();
   const [quantity, setQuantity] = useState(1);
   const [activeTab, setActiveTab] = useState('detail');
   const [isRedeeming, setIsRedeeming] = useState(false);
   const [selectedImage, setSelectedImage] = useState((product.images && product.images.length > 0) ? product.images[0] : product.image);

   // Checkout State
   const [checkoutOpen, setCheckoutOpen] = useState(false);
   const [isLocating, setIsLocating] = useState(false);
   const [shippingData, setShippingData] = useState({
      address: '',
      city: '',
      postalCode: '',
      note: ''
   });

   // Load saved address from localStorage
   useEffect(() => {
      const savedAddress = localStorage.getItem('savedShippingAddress');
      if (savedAddress) {
         try {
            const parsed = JSON.parse(savedAddress);
            setShippingData(prev => ({
               ...prev,
               address: parsed.address || '',
               city: parsed.city || '',
               postalCode: parsed.postalCode || ''
            }));
         } catch (error) {
            console.error('Failed to parse saved address:', error);
         }
      }
   }, []);

   // Auto-save address to localStorage
   useEffect(() => {
      if (shippingData.address || shippingData.city || shippingData.postalCode) {
         const dataToSave = {
            address: shippingData.address,
            city: shippingData.city,
            postalCode: shippingData.postalCode
         };
         localStorage.setItem('savedShippingAddress', JSON.stringify(dataToSave));
      }
   }, [shippingData.address, shippingData.city, shippingData.postalCode]);

   const handleGetLocation = () => {
      setIsLocating(true);
      if (!navigator.geolocation) {
         toast.error('Browser tidak mendukung Geolocation');
         setIsLocating(false);
         return;
      }

      navigator.geolocation.getCurrentPosition(async (position) => {
         const { latitude, longitude } = position.coords;
         try {
            // Use OpenStreetMap Nominatim for free reverse geocoding
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();

            if (data && data.display_name) {
               const address = data.display_name;
               const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county || '';
               const postcode = data.address?.postcode || '';

               setShippingData(prev => ({
                  ...prev,
                  address: address,
                  city: city,
                  postalCode: postcode
               }));
               toast.success('Lokasi berhasil diambil dari GPS!');
            } else {
               toast.error('Gagal mendapatkan detail alamat');
            }
         } catch (error) {
            toast.error('Gagal mengambil data lokasi');
         } finally {
            setIsLocating(false);
         }
      }, (error) => {
         console.error(error);
         toast.error('Gagal mengakses lokasi. Silakan input manual.');
         setIsLocating(false);
      });
   };



   const images = (product.images && product.images.length > 0) ? product.images : [product.image];
   const totalPrice = product.pointsCost * quantity;
   const canRedeem = userPoints >= totalPrice && product.stock >= quantity;

   const [successModalOpen, setSuccessModalOpen] = useState(false);
   const [lastTransaction, setLastTransaction] = useState(null);

   const handleOpenCheckout = () => {
      if (!isLoggedIn) return router.push('/login');
      if (!canRedeem) return;
      setCheckoutOpen(true);
   };

   const handleRedeem = async () => {
      if (!shippingData.address || !shippingData.city) {
         toast.error('Mohon lengkapi alamat pengiriman');
         return;
      }

      setIsRedeeming(true);
      try {
         const result = await redeemProduct(product._id, quantity, shippingData);
         if (result.success) {
            setCheckoutOpen(false);
            setLastTransaction(result.transaction);
            setSuccessModalOpen(true); // Show success modal
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
         } else {
            toast.error(result.error || 'Gagal menukar.');
         }
      } catch (error) {
         console.error(error);
         toast.error('Terjadi kesalahan.');
      } finally {
         setIsRedeeming(false);
      }
   };

   const handleAddToCart = () => {
      if (!isLoggedIn) return router.push('/login');
      addToCart(product._id, quantity);
   };

   return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 pb-24 md:pb-12 relative">

         {/* Mobile Back Button Header (Absolute) */}
         <div className="md:hidden fixed top-0 left-0 z-50 p-4 w-full bg-gradient-to-b from-black/50 to-transparent h-20 flex items-center pointer-events-none">
            <button onClick={() => router.back()} className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white pointer-events-auto hover:bg-white/30 transition">
               <ArrowLeft className="w-6 h-6" />
            </button>
         </div>

         {/* Desktop Breadcrumb */}
         <div className="hidden md:block border-b border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4 py-3">
               <div className="flex items-center text-xs text-green-600 gap-1">
                  <Link href="/" className="hover:underline">Home</Link>
                  <ChevronRight className="w-3 h-3 text-gray-400" />
                  <Link href="/shop" className="hover:underline">Toko</Link>
                  <ChevronRight className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-500 truncate max-w-[200px]">{product.name}</span>
               </div>
            </div>
         </div>

         <div className="container mx-auto px-0 md:px-4 py-0 md:py-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 md:gap-10">

               {/* Left Column: Images */}
               <div className="lg:col-span-4 space-y-4">
                  {/* Main Image - Mobile: Full Width Aspect 1:1, Desktop: Rounded */}
                  <div className="relative w-full aspect-square md:rounded-xl overflow-hidden border-b md:border border-gray-200 dark:border-gray-700">
                     <img
                        src={selectedImage}
                        alt={product.name}
                        className="w-full h-full object-cover"
                     />
                     {product.stock <= 0 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-xl">Habis</div>
                     )}
                  </div>

                  {/* Thumbnails (Hidden on Mobile for simplicity, can use swipe dots in real app) */}
                  <div className="hidden md:flex gap-3 overflow-x-auto pb-2">
                     {images.map((img, i) => (
                        <button
                           key={i}
                           onClick={() => setSelectedImage(img)}
                           className={`relative w-16 h-16 rounded-md overflow-hidden border-2 flex-shrink-0 
                    ${selectedImage === img ? 'border-green-500' : 'border-transparent hover:border-gray-300'}`}
                        >
                           <img src={img} alt="thumb" className="w-full h-full object-cover" />
                        </button>
                     ))}
                  </div>
               </div>

               {/* Middle Column: Product Info */}
               <div className="lg:col-span-5 space-y-4 md:space-y-6 p-4 md:p-0">
                  {/* Global Style to Hide Footer on Mobile for this page */}
                  <style jsx global>{`
                     @media (max-width: 768px) {
                        footer {
                           display: none !important;
                        }
                     }
                  `}</style>

                  <div>
                     {/* Mobile Price Section (Tokopedia Style: Price First) */}
                     <div className="flex items-end gap-2 mb-2">
                        <div className="text-3xl font-black text-gray-900 dark:text-white">
                           {product.pointsCost.toLocaleString()}
                        </div>
                        <span className="text-sm font-bold text-green-600 mb-1.5 bg-green-50 px-2 py-0.5 rounded-full">Poin</span>
                     </div>

                     <h1 className="text-lg md:text-2xl font-normal leading-snug mb-3 text-gray-800 dark:text-gray-100 line-clamp-2 md:line-clamp-none">
                        {product.name}
                     </h1>

                     {/* Stats / Stock */}
                     <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                        <span className="border border-green-200 text-green-700 bg-green-50 px-2 py-0.5 rounded text-xs font-bold">Stok: {product.stock}</span>
                        <span>Terjual 100+</span> {/* Mock sold count for app feel */}
                        <div className="flex items-center gap-1 text-yellow-500">
                           <Star className="w-3.5 h-3.5 fill-current" />
                           <span className="text-gray-700 dark:text-gray-300 font-bold">4.8</span>
                        </div>
                     </div>
                  </div>

                  {/* Thick Divider Mobile */}
                  <div className="md:hidden -mx-4 h-2 bg-gray-100 dark:bg-gray-800 mb-4" />

                  <div className="hidden md:block hr border-t border-gray-100 dark:border-gray-800" />

                  {/* Detail/Info Tabs */}
                  <div>
                     <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-3">Detail Produk</h3>

                     {/* Mobile Info Grid (Condition, Category, etc) */}
                     <div className="md:hidden grid grid-cols-2 gap-4 mb-4 text-xs">
                        <div>
                           <span className="text-gray-500 block">Kondisi</span>
                           <span className="text-gray-900 font-medium">Baru</span>
                        </div>
                        <div>
                           <span className="text-gray-500 block">Min. Pemesanan</span>
                           <span className="text-gray-900 font-medium">1 Buah</span>
                        </div>
                        <div>
                           <span className="text-gray-500 block">Kategori</span>
                           <span className="text-green-600 font-bold capitalize">{product.category || 'Umum'}</span>
                        </div>
                     </div>

                     <div className="md:hidden -mx-4 h-[1px] bg-gray-100 dark:bg-gray-800 mb-4" />

                     <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                        <p className="mb-4">{product.description || "Tidak ada deskripsi."}</p>
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs text-gray-500">
                           <p className="font-bold mb-1">Catatan Pengiriman:</p>
                           <p>Pesanan sebelum jam 14:00 dikirim hari yang sama.</p>
                        </div>
                     </div>
                  </div>

                  {/* Thick Divider Mobile */}
                  <div className="md:hidden -mx-4 h-2 bg-gray-100 dark:bg-gray-800 mt-6" />

                  <div className="hidden md:block hr border-t border-gray-100 dark:border-gray-800" />


               </div>

               {/* Right Column: Sticky Action Card (DESKTOP ONLY) */}
               <div className="hidden lg:block lg:col-span-3">
                  <div className="sticky top-24 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm space-y-4">
                     <h3 className="font-bold text-sm">Atur jumlah dan catatan</h3>

                     <div className="flex items-center gap-3 border border-gray-200 dark:border-gray-700 rounded-md p-1 w-fit">
                        <button
                           onClick={() => setQuantity(Math.max(1, quantity - 1))}
                           disabled={quantity <= 1}
                           className={`p-1 rounded hover:bg-gray-100 ${quantity <= 1 ? 'text-gray-300' : 'text-gray-600'}`}
                        >
                           <Minus className="w-4 h-4" />
                        </button>
                        <input
                           type="text"
                           value={quantity}
                           readOnly
                           className="w-10 text-center text-sm font-bold bg-transparent border-none focus:ring-0 p-0"
                        />
                        <button
                           onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                           disabled={quantity >= product.stock}
                           className={`p-1 rounded hover:bg-gray-100 ${quantity >= product.stock ? 'text-gray-300' : 'text-green-600'}`}
                        >
                           <Plus className="w-4 h-4" />
                        </button>
                     </div>
                     <p className="text-xs text-gray-500">Stok Total: <strong>{product.stock}</strong></p>

                     <div className="flex justify-between items-center pt-4">
                        <span className="text-gray-500 text-sm">Subtotal</span>
                        <span className="font-bold text-lg">{totalPrice.toLocaleString()} Poin</span>
                     </div>

                     <div className="space-y-2 pt-2">
                        <Button
                           className="w-full font-bold h-10 bg-green-600 hover:bg-green-700 text-white"
                           onClick={handleOpenCheckout}
                           disabled={!canRedeem || isRedeeming || product.stock === 0}
                        >
                           {isRedeeming ? 'Memproses...' : product.stock === 0 ? 'Stok Habis' : 'Tukar Langsung'}
                        </Button>
                        <Button
                           variant="outline"
                           className="w-full font-bold h-10 border-green-600 text-green-600 hover:bg-green-50"
                           onClick={handleAddToCart}
                           disabled={cartLoading || product.stock === 0}
                        >
                           + Keranjang
                        </Button>
                     </div>


                  </div>
               </div>
            </div>
         </div>

         {/* MOBILE BOTTOM ACTION BAR (Sticky) */}
         <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-3 px-4 flex items-center gap-3 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">

            <Button
               variant="outline"
               onClick={handleAddToCart}
               className="flex-1 border-green-600 text-green-600 font-bold h-10"
               disabled={cartLoading || product.stock === 0}
            >
               + Keranjang
            </Button>
            <Button
               onClick={handleOpenCheckout}
               className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold h-10"
               disabled={!canRedeem || isRedeeming || product.stock === 0}
            >
               {isRedeeming ? 'Proses...' : 'Tukar Langsung'}
            </Button>
         </div>

         {/* Checkout Modal */}
         <Modal isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} title="Pengiriman">
            <div className="space-y-6">
               {/* Manual Address Input with Optional Geolocation */}
               <div className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                     <label className="text-sm font-bold flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-green-600" /> Alamat Pengiriman
                     </label>
                     <Button
                        onClick={handleGetLocation}
                        disabled={isLocating}
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs border-green-600 text-green-600 hover:bg-green-50"
                     >
                        <Navigation className={`w-3 h-3 mr-1 ${isLocating ? 'animate-spin' : ''}`} />
                        {isLocating ? 'Mencari...' : 'Auto-Fill GPS'}
                     </Button>
                  </div>

                  <Input
                     placeholder="Alamat Lengkap"
                     value={shippingData.address}
                     onChange={(e) => setShippingData(prev => ({ ...prev, address: e.target.value }))}
                     className="bg-white border-gray-200"
                     required
                  />
                  <div className="grid grid-cols-2 gap-3">
                     <Input
                        placeholder="Kota"
                        value={shippingData.city}
                        onChange={(e) => setShippingData(prev => ({ ...prev, city: e.target.value }))}
                        className="bg-white border-gray-200"
                        required
                     />
                     <Input
                        placeholder="Kode Pos"
                        value={shippingData.postalCode}
                        onChange={(e) => setShippingData(prev => ({ ...prev, postalCode: e.target.value }))}
                        className="bg-white border-gray-200"
                     />
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                     <MapPin className="w-3 h-3" />
                     Alamat akan disimpan otomatis untuk pembelian selanjutnya
                  </p>
               </div>

               {/* Order Summary */}
               <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl space-y-2">
                  <h3 className="font-bold text-sm border-b border-green-200 pb-2 mb-2">Ringkasan Pesanan</h3>
                  <div className="flex justify-between text-sm">
                     <span className="text-gray-600 dark:text-gray-300">{product.name} x{quantity}</span>
                     <span className="font-bold">{totalPrice.toLocaleString()} Poin</span>
                  </div>
                  <div className="flex justify-between text-sm">
                     <span className="text-gray-600 dark:text-gray-300 flex items-center gap-1"><Truck className="w-3 h-3" /> Ongkos Kirim</span>
                     <span className="font-bold text-green-600">Gratis</span>
                  </div>
                  <div className="flex justify-between text-lg font-black border-t border-green-200 pt-2 mt-2">
                     <span>Total Bayar</span>
                     <span className="text-green-700">{totalPrice.toLocaleString()} Poin</span>
                  </div>
               </div>

               <Button
                  className="w-full h-12 text-lg font-bold bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-300 disabled:text-gray-500"
                  onClick={handleRedeem}
                  disabled={isRedeeming || !shippingData.address || !shippingData.city}
               >
                  {isRedeeming ? 'Memproses Pesanan...' : (!shippingData.address || !shippingData.city) ? 'Lengkapi Alamat Dulu' : 'Konfirmasi & Tukar Poin'}
               </Button>
            </div>
         </Modal>

         <PurchaseSuccessModal
            isOpen={successModalOpen}
            onClose={() => {
               setSuccessModalOpen(false);
               router.push('/profile');
            }}
            transaction={lastTransaction}
         />
      </div>
   );
}
