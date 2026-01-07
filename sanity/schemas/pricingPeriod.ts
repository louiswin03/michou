import { defineType } from 'sanity'

export default defineType({
  name: 'pricingPeriod',
  title: '💰 Périodes de Prix',
  type: 'document',
  description: '🎯 Définissez vos tarifs par période (haute saison, basse saison, événements spéciaux, etc.)',
  fields: [
    {
      name: 'name',
      title: '📝 Nom de la période',
      type: 'string',
      description: '💡 Ex: "Été 2025", "Vacances de Noël", "Week-end Pascal"',
      validation: Rule => Rule.required().min(3).max(100),
      placeholder: 'Ex: Haute saison Été 2025',
    },
    {
      name: 'startDate',
      title: '📅 Date de début',
      type: 'date',
      validation: Rule => Rule.required(),
      options: {
        dateFormat: 'DD/MM/YYYY',
      },
      description: '🗓️ Premier jour où ce tarif s\'applique',
    },
    {
      name: 'endDate',
      title: '📅 Date de fin',
      type: 'date',
      validation: Rule => Rule.required().min(Rule.valueOfField('startDate')),
      options: {
        dateFormat: 'DD/MM/YYYY',
      },
      description: '🗓️ Dernier jour où ce tarif s\'applique (inclus)',
    },
    {
      name: 'pricePerNight',
      title: '💶 Prix par nuit',
      type: 'number',
      validation: Rule => Rule.required().min(50).max(1000),
      description: '💰 Prix en euros par nuit (entre 50€ et 1000€)',
      placeholder: '150',
    },
    {
      name: 'minimumNights',
      title: '🌙 Nombre de nuits minimum',
      type: 'number',
      validation: Rule => Rule.required().min(1).max(30),
      initialValue: 2,
      description: '⏰ Séjour minimum requis pour réserver pendant cette période',
      placeholder: '2',
    },
    {
      name: 'isAvailable',
      title: '✅ Disponible à la réservation',
      type: 'boolean',
      initialValue: true,
      description: '🔓 Cochez pour autoriser les réservations / Décochez pour bloquer la période',
    },
    {
      name: 'comment',
      title: '💬 Commentaire interne',
      type: 'text',
      rows: 3,
      description: '📝 Notes privées (non visibles par les clients) - Ex: "Réduction possible si +14 jours"',
      placeholder: 'Ajoutez des notes pour vous rappeler...',
    },
    {
      name: 'isActive',
      title: '🔄 Période active',
      type: 'boolean',
      initialValue: true,
      description: '⚡ Désactivez temporairement sans supprimer',
    },
  ],
  preview: {
    select: {
      title: 'name',
      startDate: 'startDate',
      endDate: 'endDate',
      price: 'pricePerNight',
      isActive: 'isActive',
      isAvailable: 'isAvailable',
      minNights: 'minimumNights',
    },
    prepare({ title, startDate, endDate, price, isActive, isAvailable, minNights }) {
      const getSafeDate = (d: string) => {
        if (!d) return '?'
        const p = d.split('-')
        return new Date(parseInt(p[0]), parseInt(p[1]) - 1, parseInt(p[2])).toLocaleDateString('fr-FR')
      }
      const start = getSafeDate(startDate)
      const end = getSafeDate(endDate)
      const status = isActive ? (isAvailable ? '✅' : '🔒') : '❌'
      const availText = isAvailable ? 'Dispo' : 'Bloqué'
      return {
        title: `${status} ${title}`,
        subtitle: `${start} → ${end} | ${price}€/nuit | ${minNights} nuits min | ${availText}`,
      }
    },
  },
  orderings: [
    {
      title: 'Date de début',
      name: 'startDateAsc',
      by: [{ field: 'startDate', direction: 'asc' }],
    },
  ],
})
