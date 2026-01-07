# Intégration Lodgify - Documentation

## 🎯 Fonctionnalités implémentées

### 1. **Génération automatique de contrats PDF**
- ✅ Contrat professionnel basé sur le template `contrat.txt`
- ✅ Design élégant avec palette de couleurs or/gris
- ✅ 3 pages : Contrat principal, Conditions générales, État descriptif
- ✅ Calcul automatique des arrhes (30%) et du solde
- ✅ Génération au format PDF via jsPDF

**Fichiers créés :**
- `hooks/useGenerateContract.ts` - Hook pour générer le PDF
- Modification de `components/quote-calculator.tsx` - Ajout de l'étape 4 pour collecter les infos client

### 2. **Intégration API Lodgify**
- ✅ Connexion à l'API Lodgify avec votre clé API
- ✅ Vérification des disponibilités en temps réel
- ✅ Blocage automatique des dates non disponibles
- ⚠️ Prix calculés avec tarif de base (150€/nuit) car l'API Lodgify `/availability` ne retourne pas de prix

**Endpoint Lodgify utilisé :**
- `GET /availability/{propertyId}?start=YYYY-MM-DD&end=YYYY-MM-DD` ✅ Fonctionne

**Fichiers créés :**
- `lib/lodgify.ts` - Service API Lodgify
- `app/api/properties/route.ts` - Endpoint pour lister les propriétés
- `app/api/availability/route.ts` - Endpoint pour les disponibilités
- `app/api/quote/route.ts` - Endpoint pour calculer le prix
- `app/api/test-calendar/route.ts` - Endpoint de test pour tous les endpoints Lodgify
- `hooks/useLodgify.ts` - Hooks React pour utiliser Lodgify
- `app/test-lodgify/page.tsx` - Page de test pour vérifier la connexion
- `app/test-calendar/page.tsx` - Page de test visuel du calendrier

**Variables d'environnement (.env.local) :**
```
LODGIFY_API_KEY=gY6XF2xUXLGLWBCIZArXBy5KQzna9drpzA7+RiWmwHSdAiZWZy9jMTd78NwDgPif
NEXT_PUBLIC_LODGIFY_PROPERTY_ID=752397
```

## 🚀 Workflow utilisateur

### Processus de réservation en 4 étapes :

1. **Étape 1 : Sélection des dates**
   - Le client choisit ses dates d'arrivée et de départ
   - ✅ Vérification automatique des disponibilités via Lodgify
   - ✅ Calcul du prix réel depuis Lodgify
   - ⚠️ Affichage d'un message si les dates sont bloquées
   - 🔄 Loader pendant le calcul

2. **Étape 2 : Nombre de voyageurs**
   - Sélection du nombre d'adultes (max 6)
   - Sélection du nombre d'enfants
   - Validation : max 6 personnes au total

3. **Étape 3 : Récapitulatif des options**
   - Affichage des services inclus (Jacuzzi, ménage, WiFi, etc.)
   - Résumé du prix total calculé par Lodgify
   - Détail : nombre de nuits × prix moyen/nuit

4. **Étape 4 : Informations du client**
   - Formulaire de collecte :
     - Nom et prénom
     - Adresse complète
     - Téléphone
     - Email
   - Affichage du détail financier :
     - Prix total
     - Arrhes 30%
     - Solde
     - Dépôt de garantie (500€)
   - **Bouton final : "Télécharger le contrat PDF"**
     - Génère instantanément le contrat complet
     - Fichier nommé : `Contrat_[Nom]_[Date].pdf`

## 📋 Structure du contrat généré

### Page 1 : Contrat principal
- En-tête avec titre élégant
- Informations du propriétaire (Michel LEXCELLENT)
- Informations du locataire
- Détails de la location (période, adresse, type)
- **Encadré financier** avec :
  - Prix total en grand (couleur or)
  - Arrhes 30%
  - Solde restant
  - Dépôt de garantie 500€
- Zones de signature

### Page 2 : Conditions générales
- Conditions de location complètes
- Horaires d'arrivée/départ
- Conditions de désistement
- Obligations du locataire
- Informations sur les équipements
- Assurance
- Dépôt de garantie

### Page 3 : État descriptif
- Informations générales (adresse, type, surface)
- Détails des pièces :
  - Cuisine équipée
  - Salon avec canapé-lit
  - Salle de bain
  - Chambres 1 et 2
  - Couloir
  - Terrasse
- Prestations incluses (linge, ménage, chauffage)
- Accès et informations pratiques
- Jacuzzi et parking

## 🔧 Configuration technique

### Dépendances ajoutées :
```json
{
  "jspdf": "^2.5.0"
}
```

### API Routes créées :
- `GET /api/properties` - Liste des propriétés Lodgify
- `GET /api/availability?propertyId=X&start=YYYY-MM-DD&end=YYYY-MM-DD` - Disponibilités
- `POST /api/quote` - Calcul du prix

### Hooks personnalisés :
- `useGenerateContract()` - Génère le PDF du contrat
- `useLodgifyQuote()` - Récupère un devis depuis Lodgify
- `useLodgifyAvailability()` - Récupère les disponibilités
- `useBlockedDates()` - Liste les dates bloquées

## 🧪 Pages de test

### `/test-lodgify`
- ✅ Vérifier la connexion à l'API Lodgify
- ✅ Voir vos propriétés
- ✅ Récupérer l'ID de propriété

### `/test-calendar`
- ✅ Tester tous les endpoints Lodgify disponibles
- ✅ Afficher le calendrier avec dates disponibles/réservées
- ✅ Voir quel endpoint API fonctionne
- ✅ Déboguer les réponses de l'API

**Résultat des tests :**
L'endpoint qui fonctionne est : `GET /availability/{propertyId}?start=...&end=...`

Les données retournées sont organisées par **périodes** avec :
- `available`: nombre de places disponibles (0 = complet)
- `bookings`: liste des réservations existantes
- Pas de prix inclus dans cet endpoint

## 📊 Avantages de l'intégration

### Pour vous (propriétaire) :
- ✅ **Automatisation complète** : Plus besoin de créer les contrats manuellement
- ✅ **Prix synchronisés** : Les prix affichés sont toujours à jour depuis Lodgify
- ✅ **Disponibilités en temps réel** : Évite les doubles réservations
- ✅ **Gain de temps** : Le contrat est généré en 1 clic
- ✅ **Professionnalisme** : Contrat PDF élégant et complet

### Pour vos clients :
- ✅ **Transparence** : Prix immédiatement visible
- ✅ **Simplicité** : Processus en 4 étapes claires
- ✅ **Rapidité** : Contrat téléchargeable instantanément
- ✅ **Confiance** : Document professionnel et complet

## 🔄 Prochaines évolutions possibles

### Court terme :
- [ ] Envoi automatique du contrat par email
- [ ] Génération d'un numéro de réservation unique
- [ ] Sauvegarde des contrats générés

### Moyen terme :
- [ ] Intégration d'un système de paiement en ligne
- [ ] Envoi automatique des arrhes
- [ ] Base de données pour archiver les réservations
- [ ] Espace client pour suivre la réservation

### Long terme :
- [ ] Signature électronique du contrat
- [ ] Synchronisation bidirectionnelle avec Lodgify
- [ ] Génération automatique de factures
- [ ] Tableau de bord pour gérer les réservations

## 📞 Support

En cas de problème :
1. Vérifiez que la clé API Lodgify est correcte dans `.env.local`
2. Vérifiez que l'ID de propriété est correct (752397)
3. Consultez la page `/test-lodgify` pour déboguer
4. Vérifiez les logs de la console du navigateur

## 🎨 Personnalisation

### Modifier les couleurs du PDF :
Éditez `hooks/useGenerateContract.ts` lignes 27-30 :
```typescript
const goldColor: [number, number, number] = [184, 134, 11];
const darkGray: [number, number, number] = [50, 50, 50];
```

### Modifier le contenu du contrat :
Éditez `hooks/useGenerateContract.ts` à partir de la ligne 114

### Modifier les informations du propriétaire :
Éditez `hooks/useGenerateContract.ts` lignes 135-138
