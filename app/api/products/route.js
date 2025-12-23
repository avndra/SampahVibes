import { connectDB } from '@/lib/db';
import Product from '@/lib/models/Product';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();
    
    const products = await Product.find()
      .sort({ featured: -1, createdAt: -1 })
      .lean();

    return NextResponse.json(products);
  } catch (error) {
    console.error('Fetch products error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}