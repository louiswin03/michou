'use client';

import { useState } from 'react';

export default function ICalViewerPage() {
  const [icalData, setIcalData] = useState<string | null>(null);
  const [parsedEvents, setParsedEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIcal = async () => {
    setLoading(true);
    setError(null);

    try {
      const icalUrl = 'https://www.lodgify.com/a00983fb-6978-4502-9097-0bb201ef0541.ics';
      const response = await fetch(`/api/ical-proxy?url=${encodeURIComponent(icalUrl)}`);

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du calendrier iCal');
      }

      const data = await response.text();
      console.log('[iCal Viewer] Raw data:', data);
      setIcalData(data);

      // Parser avec ical.js
      try {
        const ICAL = require('ical.js');
        const jcalData = ICAL.parse(data);
        const comp = new ICAL.Component(jcalData);
        const vevents = comp.getAllSubcomponents('vevent');

        const events = vevents.map((vevent: any) => {
          const event = new ICAL.Event(vevent);
          const startDate = event.startDate.toJSDate();
          const endDate = event.endDate.toJSDate();

          // Calculer les nuits
          const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

          return {
            summary: event.summary || 'Sans titre',
            description: event.description || '',
            start: startDate,
            end: endDate,
            startStr: startDate.toISOString().split('T')[0],
            endStr: endDate.toISOString().split('T')[0],
            nights: nights,
            uid: event.uid || '',
          };
        });

        // Trier par date de début
        events.sort((a, b) => a.start.getTime() - b.start.getTime());

        console.log('[iCal Viewer] Parsed events:', events);
        setParsedEvents(events);
      } catch (parseError) {
        console.error('[iCal Viewer] Parse error:', parseError);
        setError('Erreur lors du parsing du calendrier');
      }
    } catch (err) {
      console.error('[iCal Viewer] Error:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-slate mb-2">
            Visualiseur iCal Lodgify
          </h1>
          <p className="text-taupe mb-4">
            Contenu du calendrier iCal synchronisé avec Airbnb et autres plateformes
          </p>
          <p className="text-sm text-taupe font-mono bg-white px-3 py-2 rounded border border-border">
            URL: https://www.lodgify.com/a00983fb-6978-4502-9097-0bb201ef0541.ics
          </p>
        </div>

        {/* Bouton de chargement */}
        <div className="mb-8">
          <button
            onClick={fetchIcal}
            disabled={loading}
            className="px-6 py-3 bg-gold text-white rounded-xl font-semibold hover:bg-gold/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Chargement...' : 'Charger le calendrier iCal'}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <h2 className="text-red-800 font-bold mb-2">Erreur</h2>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Événements parsés */}
        {parsedEvents.length > 0 && (
          <div className="bg-white rounded-2xl border-2 border-border p-8 mb-8">
            <h2 className="text-2xl font-serif font-bold text-slate mb-6">
              Réservations trouvées ({parsedEvents.length})
            </h2>

            <div className="space-y-4">
              {parsedEvents.map((event, index) => (
                <div
                  key={index}
                  className="p-6 bg-gradient-to-r from-slate/5 to-transparent border-l-4 border-gold rounded-lg"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-slate">
                      {event.summary}
                    </h3>
                    <span className="px-3 py-1 bg-gold/10 text-gold text-sm font-medium rounded-full">
                      {event.nights} nuit{event.nights > 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-taupe">Arrivée :</span>
                      <span className="ml-2 font-medium text-slate">
                        {event.start.toLocaleDateString('fr-FR', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div>
                      <span className="text-taupe">Départ :</span>
                      <span className="ml-2 font-medium text-slate">
                        {event.end.toLocaleDateString('fr-FR', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-taupe">
                    <span className="font-medium">Dates :</span> {event.startStr} → {event.endStr}
                  </div>

                  {event.description && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-sm text-taupe">{event.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Statistiques */}
            <div className="mt-8 pt-6 border-t border-border">
              <h3 className="text-lg font-semibold text-slate mb-4">Statistiques</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {parsedEvents.length}
                  </div>
                  <div className="text-xs text-taupe mt-1">Réservations</div>
                </div>
                <div className="p-4 bg-green-50 rounded-xl text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {parsedEvents.reduce((sum, e) => sum + e.nights, 0)}
                  </div>
                  <div className="text-xs text-taupe mt-1">Nuits totales</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {parsedEvents.length > 0
                      ? Math.round(parsedEvents.reduce((sum, e) => sum + e.nights, 0) / parsedEvents.length)
                      : 0}
                  </div>
                  <div className="text-xs text-taupe mt-1">Moy. nuits/séjour</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Données brutes */}
        {icalData && (
          <div className="bg-white rounded-2xl border-2 border-border p-8">
            <h2 className="text-2xl font-serif font-bold text-slate mb-6">
              Données brutes iCal
            </h2>
            <pre className="text-xs bg-gray-50 p-4 rounded overflow-auto max-h-96 border border-border">
              {icalData}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
