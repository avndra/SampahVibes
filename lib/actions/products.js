'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/db';
import Product from '@/lib/models/Product';
import User from '@/lib/models/User';
import AdminActivity from '@/lib/models/AdminActivity';
import { revalidatePath } from 'next/cache';

export async function createProduct(formData) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== 'admin') {
      return { success: false, error: 'Unauthorized' };
    }

    await connectDB();

    const product = await Product.create({
      name: formData.name,
      description: formData.description || '',
      category: formData.category,
      pointsCost: parseInt(formData.pointsCost),
      stock: parseInt(formData.stock),
      image: formData.image || 'https://placehold.co/400x300/22c55e/white?text=Product',
      isActive: formData.isActive !== false,
      featured: formData.featured || false,
    });

    // Log admin activity
    const adminUser = await User.findById(session.user.id);
    await AdminActivity.create({
      adminId: adminUser._id,
      action: 'create',
      entityType: 'product',
      entityId: product._id,
      entityName: product.name,
      details: {
        name: product.name,
        category: product.category,
        pointsCost: product.pointsCost,
        stock: product.stock
      }
    });

    revalidatePath('/admin/products');
    revalidatePath('/shop');

    return { success: true, message: 'Product created successfully!' };
  } catch (error) {
    console.error('Create product error:', error);
    return { success: false, error: 'Failed to create product' };
  }
}

export async function updateProduct(productId, formData) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== 'admin') {
      return { success: false, error: 'Unauthorized' };
    }

    await connectDB();

    // Get the original product to log the changes
    const originalProduct = await Product.findById(productId);
    if (!originalProduct) {
      return { success: false, error: 'Product not found' };
    }

    await Product.findByIdAndUpdate(productId, {
      name: formData.name,
      description: formData.description || '',
      category: formData.category,
      pointsCost: parseInt(formData.pointsCost),
      stock: parseInt(formData.stock),
      image: formData.image,
      isActive: formData.isActive,
      featured: formData.featured,
    });

    // Log admin activity
    const adminUser = await User.findById(session.user.id);
    await AdminActivity.create({
      adminId: adminUser._id,
      action: 'update',
      entityType: 'product',
      entityId: productId,
      entityName: originalProduct.name,
      details: {
        oldValues: {
          name: originalProduct.name,
          category: originalProduct.category,
          pointsCost: originalProduct.pointsCost,
          stock: originalProduct.stock,
          isActive: originalProduct.isActive,
          featured: originalProduct.featured
        },
        newValues: {
          name: formData.name,
          category: formData.category,
          pointsCost: parseInt(formData.pointsCost),
          stock: parseInt(formData.stock),
          isActive: formData.isActive,
          featured: formData.featured
        }
      }
    });

    revalidatePath('/admin/products');
    revalidatePath('/shop');

    return { success: true, message: 'Product updated successfully!' };
  } catch (error) {
    console.error('Update product error:', error);
    return { success: false, error: 'Failed to update product' };
  }
}

export async function deleteProduct(productId) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== 'admin') {
      return { success: false, error: 'Unauthorized' };
    }

    await connectDB();

    // Get the original product to log the deletion
    const originalProduct = await Product.findById(productId);
    if (!originalProduct) {
      return { success: false, error: 'Product not found' };
    }

    await Product.findByIdAndDelete(productId);

    // Log admin activity
    const adminUser = await User.findById(session.user.id);
    await AdminActivity.create({
      adminId: adminUser._id,
      action: 'delete',
      entityType: 'product',
      entityId: productId,
      entityName: originalProduct.name,
      details: {
        name: originalProduct.name,
        category: originalProduct.category,
        pointsCost: originalProduct.pointsCost,
        stock: originalProduct.stock
      }
    });

    revalidatePath('/admin/products');
    revalidatePath('/shop');

    return { success: true, message: 'Product deleted successfully!' };
  } catch (error) {
    console.error('Delete product error:', error);
    return { success: false, error: 'Failed to delete product' };
  }
}