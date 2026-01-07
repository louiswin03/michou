import { useState, useEffect } from 'react'

interface CalendarData {
  pricingPeriods: Array<{
    _id: string
    name: string
    startDate: string
    endDate: string
    pricePerNight: number
    minimumNights: number
    isAvailable: boolean
    comment?: string
    isActive: boolean
  }>
  blockedDates: Array<{
    _id: string
    startDate: string
    endDate: string
    reason: string
    comment?: string
    isActive: boolean
  }>
  bookingRules: {
    defaultPricePerNight: number
    defaultMinimumNights: number
    maximumGuests: number
    depositPercentage: number
    securityDeposit: number
    touristTaxPerPersonPerNight: number
    checkInTime: string
    checkOutTime: string
  } | null
}

interface AvailabilityCheck {
  available: boolean
  reason?: string
  minimumNights?: number
  pricePerNight?: number
  totalNights?: number
  totalPrice?: number
}

interface QuoteRequest {
  arrival: string
  departure: string
  adults?: number
  children?: number
}

interface QuoteResponse {
  arrival: string
  departure: string
  nights: number
  guests: {
    adults: number
    children: number
    total: number
  }
  pricing: {
    accommodation: number
    touristTax: number
    total: number
    deposit: number
    balance: number
    securityDeposit: number
  }
  nightsBreakdown: Array<{
    date: string
    price: number
    periodName?: string
  }>
  checkIn: string
  checkOut: string
}

/**
 * Hook pour récupérer les données du calendrier depuis Sanity
 */
export function useSanityCalendar(startDate?: string, endDate?: string) {
  const [data, setData] = useState<CalendarData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (startDate) params.append('startDate', startDate)
        if (endDate) params.append('endDate', endDate)

        const response = await fetch(`/api/sanity/calendar?${params}`)
        const result = await response.json()

        if (result.success) {
          setData(result.data)
          setError(null)
        } else {
          setError(result.error || 'Failed to fetch calendar')
        }
      } catch (err) {
        setError('Network error')
        console.error('Error fetching calendar:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCalendar()
  }, [startDate, endDate])

  return { data, loading, error }
}

/**
 * Hook pour vérifier la disponibilité d'une période
 */
export function useSanityAvailability(startDate: string, endDate: string) {
  const [availability, setAvailability] = useState<AvailabilityCheck | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!startDate || !endDate) {
      setAvailability(null)
      return
    }

    const checkAvailability = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams({ startDate, endDate })
        const response = await fetch(`/api/sanity/availability?${params}`)
        const result = await response.json()

        if (result.success) {
          setAvailability({
            available: result.available,
            reason: result.reason,
            minimumNights: result.minimumNights,
            pricePerNight: result.pricePerNight,
            totalNights: result.totalNights,
            totalPrice: result.totalPrice,
          })
          setError(null)
        } else {
          setError(result.error || 'Failed to check availability')
        }
      } catch (err) {
        setError('Network error')
        console.error('Error checking availability:', err)
      } finally {
        setLoading(false)
      }
    }

    checkAvailability()
  }, [startDate, endDate])

  return { availability, loading, error }
}

/**
 * Hook pour calculer un devis
 */
export function useSanityQuote() {
  const [quote, setQuote] = useState<QuoteResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const calculateQuote = async (request: QuoteRequest) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/sanity/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      const result = await response.json()

      if (result.success) {
        setQuote(result.quote)
        return result.quote
      } else {
        setError(result.error || 'Failed to calculate quote')
        return null
      }
    } catch (err) {
      setError('Network error')
      console.error('Error calculating quote:', err)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { quote, loading, error, calculateQuote }
}
