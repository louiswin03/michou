// Calendrier & Réservations
import pricingPeriod from './pricingPeriod'
import blockedDate from './blockedDate'
import bookingRules from './bookingRules'
import dayPricing from './dayPricing'
import pricingRule from './pricingRule'

// Pages
import homePage from './pages/homePage'
import contactPage from './pages/contactPage'
import aboutPage from './pages/aboutPage'
import generalSettings from './pages/generalSettings'

export const schemaTypes = [
  // Pages
  homePage,
  contactPage,
  aboutPage,
  generalSettings,

  // Calendrier
  dayPricing,
  pricingPeriod,
  blockedDate,
  bookingRules,
  pricingRule,
]
