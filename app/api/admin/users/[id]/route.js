import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import AdminActivity from '@/lib/models/AdminActivity';
import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { id: userId } = await params;
    const { isBanned } = await request.json();

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent admins from banning other admins
    if (user.role === 'admin' && session.user.id !== userId) {
      return NextResponse.json({ error: 'Cannot modify admin user status' }, { status: 403 });
    }

    const wasBanned = user.isBanned;
    user.isBanned = isBanned;
    await user.save();

    // Log admin activity
    const adminUser = await User.findById(session.user.id);
    await AdminActivity.create({
      adminId: adminUser._id,
      action: 'update',
      entityType: 'user',
      entityId: user._id,
      entityName: user.name,
      details: {
        action: isBanned ? 'ban' : 'unban',
        previousStatus: wasBanned,
        newStatus: user.isBanned
      }
    });

    // Revalidate paths to refresh the UI
    const { revalidatePath } = await import('next/cache');
    revalidatePath('/admin/users');

    return NextResponse.json({
      success: true,
      message: `User ${user.isBanned ? 'banned' : 'unbanned'} successfully!`
    });
  } catch (error) {
    console.error('Toggle ban error:', error);
    return NextResponse.json({ error: 'Failed to update user status' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { id: userId } = await params;

    const user = await User.findById(userId);
    const adminUser = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent admins from deleting other admins
    if (user.role === 'admin' && session.user.id !== userId) {
      return NextResponse.json({ error: 'Cannot delete admin user' }, { status: 403 });
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

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

    // Revalidate paths to refresh the UI
    const { revalidatePath } = await import('next/cache');
    revalidatePath('/admin/users');

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully!'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}