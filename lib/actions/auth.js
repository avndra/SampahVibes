'use server';

import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function registerUser(formData) {
  try {
    // Validate input
    const validatedData = registerSchema.parse({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });

    await connectDB();

    // Check if user exists
    const existingUser = await User.findOne({ email: validatedData.email });
    
    if (existingUser) {
      return { success: false, error: 'Email already registered' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Create user
    await User.create({
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
      role: 'user',
    });

    return { 
      success: true, 
      message: 'Account created successfully! Please login.' 
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    console.error('Registration error:', error);
    return { success: false, error: 'Failed to create account. Please try again.' };
  }
}

export async function updateProfile(userId, formData) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.id !== userId) {
      return { success: false, error: 'Unauthorized' };
    }

    await connectDB();

    const updateData = {
      name: formData.name,
      phone: formData.phone || '',
      address: formData.address || '',
      updatedAt: new Date()
    };

    await User.findByIdAndUpdate(userId, updateData);

    revalidatePath('/profile');

    return { success: true, message: 'Profile updated successfully!' };
  } catch (error) {
    console.error('Profile update error:', error);
    return { success: false, error: 'Failed to update profile' };
  }
}