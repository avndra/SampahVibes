import { connectDB } from '@/lib/db';
import Activity from '@/lib/models/Activity';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { status, adminNote } = await request.json();

    await connectDB();

    const updatedOrder = await Activity.findByIdAndUpdate(
      id,
      { status, adminNote },
      { new: true }
    )
      .populate('userId', 'name email avatar')
      .populate('productId', 'name image pointsCost');

    if (!updatedOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}