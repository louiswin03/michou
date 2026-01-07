import { NextResponse } from 'next/server';
import { getProperties } from '@/lib/lodgify';

export async function GET() {
  try {
    const properties = await getProperties();
    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error in properties route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}
