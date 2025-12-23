import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
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

        // Return preview data only (no save)
        return NextResponse.json({
            barcode: scanResult.barcode,
            productName: scanResult.productName,
            trashType: scanResult.trashType,
            weight: scanResult.weight,
            pointsEarned: scanResult.pointsEarned,
            message: scanResult.message
        });

    } catch (error) {
        console.error('Preview error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
