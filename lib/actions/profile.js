'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import { revalidatePath } from 'next/cache';

export async function updateUserProfile(formData) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    if (session.user.id === 'demo-user-id') {
      return { success: false, error: 'Demo account cannot be updated' };
    }

    await connectDB();

    const updateData = {
      name: formData.name,
      phone: formData.phone || '',
      address: formData.address || '',
      updatedAt: new Date()
    };

    await User.findByIdAndUpdate(session.user.id, updateData);

    revalidatePath('/profile');

    return { success: true, message: 'Profile updated successfully!' };
  } catch (error) {
    console.error('Profile update error:', error);
    return { success: false, error: 'Failed to update profile' };
  }
}