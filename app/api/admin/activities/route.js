import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/db';
import AdminActivity from '@/lib/models/AdminActivity';
import User from '@/lib/models/User';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get admin activities with populated admin info
    const adminActivities = await AdminActivity.find()
      .populate({
        path: 'adminId',
        select: 'name email'
      })
      .sort({ timestamp: -1 })
      .limit(20)
      .lean();

    return NextResponse.json(adminActivities);
  } catch (error) {
    console.error('Fetch admin activities error:', error);
    return NextResponse.json({ error: 'Failed to fetch admin activities' }, { status: 500 });
  }
}

export { GET as getAdminActivities };