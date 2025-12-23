'use client';

import { useState } from 'react';
import {
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import ModernAdminSidebar from '@/components/admin/ModernAdminSidebar';

export default function AdminLayoutClient({ session, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col lg:flex-row">

      {/* Mobile Header */}
      <div className="lg:hidden bg-[#0a1f1f] text-white p-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg">
            <span className="font-bold text-lg">E</span>
          </div>
          <span className="font-bold text-lg tracking-tight">E-Recycle Admin</span>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <ModernAdminSidebar
        session={session}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col lg:pl-64 transition-all duration-300 min-h-[calc(100vh-64px)] lg:min-h-screen">

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}