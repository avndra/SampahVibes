'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, QrCode, ShoppingBag, Leaf, X } from 'lucide-react';

export default function OnboardingGuide({ userPoints = 0, userDeposits = 0 }) {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(0);

    // Show only if user is logged in but has no activity yet (New User)
    // And hasn't seen the guide locally
    useEffect(() => {
        const hasSeenGuide = localStorage.getItem('recyclevibes_onboarding_seen');

        // Condition: 0 Points AND 0 Deposits implies a fresh user
        if (userPoints === 0 && userDeposits === 0 && !hasSeenGuide) {
            // Small delay for better UX
            const timer = setTimeout(() => setOpen(true), 1500);
            return () => clearTimeout(timer);
        }
    }, [userPoints, userDeposits]);

    const handleClose = () => {
        setOpen(false);
        localStorage.setItem('recyclevibes_onboarding_seen', 'true');
    };

    const nextStep = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            handleClose();
        }
    };

    const steps = [
        {
            title: "Selamat Datang di RecycleVibes! 🌱",
            desc: "Platform daur ulang modern untuk mengubah sampahmu menjadi hadiah menarik.",
            icon: <Leaf className="w-12 h-12 text-green-500" />,
            color: "bg-green-50"
        },
        {
            title: "1. Scan Barcode Sampah",
            desc: "Gunakan fitur SCAN di halaman utama untuk memindai barcode botol atau kemasan plastik.",
            icon: <QrCode className="w-12 h-12 text-blue-500" />,
            color: "bg-blue-50"
        },
        {
            title: "2. Kumpulkan Poin",
            desc: "Setiap sampah yang valid akan memberimu poin. Semakin banyak scan, semakin banyak poin!",
            icon: <div className="text-4xl font-black text-yellow-500">+💯</div>,
            color: "bg-yellow-50"
        },
        {
            title: "3. Tukar Hadiah",
            desc: "Tukarkan poinmu dengan voucher, pulsa, atau barang menarik di menu Shop.",
            icon: <ShoppingBag className="w-12 h-12 text-purple-500" />,
            color: "bg-purple-50"
        }
    ];

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-sm p-6 relative animate-in zoom-in-95 duration-200">

                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${steps[step].color} mb-6`}>
                    {steps[step].icon}
                </div>

                <div className="text-center mb-6">
                    <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                        {steps[step].title}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                        {steps[step].desc}
                    </p>
                </div>

                {/* Step Indicators */}
                <div className="flex justify-center gap-1.5 py-4 mb-4">
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-6 bg-green-600' : 'w-1.5 bg-gray-200 dark:bg-gray-700'}`}
                        />
                    ))}
                </div>

                <div className="flex justify-between gap-3">
                    <Button variant="ghost" onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                        Lewati
                    </Button>
                    <Button onClick={nextStep} className="bg-green-600 hover:bg-green-700 text-white flex-1">
                        {step === steps.length - 1 ? 'Mulai Sekarang' : 'Lanjut'}
                        {step !== steps.length - 1 && <ArrowRight className="w-4 h-4 ml-1" />}
                        {step === steps.length - 1 && <Check className="w-4 h-4 ml-1" />}
                    </Button>
                </div>
            </div>
        </div>
    );
}
