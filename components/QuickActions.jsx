'use client';

import Link from 'next/link';
import { ScanLine, Gift, History, BookOpen } from 'lucide-react';

export default function QuickActions() {
    const actions = [
        {
            label: 'Tukar',
            icon: <Gift className="w-6 h-6 text-white" />,
            href: '/shop',
            color: 'bg-purple-500',
            shadow: 'shadow-purple-500/30'
        },
        {
            label: 'Riwayat',
            icon: <History className="w-6 h-6 text-white" />,
            href: '/profile', // Profile usually has history
            color: 'bg-blue-500',
            shadow: 'shadow-blue-500/30'
        },
        {
            label: 'Panduan',
            icon: <BookOpen className="w-6 h-6 text-white" />,
            href: '/help',
            color: 'bg-orange-500',
            shadow: 'shadow-orange-500/30'
        }
    ];

    return (
        <div className="grid grid-cols-3 gap-4 px-4 py-6">
            {actions.map((action, index) => (
                <Link key={index} href={action.href} className="flex flex-col items-center group">
                    <div className={`w-12 h-12 rounded-2xl ${action.color} flex items-center justify-center shadow-lg ${action.shadow} mb-2 transform group-hover:scale-105 transition-transform duration-200`}>
                        {action.icon}
                    </div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">
                        {action.label}
                    </span>
                </Link>
            ))}
        </div>
    );
}
