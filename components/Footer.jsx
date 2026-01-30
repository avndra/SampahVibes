'use client';

import Link from 'next/link';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Facebook, Instagram, Twitter, Mail, ArrowRight, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* 1. Brand Section */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">R</div>
                            <span className="text-xl font-black tracking-tighter text-gray-900 dark:text-white">Recycle<span className="text-green-600">Vibes</span></span>
                        </Link>
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                            Platform daur ulang modern yang mengubah sampah plastikmu menjadi poin dan hadiah menarik. Bergabunglah dalam gerakan hijau ini!
                        </p>
                        <div className="flex gap-4 pt-2">
                            <SocialIcon icon={<Facebook className="w-4 h-4" />} href="#" />
                            <SocialIcon icon={<Instagram className="w-4 h-4" />} href="#" />
                            <SocialIcon icon={<Twitter className="w-4 h-4" />} href="#" />
                        </div>
                    </div>

                    {/* 2. Quick Links */}
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-6">Navigasi</h3>
                        <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
                            <li><FooterLink href="/">Beranda</FooterLink></li>
                            <li><FooterLink href="/shop">Tukar Poin (Shop)</FooterLink></li>
                            <li><FooterLink href="/scan">Scan Sampah</FooterLink></li>
                        </ul>
                    </div>

                    {/* 3. Support */}
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-6">Bantuan</h3>
                        <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
                            <li><FooterLink href="/terms">Syarat & Ketentuan</FooterLink></li>
                            <li><FooterLink href="/privacy">Kebijakan Privasi</FooterLink></li>
                            <li><FooterLink href="/help">Pusat Bantuan</FooterLink></li>
                            <li className="flex items-center gap-2 pt-2">
                                <Mail className="w-4 h-4 text-green-600" />
                                <span>support@recyclevibes.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* 4. Newsletter */}
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-6">Tetap Terhubung</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            Dapatkan tips daur ulang dan info promo poin terbaru.
                        </p>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Email kamu..."
                                className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 focus-visible:ring-green-500"
                            />
                            <Button size="icon" className="bg-green-600 hover:bg-green-700 text-white shrink-0">
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-400">
                        © {currentYear} RecycleVibes Platform. All rights reserved.
                    </p>

                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 px-4 py-2 rounded-full border border-gray-100 dark:border-gray-800">
                        <span>Dibuat dengan</span>
                        <div className="w-5 h-5">
                            <DotLottieReact
                                src="https://lottie.host/d9ab3795-4f0f-4f80-8924-85816918e1f7/yMZKfHpMF4.lottie"
                                loop
                                autoplay
                                style={{ width: '100%', height: '100%' }}
                            />
                        </div>
                        <span>oleh <span className="font-bold text-gray-900 dark:text-white">Suryo</span></span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialIcon({ icon, href }) {
    return (
        <Link
            href={href}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-green-600 hover:text-white dark:hover:bg-green-600 dark:hover:text-white transition-all duration-300"
        >
            {icon}
        </Link>
    );
}

function FooterLink({ href, children }) {
    return (
        <Link href={href} className="hover:text-green-600 dark:hover:text-green-500 transition-colors flex items-center gap-2 group">
            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700 group-hover:bg-green-500 transition-colors"></span>
            {children}
        </Link>
    );
}
