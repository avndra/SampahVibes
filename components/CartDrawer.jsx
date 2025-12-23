'use client';

import { useCart } from '@/context/CartContext';
import { Button, IconButton, Box } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, loading, updateQuantity, removeFromCart, cartCount, cartTotal } = useCart();

  return (
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
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden">
                    <Image src={item.productId.image} alt={item.productId.name} fill className="object-cover" unoptimized />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <Link href={`/shop/${item.productId._id}`} className="font-bold text-lg hover:underline" onClick={onClose}>
                      {item.productId.name}
                    </Link>
                    <p className="text-yellow-600 font-bold">{item.productId.pointsCost.toLocaleString()} poin</p>
                    <div className="flex items-center gap-2 mt-auto">
                      <IconButton size="small" onClick={() => updateQuantity(item.productId._id, item.quantity - 1)} disabled={loading} sx={{ border: 1, borderColor: 'divider' }}>
                        <Minus className="h-4 w-4" />
                      </IconButton>
                      <span className="font-bold w-8 text-center">{item.quantity}</span>
                      <IconButton size="small" onClick={() => updateQuantity(item.productId._id, item.quantity + 1)} disabled={loading} sx={{ border: 1, borderColor: 'divider' }}>
                        <Plus className="h-4 w-4" />
                      </IconButton>
                      <IconButton size="small" color="error" className="ml-auto" onClick={() => removeFromCart(item.productId._id)} disabled={loading}>
                        <Trash2 className="h-5 w-5" />
                      </IconButton>
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
          <div className="p-6 border-t-2 border-gray-100 dark:border-gray-800 space-y-4">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total</span>
              <span className="text-yellow-600">{cartTotal.toLocaleString()} poin</span>
            </div>
            <Button
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                height: 56,
                borderRadius: 3,
                fontSize: '1.125rem',
                fontWeight: 900,
                textTransform: 'none',
                backgroundColor: '#10b981',
                '&:hover': { backgroundColor: '#059669' }
              }}
            >
              Lanjut ke Pembayaran
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
