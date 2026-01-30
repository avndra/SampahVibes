import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// Define Validation Schema
const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters')
});

export async function POST(req) {
    try {
        const body = await req.json();

        // 1. Zod Validation
        const validation = registerSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.errors[0].message },
                { status: 400 }
            );
        }

        const { name, email, password } = validation.data;

        await connectDB();

        // 2. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: 'Email already registered' },
                { status: 400 }
            );
        }

        // 3. Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Assign Role
        // Logic: If email is specifically 'admin@erecycle.com', make them admin.
        // Otherwise, standard user.
        const role = email === 'admin@erecycle.com' ? 'admin' : 'user';

        // 5. Create User
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            totalPoints: 0,
            totalWeight: 0,
            totalDeposits: 0
        });

        return NextResponse.json(
            { message: 'User created successfully', userId: newUser._id },
            { status: 201 }
        );

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
