'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className={cn(
        "relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border-2 border-green-100 dark:border-gray-800 animate-in zoom-in-95 duration-200",
        sizeClasses[size]
      )}>
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b-2 border-gray-100 dark:border-gray-800 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
          <h2 className="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {title}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-red-100 hover:text-red-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Body */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}