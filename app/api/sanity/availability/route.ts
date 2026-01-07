import { NextResponse } from 'next/server'
import {
  getDayPricing,
  getPricingPeriods,
  getBlockedDates,
  getBookingRules
} from '@/lib/sanity'

export const dynamic = 'force-dynamic'

/**
 * API Route: GET /api/sanity/availability
 *
 * Vérifie la disponibilité pour une période donnée
 *
 * Query params requis :
 * - startDate: YYYY-MM-DD (date d'arrivée)
 * - endDate: YYYY-MM-DD (date de départ)
 *
 * Retourne :
 * - available: boolean
 * - reason: string (si non disponible)
 * - minimumNights: number (nombre de nuits minimum requis)
 * - pricePerNight: number (prix moyen par nuit)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!startDate || !endDate) {
      return NextResponse.json(
        {
          success: false,
          error: 'startDate and endDate are required',
        },
        { status: 400 }
      )
    }

    // Vérifier que les dates sont valides
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (start >= end) {
      return NextResponse.json({
        success: true,
        available: false,
        reason: 'La date de départ doit être après la date d\'arrivée',
      })
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

    // Vérifier si des dates sont bloquées (jour par jour + ancien système)
    const unavailableDates: string[] = []

    // Utiliser les dates comme strings pour éviter les problèmes de timezone
    const checkInParts = startDate.split('-')
    const checkInYear = parseInt(checkInParts[0])
    const checkInMonth = parseInt(checkInParts[1]) - 1
    const checkInDay = parseInt(checkInParts[2])

    for (let i = 0; i < nights; i++) {
      const currentDate = new Date(checkInYear, checkInMonth, checkInDay + i)
      const year = currentDate.getFullYear()
      const month = String(currentDate.getMonth() + 1).padStart(2, '0')
      const day = String(currentDate.getDate()).padStart(2, '0')
      const dateStr = `${year}-${month}-${day}`

      // 1. Vérifier les jours individuels (PRIORITAIRE)
      const dayPrice = dayPricings.find(d => d.date === dateStr)
      if (dayPrice && !dayPrice.isAvailable) {
        unavailableDates.push(dateStr)
      } else {
        // 2. Vérifier l'ancien système de dates bloquées
        const isBlockedOld = blockedDates.some(
          blocked => dateStr >= blocked.startDate && dateStr <= blocked.endDate
        )
        if (isBlockedOld) {
          unavailableDates.push(dateStr)
        }
      }
    }

    if (unavailableDates.length > 0) {
      // Créer les plages de dates indisponibles
      const ranges: Array<{ start: string; end: string }> = []
      let rangeStart = unavailableDates[0]
      let rangeEnd = unavailableDates[0]

      for (let i = 1; i < unavailableDates.length; i++) {
        const prevDate = new Date(unavailableDates[i - 1])
        const currentDateCheck = new Date(unavailableDates[i])
        const dayDiff = (currentDateCheck.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)

        if (dayDiff === 1) {
          // Dates consécutives
          rangeEnd = unavailableDates[i]
        } else {
          // Nouvelle plage
          ranges.push({ start: rangeStart, end: rangeEnd })
          rangeStart = unavailableDates[i]
          rangeEnd = unavailableDates[i]
        }
      }
      ranges.push({ start: rangeStart, end: rangeEnd })

      // Formater le message
      let reason = 'Non disponible : '
      const rangeMessages = ranges.map(range => {
        const startFormatted = new Date(range.start).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
        if (range.start === range.end) {
          return `le ${startFormatted}`
        } else {
          const endFormatted = new Date(range.end).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
          return `du ${startFormatted} au ${endFormatted}`
        }
      })

      reason += rangeMessages.join(', ')

      return NextResponse.json({
        success: true,
        available: false,
        reason,
        unavailableDates,
      })
    }

    // Trouver les périodes de prix qui s'appliquent
    const applicablePeriods = pricingPeriods.filter(
      period =>
        period.isActive &&
        (
          (startDate >= period.startDate && startDate <= period.endDate) ||
          (endDate >= period.startDate && endDate <= period.endDate) ||
          (startDate <= period.startDate && endDate >= period.endDate)
        )
    )

    // Vérifier si toutes les périodes sont disponibles
    const hasUnavailablePeriod = applicablePeriods.some(
      period => !period.isAvailable
    )

    if (hasUnavailablePeriod) {
      return NextResponse.json({
        success: true,
        available: false,
        reason: 'Cette période n\'est pas disponible à la réservation',
      })
    }

    // Déterminer le nombre de nuits minimum
    let minimumNights = bookingRules?.defaultMinimumNights || 2

    if (applicablePeriods.length > 0) {
      // Prendre le maximum des nuits minimum requises
      minimumNights = Math.max(
        ...applicablePeriods.map(p => p.minimumNights),
        minimumNights
      )
    }

    // Vérifier si le séjour respecte le minimum
    if (nights < minimumNights) {
      return NextResponse.json({
        success: true,
        available: false,
        reason: `Séjour minimum de ${minimumNights} nuit${minimumNights > 1 ? 's' : ''} requis pour cette période`,
        minimumNights,
      })
    }

    // Calculer le prix moyen par nuit
    let totalPrice = 0
    const defaultPrice = bookingRules?.defaultPricePerNight || 150

    // Utiliser les dates comme strings pour éviter les problèmes de timezone
    const startDateParts = startDate.split('-')
    const startYear = parseInt(startDateParts[0])
    const startMonth = parseInt(startDateParts[1]) - 1
    const startDay = parseInt(startDateParts[2])

    for (let i = 0; i < nights; i++) {
      const currentDate = new Date(startYear, startMonth, startDay + i)
      const year = currentDate.getFullYear()
      const month = String(currentDate.getMonth() + 1).padStart(2, '0')
      const day = String(currentDate.getDate()).padStart(2, '0')
      const dateStr = `${year}-${month}-${day}`

      // 1. Vérifier prix jour individuel (PRIORITAIRE)
      const dayPrice = dayPricings.find(d => d.date === dateStr)
      if (dayPrice && dayPrice.pricePerNight !== undefined && dayPrice.pricePerNight !== null) {
        totalPrice += dayPrice.pricePerNight
      } else {
        // 2. Trouver la période de prix applicable
        const period = pricingPeriods.find(
          p =>
            p.isActive &&
            dateStr >= p.startDate &&
            dateStr <= p.endDate
        )
        totalPrice += period ? period.pricePerNight : defaultPrice
      }
    }

    const pricePerNight = Math.round(totalPrice / nights)

    return NextResponse.json({
      success: true,
      available: true,
      minimumNights,
      pricePerNight,
      totalNights: nights,
      totalPrice,
    })
  } catch (error) {
    console.error('Error checking availability:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check availability',
      },
      { status: 500 }
    )
  }
}
