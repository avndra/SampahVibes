import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get('file');

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file found.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate a unique filename
    const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
    const publicPath = '/uploads/products';
    const finalPath = path.join(process.cwd(), 'public', publicPath, filename);

    await writeFile(finalPath, buffer);

    const imageUrl = `${publicPath}/${filename}`;

    return NextResponse.json({ success: true, url: imageUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, error: 'File upload failed.' }, { status: 500 });
  }
}
