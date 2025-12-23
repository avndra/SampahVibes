import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import Activity from '@/lib/models/Activity';

// DATABASE MOCKUP: Barcode Botol Plastik Valid
const VALID_PRODUCTS = {
  // Le Minerale
  "8996001600399": { name: "Le Minerale 1500ml", brand: "Le Minerale", base_weight: 0.035 },
  "8996001600375": { name: "Le Minerale 330ml", brand: "Le Minerale", base_weight: 0.012 },
  "8996001600269": { name: "Le Minerale 600ml", brand: "Le Minerale", base_weight: 0.018 },

  // Aqua
  "8886008101053": { name: "Aqua 600ml", brand: "Aqua", base_weight: 0.016 },
  "8992696404441": { name: "Aqua 1500ml", brand: "Aqua", base_weight: 0.032 },

  // Cleo
  "8996129800640": { name: "Cleo 1500ml", brand: "Cleo", base_weight: 0.035 },
  "8996129803504": { name: "Cleo 550ml", brand: "Cleo", base_weight: 0.015 },

  // Santri / Generic Demo
  "8991234567890": { name: "Santri 600ml", brand: "Santri", base_weight: 0.016 },
};

// Estimate bottle weight based on volume
function estimateBottleWeight(quantityStr) {
  if (!quantityStr) return 0.015; // Default 15g for unknown

  const quantityLower = quantityStr.toLowerCase();
  const match = quantityLower.match(/(\d+(?:\.\d+)?)\s*(ml|l|cl|litre|liter)?/);

  if (match) {
    const value = parseFloat(match[1]);
    const unit = match[2] || 'ml';

    let ml;
    if (['l', 'litre', 'liter'].includes(unit)) {
      ml = value * 1000;
    } else if (unit === 'cl') {
      ml = value * 10;
    } else {
      ml = value;
    }

    // Estimate: 10g base + 0.02g per ml
    let weightGrams = 10 + (ml * 0.02);

    // Cap at realistic values
    if (weightGrams < 8) weightGrams = 8;
    else if (weightGrams > 50) weightGrams = 50;

    return Math.round((weightGrams / 1000) * 1000) / 1000; // Convert to kg, round to 3 decimals
  }

  return 0.015; // Default fallback
}

// Lookup product from Open Food Facts API
async function lookupOpenFoodFacts(barcode) {
  try {
    const url = `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'E-Recycle/1.0' },
      signal: AbortSignal.timeout(5000)
    });

    if (response.ok) {
      const data = await response.json();

      if (data.status === 1 && data.product) {
        const product = data.product;
        const productName = product.product_name || "Unknown Product";
        const brands = product.brands || "";
        const quantity = product.quantity || "";

        let fullName = brands ? `${brands} ${productName}`.trim() : productName;
        if (quantity) fullName += ` (${quantity})`;

        const estimatedWeight = estimateBottleWeight(quantity);

        return {
          found: true,
          name: fullName,
          brand: brands,
          quantity: quantity,
          weight: estimatedWeight
        };
      }
    }

    return { found: false };
  } catch (error) {
    console.error("Open Food Facts API error:", error);
    return { found: false };
  }
}

// Process barcode scanning
async function scanBarcode(code) {
  // 1. Check local database first
  const productInfo = VALID_PRODUCTS[code];

  let itemName, weight;

  if (productInfo) {
    // Use local database
    itemName = productInfo.name;
    const variation = (parseInt(code.slice(-1)) % 5) / 1000;
    weight = Math.round((productInfo.base_weight + variation) * 1000) / 1000;
  } else {
    // 2. Try Open Food Facts API
    const offResult = await lookupOpenFoodFacts(code);

    if (offResult.found) {
      itemName = offResult.name;
      weight = offResult.weight;
    } else {
      // 3. Fallback - accept any valid barcode format (8+ digits)
      if (!/^\d{8,}$/.test(code)) {
        return {
          error: "Format barcode tidak valid. Harus 8+ digit angka.",
          status: 400
        };
      }

      // Accept any valid barcode with generic estimation
      itemName = "Botol Plastik (Unknown)";
      const seedVal = parseInt(code.slice(-4)) || 999;
      const weightGrams = (seedVal % 25) + 15; // 15-40g range
      weight = Math.round((weightGrams / 1000) * 1000) / 1000;
    }
  }

  // Points Calculation
  const pointsPerKg = 1000;
  let points = Math.floor(pointsPerKg * weight);
  if (points < 5) points = 5;

  return {
    barcode: code,
    trashType: "Botol Plastik (PET)",
    productName: itemName,
    weight: weight,
    pointsEarned: points,
    message: `Verified: ${itemName}`
  };
}

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
    const scanResult = await scanBarcode(barcode);

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