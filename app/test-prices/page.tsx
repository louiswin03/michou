'use client';

import { useState } from 'react';

export default function TestPricesPage() {
  const [startDate, setStartDate] = useState('2026-03-27');
  const [endDate, setEndDate] = useState('2026-04-03');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [priceData, setPriceData] = useState<any>(null);

  const fetchPrices = async () => {
    setLoading(true);
    setError(null);
    setPriceData(null);

    try {
      const propertyId = 752397;

      console.log('[Test Prices] Fetching prices for:', { propertyId, startDate, endDate });

      const response = await fetch(
        `/api/test-prices?propertyId=${propertyId}&start=${startDate}&end=${endDate}`
      );

      const result = await response.json();

      console.log('[Test Prices] API response:', result);

      if (result.success) {
        setPriceData(result.data);
      } else {
        console.error('[Test Prices] Error details:', result);
        const errorMsg = result.error
          ? `${result.message} - ${result.error}`
          : result.message || 'Failed to fetch prices';
        throw new Error(errorMsg);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate mb-8">Test API Lodgify - Prix</h1>

        {/* Formulaire */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-border mb-8">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate mb-2">
                Date de début
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate mb-2">
                Date de fin
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg"
              />
            </div>
          </div>

          <button
            onClick={fetchPrices}
            disabled={loading}
            className="w-full bg-gold text-white px-6 py-3 rounded-lg font-semibold hover:bg-gold/90 disabled:opacity-50"
          >
            {loading ? 'Chargement...' : 'Récupérer les prix'}
          </button>
        </div>

        {/* Erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <h2 className="text-red-800 font-bold mb-2">Erreur</h2>
            <p className="text-red-600 text-sm">{error}</p>
            <p className="text-xs text-red-500 mt-2">Vérifiez la console du navigateur (F12) pour plus de détails</p>
          </div>
        )}

        {/* Données brutes */}
        {priceData && (
          <div className="space-y-4">
            {/* Résumé */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
              <h2 className="text-xl font-bold text-slate mb-4">Résumé</h2>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Devise:</span>{' '}
                  {priceData.rate_settings?.currency_code || 'N/A'}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Nombre de jours:</span>{' '}
                  {priceData.calendar_items?.length || 0}
                </p>
                <p className="text-sm">
                  <span className="font-medium">TVA:</span>{' '}
                  {priceData.rate_settings?.vat || 0}%
                </p>
              </div>
            </div>

            {/* Calendrier des prix */}
            {priceData.calendar_items && priceData.calendar_items.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
                <h2 className="text-xl font-bold text-slate mb-4">
                  Prix par jour ({priceData.calendar_items.length} jours)
                </h2>
                <div className="space-y-2">
                  {priceData.calendar_items.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm font-medium">{item.date}</span>
                      <div className="flex items-center gap-4">
                        {item.prices && item.prices.length > 0 && item.prices[0].price_per_day && (
                          <span className="text-sm text-gold font-bold">
                            {item.prices[0].price_per_day.amount || 'N/A'}{' '}
                            {priceData.rate_settings?.currency_code || 'EUR'}
                          </span>
                        )}
                        {item.is_default && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Défaut
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Taxes et frais */}
            {priceData.rate_settings && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
                <h2 className="text-xl font-bold text-slate mb-4">Taxes et Frais</h2>

                {/* Taxes */}
                {priceData.rate_settings.taxes && priceData.rate_settings.taxes.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-slate mb-2">Taxes</h3>
                    <div className="space-y-2">
                      {priceData.rate_settings.taxes.map((tax: any, index: number) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{tax.tax_name}</span>
                            <span className="text-sm text-gold">
                              {tax.price?.rate_type === 'Percentage'
                                ? `${tax.price.percentage}%`
                                : `${tax.price?.amount || 0} ${priceData.rate_settings.currency_code}`}
                            </span>
                          </div>
                          <div className="text-xs text-taupe mt-1">
                            Type: {tax.tax_type} • Fréquence: {tax.frequency}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Frais */}
                {priceData.rate_settings.fees && priceData.rate_settings.fees.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-slate mb-2">Frais</h3>
                    <div className="space-y-2">
                      {priceData.rate_settings.fees.map((fee: any, index: number) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{fee.fee_name}</span>
                            <span className="text-sm text-gold">
                              {fee.price?.rate_type === 'Percentage'
                                ? `${fee.price.percentage}%`
                                : `${fee.price?.amount || 0} ${priceData.rate_settings.currency_code}`}
                            </span>
                          </div>
                          <div className="text-xs text-taupe mt-1">
                            Type: {fee.fee_type} • Fréquence: {fee.frequency}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* JSON brut */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
              <h2 className="text-xl font-bold text-slate mb-4">Données brutes (JSON)</h2>
              <pre className="text-xs bg-gray-50 p-4 rounded overflow-auto max-h-96">
                {JSON.stringify(priceData, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
