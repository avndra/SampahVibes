'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Modal from '@/components/Modal';
import { processScan } from '@/lib/actions/scan';
import { toast } from 'sonner';
import { Loader2, Scan, Sparkles, Zap, TrendingUp } from 'lucide-react';
import { TRASH_TYPES } from '@/lib/config';
import { useAppContext } from '@/context/AppContext';
import confetti from 'canvas-confetti';

export default function ScanModal({ open, onClose }) {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const { refreshUser } = useAppContext();

  const handleScan = async () => {
    setScanning(true);
    
    // Simulate scanning delay with progress
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Generate dummy data (CLIENT-SIDE ONLY)
    const trashType = TRASH_TYPES[Math.floor(Math.random() * TRASH_TYPES.length)];
    const weight = parseFloat((Math.random() * 4.5 + 0.5).toFixed(2));
    
    // Process scan (SERVER-SIDE - only saves points)
    const scanResult = await processScan(trashType, weight);
    
    if (scanResult.success) {
      setResult({
        trashType,
        weight,
        points: scanResult.points
      });
      
      // Confetti celebration!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      toast.success(`🎉 +${scanResult.points} points earned!`, {
        description: 'Keep up the great work!'
      });
      refreshUser();
    } else {
      toast.error(scanResult.error || 'Scan failed');
      setScanning(false);
    }
  };

  const handleClose = () => {
    setResult(null);
    onClose();
  };

  return (
    <Modal isOpen={open} onClose={handleClose} title="🔍 Scan Your Trash" size="md">
      <div className="space-y-6">
        {!result ? (
          <div className="text-center py-8">
            {/* Scanning Animation */}
            <div className="relative w-40 h-40 mx-auto mb-8">
              {/* Outer Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 rounded-full blur-2xl opacity-50 animate-pulse" />
              
              {/* Main Circle */}
              <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl">
                {scanning ? (
                  <>
                    <Loader2 className="h-20 w-20 text-white animate-spin" />
                    <div className="absolute inset-0 rounded-full border-4 border-white/30 border-t-white animate-spin" />
                  </>
                ) : (
                  <>
                    <Scan className="h-20 w-20 text-white" />
                    <Sparkles className="absolute top-4 right-4 h-8 w-8 text-yellow-300 animate-pulse" />
                  </>
                )}
              </div>

              {/* Scanning Rings */}
              {scanning && (
                <>
                  <div className="absolute inset-0 rounded-full border-4 border-green-400 animate-ping" />
                  <div className="absolute inset-0 rounded-full border-4 border-emerald-400 animate-ping delay-75" />
                </>
              )}
            </div>

            {scanning ? (
              <div className="space-y-3">
                <p className="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent animate-pulse">
                  Analyzing your trash...
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Please wait while we identify the items
                </p>
                {/* Progress Bar */}
                <div className="w-full max-w-xs mx-auto h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-progress" />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Ready to Scan!
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Point your camera at recyclable items
                </p>
                <Button 
                  onClick={handleScan} 
                  size="lg"
                  className="w-full max-w-xs mx-auto rounded-2xl h-14 text-lg font-black"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Start Scanning
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 space-y-6">
            {/* Success Animation */}
            <div className="text-8xl mb-4 animate-bounce">♻️</div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 blur-2xl opacity-30" />
              <h3 className="relative text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6">
                Scan Complete! 🎉
              </h3>
            </div>
            
            {/* Result Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-semibold">Type</p>
                <p className="text-3xl font-black text-blue-600 dark:text-blue-400">
                  {result.trashType}
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-2xl p-6 border-2 border-purple-200 dark:border-purple-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-semibold">Weight</p>
                <p className="text-3xl font-black text-purple-600 dark:text-purple-400">
                  {result.weight} kg
                </p>
              </div>
            </div>
            
            {/* Points Display */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl p-8 border-4 border-white dark:border-gray-900 shadow-2xl">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <TrendingUp className="h-8 w-8 text-white animate-pulse" />
                  <p className="text-lg text-white font-bold">Points Earned</p>
                </div>
                <p className="text-7xl font-black text-white drop-shadow-lg">
                  +{result.points}
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  {[...Array(3)].map((_, i) => (
                    <Sparkles key={i} className="h-6 w-6 text-yellow-200 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleClose} 
              className="mt-6 w-full max-w-xs mx-auto rounded-2xl h-14 text-lg font-black" 
              variant="outline"
            >
              Awesome! 🎊
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}