import { NextRequest, NextResponse } from 'next/server';
import { getAvailability } from '@/lib/lodgify';

export async function GET(request: NextRequest) {
  try {
    console.log('[API /availability] Received request');
    const searchParams = request.nextUrl.searchParams;
    const propertyId = searchParams.get('propertyId');
    const startDate = searchParams.get('start');
    const endDate = searchParams.get('end');

    console.log('[API /availability] Parameters:', { propertyId, startDate, endDate });

    if (!propertyId || !startDate || !endDate) {
      console.error('[API /availability] Missing parameters');
      return NextResponse.json(
        { error: 'Missing required parameters: propertyId, start, end' },
        { status: 400 }
      );
    }

    const availability = await getAvailability(
      parseInt(propertyId),
      startDate,
      endDate
    );

    console.log('[API /availability] Availability fetched successfully, days:', availability.length);
    return NextResponse.json(availability);
  } catch (error) {
    console.error('[API /availability] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch availability';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
