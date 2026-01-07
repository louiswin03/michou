const LODGIFY_API_URL = 'https://api.lodgify.com/v2';
const API_KEY = process.env.LODGIFY_API_KEY;

export interface LodgifyAvailability {
  date: string;
  available: boolean;
  price?: number;
}

export interface LodgifyProperty {
  id: number;
  name: string;
  type: string;
  people: number;
}

export interface LodgifyQuote {
  propertyId: number;
  arrival: string;
  departure: string;
  adults: number;
  children: number;
  total: number;
  currency: string;
  breakdown: {
    nights: number;
    basePrice: number;
    taxes: number;
    fees: number;
  };
}

// Headers pour les requêtes Lodgify
const headers = {
  'X-ApiKey': API_KEY || '',
  'Content-Type': 'application/json',
};

/**
 * Récupère la liste des propriétés
 */
export async function getProperties(): Promise<LodgifyProperty[]> {
  try {
    const response = await fetch(`${LODGIFY_API_URL}/properties`, {
      headers,
      next: { revalidate: 3600 }, // Cache 1 heure
    });

    if (!response.ok) {
      throw new Error(`Lodgify API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching properties from Lodgify:', error);
    throw error;
  }
}

/**
 * Récupère les disponibilités pour une propriété sur une période donnée
 * Utilise l'endpoint GET /availability/{propertyId}
 */
export async function getAvailability(
  propertyId: number,
  startDate: string, // Format: YYYY-MM-DD
  endDate: string    // Format: YYYY-MM-DD
): Promise<LodgifyAvailability[]> {
  try {
    console.log('[Lodgify] Fetching availability for:', { propertyId, startDate, endDate });

    const response = await fetch(
      `${LODGIFY_API_URL}/availability/${propertyId}?start=${startDate}&end=${endDate}`,
      {
        headers,
        cache: 'no-store', // Pas de cache pour avoir les dispos actuelles
      }
    );

    console.log('[Lodgify] Availability response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Lodgify] Availability API error:', response.status, errorText);
      throw new Error(`Lodgify API error: ${response.status} - ${errorText}`);
    }

    const availabilityData = await response.json();
    console.log('[Lodgify] Availability data received:', availabilityData);

    // Transformer les données Lodgify (format par périodes) en format jour par jour
    const dailyAvailability: LodgifyAvailability[] = [];

    if (Array.isArray(availabilityData) && availabilityData.length > 0) {
      const roomData = availabilityData[0]; // Prendre le premier room_type

      if (roomData.periods && Array.isArray(roomData.periods)) {
        console.log('[Lodgify] Processing', roomData.periods.length, 'periods');

        for (const period of roomData.periods) {
          const periodStart = new Date(period.start);
          const periodEnd = new Date(period.end);
          const isAvailable = period.available > 0;
          const hasBookings = period.bookings && period.bookings.length > 0;

          console.log('[Lodgify] Period:', {
            start: period.start,
            end: period.end,
            available: period.available,
            bookings: period.bookings?.length || 0,
            willBeMarkedAsAvailable: isAvailable && !hasBookings
          });

          // Générer une entrée pour chaque jour de la période
          // Disponible si: available > 0 ET pas de réservations
          let currentDate = new Date(periodStart);

          // Cas spécial: si start === end, c'est une période d'un seul jour
          if (period.start === period.end) {
            dailyAvailability.push({
              date: currentDate.toISOString().split('T')[0],
              available: isAvailable && !hasBookings,
              price: undefined,
            });
          } else {
            // Période normale avec plusieurs jours
            // IMPORTANT: <= pour inclure le dernier jour (periodEnd)
            while (currentDate <= periodEnd) {
              dailyAvailability.push({
                date: currentDate.toISOString().split('T')[0],
                available: isAvailable && !hasBookings,
                price: undefined, // Lodgify ne retourne pas de prix dans cet endpoint
              });
              currentDate.setDate(currentDate.getDate() + 1);
            }
          }
        }
      }
    }

    console.log('[Lodgify] Processed daily availability:', dailyAvailability.length, 'days');

    // Détecter et bloquer les dates "orphelines" (1 jour disponible qui ne peut pas faire 2 nuits)
    // Une date est orpheline si elle est disponible mais entourée de dates non disponibles
    const blockedOrphans = new Set<string>();

    for (let i = 0; i < dailyAvailability.length; i++) {
      const current = dailyAvailability[i];

      if (!current.available) continue; // Déjà bloquée, passer

      // Vérifier si c'est une date orpheline
      // Une date orpheline = disponible mais ne peut pas faire partie d'un séjour de 2 nuits
      // Cas 1: La date est seule (pas de date dispo avant ET après)
      // Cas 2: Il y a seulement 1 date dispo avant ou après (pas assez pour 2 nuits)

      let availableBefore = 0;
      let availableAfter = 0;

      // Compter les dates disponibles consécutives avant
      for (let j = i - 1; j >= 0; j--) {
        if (dailyAvailability[j].available) {
          availableBefore++;
        } else {
          break; // On arrête dès qu'on trouve une date bloquée
        }
      }

      // Compter les dates disponibles consécutives après
      for (let j = i + 1; j < dailyAvailability.length; j++) {
        if (dailyAvailability[j].available) {
          availableAfter++;
        } else {
          break; // On arrête dès qu'on trouve une date bloquée
        }
      }

      // Pour faire un séjour de 2 nuits, il faut au moins 2 dates consécutives disponibles
      // Donc la date actuelle + au moins 1 autre date (avant ou après)
      const canMakeTwoNights = (availableBefore >= 1) || (availableAfter >= 1);

      if (!canMakeTwoNights) {
        blockedOrphans.add(current.date);
        console.log('[Lodgify] Blocking orphan date (cannot make 2-night stay):', current.date, {
          availableBefore,
          availableAfter,
        });
      }
    }

    // Appliquer le blocage des dates orphelines
    const finalAvailability = dailyAvailability.map(day => ({
      ...day,
      available: day.available && !blockedOrphans.has(day.date),
    }));

    console.log('[Lodgify] Blocked', blockedOrphans.size, 'orphan dates');

    return finalAvailability;
  } catch (error) {
    console.error('[Lodgify] Error fetching availability:', error);
    throw error;
  }
}

/**
 * Récupère les tarifs depuis l'API Lodgify
 */
export async function getRates(
  propertyId: number,
  startDate: string,
  endDate: string
): Promise<any> {
  try {
    console.log('[Lodgify] Fetching rates for:', { propertyId, startDate, endDate });

    const response = await fetch(
      `${LODGIFY_API_URL}/rates/calendar?houseId=${propertyId}&start=${startDate}&end=${endDate}`,
      {
        headers,
        cache: 'no-store',
      }
    );

    console.log('[Lodgify] Rates response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Lodgify] Rates API error:', response.status, errorText);
      // Si l'API rates échoue, retourner null pour utiliser les prix par défaut
      return null;
    }

    const ratesData = await response.json();
    console.log('[Lodgify] Rates data received:', ratesData);
    return ratesData;
  } catch (error) {
    console.error('[Lodgify] Error fetching rates:', error);
    return null;
  }
}

/**
 * Récupère un devis pour une réservation avec les vrais prix de Lodgify
 */
export async function getQuote(
  propertyId: number,
  arrival: string,    // Format: YYYY-MM-DD
  departure: string,  // Format: YYYY-MM-DD
  adults: number = 2,
  children: number = 0
): Promise<LodgifyQuote> {
  try {
    console.log('[Lodgify] Fetching quote for:', { propertyId, arrival, departure, adults, children });

    // Récupérer les disponibilités
    const availability = await getAvailability(propertyId, arrival, departure);

    // Calculer le nombre de nuits
    const start = new Date(arrival);
    const end = new Date(departure);
    const nights = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

    // Vérifier si toutes les dates sont disponibles
    const allAvailable = availability.every(day => day.available);

    if (!allAvailable) {
      console.warn('[Lodgify] Some dates are not available in the requested period');
    }

    // Récupérer les tarifs depuis l'API
    const ratesData = await getRates(propertyId, arrival, departure);

    let basePrice = 0;
    let currency = 'EUR';
    let taxes = 0;
    let fees = 0;

    if (ratesData && ratesData.calendar_items) {
      // Calculer le prix total à partir des tarifs journaliers
      for (const item of ratesData.calendar_items) {
        if (item.prices && item.prices.length > 0) {
          const priceInfo = item.prices[0];
          if (priceInfo.price_per_day && priceInfo.price_per_day.amount) {
            basePrice += priceInfo.price_per_day.amount;
          }
        }
      }

      // Récupérer la devise et les taxes/frais depuis rate_settings
      if (ratesData.rate_settings) {
        currency = ratesData.rate_settings.currency_code || 'EUR';

        // Calculer les taxes
        if (ratesData.rate_settings.taxes && ratesData.rate_settings.taxes.length > 0) {
          for (const tax of ratesData.rate_settings.taxes) {
            if (tax.price) {
              if (tax.price.rate_type === 'Percentage' && tax.price.percentage) {
                taxes += (basePrice * tax.price.percentage) / 100;
              } else if (tax.price.amount) {
                taxes += tax.price.amount;
              }
            }
          }
        }

        // Calculer les frais
        if (ratesData.rate_settings.fees && ratesData.rate_settings.fees.length > 0) {
          for (const fee of ratesData.rate_settings.fees) {
            if (fee.price) {
              if (fee.price.rate_type === 'Percentage' && fee.price.percentage) {
                fees += (basePrice * fee.price.percentage) / 100;
              } else if (fee.price.amount) {
                fees += fee.price.amount;
              }
            }
          }
        }
      }

      console.log('[Lodgify] Real prices from API:', { basePrice, taxes, fees, currency });
    } else {
      // Fallback: Prix par défaut si l'API ne retourne pas de tarifs
      console.warn('[Lodgify] Using default pricing (150€/night)');
      basePrice = nights * 150;
    }

    const total = basePrice + taxes + fees;

    const quote: LodgifyQuote = {
      propertyId,
      arrival,
      departure,
      adults,
      children,
      total,
      currency,
      breakdown: {
        nights,
        basePrice,
        taxes,
        fees,
      },
    };

    console.log('[Lodgify] Quote calculated:', quote);
    return quote;
  } catch (error) {
    console.error('[Lodgify] Error fetching quote:', error);
    throw error;
  }
}

/**
 * Récupère le calendrier avec disponibilités et prix pour un mois donné
 */
export async function getCalendar(
  propertyId: number,
  year: number,
  month: number // 1-12
): Promise<LodgifyAvailability[]> {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const start = startDate.toISOString().split('T')[0];
  const end = endDate.toISOString().split('T')[0];

  return getAvailability(propertyId, start, end);
}

/**
 * Vérifie si une période est disponible
 */
export async function checkAvailability(
  propertyId: number,
  startDate: string,
  endDate: string
): Promise<{ available: boolean; blockedDates: string[] }> {
  try {
    const availability = await getAvailability(propertyId, startDate, endDate);

    const blockedDates = availability
      .filter(day => !day.available)
      .map(day => day.date);

    return {
      available: blockedDates.length === 0,
      blockedDates,
    };
  } catch (error) {
    console.error('Error checking availability:', error);
    throw error;
  }
}
