import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import Activity from '@/lib/models/Activity';
import { scanBarcodeLogic } from '@/lib/scan-logic';
import { calculateLevel, calculateXpFromWeight, getLevelBonusPoints, getLevelTitle } from '@/lib/xpSystem';

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

    // Calculate XP earned from weight (grams)
    const weightInGrams = scanResult.weight * 1000; // Convert kg to grams
    const xpEarned = calculateXpFromWeight(weightInGrams);

    // Store old level for comparison
    const oldLevel = user.level || 0;
    const oldXp = user.xp || 0;

    // Update XP
    user.xp = oldXp + xpEarned;

    // Calculate new level
    const newLevel = calculateLevel(user.xp);
    user.level = newLevel;

    // Check for level up and award bonus points
    let bonusPoints = 0;
    let leveledUp = false;
    if (newLevel > oldLevel) {
      leveledUp = true;
      // Award bonus for each level gained (in case of multiple level ups)
      for (let lvl = oldLevel + 1; lvl <= newLevel; lvl++) {
        bonusPoints += getLevelBonusPoints(lvl);
      }
    }

    // Update User Stats
    user.totalPoints += scanResult.pointsEarned + bonusPoints;
    user.totalWeight += scanResult.weight;
    user.totalDeposits += 1;

    // Monthly points tracking
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    if (!user.monthlyPoints) user.monthlyPoints = {};
    user.monthlyPoints.set(currentMonth, (user.monthlyPoints.get(currentMonth) || 0) + scanResult.pointsEarned + bonusPoints);

    await user.save();

    // Create Activity Log
    await Activity.create({
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      type: 'scan',
      points: scanResult.pointsEarned,
      productName: `${scanResult.trashType} (${scanResult.weight} kg)`,
      timestamp: new Date()
    });

    // Return enhanced response with XP data
    return NextResponse.json({
      ...scanResult,
      xp: {
        earned: xpEarned,
        total: user.xp,
        level: newLevel,
        levelTitle: getLevelTitle(newLevel),
        leveledUp,
        bonusPoints,
        oldLevel,
      }
    });

  } catch (error) {
    console.error('Scan error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}