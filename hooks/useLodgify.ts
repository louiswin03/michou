import { useState, useEffect } from 'react';

export interface LodgifyAvailability {
  date: string;
  available: boolean;
  price?: number;
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

export function useLodgifyAvailability(
  propertyId: number | null,
  startDate: string | null,
  endDate: string | null
) {
  const [availability, setAvailability] = useState<LodgifyAvailability[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!propertyId || !startDate || !endDate) {
      setAvailability([]);
      return;
    }

    const fetchAvailability = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/availability?propertyId=${propertyId}&start=${startDate}&end=${endDate}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch availability');
        }

        const data = await response.json();
        setAvailability(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setAvailability([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [propertyId, startDate, endDate]);

  return { availability, loading, error };
}

export function useLodgifyQuote() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuote = async (
    propertyId: number,
    arrival: string,
    departure: string,
    adults: number = 2,
    children: number = 0
  ): Promise<LodgifyQuote | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId,
          arrival,
          departure,
          adults,
          children,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch quote');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchQuote, loading, error };
}

/**
 * Hook pour récupérer les dates bloquées (non disponibles)
 * pour les désactiver dans le calendrier
 * Combine les données de l'API Lodgify ET de l'iCal pour avoir toutes les réservations
 */
export function useBlockedDates(
  propertyId: number | null,
  monthsAhead: number = 6
) {
  const [blockedDates, setBlockedDates] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!propertyId) {
      setBlockedDates(new Set());
      return;
    }

    const fetchBlockedDates = async () => {
      setLoading(true);

      try {
        const today = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + monthsAhead);

        const start = today.toISOString().split('T')[0];
        const end = endDate.toISOString().split('T')[0];

        // 1. Récupérer les dates bloquées depuis l'API Lodgify
        const response = await fetch(
          `/api/availability?propertyId=${propertyId}&start=${start}&end=${end}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch availability');
        }

        const data: LodgifyAvailability[] = await response.json();
        console.log('[useBlockedDates] Raw availability data from Lodgify API:', data);

        const blockedFromAPI = new Set(
          data.filter(day => !day.available).map(day => day.date)
        );

        console.log('[useBlockedDates] Blocked dates from Lodgify API:', Array.from(blockedFromAPI));

        // 2. Récupérer les réservations depuis l'iCal (qui inclut Airbnb)
        try {
          const icalUrl = 'https://www.lodgify.com/a00983fb-6978-4502-9097-0bb201ef0541.ics';
          const icalResponse = await fetch(`/api/ical-proxy?url=${encodeURIComponent(icalUrl)}`);

          if (icalResponse.ok) {
            const icalData = await icalResponse.text();

            // Parser l'iCal avec ical.js
            const ICAL = require('ical.js');
            const jcalData = ICAL.parse(icalData);
            const comp = new ICAL.Component(jcalData);
            const vevents = comp.getAllSubcomponents('vevent');

            const blockedFromICal = new Set<string>();

            vevents.forEach((vevent: any) => {
              const event = new ICAL.Event(vevent);
              const startDate = event.startDate.toJSDate();
              const endDate = event.endDate.toJSDate();

              // Ajouter toutes les dates de la réservation
              let currentDate = new Date(startDate);
              while (currentDate < endDate) {
                const dateStr = currentDate.toISOString().split('T')[0];
                if (dateStr >= start && dateStr <= end) {
                  blockedFromICal.add(dateStr);
                }
                currentDate.setDate(currentDate.getDate() + 1);
              }
            });

            console.log('[useBlockedDates] Blocked dates from iCal:', Array.from(blockedFromICal));

            // 3. Combiner les deux sources
            const allBlocked = new Set([...blockedFromAPI, ...blockedFromICal]);
            console.log('[useBlockedDates] Total blocked dates (API + iCal):', Array.from(allBlocked));
            setBlockedDates(allBlocked);
          } else {
            // Si l'iCal échoue, utiliser seulement l'API
            console.warn('[useBlockedDates] iCal fetch failed, using only API data');
            setBlockedDates(blockedFromAPI);
          }
        } catch (icalError) {
          console.error('[useBlockedDates] Error fetching iCal:', icalError);
          // En cas d'erreur iCal, utiliser seulement l'API
          setBlockedDates(blockedFromAPI);
        }
      } catch (err) {
        console.error('Error fetching blocked dates:', err);
        setBlockedDates(new Set());
      } finally {
        setLoading(false);
      }
    };

    fetchBlockedDates();
  }, [propertyId, monthsAhead]);

  return { blockedDates, loading };
}
