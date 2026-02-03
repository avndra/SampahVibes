'use client';

import { useState, useEffect } from 'react';
import { Button, Dialog, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material';
import { X, MapPin, Truck, StickyNote, Navigation } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

export default function CheckoutModal({ isOpen, onClose, item, onConfirm }) {
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [note, setNote] = useState('');

    const [loading, setLoading] = useState(false);
    const [isLocating, setIsLocating] = useState(false);

    // Load saved address from localStorage on mount
    useEffect(() => {
        const savedAddress = localStorage.getItem('savedShippingAddress');
        if (savedAddress) {
            try {
                const parsed = JSON.parse(savedAddress);
                setAddress(parsed.address || '');
                setCity(parsed.city || '');
                setPostalCode(parsed.postalCode || '');
            } catch (error) {
                console.error('Failed to parse saved address:', error);
            }
        }
    }, []);

    // Auto-save address to localStorage whenever it changes
    useEffect(() => {
        if (address || city || postalCode) {
            const shippingData = { address, city, postalCode };
            localStorage.setItem('savedShippingAddress', JSON.stringify(shippingData));
        }
    }, [address, city, postalCode]);

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

                    toast.success('Lokasi berhasil diambil dari GPS!');
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
            toast.error('Gagal mengakses lokasi. Silakan input manual.');
            setIsLocating(false);
        });
    };

    const handleConfirm = async () => {
        if (!address || !city) {
            toast.error('Mohon lengkapi alamat dan kota pengiriman.');
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

                        {/* Shipping Form with Manual Input */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-bold flex items-center gap-2 text-gray-700">
                                    <MapPin className="w-4 h-4 text-green-600" /> Alamat Pengiriman
                                </label>
                                <Button
                                    onClick={handleGetLocation}
                                    disabled={isLocating}
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 'bold',
                                        fontSize: '0.75rem',
                                        borderRadius: 2,
                                        borderColor: '#10b981',
                                        color: '#10b981',
                                        '&:hover': {
                                            backgroundColor: '#d1fae5',
                                            borderColor: '#059669'
                                        }
                                    }}
                                >
                                    <Navigation className={`w-3.5 h-3.5 mr-1 ${isLocating ? 'animate-spin' : ''}`} />
                                    {isLocating ? 'Mencari...' : 'Auto-Fill GPS'}
                                </Button>
                            </div>

                            {/* address */}
                            <TextField
                                label="Alamat Lengkap"
                                fullWidth
                                variant="outlined"
                                size="small"
                                required
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Jl. Contoh No. 123, RT/RW 01/02, Kelurahan..."
                                multiline
                                rows={2}
                                InputProps={{
                                    sx: { borderRadius: 3 }
                                }}
                            />

                            {/* City and Postal Coded */}
                            <div className="grid grid-cols-2 gap-3">
                                <TextField
                                    label="Kota"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    required
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    placeholder="Jakarta"
                                    InputProps={{
                                        sx: { borderRadius: 3 }
                                    }}
                                />
                                <TextField
                                    label="Kode Pos"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={postalCode}
                                    onChange={(e) => setPostalCode(e.target.value)}
                                    placeholder="12345"
                                    InputProps={{
                                        sx: { borderRadius: 3 }
                                    }}
                                />
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

                            {/* Info text */}
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                Alamat akan disimpan otomatis untuk pembelian selanjutnya
                            </p>
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
                                disabled={loading || !address || !city}
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
                                {loading ? 'Memproses...' : (!address || !city) ? 'Lengkapi Alamat Dulu' : 'Konfirmasi & Tukar Poin'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </div>
        </Dialog>
    );
}
