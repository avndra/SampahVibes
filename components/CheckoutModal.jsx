'use client';

import { useState } from 'react';
import { Button, Dialog, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material';
import { X, MapPin, Truck, StickyNote } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

export default function CheckoutModal({ isOpen, onClose, item, onConfirm }) {
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [note, setNote] = useState('');

    const [loading, setLoading] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const [locationVerified, setLocationVerified] = useState(false);

    if (!item) return null;

    const totalCost = item.productId.pointsCost * item.quantity;

    const handleGetLocation = () => {
        setIsLocating(true);
        if (!navigator.geolocation) {
            toast.error('Browser tidak mendukung Geolocation');
            setIsLocating(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                // Use OpenStreetMap Nominatim for free reverse geocoding
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                const data = await response.json();

                if (data && data.display_name) {
                    const addr = data.display_name;
                    const cityData = data.address?.city || data.address?.town || data.address?.village || data.address?.county || '';
                    const postData = data.address?.postcode || '';

                    setAddress(addr);
                    setCity(cityData);
                    setPostalCode(postData);

                    setLocationVerified(true);
                    toast.success('Lokasi berhasil dikonfirmasi!');
                } else {
                    toast.error('Gagal mendapatkan detail alamat');
                }
            } catch (error) {
                toast.error('Gagal mengambil data lokasi');
            } finally {
                setIsLocating(false);
            }
        }, (error) => {
            console.error(error);
            toast.error('Gagal mengakses lokasi. Pastikan izin GPS aktif.');
            setIsLocating(false);
        });
    };

    const handleConfirm = async () => {
        if (!locationVerified || !address) {
            toast.error('Mohon verifikasi lokasi pengiriman terlebih dahulu.');
            return;
        }

        setLoading(true);
        await onConfirm(item.productId._id, {
            address,
            city,
            postalCode,
            note
        });
        setLoading(false);
        onClose();
    };

    return (
        <Dialog
            open={isOpen}
            onClose={loading ? undefined : onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                style: {
                    borderRadius: 24,
                    padding: 8,
                    backgroundColor: '#ffffff'
                }
            }}
        >
            <div className="relative">
                <IconButton
                    onClick={onClose}
                    disabled={loading}
                    sx={{ position: 'absolute', right: 8, top: 8, zIndex: 10 }}
                >
                    <X className="w-5 h-5" />
                </IconButton>

                <DialogTitle sx={{ fontWeight: 900, fontSize: '1.5rem', pb: 1 }}>
                    Konfirmasi Penukaran
                </DialogTitle>

                <DialogContent>
                    <div className="space-y-6">
                        {/* Item Summary (Compact) */}
                        <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-white shadow-sm">
                                <Image
                                    src={item.productId.image}
                                    alt={item.productId.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 leading-tight mb-1">{item.productId.name}</h3>
                                <p className="text-gray-500 text-sm mb-2">{item.quantity} x {item.productId.pointsCost.toLocaleString()} pts</p>
                                <div className="inline-block px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-md text-xs font-bold">
                                    Total: {totalCost.toLocaleString()} poin
                                </div>
                            </div>
                        </div>

                        {/* Shipping Form with Geolocation */}
                        <div className="space-y-4">
                            <label className="text-sm font-bold flex items-center gap-2 text-gray-700">
                                <MapPin className="w-4 h-4 text-green-600" /> Pilih Lokasi Pengiriman
                            </label>

                            {/* Location Verifier UI */}
                            <div className={`relative w-full p-4 rounded-xl border-2 transition-colors group ${locationVerified ? 'bg-green-50 border-green-500' : 'bg-gray-50 border-gray-200 hover:border-green-300'}`}>
                                {!locationVerified ? (
                                    <div className="flex flex-col items-center justify-center py-2 text-center">
                                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                                            <MapPin className={`w-6 h-6 ${isLocating ? 'animate-bounce' : ''}`} />
                                        </div>
                                        <h4 className="font-bold text-gray-800 mb-1">Verifikasi Lokasi Diperlukan</h4>
                                        <p className="text-sm text-gray-500 mb-4 max-w-xs mx-auto">Kami perlu mengakses lokasi Anda untuk memastikan pengiriman yang akurat.</p>
                                        <Button
                                            onClick={handleGetLocation}
                                            disabled={isLocating}
                                            variant="contained"
                                            sx={{
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                fontWeight: 'bold',
                                                backgroundColor: '#16a34a',
                                                '&:hover': { backgroundColor: '#15803d' }
                                            }}
                                        >
                                            {isLocating ? 'Mencari Lokasi...' : '📍 Ambil Lokasi Saya'}
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 flex-shrink-0">
                                            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center">
                                                <MapPin className="w-4 h-4" />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-gray-800 text-sm">Lokasi Terverifikasi</h4>
                                                <button onClick={() => setLocationVerified(false)} className="text-xs text-red-500 hover:underline font-bold ml-2">Ubah</button>
                                            </div>
                                            <p className="text-xs text-gray-600 mt-1 break-words">{address}</p>
                                            <div className="flex gap-2 mt-2">
                                                {city && <span className="text-[10px] bg-white border border-green-200 text-green-700 px-2 py-0.5 rounded-full font-bold">{city}</span>}
                                                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">GPS Akurat</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Note Input */}
                            <TextField
                                label="Catatan Tambahan (Opsional)"
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Contoh: Titip di satpam, pagar hitam"
                                InputProps={{
                                    startAdornment: <StickyNote className="w-4 h-4 text-gray-400 mr-2" />,
                                    sx: { borderRadius: 3 }
                                }}
                            />
                        </div>

                        {/* Total Summary & Action */}
                        <div className="pt-4 border-t border-gray-100 mt-2">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-500 font-medium">Total Bayar</span>
                                <span className="text-2xl font-black text-green-600">
                                    {totalCost.toLocaleString()} <span className="text-sm text-gray-400 font-normal">pts</span>
                                </span>
                            </div>

                            <Button
                                variant="contained"
                                fullWidth
                                size="large"
                                disabled={loading || !locationVerified}
                                onClick={handleConfirm}
                                sx={{
                                    height: 52,
                                    borderRadius: 3,
                                    textTransform: 'none',
                                    fontSize: '1.1rem',
                                    fontWeight: 800,
                                    backgroundColor: '#10b981',
                                    boxShadow: '0 10px 30px -10px rgba(16, 185, 129, 0.5)',
                                    '&:hover': {
                                        backgroundColor: '#059669',
                                        boxShadow: '0 15px 35px -10px rgba(16, 185, 129, 0.6)',
                                    },
                                    '&.Mui-disabled': {
                                        backgroundColor: '#e5e7eb',
                                        color: '#9ca3af'
                                    }
                                }}
                            >
                                {loading ? 'Memproses...' : !locationVerified ? 'Verifikasi Lokasi Dulu' : 'Konfirmasi & Tukar Poin'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </div>
        </Dialog>
    );
}
