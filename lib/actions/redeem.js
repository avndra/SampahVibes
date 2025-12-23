'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import Product from '@/lib/models/Product';
import Activity from '@/lib/models/Activity';
import { revalidatePath } from 'next/cache';

export async function redeemProduct(productId, quantity = 1, shippingDetails = null) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return { success: false, error: 'Please login to redeem products' };
    }

    // Demo account handling
    if (session.user.id === 'demo-user-id') {
      return { 
        success: false, 
        error: 'Demo account cannot redeem products. Please create a real account!' 
      };
    }

    await connectDB();

    const [user, product] = await Promise.all([
      User.findById(session.user.id),
      Product.findById(productId)
    ]);

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    if (!product) {
      return { success: false, error: 'Product not found' };
    }

    if (!product.isActive) {
      return { success: false, error: 'This product is no longer available' };
    }

    const totalPointsCost = product.pointsCost * quantity;

    if (user.totalPoints < totalPointsCost) {
      return { 
        success: false, 
        error: `You need ${totalPointsCost - user.totalPoints} more points` 
      };
    }

    if (product.stock < quantity) {
      return { success: false, error: 'Product out of stock' };
    }

    // Perform redemption
    await Promise.all([
      User.findByIdAndUpdate(session.user.id, {
        $inc: { totalPoints: -totalPointsCost },
        updatedAt: new Date()
      }),
      
      Product.findByIdAndUpdate(productId, {
        $inc: { stock: -quantity }
      }),
      
      Activity.create({
        userId: session.user.id,
        type: 'redeem',
        points: -totalPointsCost,
        productId: product._id,
        productName: `${product.name} (x${quantity})`,
        status: 'pending', // Set initial status for admin approval
        shippingAddress: shippingDetails,
        timestamp: new Date()
      })
    ]);

    revalidatePath('/shop');
    revalidatePath('/profile');
    revalidatePath('/');

    return { 
      success: true,
      message: `Permintaan penukaran ${product.name} dikirim! Menunggu konfirmasi admin.` 
    };
  } catch (error) {
    console.error('Redemption error:', error);
    return { success: false, error: 'Failed to redeem product. Please try again.' };
  }
}