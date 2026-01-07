import { NextResponse } from 'next/server'
import {
  getPricingPeriods,
  getBlockedDates,
  getBookingRules
} from '@/lib/sanity'

export const dynamic = 'force-dynamic'

/**
 * API Route: GET /api/sanity/calendar
 *
 * Récupère toutes les informations du calendrier :
 * - Périodes de prix
 * - Dates bloquées
 * - Paramètres de réservation
 *
 * Query params optionnels :
 * - startDate: YYYY-MM-DD (filtre à partir de cette date)
 * - endDate: YYYY-MM-DD (filtre jusqu'à cette date)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Récupérer toutes les données en parallèle
    const [pricingPeriods, blockedDates, bookingRules] = await Promise.all([
      getPricingPeriods(),
      getBlockedDates(),
      getBookingRules(),
    ])

    // Filtrer par dates si spécifié
    let filteredPricing = pricingPeriods
    let filteredBlocked = blockedDates

    if (startDate && endDate) {
      filteredPricing = pricingPeriods.filter(
        period =>
          period.endDate >= startDate && period.startDate <= endDate
      )

      filteredBlocked = blockedDates.filter(
        blocked =>
          blocked.endDate >= startDate && blocked.startDate <= endDate
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        pricingPeriods: filteredPricing,
        blockedDates: filteredBlocked,
        bookingRules,
      },
    })
  } catch (error) {
    console.error('Error fetching calendar data:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch calendar data',
      },
      { status: 500 }
    )
  }
}
