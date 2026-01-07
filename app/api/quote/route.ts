import { NextRequest, NextResponse } from 'next/server';
import { getQuote } from '@/lib/lodgify';

export async function POST(request: NextRequest) {
  try {
    console.log('[API /quote] Received request');
    const body = await request.json();
    const { propertyId, arrival, departure, adults, children } = body;

    console.log('[API /quote] Parameters:', { propertyId, arrival, departure, adults, children });

    if (!propertyId || !arrival || !departure) {
      console.error('[API /quote] Missing parameters');
      return NextResponse.json(
        { error: 'Missing required parameters: propertyId, arrival, departure' },
        { status: 400 }
      );
    }

    const quote = await getQuote(
      parseInt(propertyId),
      arrival,
      departure,
      adults || 2,
      children || 0
    );

    console.log('[API /quote] Quote fetched successfully:', quote);
    return NextResponse.json(quote);
  } catch (error) {
    console.error('[API /quote] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch quote';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
