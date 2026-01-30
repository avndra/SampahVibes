import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import Product from '@/lib/models/Product';
import Transaction from '@/lib/models/Transaction';
import Activity from '@/lib/models/Activity';

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { productId, quantity, shippingData } = await req.json();

        if (!productId || quantity < 1) {
            return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
        }

        await connectDB();

        // 1. Get Product first to calculate cost
        const product = await Product.findById(productId);
        if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

        const totalCost = product.pointsCost * quantity;

        // 2. Get User to access their info (for Activity log)
        const user = await User.findById(session.user.id);
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        // ===== ATOMIC OPERATIONS START =====
        // These operations use MongoDB's atomic $inc with conditional filters.
        // If the conditions aren't met, the operation returns null instead of modifying.

        // 3. Atomically deduct User Points (ONLY if they have enough)
        const updatedUser = await User.findOneAndUpdate(
            {
                _id: session.user.id,
                totalPoints: { $gte: totalCost } // Condition: must have enough points
            },
            {
                $inc: { totalPoints: -totalCost } // Atomic decrement
            },
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            // User didn't have enough points (or was modified concurrently)
            return NextResponse.json({ error: 'Poin tidak mencukupi' }, { status: 400 });
        }

        // 4. Atomically deduct Product Stock (ONLY if enough stock exists)
        const updatedProduct = await Product.findOneAndUpdate(
            {
                _id: productId,
                stock: { $gte: quantity } // Condition: must have enough stock
            },
            {
                $inc: { stock: -quantity } // Atomic decrement
            },
            { new: true }
        );

        if (!updatedProduct) {
            // Stock was insufficient or sold out concurrently.
            // IMPORTANT: Rollback the user's points!
            await User.findByIdAndUpdate(session.user.id, {
                $inc: { totalPoints: totalCost } // Refund the points
            });
            return NextResponse.json({ error: 'Stok tidak mencukupi' }, { status: 400 });
        }
        // ===== ATOMIC OPERATIONS END =====

        // 5. Create Transaction Record (this is safe, no race condition here)
        const transaction = await Transaction.create({
            userId: user._id,
            productId: product._id,
            productName: product.name,
            productImage: product.image,
            pointsCost: product.pointsCost,
            quantity: quantity,
            totalPoints: totalCost,
            status: 'pending',
            shippingData: shippingData
        });

        // 6. Create Activity Log for the feed
        await Activity.create({
            userId: user._id,
            userName: user.name,
            userEmail: user.email,
            type: 'redeem',
            points: totalCost,
            productId: product._id,
            productName: product.name,
            status: 'pending',
            timestamp: new Date()
        });

        return NextResponse.json({
            success: true,
            message: 'Penukaran berhasil!',
            transaction: transaction,
            remainingPoints: updatedUser.totalPoints
        });

    } catch (error) {
        console.error('Purchase Error:', error);
        return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
    }
}
