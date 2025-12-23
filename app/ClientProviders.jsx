'use client';

import { SessionProvider } from 'next-auth/react';
import { AppProvider } from '@/context/AppContext';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'sonner';
import { usePathname } from 'next/navigation';
import BanGuard from '@/components/BanGuard';

export default function ClientProviders({ children }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <SessionProvider>
      <BanGuard>
        <AppProvider>
          <CartProvider>
            {!isAdminPage && <Navbar />}
            <main className={`min-h-screen ${!isAdminPage ? 'pt-20' : ''}`}>
              {children}
            </main>
            {!isAdminPage && <Footer />}
            <Toaster
              position="top-right"
              richColors
              closeButton
              toastOptions={{
                className: 'rounded-2xl border-2 shadow-xl',
              }}
            />
          </CartProvider>
        </AppProvider>
      </BanGuard>
    </SessionProvider>
  );
}