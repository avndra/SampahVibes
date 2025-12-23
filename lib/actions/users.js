'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import Activity from '@/lib/models/Activity';
import AdminActivity from '@/lib/models/AdminActivity';
import { revalidatePath } from 'next/cache';

export async function toggleUserBan(userId) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== 'admin') {
      return { success: false, error: 'Unauthorized' };
    }

    await connectDB();

    const user = await User.findById(userId);
    const adminUser = await User.findById(session.user.id);
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const wasBanned = user.isBanned;
    user.isBanned = !user.isBanned;
    await user.save();

    // Log admin activity
    await AdminActivity.create({
      adminId: adminUser._id,
      action: user.isBanned ? 'update' : 'update', // Both ban and unban are updates
      entityType: 'user',
      entityId: user._id,
      entityName: user.name,
      details: {
        action: user.isBanned ? 'ban' : 'unban',
        previousStatus: wasBanned,
        newStatus: user.isBanned
      }
    });

    revalidatePath('/admin/users');

    return { 
      success: true, 
      message: `User ${user.isBanned ? 'banned' : 'unbanned'} successfully!` 
    };
  } catch (error) {
    console.error('Toggle ban error:', error);
    return { success: false, error: 'Failed to update user status' };
  }
}

export async function deleteUser(userId) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== 'admin') {
      return { success: false, error: 'Unauthorized' };
    }

    await connectDB();

    const user = await User.findById(userId);
    const adminUser = await User.findById(session.user.id);

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Delete user and their activities
    await Promise.all([
      User.findByIdAndDelete(userId),
      Activity.deleteMany({ userId })
    ]);

    // Log admin activity
    await AdminActivity.create({
      adminId: adminUser._id,
      action: 'delete',
      entityType: 'user',
      entityId: user._id,
      entityName: user.name,
      details: {
        email: user.email,
        totalPoints: user.totalPoints,
        totalDeposits: user.totalDeposits
      }
    });

    revalidatePath('/admin/users');

    return { success: true, message: 'User deleted successfully!' };
  } catch (error) {
    console.error('Delete user error:', error);
    return { success: false, error: 'Failed to delete user' };
  }
}