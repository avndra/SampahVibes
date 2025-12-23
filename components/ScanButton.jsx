'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ScanModal from './ScanModal';
import Icon from '@/components/Icon';

export default function ScanButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="hidden md:block fixed bottom-8 right-8 z-40 group">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 rounded-full blur-xl opacity-75 group-hover:opacity-100 animate-pulse pointer-events-none" />

        {/* Button */}
        <Button
          onClick={() => setOpen(true)}
          className="relative h-20 w-20 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600"
          size="icon"
        >
          <div className="relative">
            <Icon name="scan" size={40} className="h-10 w-10" />
            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-300 animate-pulse" />
          </div>
        </Button>

        {/* Pulse Ring Animation */}
        <div className="absolute inset-0 rounded-full border-4 border-green-400 animate-ping opacity-75 pointer-events-none" />
      </div>

      <ScanModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}