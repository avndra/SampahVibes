'use client';

import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex items-center justify-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                    <span>© {currentYear} E-Recycle.</span>
                    <span>Dibuat oleh</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Suryo</span>
                    <span>dengan</span>
                    <div className="w-6 h-6 inline-flex items-center justify-center">
                        <DotLottieReact
                            src="https://lottie.host/d9ab3795-4f0f-4f80-8924-85816918e1f7/yMZKfHpMF4.lottie"
                            loop
                            autoplay
                            style={{ width: '100%', height: '100%' }}
                        />
                    </div>
                </div>
            </div>
        </footer>
    );
}
