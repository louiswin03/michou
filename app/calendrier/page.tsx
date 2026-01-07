'use client';

import { useState, useEffect } from 'react';
import ICAL from 'ical.js';

interface CalendarEvent {
  summary: string;
  start: Date;
  end: Date;
  description?: string;
  status?: string;
}

export default function CalendrierPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const CALENDAR_URL = 'https://www.lodgify.com/a00983fb-6978-4502-9097-0bb201ef0541.ics';

  useEffect(() => {
    fetchCalendar();
  }, []);

  const fetchCalendar = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch via un proxy API pour éviter CORS
      const response = await fetch(`/api/ical-proxy?url=${encodeURIComponent(CALENDAR_URL)}`);

      if (!response.ok) {
        throw new Error('Erreur lors du chargement du calendrier');
      }

      const icalData = await response.text();
      console.log('iCal data:', icalData);

      // Parser le fichier iCal
      const jcalData = ICAL.parse(icalData);
      const comp = new ICAL.Component(jcalData);
      const vevents = comp.getAllSubcomponents('vevent');

      const parsedEvents: CalendarEvent[] = vevents.map((vevent) => {
        const event = new ICAL.Event(vevent);
        return {
          summary: event.summary,
          start: event.startDate.toJSDate(),
          end: event.endDate.toJSDate(),
          description: event.description,
          status: event.status,
        };
      });

      setEvents(parsedEvents);
    } catch (err) {
      console.error('Error fetching calendar:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  // Générer les jours du mois actuel
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: Date[] = [];

    // Ajouter les jours du mois précédent pour remplir la première semaine
    const firstDayOfWeek = firstDay.getDay();
    const daysFromPrevMonth = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    for (let i = daysFromPrevMonth; i > 0; i--) {
      const day = new Date(year, month, 1 - i);
      days.push(day);
    }

    // Ajouter tous les jours du mois
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    // Ajouter les jours du mois suivant pour remplir la dernière semaine
    const remainingDays = 42 - days.length; // 6 semaines * 7 jours
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }

    return days;
  };

  const isDateBooked = (date: Date): boolean => {
    return events.some((event) => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      eventStart.setHours(0, 0, 0, 0);
      eventEnd.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);
      return date >= eventStart && date < eventEnd;
    });
  };

  const getEventForDate = (date: Date): CalendarEvent | undefined => {
    return events.find((event) => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      eventStart.setHours(0, 0, 0, 0);
      eventEnd.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);
      return date >= eventStart && date < eventEnd;
    });
  };

  const days = getDaysInMonth(currentMonth);
  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-slate">Chargement du calendrier...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream p-4">
        <div className="max-w-2xl w-full bg-red-50 border border-red-200 rounded-xl p-6">
          <h2 className="text-red-800 font-bold mb-2">Erreur</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchCalendar}
            className="px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold-dark transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-slate mb-2">Calendrier des réservations</h1>
          <p className="text-taupe">Synchronisé avec Lodgify</p>
        </div>

        {/* Contrôles du calendrier */}
        <div className="bg-white rounded-xl shadow-sm border border-border p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={previousMonth}
              className="px-4 py-2 border border-border rounded-lg hover:bg-cream transition-colors"
            >
              ← Mois précédent
            </button>
            <h2 className="text-2xl font-serif text-slate">
              {currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </h2>
            <button
              onClick={nextMonth}
              className="px-4 py-2 border border-border rounded-lg hover:bg-cream transition-colors"
            >
              Mois suivant →
            </button>
          </div>

          {/* Grille du calendrier */}
          <div className="grid grid-cols-7 gap-2">
            {/* En-têtes des jours */}
            {weekDays.map((day) => (
              <div key={day} className="text-center font-medium text-taupe text-sm py-2">
                {day}
              </div>
            ))}

            {/* Jours du mois */}
            {days.map((date, index) => {
              const booked = isDateBooked(date);
              const event = getEventForDate(date);
              const currentMonthDay = isCurrentMonth(date);
              const today = isToday(date);

              return (
                <div
                  key={index}
                  className={`min-h-24 p-2 border rounded-lg relative ${
                    !currentMonthDay
                      ? 'bg-gray-50 text-gray-400'
                      : booked
                      ? 'bg-red-50 border-red-200'
                      : 'bg-green-50 border-green-200'
                  } ${today ? 'ring-2 ring-gold' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span
                      className={`text-sm font-medium ${
                        !currentMonthDay ? 'text-gray-400' : today ? 'text-gold' : 'text-slate'
                      }`}
                    >
                      {date.getDate()}
                    </span>
                    {booked && currentMonthDay && (
                      <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">
                        Réservé
                      </span>
                    )}
                  </div>
                  {event && currentMonthDay && (
                    <div className="text-xs text-red-700 mt-1 line-clamp-2">
                      {event.summary || 'Réservation'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Légende */}
        <div className="bg-white rounded-xl shadow-sm border border-border p-6 mb-6">
          <h3 className="font-medium text-slate mb-4">Légende</h3>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-50 border border-green-200 rounded"></div>
              <span className="text-sm text-taupe">Disponible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-50 border border-red-200 rounded"></div>
              <span className="text-sm text-taupe">Réservé</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 border-2 border-gold rounded"></div>
              <span className="text-sm text-taupe">Aujourd'hui</span>
            </div>
          </div>
        </div>

        {/* Liste des réservations */}
        {events.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-border p-6">
            <h3 className="font-medium text-slate mb-4">
              Prochaines réservations ({events.length})
            </h3>
            <div className="space-y-3">
              {events
                .sort((a, b) => a.start.getTime() - b.start.getTime())
                .slice(0, 10)
                .map((event, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-cream rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-slate">{event.summary || 'Réservation'}</p>
                      {event.description && (
                        <p className="text-sm text-taupe mt-1">{event.description}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate">
                        {event.start.toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                        })}{' '}
                        →{' '}
                        {event.end.toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="text-xs text-taupe mt-1">
                        {Math.ceil(
                          (event.end.getTime() - event.start.getTime()) / (1000 * 60 * 60 * 24)
                        )}{' '}
                        nuits
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
