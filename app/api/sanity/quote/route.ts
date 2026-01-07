import { NextResponse } from 'next/server'
import {
  getDayPricing,
  getPricingPeriods,
  getBlockedDates,
  getBookingRules
} from '@/lib/sanity'

export const dynamic = 'force-dynamic'

/**
 * API Route: POST /api/sanity/quote
 *
 * Calcule un devis complet pour un séjour
 *
 * Body requis :
 * - arrival: YYYY-MM-DD (date d'arrivée)
 * - departure: YYYY-MM-DD (date de départ)
 * - adults: number (nombre d'adultes)
 * - children: number (nombre d'enfants)
 *
 * Retourne un devis détaillé avec :
 * - Prix par nuit détaillé
 * - Taxe de séjour
 * - Arrhes (30%)
 * - Total
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { arrival, departure, adults = 2, children = 0 } = body

    if (!arrival || !departure) {
      return NextResponse.json(
        {
          success: false,
          error: 'arrival and departure dates are required',
        },
        { status: 400 }
      )
    }

    const startDate = arrival
    const endDate = departure
    const totalGuests = adults + children

    // Vérifier que les dates sont valides
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (start >= end) {
      return NextResponse.json(
        {
          success: false,
          error: 'La date de départ doit être après la date d\'arrivée',
        },
        { status: 400 }
      )
    }

    // Calculer le nombre de nuits
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

    // Récupérer les données
    const [dayPricings, pricingPeriods, blockedDates, bookingRules] = await Promise.all([
      getDayPricing(),
      getPricingPeriods(),
      getBlockedDates(),
      getBookingRules(),
    ])

    // Vérifier la disponibilité (jour par jour)
    const checkInParts = startDate.split('-')
    const checkInYear = parseInt(checkInParts[0])
    const checkInMonth = parseInt(checkInParts[1]) - 1
    const checkInDay = parseInt(checkInParts[2])

    for (let i = 0; i < nights; i++) {
      const currentDate = new Date(Date.UTC(checkInYear, checkInMonth, checkInDay + i))
      const year = currentDate.getUTCFullYear()
      const month = String(currentDate.getUTCMonth() + 1).padStart(2, '0')
      const day = String(currentDate.getUTCDate()).padStart(2, '0')
      const dateStr = `${year}-${month}-${day}`

      // 1. Vérifier les jours individuels (PRIORITAIRE)
      const dayPrice = dayPricings.find(d => d.date === dateStr)
      if (dayPrice && !dayPrice.isAvailable) {
        return NextResponse.json(
          {
            success: false,
            error: 'Certaines dates sont déjà réservées ou bloquées',
          },
          { status: 400 }
        )
      }

      // 2. Vérifier l'ancien système
      const isBlocked = blockedDates.some(
        blocked => dateStr >= blocked.startDate && dateStr <= blocked.endDate
      )
      if (isBlocked) {
        return NextResponse.json(
          {
            success: false,
            error: 'Certaines dates sont déjà réservées ou bloquées',
          },
          { status: 400 }
        )
      }
    }

    // Calculer le prix détaillé par nuit
    const defaultPrice = bookingRules?.defaultPricePerNight || 150
    const nightsBreakdown: Array<{
      date: string
      price: number
      periodName?: string
    }> = []

    let totalAccommodation = 0

    // Utiliser les dates comme strings pour éviter les problèmes de timezone
    const startDateParts = startDate.split('-')
    const startYear = parseInt(startDateParts[0])
    const startMonth = parseInt(startDateParts[1]) - 1 // Mois commence à 0
    const startDay = parseInt(startDateParts[2])

    for (let i = 0; i < nights; i++) {
      // Créer la date correctement en évitant les problèmes de timezone
      // Utiliser UTC pour garantir que le calcul est cohérent
      const requestDate = new Date(Date.UTC(startYear, startMonth, startDay + i))

      const year = requestDate.getUTCFullYear()
      const month = String(requestDate.getUTCMonth() + 1).padStart(2, '0')
      const day = String(requestDate.getUTCDate()).padStart(2, '0')
      const dateStr = `${year}-${month}-${day}`

      // 1. Vérifier prix jour individuel (PRIORITAIRE)
      const dayPrice = dayPricings.find(d => d.date === dateStr)
      let nightPrice: number
      let sourceName: string | undefined

      if (dayPrice && dayPrice.pricePerNight !== undefined && dayPrice.pricePerNight !== null) {
        nightPrice = dayPrice.pricePerNight
        sourceName = `Jour spécifique${dayPrice.comment ? ` (${dayPrice.comment})` : ''}`
      } else {
        // 2. Trouver la période de prix applicable
        const period = pricingPeriods.find(
          p =>
            p.isActive &&
            dateStr >= p.startDate &&
            dateStr <= p.endDate
        )
        nightPrice = period ? period.pricePerNight : defaultPrice
        sourceName = period?.name
      }

      nightsBreakdown.push({
        date: dateStr,
        price: nightPrice,
        periodName: sourceName,
      })

      totalAccommodation += nightPrice
    }

    // Calculer la taxe de séjour
    const touristTaxRate = bookingRules?.touristTaxPerPersonPerNight || 1.5
    const touristTax = nights * totalGuests * touristTaxRate

    // Calculer le total
    const total = totalAccommodation + touristTax

    // Calculer les arrhes
    const depositPercentage = bookingRules?.depositPercentage || 30
    const deposit = Math.round((total * depositPercentage) / 100)
    const balance = total - deposit

    // Dépôt de garantie
    const securityDeposit = bookingRules?.securityDeposit || 500

    return NextResponse.json({
      success: true,
      quote: {
        arrival,
        departure,
        nights,
        guests: {
          adults,
          children,
          total: totalGuests,
        },
        pricing: {
          accommodation: totalAccommodation,
          touristTax,
          total,
          deposit,
          balance,
          securityDeposit,
        },
        nightsBreakdown,
        checkIn: bookingRules?.checkInTime || '16:00',
        checkOut: bookingRules?.checkOutTime || '10:00',
      },
    })
  } catch (error) {
    console.error('Error calculating quote:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to calculate quote',
      },
      { status: 500 }
    )
  }
}
