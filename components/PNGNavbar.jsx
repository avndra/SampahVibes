import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import { useState } from 'react';
import Image from 'next/image';
import Icon from '@/components/Icon';

export default function PNGNavbar() {
  const { data: session } = useSession();
  const { user } = useAppContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-b-2 border-green-100 dark:border-gray-800 shadow-lg">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-xl">
              <Icon name="scan" size={24} className="h-6 w-6 text-white" />
            </div>
          </div>
          <span className="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            E-Recycle
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/shop"
            className="relative text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors font-bold text-lg group"
          >
            <Icon name="shop" size={24} className="inline mr-1" />
            Shop
            <span className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500 group-hover:w-full transition-all duration-300 rounded-full" />
          </Link>

          {session ? (
            <>
              {/* Points Display */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl blur-md opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg">
                  <Icon name="points_earned" size={20} className="h-5 w-5 text-white animate-pulse" />
                  <span className="font-black text-white text-lg">
                    {user?.totalPoints?.toLocaleString() || 0}
                  </span>
                </div>
              </div>

              <Link href="/profile">
                <Button variant="ghost" size="icon" className="rounded-full relative">
                  {user?.avatar ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-green-500">
                      <Image
                        src={user.avatar}
                        alt="Profile"
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <Icon name="user" size={20} className="h-5 w-5" />
                  )}
                </Button>
              </Link>

              {session.user.role === 'admin' && (
                <Link href="/admin">
                  <Button variant="outline" size="sm" className="rounded-full">
                    <Icon name="admin_dashboard" size={16} className="h-4 w-4 mr-2" />
                    Admin
                  </Button>
                </Link>
              )}

              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut()}
                className="rounded-full hover:bg-red-100 hover:text-red-600"
              >
                <Icon name="log_out" size={20} className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button size="lg" className="rounded-full">
                Get Started
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Icon name="filter" size={24} className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-green-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link
              href="/shop"
              className="block py-3 px-4 rounded-xl hover:bg-green-50 dark:hover:bg-gray-800 font-bold transition-colors flex items-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Icon name="shop" size={20} className="mr-3" /> Shop
            </Link>

            {session ? (
              <>
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500">
                  <Icon name="points_earned" size={20} className="h-5 w-5 text-white" />
                  <span className="font-black text-white">
                    {user?.totalPoints?.toLocaleString() || 0} Points
                  </span>
                </div>

                <Link
                  href="/profile"
                  className="block py-3 px-4 rounded-xl hover:bg-green-50 dark:hover:bg-gray-800 font-bold transition-colors flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon name="user" size={20} className="mr-3" /> Profile
                </Link>

                {session.user.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="block py-3 px-4 rounded-xl hover:bg-green-50 dark:hover:bg-gray-800 font-bold transition-colors flex items-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon name="admin_dashboard" size={20} className="mr-3" /> Admin Dashboard
                  </Link>
                )}

                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-3 px-4 rounded-xl hover:bg-red-50 dark:hover:bg-red-950 text-red-600 font-bold transition-colors flex items-center"
                >
                  <Icon name="log_out" size={20} className="mr-3 text-red-600" /> Logout
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full rounded-xl" size="lg">
                  Get Started
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}