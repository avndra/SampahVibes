import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/db';
import Activity from '@/lib/models/Activity';
import { redirect } from 'next/navigation';
import ActivityFeed from '@/components/ActivityFeed';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function HistoryPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect('/login');
    }

    await connectDB();

    const activities = await Activity.find({ userId: session.user.id })
        .sort({ timestamp: -1 })
        .limit(50)
        .lean();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
            <div className="max-w-md mx-auto md:max-w-2xl bg-white dark:bg-gray-900 min-h-screen shadow-lg">
                {/* Header */}
                <div className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-4 py-4 flex items-center border-b border-gray-100 dark:border-gray-800">
                    <Link href="/" className="mr-4 p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                    </Link>
                    <h1 className="text-xl font-bold text-gray-800 dark:text-white">Riwayat Aktivitas</h1>
                </div>

                {/* Content */}
                <div className="p-4">
                    {activities.length > 0 ? (
                        <ActivityFeed activities={JSON.parse(JSON.stringify(activities))} />
                    ) : (
                        <div className="text-center py-20 text-gray-500">
                            Belum ada aktivitas.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
