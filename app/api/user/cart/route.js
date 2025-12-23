import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import Product from '@/lib/models/Product';
import { NextResponse } from 'next/server';

// GET /api/user/cart - Get user's cart
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const user = await User.findById(session.user.id).populate('cart.productId');
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json(user.cart);
  } catch (error) {
    console.error('Get cart error:', error);
    return NextResponse.json({ error: 'Failed to get cart' }, { status: 500 });
  }
}

// POST /api/user/cart - Add item to cart
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { productId, quantity = 1 } = await req.json();
    if (!productId || quantity < 1) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const product = await Product.findById(productId);
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    const cartItemIndex = user.cart.findIndex(item => item.productId.toString() === productId);

    if (cartItemIndex > -1) {
      user.cart[cartItemIndex].quantity += quantity;
    } else {
      user.cart.push({ productId, quantity });
    }

    await user.save();
    const populatedUser = await User.findById(session.user.id).populate('cart.productId');

    return NextResponse.json(populatedUser.cart);
  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
  }
}

// PUT /api/user/cart - Update item quantity
export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { productId, quantity } = await req.json();
    if (!productId || quantity < 1) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const cartItemIndex = user.cart.findIndex(item => item.productId.toString() === productId);

    if (cartItemIndex > -1) {
      user.cart[cartItemIndex].quantity = quantity;
      await user.save();
      const populatedUser = await User.findById(session.user.id).populate('cart.productId');
      return NextResponse.json(populatedUser.cart);
    } else {
      return NextResponse.json({ error: 'Item not in cart' }, { status: 404 });
    }
  } catch (error) {
    console.error('Update cart error:', error);
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}

// DELETE /api/user/cart - Remove item from cart
export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    user.cart = user.cart.filter(item => item.productId.toString() !== productId);
    
    await user.save();
    const populatedUser = await User.findById(session.user.id).populate('cart.productId');

    return NextResponse.json(populatedUser.cart);
  } catch (error) {
    console.error('Remove from cart error:', error);
    return NextResponse.json({ error: 'Failed to remove from cart' }, { status: 500 });
  }
}
