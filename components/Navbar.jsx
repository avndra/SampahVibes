'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useAppContext } from '@/context/AppContext';
import { useCart } from '@/context/CartContext';
import { Button, IconButton } from '@mui/material';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import CartDrawer from './CartDrawer';
import Icon from './Icon';
import ScanModal from './ScanModal';
import { User, LogOut, Settings, Menu, X, Shield, Home, Gift, Scan, ShoppingCart, Bell } from 'lucide-react';


export default function Navbar() {
  const { data: session } = useSession();
  const { user } = useAppContext();
  const { cartCount } = useCart();
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [scanModalOpen, setScanModalOpen] = useState(false);

  const [unreadNotif, setUnreadNotif] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    if (session) {
      // Poll unread count every 30s or on mount
      const fetchUnread = async () => {
        try {
          const res = await fetch('/api/notifications');
          if (res.ok) {
            const data = await res.json();
            setUnreadNotif(data.unreadCount);
          }
        } catch (e) { console.error(e); }
      };
      fetchUnread();
      const interval = setInterval(fetchUnread, 30000);

      // Listen for custom event when notifications are marked as read
      const handleNotificationsRead = () => {
        setUnreadNotif(0);
      };
      window.addEventListener('notificationsRead', handleNotificationsRead);

      return () => {
        clearInterval(interval);
        window.removeEventListener('notificationsRead', handleNotificationsRead);
      };
    }
  }, [session]); // Refetch unread count on session change

  const isProductDetail = pathname?.startsWith('/shop/') && pathname !== '/shop';

  const navItems = [
    { id: 'home', label: 'Beranda', href: '/' },
    { id: 'shop', label: 'Tukar', href: '/shop' },
  ];

  return (
    <>
      {/* Desktop Header (Visible only on md+) */}
      <header className="hidden md:block fixed top-0 left-0 right-0 z-50">
        <nav className="bg-[#0a1f1f]/95 dark:bg-[#0a1f1f]/95 backdrop-blur-lg border-b border-green-500/20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-20">
              {/* Left: Logo */}
              <div className="flex-shrink-0">
                <Link href="/" className="flex items-center gap-3 group">
                  <Image
                    src="/icons/logo2.png"
                    alt="RecycleVibes Logo"
                    width={80}
                    height={10}
                    className="object-contain h-auto"
                    unoptimized
                  />
                  <span className="text-3xl tracking-wide transition-transform duration-300 group-hover:scale-[1.02] flex items-baseline gap-1">
                    <span className="text-white font-[family-name:var(--font-satisfy)]">Recycle</span>
                    <span className="bg-gradient-to-tr from-green-400 to-teal-400 bg-clip-text text-transparent font-[family-name:var(--font-shadows)] font-bold">vibes</span>
                  </span>
                </Link>
              </div>

              {/* Center: Navigation Links (Desktop) */}
              <div className="flex items-center justify-center flex-1">
                <div className="flex items-center gap-8">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link key={item.id} href={item.href} className={`nav-link-animated text-base font-bold transition-colors py-2 ${isActive ? 'text-green-400 dark:text-green-300' : 'text-gray-300 dark:text-gray-200 hover:text-green-400 dark:hover:text-green-300'}`}>
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Right: Actions (Desktop) */}
              <div className="flex items-center justify-end gap-4">
                {session ? (
                  <>
                    <Link href="/notifications">
                      <IconButton
                        sx={{ color: '#ffffff', '&:hover': { color: '#e5e7eb', backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
                      >
                        <div className="relative">
                          <Bell className="w-6 h-6" />
                          {unreadNotif > 0 && (
                            <span className="absolute -top-2 -right-2 min-w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1 border-2 border-[#0a1f1f]">
                              {unreadNotif > 99 ? '99+' : unreadNotif}
                            </span>
                          )}
                        </div>
                      </IconButton>
                    </Link>

                    <IconButton
                      onClick={() => setCartDrawerOpen(true)}
                      sx={{ color: '#9ca3af', '&:hover': { color: '#ffffff', backgroundColor: 'rgba(255, 255, 255, 0.05)' } }}
                    >
                      <div className="relative">
                        <ShoppingCart className="w-6 h-6 text-white" />
                        {cartCount > 0 && (
                          <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                            {cartCount}
                          </span>
                        )}
                      </div>
                    </IconButton>
                    <div className="relative">
                      <Link href="/profile" className="flex items-center gap-2">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-green-500/50 hover:ring-green-400 transition-all">
                          <Image src={user?.avatar || '/icons/default_avatar.png'} alt={user?.name || 'User'} fill className="object-cover" unoptimized />
                        </div>
                      </Link>
                    </div>
                    {user?.role === 'admin' && (
                      <Link href="/admin">
                        <IconButton sx={{ color: '#9ca3af', '&:hover': { color: '#ffffff', backgroundColor: 'rgba(255, 255, 255, 0.05)' } }}>
                          <Shield size={20} />
                        </IconButton>
                      </Link>
                    )}
                    <button onClick={() => signOut()} className="btn-logout">
                      <span className="sign">
                        <LogOut size={18} />
                      </span>
                      <span className="text">Logout</span>
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link href="/login">
                      <Button
                        variant="text"
                        sx={{
                          color: '#d1d5db',
                          textTransform: 'none',
                          fontWeight: 'bold',
                          '&:hover': { color: '#ffffff', backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                        }}
                      >
                        Masuk
                      </Button>
                    </Link>
                    <Link href="/login?mode=signup">
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: '#10b981',
                          color: '#ffffff',
                          textTransform: 'none',
                          fontWeight: 'bold',
                          borderRadius: 2,
                          '&:hover': { backgroundColor: '#059669' }
                        }}
                      >
                        Daftar
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Top Bar (Logo & Title) */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#0a1f1f] border-b border-green-500/20 h-16 px-4 flex items-center justify-between pointer-events-auto">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/icons/logo2.png"
            alt="RecycleVibes Logo"
            width={48}
            height={48}
            className="object-contain h-10 w-auto"
            unoptimized
          />
          <span className="text-xl tracking-wide flex items-baseline gap-0.5">
            <span className="text-white font-[family-name:var(--font-satisfy)]">Recycle</span>
            <span className="bg-gradient-to-tr from-green-400 to-teal-400 bg-clip-text text-transparent font-[family-name:var(--font-shadows)] font-bold">vibes</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          {session && (
            <button onClick={() => signOut()} className="btn-logout">
              <span className="sign">
                <LogOut size={18} />
              </span>
              <span className="text">Logout</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navbar (Floating Bottom Pill) */}
      {!isProductDetail && (
        <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
          <div className="bg-[#0a1f1f] rounded-full shadow-2xl px-4 h-16 flex items-center justify-between border border-white/10 backdrop-blur-md">

            {/* Home Button */}
            <Link href="/" className={`flex flex-col items-center justify-center w-12 h-full ${pathname === '/' ? 'text-green-400' : 'text-gray-400'}`}>
              <Home className="w-6 h-6 mb-0.5" />
              <span className="text-[9px] font-medium">Home</span>
            </Link>

            {/* Shop Button */}
            <Link href="/shop" className={`flex flex-col items-center justify-center w-12 h-full ${pathname === '/shop' ? 'text-green-400' : 'text-gray-400'}`}>
              <Gift className="w-6 h-6 mb-0.5" />
              <span className="text-[9px] font-medium">Hadiah</span>
            </Link>

            {/* Scan Button (Center Floating) */}
            <div className="relative -top-5">
              <button
                onClick={() => session ? setScanModalOpen(true) : null}
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-4 border-[#0a1f1f] transform transition-transform active:scale-95 ${session ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400'}`}
              >
                <Scan className="w-8 h-8" />
              </button>
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setCartDrawerOpen(true)}
              className="flex flex-col items-center justify-center w-12 h-full text-gray-400 hover:text-green-400 relative"
            >
              <div className="relative">
                <ShoppingCart className="w-6 h-6 mb-0.5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-[#0a1f1f]">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[9px] font-medium">Keranjang</span>
            </button>

            {/* Profile Button */}
            <Link href={session ? "/profile" : "/login"} className={`flex flex-col items-center justify-center w-12 h-full ${pathname === '/profile' ? 'text-green-400' : 'text-gray-400'}`}>
              {session && user?.avatar ? (
                <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-400 mb-0.5">
                  <img src={user.avatar} alt="User" className="object-cover w-full h-full" />
                </div>
              ) : (
                <User className="w-6 h-6 mb-0.5" />
              )}
              <span className="text-[9px] font-medium">{session ? 'Profil' : 'Masuk'}</span>
            </Link>

          </div>
        </div>
      )}

      <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
      <ScanModal open={scanModalOpen} onClose={() => setScanModalOpen(false)} />
    </>
  );
}