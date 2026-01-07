import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false, // Set to true in production for better performance
  token: process.env.SANITY_API_TOKEN,
})

// Types pour les données Sanity
export interface DayPricing {
  _id: string
  _type: 'dayPricing'
  date: string
  pricePerNight?: number
  minimumNights?: number
  isAvailable: boolean
  blockReason?: 'booking' | 'maintenance' | 'personal' | 'other'
  comment?: string
  highlightColor?: 'none' | 'green' | 'yellow' | 'orange' | 'red' | 'blue' | 'purple'
}

export interface PricingPeriod {
  _id: string
  _type: 'pricingPeriod'
  name: string
  startDate: string
  endDate: string
  pricePerNight: number
  minimumNights: number
  isAvailable: boolean
  comment?: string
  isActive: boolean
}

export interface BlockedDate {
  _id: string
  _type: 'blockedDate'
  startDate: string
  endDate: string
  reason: 'booking' | 'maintenance' | 'personal' | 'blocked'
  comment?: string
  color: 'red' | 'orange' | 'yellow' | 'gray'
  isActive: boolean
}

export interface BookingRules {
  _id: string
  _type: 'bookingRules'
  defaultPricePerNight: number
  defaultMinimumNights: number
  maximumGuests: number
  advanceBookingDays: number
  depositPercentage: number
  securityDeposit: number
  touristTaxPerPersonPerNight: number
  checkInTime: string
  checkOutTime: string
  notes?: string
}

// Fonctions helper pour récupérer les données
export async function getDayPricing(): Promise<DayPricing[]> {
  const allDays = await client.fetch(
    `*[_type == "dayPricing"] | order(_updatedAt desc)`
  )

  // Dédupliquer : garder seulement la version la plus récente de chaque date
  const daysMap = new Map<string, DayPricing>()
  for (const day of allDays) {
    if (!daysMap.has(day.date)) {
      daysMap.set(day.date, day)
    }
  }

  // Retourner triés par date
  return Array.from(daysMap.values()).sort((a, b) => a.date.localeCompare(b.date))
}

export async function getPricingPeriods(): Promise<PricingPeriod[]> {
  return client.fetch(
    `*[_type == "pricingPeriod" && isActive == true] | order(startDate asc)`
  )
}

export async function getBlockedDates(): Promise<BlockedDate[]> {
  return client.fetch(
    `*[_type == "blockedDate" && isActive == true] | order(startDate desc)`
  )
}

export async function getBookingRules(): Promise<BookingRules | null> {
  return client.fetch(`*[_type == "bookingRules"][0]`)
}

// Fonction pour obtenir le prix pour une date donnée
export async function getPriceForDate(date: string): Promise<number | null> {
  // 1. Vérifier si un prix par jour existe (PRIORITAIRE)
  const dayPricings = await getDayPricing()
  const dayPrice = dayPricings.find(d => d.date === date)
  if (dayPrice && dayPrice.pricePerNight !== undefined && dayPrice.pricePerNight !== null) {
    return dayPrice.pricePerNight
  }

  // 2. Vérifier les périodes
  const periods = await getPricingPeriods()
  for (const period of periods) {
    if (date >= period.startDate && date <= period.endDate) {
      return period.pricePerNight
    }
  }

  // 3. Si aucune période ne correspond, retourner le prix par défaut
  const rules = await getBookingRules()
  return rules?.defaultPricePerNight || 150
}

// Fonction pour vérifier si une date est bloquée
export async function isDateBlocked(date: string): Promise<boolean> {
  // 1. Vérifier si un jour spécifique existe et est bloqué (PRIORITAIRE)
  const dayPricings = await getDayPricing()
  const dayPrice = dayPricings.find(d => d.date === date)
  if (dayPrice) {
    return !dayPrice.isAvailable
  }

  // 2. Vérifier les dates bloquées (ancien système)
  const blockedDates = await getBlockedDates()
  return blockedDates.some(
    blocked => date >= blocked.startDate && date <= blocked.endDate
  )
}

// Fonction pour obtenir les nuits minimum pour une période
export async function getMinimumNightsForPeriod(
  startDate: string,
  endDate: string
): Promise<number> {
  // 1. Vérifier si le jour de départ a une règle spécifique (PRIORITAIRE)
  const dayPricings = await getDayPricing()
  const dayPrice = dayPricings.find(d => d.date === startDate)
  if (dayPrice && dayPrice.minimumNights !== undefined && dayPrice.minimumNights !== null) {
    return dayPrice.minimumNights
  }

  // 2. Trouver la période qui chevauche les dates données
  const periods = await getPricingPeriods()
  for (const period of periods) {
    if (
      (startDate >= period.startDate && startDate <= period.endDate) ||
      (endDate >= period.startDate && endDate <= period.endDate) ||
      (startDate <= period.startDate && endDate >= period.endDate)
    ) {
      return period.minimumNights
    }
  }

  // 3. Sinon retourner le minimum par défaut
  const rules = await getBookingRules()
  return rules?.defaultMinimumNights || 2
}
