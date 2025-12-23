'use client';

import { useState } from 'react';
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
   Truck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { redeemProduct } from '@/lib/actions/redeem';
import { useCart } from '@/context/CartContext';
import Modal from '@/components/Modal';

export default function ProductDetailClient({ product, userPoints, isLoggedIn }) {
   const router = useRouter();
   const { addToCart, loading: cartLoading } = useCart();
   const [quantity, setQuantity] = useState(1);
   const [activeTab, setActiveTab] = useState('detail');
   const [isRedeeming, setIsRedeeming] = useState(false);
   const [selectedImage, setSelectedImage] = useState(product.image);

   // Checkout State
   const [checkoutOpen, setCheckoutOpen] = useState(false);
   const [isLocating, setIsLocating] = useState(false);
   const [locationVerified, setLocationVerified] = useState(false);
   const [shippingData, setShippingData] = useState({
      address: '',
      city: '',
      postalCode: '',
      note: ''
   });

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
               setLocationVerified(true);
               toast.success('Lokasi berhasil dikonfirmasi!');
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
         toast.error('Gagal mengakses lokasi. Pastikan izin GPS aktif.');
         setIsLocating(false);
      });
   };

   // Mock Data
   const rating = 4.8;
   const soldCount = 250;
   const reviewCount = 120;
   const shopName = "Official E-Recycle Store";
   const shopLocation = "Jakarta Pusat";

   const images = [product.image, product.image, product.image];
   const totalPrice = product.pointsCost * quantity;
   const canRedeem = userPoints >= totalPrice && product.stock >= quantity;

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
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
            toast.success(result.message);
            router.push('/profile');
         } else {
            toast.error(result.error || 'Gagal menukar.');
         }
      } catch (error) {
         toast.error('Terjadi kesalahan.');
      } finally {
         setIsRedeeming(false);
      }
   };

   const handleAddToCart = () => {
      if (!isLoggedIn) return router.push('/login');
      addToCart(product._id, quantity);
      toast.success('Masuk keranjang!');
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
                  <div className="relative w-full aspect-square md:rounded-xl overflow-hidden border-b md:border border-gray-200 dark:border-gray-700 sticky top-0 md:top-24">
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
                  <div>
                     <div className="flex justify-between items-start">
                        <h1 className="text-lg md:text-2xl font-bold leading-snug mb-2 text-gray-900 dark:text-white">{product.name}</h1>
                        <button className="md:hidden text-gray-500"><Heart className="w-6 h-6" /></button>
                     </div>

                     <div className="flex items-center gap-1 mb-3">
                        <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                           {product.pointsCost.toLocaleString()}
                        </div>
                        <span className="text-sm font-semibold text-green-600 bg-green-100 px-1.5 py-0.5 rounded">Poin</span>
                     </div>

                     <div className="flex items-center gap-3 text-sm text-gray-500 mb-4 border-b md:border-none pb-4 md:pb-0 border-gray-100">
                        <div className="flex items-center gap-1">
                           <span className="text-gray-900 dark:text-white">Terjual {soldCount}+</span>
                        </div>
                        <span className="text-gray-300">•</span>
                        <div className="flex items-center gap-1 border border-gray-300 rounded-lg px-2 py-1">
                           <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                           <span className="text-gray-900 dark:text-white font-bold">{rating}</span>
                           <span className="text-gray-400">({reviewCount})</span>
                        </div>
                     </div>
                  </div>

                  <div className="hidden md:block hr border-t border-gray-100 dark:border-gray-800" />

                  {/* Detail/Info Tabs */}
                  <div>
                     <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
                        <button
                           className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'detail' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500'}`}
                           onClick={() => setActiveTab('detail')}
                        >
                           Detail
                        </button>
                        <button
                           className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'info' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500'}`}
                           onClick={() => setActiveTab('info')}
                        >
                           Info Penting
                        </button>
                     </div>

                     <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {activeTab === 'detail' ? (
                           product.description || "Tidak ada deskripsi."
                        ) : (
                           <div className="space-y-2">
                              <p><strong>Kebijakan Pengembalian:</strong> Barang yang sudah ditukar tidak dapat dikembalikan kecuali cacat produksi.</p>
                              <p><strong>Pengiriman:</strong> Estimasi 3-5 hari kerja.</p>
                           </div>
                        )}
                     </div>
                  </div>

                  <div className="hidden md:block hr border-t border-gray-100 dark:border-gray-800" />

                  {/* Shop Info Card */}
                  <div className="flex items-center gap-4 p-3 rounded-lg md:bg-transparent bg-gray-50 dark:bg-gray-800 md:p-0">
                     <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-xl">
                        E
                     </div>
                     <div>
                        <p className="font-bold text-sm flex items-center gap-1">
                           {shopName}
                           <span className="bg-green-100 text-green-700 text-[10px] px-1 rounded font-bold">Official</span>
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                           <MapPin className="w-3 h-3" /> {shopLocation}
                        </p>
                     </div>
                     <Button variant="outline" size="sm" className="ml-auto font-bold text-green-600 border-green-600 hover:bg-green-50">
                        Follow
                     </Button>
                  </div>
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
                           {isRedeeming ? 'Memproses...' : product.stock === 0 ? 'Stok Habis' : 'Beli Langsung'}
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

                     <div className="flex items-center justify-center gap-4 pt-2">
                        <button className="text-xs text-gray-500 flex items-center gap-1 font-semibold hover:text-green-600">
                           <MessageSquare className="w-4 h-4" /> Chat
                        </button>
                        <button className="text-xs text-gray-500 flex items-center gap-1 font-semibold hover:text-green-600">
                           <Heart className="w-4 h-4" /> Wishlist
                        </button>
                        <button className="text-xs text-gray-500 flex items-center gap-1 font-semibold hover:text-green-600">
                           <Share2 className="w-4 h-4" /> Share
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* MOBILE BOTTOM ACTION BAR (Sticky) */}
         <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-3 px-4 flex items-center gap-3 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <button className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
               <MessageSquare className="w-5 h-5" />
            </button>
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
               {isRedeeming ? 'Proses...' : 'Beli Langsung'}
            </Button>
         </div>

         {/* Checkout Modal */}
         <Modal isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} title="Pengiriman">
            <div className="space-y-6">
               {/* Address Selection Mockup */}
               <div className="space-y-2">
                  <label className="text-sm font-bold flex items-center gap-2">
                     <MapPin className="w-4 h-4 text-green-600" /> Pilih Lokasi Pengiriman
                  </label>

                  {/* Location Verifier */}
                  <div className={`relative w-full p-4 rounded-xl border-2 transition-colors group ${locationVerified ? 'bg-green-50 border-green-500' : 'bg-gray-50 border-gray-200 hover:border-green-300'}`}>
                     {!locationVerified ? (
                        <div className="flex flex-col items-center justify-center py-4 text-center">
                           <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                              <MapPin className={`w-6 h-6 ${isLocating ? 'animate-bounce' : ''}`} />
                           </div>
                           <h4 className="font-bold text-gray-800 mb-1">Verifikasi Lokasi Diperlukan</h4>
                           <p className="text-sm text-gray-500 mb-4 max-w-xs">Kami perlu mengakses lokasi Anda untuk memastikan pengiriman yang akurat.</p>
                           <Button
                              onClick={handleGetLocation}
                              disabled={isLocating}
                              className="bg-green-600 hover:bg-green-700 text-white font-bold"
                           >
                              {isLocating ? 'Mencari Lokasi...' : '📍 Ambil Lokasi Saya'}
                           </Button>
                        </div>
                     ) : (
                        <div className="flex items-start gap-3">
                           <div className="mt-1">
                              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center">
                                 <MapPin className="w-4 h-4" />
                              </div>
                           </div>
                           <div className="flex-1">
                              <div className="flex justify-between items-start">
                                 <h4 className="font-bold text-gray-800 text-sm">Lokasi Terverifikasi</h4>
                                 <button onClick={() => setLocationVerified(false)} className="text-xs text-red-500 hover:underline">Ubah</button>
                              </div>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{shippingData.address}</p>
                              <div className="flex gap-2 mt-2">
                                 <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">GPS Akurat</span>
                              </div>
                           </div>
                        </div>
                     )}
                  </div>
               </div>

               <div className="space-y-3 opacity-75 pointer-events-none filter grayscale-[0.5]">
                  <Input
                     placeholder="Alamat Lengkap"
                     value={shippingData.address}
                     readOnly
                     className="bg-gray-100 border-gray-200 cursor-not-allowed"
                  />
                  <div className="grid grid-cols-2 gap-3">
                     <Input
                        placeholder="Kota"
                        value={shippingData.city}
                        readOnly
                        className="bg-gray-100 border-gray-200 cursor-not-allowed"
                     />
                     <Input
                        placeholder="Kode Pos"
                        value={shippingData.postalCode}
                        readOnly
                        className="bg-gray-100 border-gray-200 cursor-not-allowed"
                     />
                  </div>
                  <Input
                     placeholder="Catatan untuk kurir (opsional)"
                     value={shippingData.note}
                     onChange={(e) => setShippingData({ ...shippingData, note: e.target.value })}
                     className="bg-white border-gray-200 pointer-events-auto"
                     style={{ filter: 'none' }}
                  />
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
                  disabled={isRedeeming || !locationVerified}
               >
                  {isRedeeming ? 'Memproses Pesanan...' : !locationVerified ? 'Verifikasi Lokasi Dulu' : 'Konfirmasi & Tukar Poin'}
               </Button>
            </div>
         </Modal>
      </div>
   );
}
