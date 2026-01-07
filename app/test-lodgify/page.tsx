'use client';

import { useEffect, useState } from 'react';

interface Property {
  id: number;
  name: string;
  type: string;
  people: number;
}

export default function TestLodgifyPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rawResponse, setRawResponse] = useState<any>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/properties');
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch properties: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        setRawResponse(data);

        // Lodgify peut retourner un objet avec une propriété contenant le tableau
        if (Array.isArray(data)) {
          setProperties(data);
        } else if (data && Array.isArray(data.items)) {
          setProperties(data.items);
        } else if (data && typeof data === 'object') {
          // Afficher la structure pour débogage
          console.log('Response structure:', data);
          setProperties([]);
        } else {
          setProperties([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-slate">Chargement des propriétés Lodgify...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h2 className="text-red-800 font-bold mb-2">Erreur</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <p className="text-sm text-red-500">
              Vérifiez que votre clé API Lodgify est correcte dans le fichier .env.local
            </p>
          </div>

          {rawResponse && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <h3 className="font-bold text-gray-800 mb-2">Réponse brute de l'API:</h3>
              <pre className="text-xs bg-white p-4 rounded overflow-auto max-h-96">
                {JSON.stringify(rawResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate mb-8">Propriétés Lodgify</h1>

        {properties.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <p className="text-taupe">Aucune propriété trouvée</p>
          </div>
        ) : (
          <div className="space-y-4">
            {properties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-xl p-6 shadow-sm border border-border"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-slate mb-2">{property.name}</h2>
                    <p className="text-taupe">
                      Type: {property.type} • Capacité: {property.people} personnes
                    </p>
                  </div>
                  <div className="bg-gold/10 px-4 py-2 rounded-lg">
                    <p className="text-xs text-gold font-medium">ID</p>
                    <p className="text-xl font-bold text-gold">{property.id}</p>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-cream rounded-lg">
                  <p className="text-sm text-taupe mb-2">
                    Ajoutez cet ID dans votre fichier <code className="bg-white px-2 py-1 rounded">.env.local</code>:
                  </p>
                  <code className="block bg-white px-3 py-2 rounded text-sm text-slate font-mono">
                    NEXT_PUBLIC_LODGIFY_PROPERTY_ID={property.id}
                  </code>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-blue-900 mb-2">Instructions</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800 text-sm">
            <li>Copiez l'ID de votre propriété ci-dessus</li>
            <li>Ajoutez-le dans le fichier .env.local</li>
            <li>Redémarrez le serveur de développement</li>
            <li>Le calculateur de devis utilisera automatiquement les prix réels de Lodgify</li>
          </ol>
        </div>

        {rawResponse && (
          <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h3 className="font-bold text-gray-800 mb-2">Réponse brute de l'API (debug):</h3>
            <pre className="text-xs bg-white p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(rawResponse, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
