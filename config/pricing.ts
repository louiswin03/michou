/**
 * Configuration des tarifs pour le gîte
 */

export const pricing = {
  // Prix tout compris par nuit (en EUR)
  pricePerNight: 150,

  // Taxe de séjour par personne par nuit
  touristTaxPerPersonPerNight: 1.5,

  // Devise
  currency: 'EUR',
}

/**
 * Calcule le prix total pour un séjour
 */
export function calculatePrice(
  checkIn: string,
  checkOut: string,
  adults: number,
  children: number
): {
  nights: number
  basePrice: number
  cleaningFee: number
  touristTax: number
  discount: number
  total: number
  perNight: number
  currency: string
} {
  const start = new Date(checkIn)
  const end = new Date(checkOut)
  const nights = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))

  // Prix de base (tout compris)
  const basePrice = nights * pricing.pricePerNight

  // Taxe de séjour
  const totalGuests = adults + children
  const touristTax = nights * totalGuests * pricing.touristTaxPerPersonPerNight

  // Total
  const total = basePrice + touristTax

  return {
    nights,
    basePrice,
    cleaningFee: 0,
    touristTax,
    discount: 0,
    total,
    perNight: pricing.pricePerNight,
    currency: pricing.currency,
  }
}
