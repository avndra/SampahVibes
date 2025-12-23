import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.id === 'demo-user-id') {
      return NextResponse.json({ error: 'Demo account cannot be updated' }, { status: 403 });
    }

    const body = await request.json();

    await connectDB();

    const updateData = {
      name: body.name,
      phone: body.phone || '',
      address: body.address || '',
      updatedAt: new Date()
    };

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id, 
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Profile updated successfully!',
      user: {
        name: updatedUser.name,
        phone: updatedUser.phone,
        address: updatedUser.address
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}