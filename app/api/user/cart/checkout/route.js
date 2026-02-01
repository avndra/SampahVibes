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

        const { productId, shippingData } = await req.json();

        if (!productId) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }

        await connectDB();

        // 1. Fetch User and populate cart to get product details
        const user = await User.findById(session.user.id).select('cart totalPoints email name address phone');

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // 2. Find the item in the cart
        const cartItem = user.cart.find(item => item.productId.toString() === productId);

        if (!cartItem) {
            return NextResponse.json({ error: 'Item not found in cart' }, { status: 404 });
        }

        // 3. Fetch current product details (to ensure price is up to date and product exists)
        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        // 4. Calculate total cost
        const quantity = cartItem.quantity;
        const totalCost = product.pointsCost * quantity;

        // 5. Check balance
        if (user.totalPoints < totalCost) {
            return NextResponse.json({ error: `Poin tidak cukup. Butuh ${totalCost} poin.` }, { status: 400 });
        }

        // 6. Process Payment
        // Deduct points
        user.totalPoints -= totalCost;

        // Remove item from cart
        user.cart = user.cart.filter(item => item.productId.toString() !== productId);

        // Save User updates
        await user.save();

        const transaction = await Transaction.create({
            userId: user._id,
            productId: product._id,
            productName: product.name,
            productImage: product.image,
            pointsCost: product.pointsCost,
            quantity: quantity,
            totalPoints: totalCost,
            status: 'pending',
            shippingData: {
                address: shippingData?.address || user.address || '',
                note: shippingData?.note || '',
                city: shippingData?.city || '',
                postalCode: shippingData?.postalCode || '',
            }
        });

        // 8. Create Activity Log (REQUIRED for Admin Dashboard)
        await Activity.create({
            userId: user._id,
            userName: user.name,
            userEmail: user.email,
            type: 'redeem',
            points: totalCost,
            productId: product._id,
            productName: product.name,
            status: 'pending',
            shippingAddress: {
                address: shippingData?.address || user.address || '',
                city: shippingData?.city || '',
                postalCode: shippingData?.postalCode || '',
                note: shippingData?.note || ''
            },
            timestamp: new Date()
        });

        return NextResponse.json({
            success: true,
            message: 'Pembayaran berhasil!',
            remainingPoints: user.totalPoints,
            transactionId: transaction._id
        });

    } catch (error) {
        console.error('Checkout error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
