'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PROPERTY_ID = 752397;

interface DayAvailability {
  date: string;
  available: boolean;
  price?: number;
}

export default function CalendrierLodgifyPage() {
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [availability, setAvailability] = useState<DayAvailability[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les disponibilités du mois
  useEffect(() => {
    const fetchAvailability = async () => {
      setLoading(true);
      setError(null);

      try {
        // Premier et dernier jour du mois
        const startDate = new Date(viewYear, viewMonth, 1);
        const endDate = new Date(viewYear, viewMonth + 1, 0);

        const start = startDate.toISOString().split('T')[0];
        const end = endDate.toISOString().split('T')[0];

        console.log('[Calendrier Lodgify] Fetching:', { start, end });

        const response = await fetch(
          `/api/availability?propertyId=${PROPERTY_ID}&start=${start}&end=${end}`
        );

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des disponibilités');
        }

        const data = await response.json();
        console.log('[Calendrier Lodgify] Data received:', data);
        setAvailability(data);
      } catch (err) {
        console.error('[Calendrier Lodgify] Error:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [viewMonth, viewYear]);

  // Navigation
  const goToPreviousMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  // Générer les jours du mois
  const getDaysInMonth = () => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    const lastDay = new Date(viewYear, viewMonth + 1, 0);
    const days = [];

    // Jours vides au début
    const startPadding = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }

    // Jours du mois
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(viewYear, viewMonth, day));
    }

    return days;
  };

  const dateToString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getAvailabilityForDate = (date: Date) => {
    const dateStr = dateToString(date);
    return availability.find(a => a.date === dateStr);
  };

  const MONTHS = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  return (
    <div className="min-h-screen bg-cream p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-slate mb-2">
            Calendrier Lodgify
          </h1>
          <p className="text-taupe">
            Visualisation complète des disponibilités depuis l'API Lodgify
          </p>
        </div>

        {/* Calendrier */}
        <div className="bg-white rounded-2xl border-2 border-border p-8 shadow-lg">
          {/* En-tête */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={goToPreviousMonth}
              className="p-3 hover:bg-cream rounded-lg transition-colors"
              aria-label="Mois précédent"
            >
              <ChevronLeft className="w-6 h-6 text-slate" />
            </button>
            <h2 className="font-serif text-2xl text-slate font-semibold">
              {MONTHS[viewMonth]} {viewYear}
            </h2>
            <button
              onClick={goToNextMonth}
              className="p-3 hover:bg-cream rounded-lg transition-colors"
              aria-label="Mois suivant"
            >
              <ChevronRight className="w-6 h-6 text-slate" />
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
              <p className="text-taupe mt-4">Chargement...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
              <p className="text-red-800 font-semibold">Erreur</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          )}

          {/* Calendrier */}
          {!loading && !error && (
            <>
              {/* Jours de la semaine */}
              <div className="grid grid-cols-7 gap-3 mb-3">
                {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
                  <div key={day} className="text-center text-sm font-semibold text-taupe py-3">
                    {day}
                  </div>
                ))}
              </div>

              {/* Grille des jours */}
              <div className="grid grid-cols-7 gap-3">
                {getDaysInMonth().map((date, index) => {
                  if (!date) {
                    return <div key={`empty-${index}`} className="aspect-square" />;
                  }

                  const dateStr = dateToString(date);
                  const dayData = getAvailabilityForDate(date);
                  const isAvailable = dayData?.available ?? false;
                  const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
                  const isToday = dateStr === dateToString(new Date());

                  return (
                    <div
                      key={dateStr}
                      className={`
                        aspect-square rounded-xl p-2 flex flex-col items-center justify-center
                        border-2 transition-all
                        ${isAvailable
                          ? 'bg-green-50 border-green-300'
                          : 'bg-red-50 border-red-300'
                        }
                        ${isPast ? 'opacity-40' : ''}
                        ${isToday ? 'ring-4 ring-gold/50' : ''}
                      `}
                    >
                      <div className={`text-lg font-bold ${
                        isAvailable ? 'text-green-900' : 'text-red-900'
                      }`}>
                        {date.getDate()}
                      </div>
                      <div className={`text-xs font-medium mt-1 ${
                        isAvailable ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {isAvailable ? '✓ Libre' : '✗ Occupé'}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Légende */}
              <div className="mt-8 pt-6 border-t border-border">
                <h3 className="text-sm font-semibold text-slate mb-4">Légende</h3>
                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-green-50 border-2 border-green-300"></div>
                    <span className="text-taupe">Disponible</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-red-50 border-2 border-red-300"></div>
                    <span className="text-taupe">Occupé / Réservé</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded border-2 border-border ring-4 ring-gold/50"></div>
                    <span className="text-taupe">Aujourd'hui</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-6 pt-6 border-t border-border">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-slate">
                      {availability.length}
                    </div>
                    <div className="text-xs text-taupe mt-1">Jours analysés</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl">
                    <div className="text-2xl font-bold text-green-600">
                      {availability.filter(d => d.available).length}
                    </div>
                    <div className="text-xs text-taupe mt-1">Jours disponibles</div>
                  </div>
                  <div className="p-4 bg-red-50 rounded-xl">
                    <div className="text-2xl font-bold text-red-600">
                      {availability.filter(d => !d.available).length}
                    </div>
                    <div className="text-xs text-taupe mt-1">Jours bloqués</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Données brutes */}
        {!loading && availability.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl border-2 border-border p-8">
            <h3 className="text-xl font-serif font-bold text-slate mb-4">
              Données brutes (JSON)
            </h3>
            <pre className="text-xs bg-gray-50 p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(availability, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
