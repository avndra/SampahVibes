import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import { NextResponse } from 'next/server';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.id === 'demo-user-id') {
      return NextResponse.json({ error: 'Demo account cannot upload avatar' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('avatar');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Please upload JPG, PNG, WEBP, or GIF' 
      }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 5MB' 
      }, { status: 400 });
    }

    // Convert to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    await connectDB();

    // Update user avatar
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { 
        avatar: dataUrl,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Avatar updated successfully!',
      avatar: dataUrl
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    return NextResponse.json({ error: 'Failed to upload avatar' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.id === 'demo-user-id') {
      return NextResponse.json({ error: 'Demo account cannot delete avatar' }, { status: 403 });
    }

    await connectDB();

    // Reset to default avatar
    const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.id}`;
    
    await User.findByIdAndUpdate(
      session.user.id,
      { 
        avatar: defaultAvatar,
        updatedAt: new Date()
      }
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Avatar removed successfully!',
      avatar: defaultAvatar
    });
  } catch (error) {
    console.error('Avatar delete error:', error);
    return NextResponse.json({ error: 'Failed to delete avatar' }, { status: 500 });
  }
}