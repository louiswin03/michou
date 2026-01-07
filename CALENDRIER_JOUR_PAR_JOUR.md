# 📅 Calendrier Jour par Jour - Guide Complet

## 🎯 Vue d'ensemble

Votre calendrier fonctionne maintenant **jour par jour** comme Airbnb ! Vous pouvez définir le prix et la disponibilité pour **chaque jour individuellement**.

---

## 🏆 Système de priorité

Le système utilise 3 niveaux de prix :

```
1️⃣ PRIX PAR JOUR (Prioritaire)
   ↓ Si pas défini
2️⃣ PRIX PAR PÉRIODE
   ↓ Si pas défini
3️⃣ PRIX PAR DÉFAUT (Paramètres)
```

### Exemple concret

```
📅 15 Juillet 2025
├─ Prix jour individuel : 250€ ✅ (UTILISÉ)
├─ Prix période "Été" : 220€
└─ Prix par défaut : 150€

📅 16 Juillet 2025
├─ Prix jour individuel : Non défini
├─ Prix période "Été" : 220€ ✅ (UTILISÉ)
└─ Prix par défaut : 150€

📅 16 Décembre 2025
├─ Prix jour individuel : Non défini
├─ Prix période : Aucune
└─ Prix par défaut : 150€ ✅ (UTILISÉ)
```

---

## 📝 Utilisation dans Sanity Studio

### Accès au calendrier jour par jour

1. Allez sur **http://localhost:3000/studio**
2. Cliquez sur **📅 Calendrier & Réservations**
3. Cliquez sur **📅 Prix par Jour**

### Créer un prix pour un jour spécifique

#### Exemple 1 : Prix spécial pour un week-end

```
📅 Date : 14/07/2025 (Fête Nationale)
💶 Prix : 280€
🌙 Nuits minimum : 2
✅ Disponible : Oui
💬 Commentaire : Weekend 14 juillet - forte demande
🎨 Couleur : 🔴 Rouge (Premium)
```

#### Exemple 2 : Bloquer un jour pour réservation

```
📅 Date : 20/08/2025
💶 Prix : (laisser vide)
🌙 Nuits minimum : (laisser vide)
✅ Disponible : Non
🏷️ Raison : 📅 Réservé
💬 Commentaire : Famille Martin - Confirmé
🎨 Couleur : 🔴 Rouge (Bloqué)
```

#### Exemple 3 : Prix réduit pour un jour creux

```
📅 Date : 12/11/2025
💶 Prix : 99€
🌙 Nuits minimum : 2
✅ Disponible : Oui
💬 Commentaire : Promotion basse saison
🎨 Couleur : 🟢 Vert (Prix bas)
```

---

## 🎨 Système de couleurs

Les couleurs vous aident à visualiser votre calendrier :

| Couleur | Utilisation | Exemple |
|---------|-------------|---------|
| 🟢 Vert | Prix bas / Promo | 99€ - Promotion |
| 🟡 Jaune | Attention / Vérifier | Check-in tardif |
| 🟠 Orange | Prix élevé | 250€ - Week-end |
| 🔴 Rouge | Bloqué / Premium | Réservé ou 300€+ |
| 🔵 Bleu | Information | Note importante |
| 🟣 Violet | VIP / Spécial | Client VIP |

---

## ⚡ Cas d'usage courants

### 1. Bloquer une semaine complète

Au lieu de créer 7 "Prix par Jour", utilisez plutôt :
- **💰 Périodes de Prix** avec `✅ Disponible : Non`

Mais si vous voulez ajouter un commentaire différent chaque jour :
- Créez 7 **📅 Prix par Jour** avec `✅ Disponible : Non`

### 2. Week-end premium tous les samedis

**Option A - Rapide (Recommandé)** :
- Créez une **💰 Période de Prix** "Samedis" avec prix élevé

**Option B - Précis** :
- Créez un **📅 Prix par Jour** pour chaque samedi avec prix spécial

### 3. Event spécial (Noël, Jour de l'An)

Créez un **📅 Prix par Jour** pour chaque jour de l'event :

```
📅 24/12/2025 → 280€ | 7 nuits min | 🔴 Rouge
📅 25/12/2025 → 300€ | 7 nuits min | 🔴 Rouge
📅 26/12/2025 → 300€ | 7 nuits min | 🔴 Rouge
📅 31/12/2025 → 350€ | 7 nuits min | 🔴 Rouge
📅 01/01/2026 → 320€ | 7 nuits min | 🔴 Rouge
```

### 4. Maintenance d'urgence

```
📅 Date : 05/03/2025
✅ Disponible : Non
🏷️ Raison : 🔧 Maintenance
💬 Commentaire : Réparation jacuzzi - Plombier 9h
```

---

## 🔍 Vue dans Sanity

Voici comment vos jours s'affichent dans la liste :

```
✅ 🔴 📅 sam. 14 juil. 2025
280€/nuit | Weekend 14 juillet - forte demande

🔒 🔴 jeu. 20 août 2025
Bloqué | Famille Martin - Confirmé

✅ 🟢 mar. 12 nov. 2025
99€/nuit | Promotion basse saison

✅ lun. 15 nov. 2025
Utilise le prix de période
```

Légende :
- ✅ = Disponible
- 🔒 = Bloqué
- 🔴🟢🟡... = Couleur de surbrillance
- 📅🔧👤 = Raison du blocage

---

## 💡 Workflow recommandé

### Configuration initiale (Une fois)

1. **Créez les Paramètres Globaux**
   - Prix par défaut : 150€
   - Nuits min : 2
   - Etc.

2. **Créez les grandes périodes**
   - Haute saison été : 01/07 → 31/08 (220€)
   - Basse saison hiver : 01/11 → 31/03 (120€)
   - Etc.

### Gestion quotidienne

3. **Utilisez Prix par Jour pour** :
   - ✅ Bloquer des réservations
   - ✅ Prix spéciaux (week-end, events)
   - ✅ Promotions de dernière minute
   - ✅ Notes importantes sur un jour

---

## 🚀 Fonctionnalités avancées

### Champs optionnels intelligents

**Prix par nuit** :
- Laissez vide → Utilise le prix de période ou défaut
- Définissez → Override le prix pour ce jour

**Nuits minimum** :
- Laissez vide → Utilise la règle de période ou défaut
- Définissez → Override pour ce jour de départ

**Exemple** :
```
📅 14/07/2025
💶 Prix : 280€ (défini)
🌙 Nuits min : (vide) → Utilisera celui de la période "Été" (7 nuits)

📅 15/07/2025
💶 Prix : (vide) → Utilisera celui de la période "Été" (220€)
🌙 Nuits min : 3 (défini) → Override pour cette date
```

### Raison de blocage

Le champ **🏷️ Raison du blocage** n'apparaît que si `✅ Disponible = Non` :

- 📅 Réservé
- 🔧 Maintenance
- 👤 Usage personnel
- 🚫 Autre

### Commentaires intelligents

Les commentaires sont **privés** (non visibles par les clients) :

**Bonnes pratiques** :
```
✅ "Client VIP - Bouteille de bienvenue préparée"
✅ "Check-in 20h au lieu de 16h"
✅ "Réduction 10% appliquée - client fidèle"
✅ "Prévoir ménage renforcé après"
```

---

## 📊 Exemples de stratégies tarifaires

### Stratégie 1 : Simple

```
📅 Toute l'année
└─ Paramètres : 150€

📅 Prix par Jour (uniquement pour blocages)
└─ Réservations confirmées
```

### Stratégie 2 : Saisons

```
📅 Toute l'année : 150€ (défaut)

💰 Haute saison été : 01/07-31/08 → 220€
💰 Basse saison hiver : 01/11-31/03 → 120€

📅 Prix par Jour
└─ Week-ends premium et réservations
```

### Stratégie 3 : Yield Management (comme Airbnb)

```
📅 Défaut : 150€

💰 Grandes périodes : Été, Noël, etc.

📅 Prix par Jour - Chaque jour optimisé :
├─ Lundi-Jeudi : -20€
├─ Vendredi-Samedi : +50€
├─ Events spéciaux : +100€
└─ Last minute (J-7) : -30€
```

---

## 🔧 Dépannage

### Le prix ne change pas sur mon site

**Solution** :
1. Vérifiez que la date est bien au format YYYY-MM-DD dans Sanity
2. Publiez le document (bouton **Publish**)
3. Rafraîchissez la page du site

### Trop de jours à créer

**Solution** :
- Utilisez **💰 Périodes de Prix** pour les grandes plages
- Utilisez **📅 Prix par Jour** seulement pour les exceptions

### Je veux un vrai calendrier visuel

**Solution à venir** :
- Un plugin Sanity avec vue calendrier sera ajouté
- En attendant, triez par date dans la liste

---

## 📱 Raccourcis Sanity

- **Créer un jour** : Clic sur "📅 Prix par Jour" → **Create**
- **Dupliquer un jour** : Ouvrir → Copier les valeurs → **Create** nouveau
- **Trier par date** : Clic sur "Date" dans l'en-tête de liste
- **Chercher une date** : Utilisez la barre de recherche (format: "14/07")

---

## 🎉 Résultat

Vous avez maintenant un système **ultra-flexible** :

- 📅 **Jour par jour** comme Airbnb
- 🎨 **Couleurs** pour visualiser
- 💬 **Commentaires** pour vous rappeler
- 🏆 **Priorité intelligente** (Jour > Période > Défaut)
- ⚡ **Temps réel** sur le site

Votre client peut gérer chaque jour individuellement en quelques clics ! 🚀

---

## 📝 Checklist pour débuter

- [ ] Créer les Paramètres Globaux
- [ ] Créer une Période par défaut (toute l'année)
- [ ] Tester : Créer un Prix par Jour pour demain
- [ ] Vérifier sur le site que le prix s'affiche
- [ ] Créer vos périodes haute/basse saison
- [ ] Ajouter vos réservations existantes
- [ ] Définir les jours spéciaux (Noël, etc.)

Vous êtes prêt ! 🚀
