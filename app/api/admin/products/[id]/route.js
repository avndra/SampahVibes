import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/lib/models/Product';
import { withAuth } from 'next-auth/middleware';

// PUT /api/admin/products/[id] - Update a specific product
async function updateHandler(req, { params }) {
  const token = req.nextauth.token;
  if (token?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();

    await connectDB();

    const updatedProduct = await Product.findByIdAndUpdate(id, body, { new: true });

    if (!updatedProduct) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error(`Product update error (ID: ${id}):`, error);
    return NextResponse.json({ success: false, error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE /api/admin/products/[id] - Delete a specific product
async function deleteHandler(req, { params }) {
  const token = req.nextauth.token;
  if (token?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await connectDB();

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error(`Product delete error (ID: ${id}):`, error);
    return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 });
  }
}

export const PUT = withAuth(updateHandler);
export const DELETE = withAuth(deleteHandler);
