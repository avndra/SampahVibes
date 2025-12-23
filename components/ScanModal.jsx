'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Scan, Sparkles, TrendingUp, RefreshCw, X } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function ScanModal({ open, onClose }) {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null); // Real-time preview state
  const [confirming, setConfirming] = useState(false); // Loading state for confirmation
  const { refreshUser } = useAppContext();
  const router = useRouter();
  const scannerRef = useRef(null);
  const isScannerRunning = useRef(false);

  // Handle body overflow
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  // Start Scanner when modal opens and user clicks "Start"
  useEffect(() => {
    if (scanning && open && !result && !isScannerRunning.current) {
      isScannerRunning.current = true;

      // Initialize scanner with a slight delay to ensure DOM is ready
      setTimeout(() => {
        try {
          // Double check element existence before init
          const readerElement = document.getElementById("reader");
          if (!readerElement) {
            console.warn("Reader element missing, skipping init");
            isScannerRunning.current = false;
            return;
          }

          const scanner = new Html5QrcodeScanner(
            "reader",
            {
              fps: 10,
              aspectRatio: 1.0,
              formatsToSupport: [
                Html5QrcodeSupportedFormats.EAN_13,
                Html5QrcodeSupportedFormats.EAN_8,
                Html5QrcodeSupportedFormats.UPC_A,
                Html5QrcodeSupportedFormats.UPC_E,
                Html5QrcodeSupportedFormats.CODE_128,
                Html5QrcodeSupportedFormats.CODE_39
              ],
              videoConstraints: {
                facingMode: "environment",
                width: { min: 640, ideal: 1280, max: 1920 },
                height: { min: 480, ideal: 720, max: 1080 },
              }
            },
            /* verbose= */ false
          );

          scanner.render(
            (decodedText) => {
              // Real-time: Show preview first, don't process yet
              handleBarcodeDetected(decodedText);
              try {
                scanner.clear();
              } catch (e) {
                console.warn("Failed to clear scanner after success", e);
              }
              setScanning(false);
              isScannerRunning.current = false;
            },
            (errorMessage) => {
              // console.log(errorMessage);
            }
          );

          scannerRef.current = scanner;
        } catch (err) {
          console.error("Scanner init error:", err);
          setError("Failed to start camera. Please ensure permissions are granted.");
          setScanning(false);
          isScannerRunning.current = false;
        }
      }, 100);
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.warn("Failed to clear scanner", err));
        scannerRef.current = null;
        isScannerRunning.current = false;
      }
    };
  }, [scanning, open, result, preview]);

  // Clean up when modal closes
  useEffect(() => {
    if (!open) {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.warn);
        scannerRef.current = null;
        isScannerRunning.current = false;
      }
      setScanning(false);
      setResult(null);
      setError(null);
      setPreview(null);
      setConfirming(false);
    }
  }, [open]);

  // Real-time barcode detected - fetch preview info
  const handleBarcodeDetected = async (barcode) => {
    toast.loading("Mendeteksi barcode...");

    try {
      const response = await fetch('/api/scan/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcode })
      });

      const data = await response.json();
      toast.dismiss();

      if (response.ok) {
        setPreview({
          barcode: barcode,
          productName: data.productName,
          trashType: data.trashType,
          weight: data.weight,
          points: data.pointsEarned
        });
        toast.success(`Terdeteksi: ${data.productName}`);
      } else {
        throw new Error(data.error || 'Barcode tidak dikenali');
      }
    } catch (err) {
      toast.dismiss();
      setError(err.message);
      toast.error("Barcode tidak dikenali");
    }
  };

  // Confirm and save the scan
  const handleConfirmScan = async () => {
    if (!preview) return;

    setConfirming(true);
    toast.loading("Menyimpan...");

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcode: preview.barcode })
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          trashType: data.trashType,
          weight: data.weight,
          points: data.pointsEarned,
          barcode: preview.barcode
        });
        setPreview(null);

        toast.dismiss();
        toast.success(`Berhasil! +${data.pointsEarned} poin`);
        refreshUser();
        router.refresh();
      } else {
        throw new Error(data.error || 'Gagal menyimpan');
      }
    } catch (err) {
      toast.dismiss();
      toast.error("Gagal menyimpan scan");
    } finally {
      setConfirming(false);
    }
  };

  const handleStartScan = () => {
    setScanning(true);
    setResult(null);
    setError(null);
    setPreview(null);
  };

  const handleClose = () => {
    setScanning(false);
    setResult(null);
    setError(null);
    setPreview(null);
    onClose();
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setPreview(null);
    setScanning(true);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Custom Modal Content Wrapper with Glassmorphism */}
      <div className="relative w-full max-w-md bg-white/90 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 dark:border-gray-700/50 animate-in zoom-in-95 duration-300">

        {/* Header Decoration */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500"></div>

        {/* Close Button Override */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        <div className="p-6 md:p-8">

          {/* Title Section */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400">
              Scanner
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Powered by Py
            </p>
          </div>

          {!scanning && !result && !error && !preview && (
            <div className="text-center py-4">
              <div className="relative group cursor-pointer" onClick={handleStartScan}>
                <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-teal-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative w-48 h-48 mx-auto mb-8 flex items-center justify-center bg-white dark:bg-gray-800 rounded-full border-4 border-gray-50 dark:border-gray-700 shadow-inner group-hover:scale-105 transition-transform duration-300">
                  <Scan className="h-24 w-24 text-green-500 group-hover:text-green-600 transition-colors duration-300" />

                  {/* Pulsing Rings */}
                  <div className="absolute inset-0 rounded-full border-2 border-green-500/30 animate-ping [animation-duration:3s]"></div>
                  <div className="absolute inset-4 rounded-full border border-teal-500/20 animate-ping [animation-duration:2s]"></div>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
                Siap Memindai?
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm px-6 leading-relaxed">
                Arahkan kamera ke barcode pada kemasan sampah Anda. Sistem kami akan otomatis mengenali jenis dan menghitung poinnya.
              </p>

              <Button
                onClick={handleStartScan}
                size="lg"
                className="w-full rounded-2xl bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold shadow-lg shadow-green-500/30 border-0 h-14 text-base tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="flex items-center justify-center gap-2">
                  <Scan className="w-5 h-5" />
                  Mulai Scanning
                </span>
              </Button>
            </div>
          )}

          {scanning && (
            <div className="relative w-full bg-black rounded-3xl overflow-hidden shadow-2xl ring-4 ring-black/5">
              {/* Scanner Container */}
              <div id="reader" className="w-full h-[350px] bg-black"></div>

              {/* Custom Overlay */}
              <div className="absolute inset-0 pointer-events-none z-10">
                {/* Darkened Borders */}
                <div className="absolute inset-0 border-[40px] border-black/50"></div>

                {/* Scanning Frame */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-white/30 rounded-lg">
                  {/* Corners */}
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-green-500 rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-green-500 rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-green-500 rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-green-500 rounded-br-lg"></div>

                  {/* Scanning Laser */}
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,1)] animate-[scan_2s_ease-in-out_infinite] opacity-80"></div>
                </div>

                {/* Text Hint */}
                <div className="absolute bottom-8 left-0 w-full text-center">
                  <p className="inline-block px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white/90 text-xs font-medium tracking-wide border border-white/10">
                    Posisikan barcode di dalam kotak
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Real-time Preview Section */}
          {preview && !result && !error && (
            <div className="text-center py-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
              {/* Preview Icon */}
              <div className="relative mx-auto w-20 h-20 mb-6">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full shadow-lg shadow-blue-500/40">
                  <Scan className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -right-2 -top-2 bg-green-400 text-green-900 text-xs font-bold px-2 py-1 rounded-full shadow-sm border border-green-200 rotate-12">
                  Terdeteksi!
                </div>
              </div>

              <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-1 tracking-tight">
                Barcode Terdeteksi
              </h3>
              <p className="text-gray-400 text-sm mb-6 font-mono bg-gray-100 dark:bg-gray-800/50 inline-block px-3 py-1 rounded-lg">
                ID: {preview.barcode}
              </p>

              {/* Preview Card */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 rounded-2xl p-1 border border-gray-200 dark:border-gray-700 mb-6 shadow-sm">
                <div className="bg-white dark:bg-gray-900/80 rounded-xl p-5">
                  {/* Product Name */}
                  <div className="mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Produk</p>
                    <p className="font-bold text-gray-800 dark:text-gray-100 text-lg">{preview.productName}</p>
                    <p className="text-xs text-green-600 dark:text-green-400 font-medium">{preview.trashType}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-6 relative">
                    {/* Divider */}
                    <div className="absolute left-1/2 top-2 bottom-2 w-px bg-gray-200 dark:bg-gray-700"></div>

                    <div className="text-center">
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Berat Estimasi</p>
                      <p className="font-bold text-blue-600 dark:text-blue-400 text-xl">{preview.weight} <span className="text-sm font-normal text-gray-400">kg</span></p>
                      <p className="text-xs text-gray-400 mt-1">≈ {Math.round(preview.weight * 1000)}g</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Poin Didapat</p>
                      <p className="font-bold text-green-600 dark:text-green-400 text-xl">+{preview.points} <span className="text-sm font-normal text-gray-400">XP</span></p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="flex-1 rounded-xl h-12 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 font-semibold"
                >
                  <RefreshCw className="w-4 h-4 mr-2" /> Scan Ulang
                </Button>
                <Button
                  onClick={handleConfirmScan}
                  disabled={confirming}
                  className="flex-1 rounded-xl h-12 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold shadow-lg shadow-green-500/30 border-0"
                >
                  {confirming ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" /> Konfirmasi
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {result && (
            <div className="text-center py-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Success Animation */}
              <div className="relative mx-auto w-24 h-24 mb-6">
                <div className="absolute inset-0 bg-green-500/20 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full">
                  <DotLottieReact
                    src="https://lottie.host/11606d62-e0bb-4042-92dc-2a14728f9f83/dKfFgJCahi.lottie"
                    autoplay
                    style={{ width: '150%', height: '150%' }}
                  />
                </div>
                <div className="absolute -right-2 -top-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow-sm border border-yellow-200 rotate-12">
                  +Points!
                </div>
              </div>

              <h3 className="text-3xl font-black text-gray-800 dark:text-white mb-1 tracking-tight">
                Scan Berhasil!
              </h3>
              <p className="text-gray-400 text-sm mb-8 font-mono bg-gray-100 dark:bg-gray-800/50 inline-block px-3 py-1 rounded-lg">
                ID: {result.barcode}
              </p>

              {/* Result Card */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 rounded-2xl p-1 border border-gray-200 dark:border-gray-700 mb-8 shadow-sm">
                <div className="bg-white dark:bg-gray-900/80 rounded-xl p-5">
                  <div className="grid grid-cols-2 gap-8 relative">
                    {/* Divider */}
                    <div className="absolute left-1/2 top-2 bottom-2 w-px bg-gray-200 dark:bg-gray-700"></div>

                    <div className="text-center">
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Jenis Sampah</p>
                      <p className="font-bold text-gray-800 dark:text-gray-100 text-lg leading-tight">{result.trashType}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Berat Terdeteksi</p>
                      <p className="font-bold text-blue-600 dark:text-blue-400 text-lg">{result.weight} <span className="text-sm font-normal text-gray-400">kg</span></p>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-dashed border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500 font-medium">Reward Didapat</span>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-xs font-bold">Level Up!</span>
                      </div>
                    </div>
                    <div className="flex items-baseline justify-center gap-1 bg-green-50 dark:bg-green-900/20 py-3 rounded-xl border border-green-100 dark:border-green-900/50">
                      <span className="text-4xl font-black text-green-600 dark:text-green-400 tracking-tighter">+{result.points}</span>
                      <span className="text-sm font-bold text-green-600/70 dark:text-green-400/70">XP</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="flex-1 rounded-xl h-12 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 font-semibold"
                >
                  <RefreshCw className="w-4 h-4 mr-2" /> Scan Lagi
                </Button>
                <Button
                  onClick={handleClose}
                  className="flex-1 rounded-xl h-12 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-bold shadow-lg shadow-gray-200 dark:shadow-none"
                >
                  Selesai
                </Button>
              </div>
            </div>
          )}

          {error && (
            <div className="text-center py-8 animate-in zoom-in duration-300">
              <div className="w-20 h-20 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl">🤔</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Hmm, Gagal Mengenali</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm px-8">
                {error}. Pastikan pencahayaan cukup dan barcode terlihat jelas.
              </p>
              <Button
                onClick={handleReset}
                className="min-w-[140px] rounded-xl h-12 bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-200 dark:shadow-none"
              >
                Coba Lagi
              </Button>
            </div>
          )}

        </div>
      </div>

      {/* Global Style for Scan Animation */}
      <style jsx global>{`
        @keyframes scan {
          0%, 100% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          50% { top: 100%; }
        }
      `}</style>
    </div>
  );
}
