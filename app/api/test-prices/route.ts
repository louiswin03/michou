import { NextRequest, NextResponse } from 'next/server';

const LODGIFY_API_URL = 'https://api.lodgify.com/v2';
const API_KEY = process.env.LODGIFY_API_KEY;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const propertyId = searchParams.get('propertyId');
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    if (!propertyId || !start || !end) {
      return NextResponse.json(
        { success: false, message: 'Missing required parameters' },
        { status: 400 }
      );
    }

    console.log('[API /test-prices] Fetching prices for:', { propertyId, start, end });

    // Utiliser l'endpoint /rates qui retourne les tarifs
    // GET /v2/properties/{propertyId}/rates
    const url = `${LODGIFY_API_URL}/properties/${propertyId}/rates`;

    console.log('[API /test-prices] Request URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-ApiKey': API_KEY || '',
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    console.log('[API /test-prices] Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[API /test-prices] Error response:', errorText);
      return NextResponse.json(
        {
          success: false,
          message: `Lodgify API error: ${response.status}`,
          error: errorText,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('[API /test-prices] Success, data items:', data.calendar_items?.length || 0);

    return NextResponse.json({
      success: true,
      data,
      url,
    });
  } catch (error) {
    console.error('[API /test-prices] Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
