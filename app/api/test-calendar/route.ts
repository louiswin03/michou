import { NextRequest, NextResponse } from 'next/server';

const LODGIFY_API_KEY = process.env.LODGIFY_API_KEY;
const LODGIFY_API_URL = 'https://api.lodgify.com/v2';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const propertyId = searchParams.get('propertyId') || '752397';
    const startDate = searchParams.get('start') || '2025-01-01';
    const endDate = searchParams.get('end') || '2025-12-31';

    console.log('[API Test Calendar] Testing endpoints for:', { propertyId, startDate, endDate });

    const headers = {
      'X-ApiKey': LODGIFY_API_KEY || '',
      'Content-Type': 'application/json',
    };

    // Tester différents endpoints
    const endpoints = [
      {
        name: 'calendar',
        url: `${LODGIFY_API_URL}/properties/${propertyId}/calendar?start=${startDate}&end=${endDate}`,
      },
      {
        name: 'availability (from/to)',
        url: `${LODGIFY_API_URL}/properties/${propertyId}/availability?from=${startDate}&to=${endDate}`,
      },
      {
        name: 'availability (start/end)',
        url: `${LODGIFY_API_URL}/properties/${propertyId}/availability?start=${startDate}&end=${endDate}`,
      },
      {
        name: 'availability root',
        url: `${LODGIFY_API_URL}/availability/${propertyId}?start=${startDate}&end=${endDate}`,
      },
    ];

    const results = [];

    for (const endpoint of endpoints) {
      try {
        console.log(`[API Test Calendar] Testing: ${endpoint.name}`);
        const response = await fetch(endpoint.url, { headers });

        const responseText = await response.text();
        let data;
        try {
          data = JSON.parse(responseText);
        } catch {
          data = responseText;
        }

        results.push({
          name: endpoint.name,
          url: endpoint.url,
          status: response.status,
          success: response.ok,
          data: response.ok ? data : null,
          error: !response.ok ? responseText : null,
        });

        if (response.ok) {
          console.log(`[API Test Calendar] ✓ ${endpoint.name} works!`);
          // Retourner le premier endpoint qui fonctionne
          return NextResponse.json({
            success: true,
            endpoint: endpoint.name,
            url: endpoint.url,
            data,
            allResults: results,
          });
        }
      } catch (error) {
        console.error(`[API Test Calendar] ✗ ${endpoint.name} failed:`, error);
        results.push({
          name: endpoint.name,
          url: endpoint.url,
          status: 0,
          success: false,
          data: null,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    // Aucun endpoint n'a fonctionné
    return NextResponse.json({
      success: false,
      message: 'Tous les endpoints ont échoué',
      allResults: results,
    }, { status: 404 });

  } catch (error) {
    console.error('[API Test Calendar] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
