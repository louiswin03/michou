'use client';

import { useState } from 'react';

interface CalendarDay {
  date: string;
  available: boolean;
  price?: number;
  status?: string;
}

export default function TestCalendarPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [calendarData, setCalendarData] = useState<CalendarDay[]>([]);
  const [rawResponse, setRawResponse] = useState<any>(null);
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-12-31');

  const fetchCalendar = async () => {
    setLoading(true);
    setError(null);
    setCalendarData([]);
    setRawResponse(null);

    try {
      const propertyId = 752397;

      console.log('[Test Calendar] Fetching calendar via API route for:', { propertyId, startDate, endDate });

      const response = await fetch(
        `/api/test-calendar?propertyId=${propertyId}&start=${startDate}&end=${endDate}`
      );

      const result = await response.json();

      console.log('[Test Calendar] API response:', result);

      if (result.success) {
        setRawResponse({
          endpoint: result.endpoint,
          url: result.url,
          status: 200,
          data: result.data,
          allResults: result.allResults,
        });

        // Traiter les données
        const data = result.data;
        if (Array.isArray(data)) {
          setCalendarData(data);
        } else if (data && Array.isArray(data.items)) {
          setCalendarData(data.items);
        } else {
          setCalendarData([]);
        }
      } else {
        setRawResponse({
          allResults: result.allResults,
        });
        throw new Error(result.message || 'Tous les endpoints ont échoué');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-slate mb-8">Test Calendrier Lodgify</h1>

        {/* Contrôles */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-border mb-8">
          <h2 className="text-xl font-bold text-slate mb-4">Paramètres</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-taupe mb-2">Date de début</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-taupe mb-2">Date de fin</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg"
              />
            </div>
          </div>
          <button
            onClick={fetchCalendar}
            disabled={loading}
            className="px-6 py-3 bg-gold text-white rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Chargement...' : 'Récupérer le calendrier'}
          </button>
        </div>

        {/* Erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <h2 className="text-red-800 font-bold mb-2">Erreur</h2>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Réponse brute */}
        {rawResponse && (
          <div className="space-y-4 mb-8">
            {/* Résultat du test de tous les endpoints */}
            {rawResponse.allResults && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-800 mb-4">Résultats des tests d'endpoints:</h3>
                <div className="space-y-3">
                  {rawResponse.allResults.map((result: any, index: number) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        result.success
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-sm">
                            {result.success ? '✓' : '✗'} {result.name}
                          </p>
                          <p className="text-xs text-gray-600 mt-1 font-mono break-all">
                            {result.url}
                          </p>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            result.success
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {result.status}
                        </span>
                      </div>
                      {result.error && (
                        <p className="text-xs text-red-600 mt-2">Erreur: {result.error}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Endpoint qui fonctionne */}
            {rawResponse.endpoint && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-800 mb-2">Réponse API (données):</h3>
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
                  <p className="text-sm text-green-800">
                    <strong>✓ Endpoint qui fonctionne:</strong> {rawResponse.endpoint}
                  </p>
                  <p className="text-xs text-green-600 mt-1 font-mono break-all">
                    {rawResponse.url}
                  </p>
                </div>
                <pre className="text-xs bg-white p-4 rounded overflow-auto max-h-96">
                  {JSON.stringify(rawResponse.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Calendrier visuel */}
        {calendarData.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
            <h2 className="text-xl font-bold text-slate mb-4">
              Calendrier ({calendarData.length} jours)
            </h2>
            <div className="grid grid-cols-7 gap-2">
              {calendarData.map((day, index) => {
                const isAvailable = day.available !== false && day.status !== 'booked';
                return (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border text-center ${
                      isAvailable
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="text-xs font-medium">
                      {new Date(day.date).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </div>
                    <div className="text-xs mt-1">
                      {isAvailable ? (
                        <span className="text-green-700">✓ Dispo</span>
                      ) : (
                        <span className="text-red-700">✗ Réservé</span>
                      )}
                    </div>
                    {day.price && (
                      <div className="text-xs font-bold text-gold mt-1">{day.price}€</div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Légende */}
            <div className="mt-6 flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
                <span className="text-taupe">Disponible</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-50 border border-red-200 rounded"></div>
                <span className="text-taupe">Réservé</span>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && calendarData.length === 0 && rawResponse && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <p className="text-yellow-800">
              L'API a répondu mais aucune donnée de calendrier n'a été trouvée.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
