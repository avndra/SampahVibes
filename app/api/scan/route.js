import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import Activity from '@/lib/models/Activity';
import { scanBarcodeLogic } from '@/lib/scan-logic';

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

    // Process barcode scanning (integrated logic)
    const scanResult = await scanBarcodeLogic(barcode);

    if (scanResult.error) {
      return NextResponse.json({ error: scanResult.error }, { status: scanResult.status });
    }

    // Save to Database
    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Update User Stats
    user.totalPoints += scanResult.pointsEarned;
    user.totalWeight += scanResult.weight;
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
      productName: `${scanResult.trashType} (${scanResult.weight} kg)`,
      timestamp: new Date()
    });

    return NextResponse.json(scanResult);

  } catch (error) {
    console.error('Scan error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}