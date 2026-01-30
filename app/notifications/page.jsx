'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Truck, CheckCircle, XCircle, Info, Check, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/notifications');
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications);
                setUnreadCount(data.unreadCount);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const markAllRead = async () => {
        try {
            await fetch('/api/notifications', { method: 'PATCH' });
            setUnreadCount(0);
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            // Dispatch event to update navbar badge immediately
            window.dispatchEvent(new Event('notificationsRead'));
        } catch (error) {
            console.error(error);
        }
    };

    const getIcon = (title) => {
        if (title?.includes('Dikirim')) return <Truck className="w-6 h-6 text-purple-500" />;
        if (title?.includes('Selesai')) return <CheckCircle className="w-6 h-6 text-green-500" />;
        if (title?.includes('Dibatalkan')) return <XCircle className="w-6 h-6 text-red-500" />;
        return <Info className="w-6 h-6 text-blue-500" />;
    };

    const getStatusBadge = (title) => {
        if (title?.includes('Dikirim')) return { text: 'Dikirim', color: 'bg-purple-100 text-purple-700' };
        if (title?.includes('Selesai')) return { text: 'Selesai', color: 'bg-green-100 text-green-700' };
        if (title?.includes('Dibatalkan')) return { text: 'Dibatalkan', color: 'bg-red-100 text-red-700' };
        return { text: 'Update', color: 'bg-blue-100 text-blue-700' };
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 md:pt-24 pb-32">
            <div className="container mx-auto px-4 max-w-2xl">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Notifikasi</h1>
                            {unreadCount > 0 && (
                                <p className="text-sm text-gray-500">{unreadCount} belum dibaca</p>
                            )}
                        </div>
                    </div>
                    {unreadCount > 0 && (
                        <Button variant="outline" size="sm" onClick={markAllRead} className="text-green-600 border-green-200 hover:bg-green-50">
                            <Check className="w-4 h-4 mr-2" />
                            Tandai Dibaca
                        </Button>
                    )}
                </div>

                {/* Content */}
                {loading ? (
                    <div className="text-center py-16 text-gray-400">
                        <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        Loading...
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bell className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Belum ada notifikasi</h3>
                        <p className="text-gray-500">Update pesanan Anda akan muncul di sini.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {notifications.map((notif) => {
                            const badge = getStatusBadge(notif.title);
                            return (
                                <div
                                    key={notif._id}
                                    className={`bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border transition-all hover:shadow-md cursor-pointer ${!notif.read ? 'border-blue-200 dark:border-blue-800' : 'border-gray-100 dark:border-gray-800'}`}
                                    onClick={() => {
                                        if (notif.link) router.push(notif.link);
                                    }}
                                >
                                    <div className="flex gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${!notif.read ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-gray-100 dark:bg-gray-800'}`}>
                                            {getIcon(notif.title)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className={`font-bold ${!notif.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                                        {notif.title}
                                                    </h3>
                                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badge.color}`}>
                                                        {badge.text}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-gray-400 whitespace-nowrap">
                                                    {formatDate(notif.createdAt).split(',')[0]}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                                {notif.message}
                                            </p>
                                            {!notif.read && (
                                                <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-blue-500">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                    Belum dibaca
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
