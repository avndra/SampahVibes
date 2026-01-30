'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Scan, Sparkles, TrendingUp, RefreshCw, X, Camera, Zap, CheckCircle2, Gift } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import confetti from 'canvas-confetti';

export default function ScanModal({ open, onClose }) {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const { refreshUser } = useAppContext();
  const router = useRouter();
  const scannerRef = useRef(null);
  const isScannerRunning = useRef(false);

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

  useEffect(() => {
    let html5QrCode;

    if (scanning && open && !result && !isScannerRunning.current) {
      isScannerRunning.current = true;

      setTimeout(() => {
        const readerElement = document.getElementById("reader");
        if (!readerElement) {
          isScannerRunning.current = false;
          return;
        }

        try {
          html5QrCode = new Html5Qrcode("reader");
          scannerRef.current = html5QrCode;

          const config = {
            fps: 10,
            aspectRatio: 1.0,
            qrbox: { width: 250, height: 250 },
            formatsToSupport: [
              Html5QrcodeSupportedFormats.EAN_13,
              Html5QrcodeSupportedFormats.EAN_8,
              Html5QrcodeSupportedFormats.UPC_A,
              Html5QrcodeSupportedFormats.UPC_E,
              Html5QrcodeSupportedFormats.CODE_128,
              Html5QrcodeSupportedFormats.CODE_39
            ]
          };

          html5QrCode.start(
            { facingMode: "environment" },
            config,
            (decodedText) => {
              handleBarcodeDetected(decodedText);
              html5QrCode.stop().then(() => {
                scannerRef.current = null;
                setScanning(false);
                isScannerRunning.current = false;
              }).catch(console.warn);
            },
            () => { }
          ).catch((err) => {
            setError("Gagal mengakses kamera. Izinkan akses kamera di browser Anda.");
            setScanning(false);
            isScannerRunning.current = false;
          });

        } catch (err) {
          setError("Gagal menginisialisasi kamera.");
          setScanning(false);
          isScannerRunning.current = false;
        }
      }, 100);
    }

    return () => {
      if (scannerRef.current) {
        try {
          if (scannerRef.current.isScanning) {
            scannerRef.current.stop().catch(console.warn);
          }
          scannerRef.current.clear().catch(console.warn);
        } catch (e) { }
        scannerRef.current = null;
        isScannerRunning.current = false;
      }
    };
  }, [scanning, open, result, preview]);

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

  const handleBarcodeDetected = async (barcode) => {
    toast.loading("Mendeteksi...");
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
          barcode,
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
          barcode: preview.barcode,
          xp: data.xp
        });
        setPreview(null);
        toast.dismiss();

        // Trigger confetti for success
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

        if (data.xp?.leveledUp) {
          toast.success(`🎉 Level Up! Level ${data.xp.level}: ${data.xp.levelTitle}`, { duration: 5000 });
          if (data.xp.bonusPoints > 0) {
            setTimeout(() => toast.success(`🎁 Bonus +${data.xp.bonusPoints} poin!`, { duration: 4000 }), 1500);
          }
        } else {
          toast.success(`+${data.pointsEarned} poin, +${data.xp?.earned || 0} XP`);
        }

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={handleClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-md animate-in zoom-in-95 fade-in duration-300">

        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-[2rem] blur-xl opacity-30 animate-pulse" />

        {/* Main Modal */}
        <div className="relative bg-[#0a1a1a] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">

          {/* Header */}
          <div className="relative px-6 pt-6 pb-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-teal-500/10" />

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
            >
              <X className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
            </button>

            {/* Title */}
            <div className="relative text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 mb-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold text-green-400 uppercase tracking-wider">Scanner Active</span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                Scan <span className="text-green-400">Barcode</span>
              </h2>
            </div>
          </div>

          {/* Content Area */}
          <div className="px-6 pb-6">

            {/* Initial State - Start Scan */}
            {!scanning && !result && !error && !preview && (
              <div className="text-center py-6">
                {/* Animated Scanner Icon */}
                <div className="relative mx-auto w-40 h-40 mb-8">
                  {/* Outer Ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-green-500/30 animate-[spin_10s_linear_infinite]" />
                  {/* Middle Ring */}
                  <div className="absolute inset-4 rounded-full border border-green-500/20" />
                  {/* Inner Circle */}
                  <div className="absolute inset-8 rounded-full bg-gradient-to-br from-green-500/20 to-teal-500/20 flex items-center justify-center backdrop-blur-sm border border-green-500/30">
                    <Camera className="w-12 h-12 text-green-400" />
                  </div>
                  {/* Corner Brackets */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-green-500 rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-green-500 rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-green-500 rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-green-500 rounded-br-lg" />
                </div>

                <h3 className="text-lg font-bold text-white mb-2">
                  Siap Memindai?
                </h3>
                <p className="text-gray-400 text-sm mb-8 leading-relaxed max-w-xs mx-auto">
                  Arahkan kamera ke barcode pada kemasan sampah plastik Anda
                </p>

                <Button
                  onClick={handleStartScan}
                  size="lg"
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-base shadow-lg shadow-green-500/25 border-0 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Mulai Scan
                </Button>

                {/* Features */}
                <div className="grid grid-cols-3 gap-3 mt-8">
                  {[
                    { icon: Zap, label: 'Instan' },
                    { icon: Sparkles, label: 'Auto-detect' },
                    { icon: Gift, label: '+Poin' },
                  ].map((item, i) => (
                    <div key={i} className="bg-white/5 rounded-xl py-3 px-2 border border-white/5">
                      <item.icon className="w-5 h-5 mx-auto text-green-400 mb-1" />
                      <p className="text-[10px] text-gray-400 font-medium">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Scanning State */}
            {scanning && (
              <div className="relative">
                {/* Scanner Container */}
                <div className="relative w-full aspect-square bg-black rounded-2xl overflow-hidden border border-white/10">
                  <div id="reader" className="w-full h-full" />

                  {/* Overlay Frame */}
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Corners */}
                    <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-green-500 rounded-tl-xl" />
                    <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-green-500 rounded-tr-xl" />
                    <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-green-500 rounded-bl-xl" />
                    <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-green-500 rounded-br-xl" />

                    {/* Scan Line */}
                    <div className="absolute left-4 right-4 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent shadow-[0_0_20px_rgba(34,197,94,0.8)] animate-[scanLine_2s_ease-in-out_infinite]" />
                  </div>
                </div>

                {/* Hint Text */}
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
                    <Loader2 className="w-4 h-4 text-green-400 animate-spin" />
                    <span className="text-sm text-green-400 font-medium">Mencari barcode...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Preview State */}
            {preview && !result && !error && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                {/* Detected Badge */}
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-blue-400 font-bold">Barcode Terdeteksi</span>
                  </div>
                </div>

                {/* Product Card */}
                <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                  <p className="text-xs text-gray-500 font-medium mb-1">Produk</p>
                  <h4 className="text-xl font-bold text-white mb-1">{preview.productName}</h4>
                  <span className="inline-block px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-bold">
                    {preview.trashType}
                  </span>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mt-5">
                    <div className="bg-black/30 rounded-xl p-4 text-center border border-white/5">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Berat</p>
                      <p className="text-2xl font-black text-blue-400">{preview.weight}<span className="text-sm font-normal text-gray-500 ml-1">kg</span></p>
                    </div>
                    <div className="bg-black/30 rounded-xl p-4 text-center border border-white/5">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Poin</p>
                      <p className="text-2xl font-black text-green-400">+{preview.points}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="h-12 rounded-xl bg-white/5 border-white/10 hover:bg-white/10 text-white font-semibold"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" /> Ulang
                  </Button>
                  <Button
                    onClick={handleConfirmScan}
                    disabled={confirming}
                    className="h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold shadow-lg shadow-green-500/25"
                  >
                    {confirming ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-4 h-4 mr-2" /> Konfirmasi</>}
                  </Button>
                </div>
              </div>
            )}

            {/* Result State */}
            {result && (
              <div className="text-center space-y-5 animate-in fade-in zoom-in-95 duration-500">
                {/* Success Icon */}
                <div className="relative mx-auto w-24 h-24">
                  <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
                  <div className="relative w-full h-full rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                    <CheckCircle2 className="w-12 h-12 text-white" />
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-white mb-1">Berhasil!</h3>
                  <p className="text-gray-400 text-sm">Sampah berhasil didaftarkan</p>
                </div>

                {/* Result Card */}
                <div className="bg-white/5 rounded-2xl p-5 border border-white/10 text-left">
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
                    <span className="text-gray-400 text-sm">Jenis</span>
                    <span className="font-bold text-white">{result.trashType}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
                    <span className="text-gray-400 text-sm">Berat</span>
                    <span className="font-bold text-blue-400">{result.weight} kg</span>
                  </div>

                  {/* Rewards Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-500/10 rounded-xl p-3 text-center border border-green-500/20">
                      <p className="text-[10px] text-green-400/70 font-bold mb-1">POIN</p>
                      <p className="text-xl font-black text-green-400">+{result.points}</p>
                    </div>
                    <div className="bg-purple-500/10 rounded-xl p-3 text-center border border-purple-500/20">
                      <p className="text-[10px] text-purple-400/70 font-bold mb-1">XP</p>
                      <p className="text-xl font-black text-purple-400">+{result.xp?.earned || 0}</p>
                    </div>
                  </div>

                  {/* Level Info */}
                  {result.xp && (
                    <div className="mt-4 pt-4 border-t border-white/10 text-center">
                      <p className="text-xs text-gray-500">Level {result.xp.level}</p>
                      <p className="font-bold text-white">{result.xp.levelTitle}</p>
                      {result.xp.leveledUp && (
                        <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30">
                          <TrendingUp className="w-3 h-3 text-yellow-400" />
                          <span className="text-xs font-bold text-yellow-400">Level Up! +{result.xp.bonusPoints} bonus</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="h-12 rounded-xl bg-white/5 border-white/10 hover:bg-white/10 text-white font-semibold"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" /> Scan Lagi
                  </Button>
                  <Button
                    onClick={handleClose}
                    className="h-12 rounded-xl bg-white text-gray-900 hover:bg-gray-100 font-bold"
                  >
                    Selesai
                  </Button>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-6 animate-in fade-in duration-300">
                <div className="w-20 h-20 mx-auto bg-red-500/20 rounded-full flex items-center justify-center mb-4 border border-red-500/30">
                  <X className="w-10 h-10 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Gagal Mengenali</h3>
                <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto">
                  {error}. Pastikan barcode terlihat jelas.
                </p>
                <Button
                  onClick={handleReset}
                  className="h-12 px-8 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold"
                >
                  Coba Lagi
                </Button>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Scan Line Animation */}
      <style jsx global>{`
        @keyframes scanLine {
          0%, 100% { top: 10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          50% { top: 90%; }
        }
      `}</style>
    </div>
  );
}
