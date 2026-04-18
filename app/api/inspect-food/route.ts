import { NextRequest, NextResponse } from 'next/server';
import { inspectFood } from '@/services';
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No image uploaded' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const imageBase64 = buffer.toString('base64');
    const mimeType = file.type || 'image/jpeg';

    // Simulate environmental data
    const mockWeather = { temperature: 28.5, humidity: 74 };

    console.log(`[API] Processing food image (${mimeType}, ${Math.round(buffer.length / 1024)}KB)`);

    const analysis = await inspectFood(imageBase64, mimeType, mockWeather);

    return NextResponse.json(analysis);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Inspection failed:', message);
    return NextResponse.json(
      { error: 'Failed to inspect food image using AI' },
      { status: 500 }
    );
  }
}
