import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const user = await User.findById(session.user.id)
      .select('-password')
      .lean();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Convert monthlyPoints Map to object
    let monthlyPointsObj = {};
    if (user.monthlyPoints) {
      if (user.monthlyPoints instanceof Map) {
        // If it's a Map instance, convert it to object
        monthlyPointsObj = Object.fromEntries(user.monthlyPoints);
      } else if (Array.isArray(user.monthlyPoints)) {
        // If it's an array of key-value pairs (what MongoDB returns after lean())
        monthlyPointsObj = Object.fromEntries(user.monthlyPoints);
      } else if (typeof user.monthlyPoints === 'object') {
        // If it's already an object
        monthlyPointsObj = user.monthlyPoints;
      }
    }

    const userData = {
      ...user,
      monthlyPoints: monthlyPointsObj
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}