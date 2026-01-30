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

    // Create Notification if status is important
    if (['shipped', 'completed', 'rejected'].includes(status)) {
      const Notification = (await import('@/lib/models/Notification')).default;

      let title = 'Update Pesanan';
      let message = `Status pesanan ${updatedOrder.productName} anda telah diperbarui menjadi: ${status}.`;

      if (status === 'shipped') {
        title = 'Pesanan Dikirim!';
        message = `Hore! Pesanan ${updatedOrder.productName} sedang dalam perjalanan. ${adminNote ? `Catatan: ${adminNote}` : ''}`;
      } else if (status === 'completed') {
        title = 'Pesanan Selesai';
        message = `Pesanan ${updatedOrder.productName} telah selesai. Terima kasih telah menukarkan poin!`;
      } else if (status === 'rejected') {
        title = 'Pesanan Dibatalkan';
        message = `Maaf, pesanan ${updatedOrder.productName} dibatalkan. ${adminNote ? `Alasan: ${adminNote}` : ''}`;
      }

      await Notification.create({
        userId: updatedOrder.userId._id,
        type: 'order_update',
        title,
        message,
        link: '/profile' // Redirect to profile to see history
      });
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}