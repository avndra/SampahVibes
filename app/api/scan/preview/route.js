import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

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

        // Call Python Service for preview (no database save)
        let scanResult;
        try {
            const pythonServiceUrl = process.env.PYTHON_SERVICE_URL || 'http://127.0.0.1:8000';
            const pythonResponse = await fetch(`${pythonServiceUrl}/scan-barcode`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: barcode }),
            });

            if (!pythonResponse.ok) {
                const errorData = await pythonResponse.json();
                return NextResponse.json({ error: errorData.detail || 'Barcode tidak dikenali' }, { status: 400 });
            }

            scanResult = await pythonResponse.json();
        } catch (error) {
            console.error("Python Service Error:", error);
            return NextResponse.json({ error: 'Gagal menghubungi scanner service' }, { status: 500 });
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
