import { defineType } from 'sanity'

export default defineType({
  name: 'blockedDate',
  title: '🚫 Dates Bloquées',
  type: 'document',
  description: '🔒 Bloquez des dates pour réservations, maintenance ou usage personnel',
  fields: [
    {
      name: 'startDate',
      title: 'Date de début',
      type: 'date',
      validation: Rule => Rule.required(),
      options: {
        dateFormat: 'DD/MM/YYYY',
      },
    },
    {
      name: 'endDate',
      title: 'Date de fin',
      type: 'date',
      validation: Rule => Rule.required().min(Rule.valueOfField('startDate')),
      options: {
        dateFormat: 'DD/MM/YYYY',
      },
    },
    {
      name: 'reason',
      title: 'Raison',
      type: 'string',
      options: {
        list: [
          { title: '📅 Réservation confirmée', value: 'booking' },
          { title: '🔧 Maintenance', value: 'maintenance' },
          { title: '👤 Usage personnel', value: 'personal' },
          { title: '🚫 Bloqué manuellement', value: 'blocked' },
        ],
      },
      validation: Rule => Rule.required(),
      initialValue: 'blocked',
    },
    {
      name: 'comment',
      title: 'Commentaire',
      type: 'text',
      rows: 3,
      description: 'Détails ou notes sur cette période bloquée',
    },
    {
      name: 'color',
      title: 'Couleur d\'affichage',
      type: 'string',
      options: {
        list: [
          { title: '🔴 Rouge (Réservé)', value: 'red' },
          { title: '🟠 Orange (Maintenance)', value: 'orange' },
          { title: '🟡 Jaune (Attention)', value: 'yellow' },
          { title: '⚫ Gris (Bloqué)', value: 'gray' },
        ],
      },
      initialValue: 'red',
    },
    {
      name: 'isActive',
      title: 'Actif',
      type: 'boolean',
      initialValue: true,
      description: 'Désactiver temporairement ce blocage sans le supprimer',
    },
  ],
  preview: {
    select: {
      startDate: 'startDate',
      endDate: 'endDate',
      reason: 'reason',
      comment: 'comment',
      isActive: 'isActive',
    },
    prepare({ startDate, endDate, reason, comment, isActive }) {
      const getSafeDate = (d: string) => {
        if (!d) return '?'
        const p = d.split('-')
        return new Date(parseInt(p[0]), parseInt(p[1]) - 1, parseInt(p[2])).toLocaleDateString('fr-FR')
      }
      const start = getSafeDate(startDate)
      const end = getSafeDate(endDate)
      const status = isActive ? '✅' : '❌'
      const reasonLabels = {
        booking: '📅 Réservation',
        maintenance: '🔧 Maintenance',
        personal: '👤 Personnel',
        blocked: '🚫 Bloqué',
      }
      return {
        title: `${status} ${start} → ${end}`,
        subtitle: `${reasonLabels[reason as keyof typeof reasonLabels]} ${comment ? `| ${comment}` : ''}`,
      }
    },
  },
  orderings: [
    {
      title: 'Date de début',
      name: 'startDateDesc',
      by: [{ field: 'startDate', direction: 'desc' }],
    },
  ],
})
