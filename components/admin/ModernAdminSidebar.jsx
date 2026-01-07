'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  Star,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { useState } from 'react';
import Icon from '@/components/Icon';

const menuItems = [
  { href: '/admin', icon: 'admin_dashboard', label: 'Dashboard', exact: true },
  { href: '/admin/orders', icon: 'orderlist', label: 'Orders' },
  { href: '/admin/products', icon: 'admin_products', label: 'Products' },
  { href: '/admin/users', icon: 'user', label: 'Users' },
  { href: '/admin/activities', icon: 'points_earned', label: 'Activities' },
  { href: '/admin/settings', icon: 'admin_settings', label: 'Settings' },
];

export default function ModernAdminSidebar({ session, isOpen, onClose }) {
  const pathname = usePathname();

  const isActive = (href, exact) => {
    if (exact) return pathname === href;
    if (pathname === href) return true;
    if (!pathname.startsWith(href)) return false;
    if (pathname.length > href.length) {
      return pathname[href.length] === '/';
    }
    return true;
  };

  return (
    <>
      {/* Sidebar Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-[#0a1f1f] border-r border-white/5
        z-50 transition-transform duration-300 transform
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 shadow-2xl
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg shadow-green-900/50">
                <Star className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black text-white tracking-tight">E-Recycle</h1>
                <p className="text-xs text-green-400 font-bold uppercase tracking-wider">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 flex flex-col justify-between p-4 overflow-y-auto">
            <div className="space-y-1">
              {menuItems.map((item) => {
                const active = isActive(item.href, item.exact);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      if (onClose) onClose();
                    }}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group
                      ${active
                        ? 'bg-green-500/20 text-green-400 shadow-inner border border-green-500/10'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }
                    `}
                  >
                    <div className={`p-1 rounded-md transition-colors ${active ? 'bg-green-500/20' : 'bg-transparent group-hover:bg-white/10'}`}>
                      <Icon name={item.icon} size={18} className={active ? 'text-green-400' : 'text-gray-400 group-hover:text-white'} />
                    </div>
                    <span>{item.label}</span>
                    {active && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Logout Button */}
            <div className="pt-4 border-t border-white/10">
              <button
                onClick={() => signOut()}
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors w-full text-red-400 hover:bg-red-500/10 hover:text-red-300"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-white/10 bg-black/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center text-white font-bold shadow-lg border-2 border-[#0a1f1f]">
                {session.user.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-white truncate">{session.user.name}</p>
                <p className="text-xs text-gray-400 truncate">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}