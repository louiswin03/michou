# 📅 Système de Calendrier Sanity

## 🎯 Vue d'ensemble

Votre site utilise maintenant **Sanity CMS** pour gérer tout le calendrier de réservations, au lieu de Lodgify. C'est comme le système d'Airbnb, mais entièrement sous votre contrôle.

---

## 📂 Structure dans Sanity Studio

Accessible sur : **http://localhost:3000/studio**

```
📅 Calendrier & Réservations
├── 💰 Périodes de Prix
│   └── Définir les tarifs par période (haute saison, etc.)
├── 🚫 Dates Bloquées
│   └── Bloquer des dates (réservations, maintenance, etc.)
└── ⚙️ Paramètres de Réservation
    └── Configuration globale (prix par défaut, arrhes, etc.)
```

---

## 💰 Périodes de Prix

### Comment ça marche ?

Pour chaque période, vous définissez :

| Champ | Description | Exemple |
|-------|-------------|---------|
| 📝 Nom | Nom de la période | "Été 2025" |
| 📅 Date début | Premier jour | 01/07/2025 |
| 📅 Date fin | Dernier jour | 31/08/2025 |
| 💶 Prix/nuit | Prix en euros | 220€ |
| 🌙 Nuits min | Séjour minimum | 7 nuits |
| ✅ Disponible | Ouvert à la résa | Oui/Non |
| 💬 Commentaire | Notes privées | "Réduction si >14j" |
| 🔄 Active | Activer/Désactiver | Oui/Non |

### Exemple d'utilisation

**Haute saison été :**
- Du 01/07/2025 au 31/08/2025
- 220€/nuit
- 7 nuits minimum
- ✅ Disponible
- 💬 "Pics de demande en août"

**Basse saison hiver :**
- Du 01/11/2025 au 31/03/2026
- 120€/nuit
- 2 nuits minimum
- ✅ Disponible
- 💬 "Possibilité séjours longs"

### 🎨 Aperçu visuel

Dans Sanity, vous verrez :
```
✅ Été 2025
01/07/2025 → 31/08/2025 | 220€/nuit | 7 nuits min | Dispo

✅ Hiver 2025-2026
01/11/2025 → 31/03/2026 | 120€/nuit | 2 nuits min | Dispo

🔒 Période de maintenance
15/04/2025 → 30/04/2025 | 150€/nuit | 2 nuits min | Bloqué
```

---

## 🚫 Dates Bloquées

### Quand utiliser ?

- ✅ **Réservation confirmée** (booking)
- 🔧 **Maintenance** (travaux, réparations)
- 👤 **Usage personnel** (vous utilisez le logement)
- 🚫 **Bloqué manuellement** (autre raison)

### Champs disponibles

| Champ | Description | Exemple |
|-------|-------------|---------|
| 📅 Date début | Première date bloquée | 15/08/2025 |
| 📅 Date fin | Dernière date bloquée | 22/08/2025 |
| 🏷️ Raison | Type de blocage | Réservation |
| 💬 Commentaire | Détails | "Mr. Dupont - confirmé" |
| 🎨 Couleur | Visuel | Rouge (Réservé) |
| 🔄 Actif | Activer/Désactiver | Oui |

### Exemple

**Réservation client :**
- Du 15/08/2025 au 22/08/2025
- Raison : 📅 Réservation confirmée
- 💬 "Famille Martin - Acompte payé"
- 🔴 Rouge
- ✅ Actif

---

## ⚙️ Paramètres Globaux

Configuration unique pour tout le site :

| Paramètre | Valeur par défaut | Description |
|-----------|-------------------|-------------|
| Prix par défaut | 150€ | Si aucune période définie |
| Nuits minimum | 2 | Par défaut |
| Max personnes | 6 | Limite du logement |
| Délai résa | 0 jours | Résa le jour même OK |
| Arrhes | 30% | Pourcentage à payer |
| Garantie | 500€ | Dépôt de garantie |
| Taxe séjour | 1,50€ | Par personne/nuit |
| Arrivée | 16:00 | Check-in |
| Départ | 10:00 | Check-out |

---

## 🔧 API Routes créées

### 1. GET `/api/sanity/calendar`

Récupère toutes les données du calendrier.

**Paramètres optionnels :**
- `startDate` : YYYY-MM-DD
- `endDate` : YYYY-MM-DD

**Réponse :**
```json
{
  "success": true,
  "data": {
    "pricingPeriods": [...],
    "blockedDates": [...],
    "bookingRules": {...}
  }
}
```

### 2. GET `/api/sanity/availability`

Vérifie si une période est disponible.

**Paramètres requis :**
- `startDate` : YYYY-MM-DD (arrivée)
- `endDate` : YYYY-MM-DD (départ)

**Réponse :**
```json
{
  "success": true,
  "available": true,
  "minimumNights": 2,
  "pricePerNight": 150,
  "totalNights": 7,
  "totalPrice": 1050
}
```

### 3. POST `/api/sanity/quote`

Calcule un devis détaillé.

**Body :**
```json
{
  "arrival": "2025-07-15",
  "departure": "2025-07-22",
  "adults": 2,
  "children": 1
}
```

**Réponse :**
```json
{
  "success": true,
  "quote": {
    "nights": 7,
    "pricing": {
      "accommodation": 1540,
      "touristTax": 31.5,
      "total": 1571.5,
      "deposit": 471.45,
      "balance": 1100.05
    },
    "nightsBreakdown": [...]
  }
}
```

---

## 🎣 Hooks React disponibles

### `useSanityCalendar(startDate?, endDate?)`

Récupère les données du calendrier.

```typescript
const { data, loading, error } = useSanityCalendar('2025-07-01', '2025-08-31')
```

### `useSanityAvailability(startDate, endDate)`

Vérifie la disponibilité.

```typescript
const { availability, loading, error } = useSanityAvailability(
  '2025-07-15',
  '2025-07-22'
)

// availability.available === true/false
// availability.reason === "Séjour minimum 7 nuits"
```

### `useSanityQuote()`

Calcule un devis.

```typescript
const { quote, loading, error, calculateQuote } = useSanityQuote()

await calculateQuote({
  arrival: '2025-07-15',
  departure: '2025-07-22',
  adults: 2,
  children: 1
})
```

---

## 📝 Logique de priorité

### Prix appliqué

1. Si la date est dans une **Période de Prix active** → Utiliser ce prix
2. Sinon → Utiliser le **Prix par défaut** (Paramètres Globaux)

### Nuits minimum

1. Si la date est dans une **Période de Prix** → Utiliser le minimum de cette période
2. Sinon → Utiliser le **Nuits minimum par défaut** (Paramètres Globaux)

### Disponibilité

Une période est **NON disponible** si :
- ❌ Une **Date Bloquée** active chevauche la période
- ❌ Une **Période de Prix** avec `isAvailable = false` chevauche
- ❌ Le séjour est **plus court** que le minimum requis

---

## 🚀 Pour commencer

### 1. Créer les Paramètres Globaux

1. Allez sur `/studio`
2. Cliquez sur **📅 Calendrier & Réservations**
3. Cliquez sur **⚙️ Paramètres de Réservation**
4. Remplissez les valeurs par défaut
5. Cliquez **Publish**

### 2. Créer une Période de Prix par défaut

1. **💰 Périodes de Prix** → **Create**
2. Nom : "Tarif standard 2025"
3. Dates : 01/01/2025 → 31/12/2025
4. Prix : 150€
5. Nuits min : 2
6. ✅ Disponible : Oui
7. **Publish**

### 3. Créer vos périodes spéciales

Haute saison, événements, etc.

### 4. Bloquer des dates

Réservations existantes, maintenance, etc.

---

## 💡 Astuces

### Chevauchement de périodes

Si plusieurs périodes se chevauchent :
- Le système utilise la **première trouvée** dans l'ordre de création
- **Conseil :** Ordonnez par date de début dans Sanity

### Dupliquer une période

1. Ouvrez une période existante
2. Copiez les valeurs
3. **Create** → Collez les nouvelles dates

### Vue d'ensemble rapide

Dans la liste des périodes, vous voyez immédiatement :
```
✅ = Active et disponible
🔒 = Active mais bloquée
❌ = Inactive
```

---

## 🔄 Migration depuis Lodgify

L'ancien système Lodgify est toujours présent mais **n'est plus utilisé** pour les prix.

**Lodgify est maintenant utilisé uniquement pour :**
- Synchroniser les réservations Airbnb (via iCal)

**Sanity gère maintenant :**
- ✅ Prix par période
- ✅ Disponibilités
- ✅ Nuits minimum
- ✅ Calcul des devis

---

## 📞 Support

En cas de problème :
1. Vérifiez que les **Paramètres Globaux** sont créés
2. Vérifiez que les dates sont au format `YYYY-MM-DD` dans l'API
3. Consultez la console navigateur pour les erreurs

---

Fait avec ❤️ pour Michou Bo Premium
