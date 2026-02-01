'use client';

import { useCart } from '@/context/CartContext';
import { Button, IconButton, Box } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useState } from 'react';
import CheckoutModal from './CheckoutModal';

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, loading, updateQuantity, removeFromCart, checkoutItem, cartCount, cartTotal } = useCart();
  const [selectedItem, setSelectedItem] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleCheckoutClick = (item) => {
    setSelectedItem(item);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutConfirm = async (productId, shippingData) => {
    const success = await checkoutItem(productId, shippingData);
    if (success && cart.length === 1) onClose(); // Close drawer if last item paid
  };

  return (
    <>
      <div className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white dark:bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b-2 border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-7 w-7 text-green-600" />
              <h2 className="text-2xl font-black">Keranjang ({cartCount})</h2>
            </div>
            <IconButton onClick={onClose}>
              <X className="h-6 w-6" />
            </IconButton>
          </div>

          {/* Cart Items */}
          {cart.length > 0 ? (
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              <div className="p-6 space-y-6">
                {cart.map(item => (
                  <div key={item.productId._id} className="flex gap-4">
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden shadow-sm border border-gray-100">
                      <Image src={item.productId.image} alt={item.productId.name} fill className="object-cover" unoptimized />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <Link href={`/shop/${item.productId._id}`} className="font-bold text-lg hover:text-green-600 transition-colors line-clamp-1" onClick={onClose}>
                          {item.productId.name}
                        </Link>
                        <p className="text-yellow-600 font-extrabold text-sm">{item.productId.pointsCost.toLocaleString()} pts</p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Controls Redesigned */}
                        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                          <button
                            className="w-7 h-7 flex items-center justify-center bg-white dark:bg-gray-700 rounded-md shadow-sm hover:bg-gray-50 active:scale-95 transition-all text-gray-600 disabled:opacity-50"
                            onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}
                            disabled={loading || item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                          <button
                            className="w-7 h-7 flex items-center justify-center bg-white dark:bg-gray-700 rounded-md shadow-sm hover:bg-gray-50 active:scale-95 transition-all text-gray-600 disabled:opacity-50"
                            onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                            disabled={loading}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <IconButton
                            size="small"
                            onClick={() => removeFromCart(item.productId._id)}
                            disabled={loading}
                            className="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </IconButton>

                          {/* Pay Button */}
                          <Button
                            variant="contained"
                            size="small"
                            disabled={loading}
                            onClick={() => handleCheckoutClick(item)}
                            sx={{
                              borderRadius: 2,
                              textTransform: 'none',
                              fontWeight: 'bold',
                              minWidth: 'auto',
                              px: 2,
                              backgroundColor: '#10b981',
                              boxShadow: 'none',
                              '&:hover': { backgroundColor: '#059669', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }
                            }}
                          >
                            Bayar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Box>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <div className="w-40 h-40 mb-4">
                <DotLottieReact
                  src="https://lottie.host/c6c68a63-7e72-4566-a987-46c586c66cdb/y4imq6ETaS.lottie"
                  loop
                  autoplay
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
              <h3 className="text-2xl font-black mb-2">Keranjang Kosong</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Sepertinya Anda belum menambahkan apapun.</p>
              <Link href="/shop">
                <Button variant="contained" onClick={onClose} sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 'bold', backgroundColor: '#10b981', '&:hover': { backgroundColor: '#059669' } }}>
                  Mulai Belanja
                </Button>
              </Link>
            </div>
          )}

          {/* Footer */}
          {cart.length > 0 && (
            <div className="p-6 border-t-2 border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Total Estimasi</span>
                <span className="text-2xl font-black text-yellow-600">{cartTotal.toLocaleString()} <span className="text-sm text-gray-400">pts</span></span>
              </div>
            </div>
          )}
        </div>
      </div>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        item={selectedItem}
        onConfirm={handleCheckoutConfirm}
      />
    </>
  );
}
