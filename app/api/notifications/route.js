import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/db';
import Notification from '@/lib/models/Notification';

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const notifications = await Notification.find({ userId: session.user.id })
            .sort({ createdAt: -1 })
            .limit(20)
            .lean();

        const unreadCount = await Notification.countDocuments({
            userId: session.user.id,
            read: false
        });

        return NextResponse.json({ notifications, unreadCount });
    } catch (error) {
        console.error('Notification Fetch Error:', error);
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        // Mark all as read
        await Notification.updateMany(
            { userId: session.user.id, read: false },
            { $set: { read: true } }
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Notification Update Error:', error);
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
