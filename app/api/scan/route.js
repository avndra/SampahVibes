import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import Activity from '@/lib/models/Activity';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { barcode } = body;

    if (!barcode) {
      return NextResponse.json({ error: 'No barcode provided' }, { status: 400 });
    }

    // 1. Call Python Service
    let scanResult;
    try {
      const pythonServiceUrl = process.env.PYTHON_SERVICE_URL || 'http://127.0.0.1:8000';
      const pythonResponse = await fetch(`${pythonServiceUrl}/scan-barcode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: barcode }),
      });

      if (!pythonResponse.ok) {
        throw new Error('Python service error');
      }

      scanResult = await pythonResponse.json();
    } catch (error) {
      console.error("Python Service Error:", error);
      // Fallback logic if Python is not running (for testing purposes)
      scanResult = {
        trashType: "Unknown Item (Fallback)",
        weight: 0.1,
        pointsEarned: 10,
        message: "Manual fallback processed"
      };
    }

    // 2. Save to Database
    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Update User Stats
    user.totalPoints += scanResult.pointsEarned;
    user.totalWeight += scanResult.weight; // Add weight
    user.totalDeposits += 1;

    // Monthly points tracking
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    if (!user.monthlyPoints) user.monthlyPoints = {};
    user.monthlyPoints.set(currentMonth, (user.monthlyPoints.get(currentMonth) || 0) + scanResult.pointsEarned);

    await user.save();

    // Create Activity Log
    await Activity.create({
      userId: user._id,
      type: 'scan',
      points: scanResult.pointsEarned,
      productName: `${scanResult.trashType} (${scanResult.weight} kg)`, // Save weight info in name
      timestamp: new Date()
    });

    return NextResponse.json(scanResult);

  } catch (error) {
    console.error('Scan error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}