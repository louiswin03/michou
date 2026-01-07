# 🔄 Migration Lodgify → Sanity

## ✅ Ce qui a été modifié

Le **calculateur de prix** (`components/quote-calculator.tsx`) utilise maintenant **Sanity** au lieu de Lodgify.

---

## 📋 Changements détaillés

### Avant (Lodgify)

```typescript
// Ancien code - Lodgify
import { useBlockedDates } from "@/hooks/useLodgify"
import { calculatePrice } from "@/config/pricing"

const { blockedDates } = useBlockedDates(PROPERTY_ID, 12)
const pricing = calculatePrice(checkIn, checkOut, adults, children)
```

**Problèmes :**
- ❌ Prix codés en dur (150€/nuit)
- ❌ Pas de gestion des périodes de prix
- ❌ Pas de nuits minimum dynamiques
- ❌ Lodgify utilisé uniquement pour les dates bloquées

### Après (Sanity)

```typescript
// Nouveau code - Sanity
import { useSanityAvailability, useSanityQuote } from "@/hooks/useSanityCalendar"

const { availability, loading: availabilityLoading } = useSanityAvailability(checkIn, checkOut)
const { quote: sanityQuote, calculateQuote } = useSanityQuote()

useEffect(() => {
  if (checkIn && checkOut && adults >= 1) {
    calculateQuote({ arrival: checkIn, departure: checkOut, adults, children })
  }
}, [checkIn, checkOut, adults, children, calculateQuote])
```

**Avantages :**
- ✅ Prix dynamiques par période depuis Sanity
- ✅ Nuits minimum configurables par période
- ✅ Disponibilité gérée via Sanity
- ✅ Messages d'erreur personnalisés
- ✅ Calcul automatique des arrhes depuis Sanity

---

## 🎯 Fonctionnalités ajoutées

### 1. **Loading state**

Quand l'utilisateur sélectionne des dates, un message de chargement s'affiche :

```
🔄 Vérification en cours...
Nous vérifions la disponibilité et calculons votre devis.
```

### 2. **Messages d'erreur intelligents**

Les messages proviennent directement de Sanity :

```
❌ Dates non disponibles
Séjour minimum de 7 nuits requis pour cette période

❌ Dates non disponibles
Certaines dates sont déjà réservées ou bloquées
```

### 3. **Prix en temps réel**

Le prix affiché correspond **exactement** à ce que vous avez configuré dans Sanity :
- Prix par nuit selon la période
- Taxe de séjour (configurable)
- Arrhes (configurable, 30% par défaut)
- Dépôt de garantie (configurable, 500€ par défaut)

---

## 🔧 Ce qui reste de Lodgify

**Lodgify est toujours actif** mais **n'est plus utilisé** pour :
- ❌ Les prix (maintenant Sanity)
- ❌ Les disponibilités (maintenant Sanity)
- ❌ Les nuits minimum (maintenant Sanity)

**Lodgify peut être utilisé pour** :
- ✅ Synchroniser les réservations Airbnb (via iCal)
- ✅ Import automatique des réservations dans Sanity

---

## 📝 Étapes pour finaliser la migration

### Étape 1 : Créer les données de base dans Sanity

Allez sur **http://localhost:3000/studio** et créez :

#### 1.1 Paramètres de Réservation

`📅 Calendrier & Réservations` → `⚙️ Paramètres de Réservation` → **Create**

```
Prix par défaut : 150€
Nuits minimum : 2
Max personnes : 6
Arrhes : 30%
Garantie : 500€
Taxe séjour : 1,50€
Arrivée : 16:00
Départ : 10:00
```

Cliquez **Publish**

#### 1.2 Période de prix par défaut

`📅 Calendrier & Réservations` → `💰 Périodes de Prix` → **Create**

```
Nom : Tarif standard 2025
Du : 01/01/2025
Au : 31/12/2025
Prix : 150€
Nuits min : 2
✅ Disponible : Oui
🔄 Active : Oui
```

Cliquez **Publish**

#### 1.3 Créer vos périodes spéciales

Exemple - Haute saison été :

```
Nom : Haute saison Été 2025
Du : 01/07/2025
Au : 31/08/2025
Prix : 220€
Nuits min : 7
✅ Disponible : Oui
💬 Commentaire : Forte demande
```

Exemple - Semaine de Noël :

```
Nom : Semaine de Noël
Du : 22/12/2025
Au : 02/01/2026
Prix : 280€
Nuits min : 7
✅ Disponible : Oui
💬 Commentaire : Tarif premium
```

### Étape 2 : Bloquer les réservations existantes

`📅 Calendrier & Réservations` → `🚫 Dates Bloquées` → **Create**

Pour chaque réservation existante :

```
Du : [Date arrivée]
Au : [Date départ]
Raison : 📅 Réservation confirmée
💬 Commentaire : Nom du client
Couleur : 🔴 Rouge
✅ Actif : Oui
```

### Étape 3 : Tester le calculateur

1. Allez sur **http://localhost:3000/contact**
2. Scrollez jusqu'au calculateur
3. Sélectionnez des dates de test
4. Vérifiez que :
   - ✅ Le prix affiché correspond à Sanity
   - ✅ Les dates bloquées sont rejetées
   - ✅ Les nuits minimum sont respectées
   - ✅ Le devis final est correct

---

## 🐛 Dépannage

### Problème : "Failed to fetch calendar data"

**Solution :**
- Vérifiez que les **Paramètres de Réservation** sont créés dans Sanity
- Vérifiez que la variable `SANITY_API_TOKEN` est dans `.env.local`

### Problème : Prix à 0€

**Solution :**
- Créez au moins **une période de prix** dans Sanity
- Ou créez les **Paramètres de Réservation** avec un prix par défaut

### Problème : Toutes les dates sont bloquées

**Solution :**
- Vérifiez dans Sanity → `🚫 Dates Bloquées`
- Désactivez (`✅ Actif : Non`) ou supprimez les dates en trop

### Problème : Le calculateur charge indéfiniment

**Solution :**
1. Ouvrez la console navigateur (F12)
2. Regardez les erreurs
3. Vérifiez que l'API Sanity répond :
   ```
   http://localhost:3000/api/sanity/calendar
   ```

---

## 📊 Comparaison avant/après

| Fonctionnalité | Lodgify (Avant) | Sanity (Maintenant) |
|----------------|-----------------|---------------------|
| Prix par nuit | ❌ Fixe 150€ | ✅ Dynamique par période |
| Nuits minimum | ❌ Fixe 2 nuits | ✅ Par période |
| Gestion dates | ✅ API Lodgify | ✅ Interface Sanity |
| Modification | ❌ Code | ✅ Interface visuelle |
| Commentaires | ❌ Non | ✅ Oui |
| Historique | ❌ Non | ✅ Oui (Sanity) |
| Temps réel | ⚠️ Cache | ✅ Immédiat |

---

## 🎉 Résultat

Vous avez maintenant un système **complet et professionnel** de gestion de calendrier :

- 🎨 **Interface moderne** dans Sanity Studio
- 💰 **Prix dynamiques** par période
- 🚫 **Gestion des disponibilités** intuitive
- 💬 **Commentaires internes** pour vous rappeler des choses
- 📊 **Calculs automatiques** (arrhes, taxes, etc.)
- ⚡ **Temps réel** - changements instantanés

---

Votre client peut maintenant gérer **tout le calendrier lui-même** sans toucher au code ! 🚀
