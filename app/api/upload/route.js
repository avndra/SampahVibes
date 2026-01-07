import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get('file');

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file found.' }, { status: 400 });
    }

    // Convert file to base64 for Cloudinary upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString('base64');
    const mimeType = file.type || 'image/jpeg';
    const dataUri = `data:${mimeType};base64,${base64Data}`;

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: 'erecycle/products', // Organize uploads in a folder
      resource_type: 'image',
      transformation: [
        { width: 800, height: 800, crop: 'limit' }, // Limit max dimensions
        { quality: 'auto:good' }, // Auto optimize quality
        { fetch_format: 'auto' }, // Auto format (webp, etc.)
      ],
    });

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'File upload failed.'
    }, { status: 500 });
  }
}
