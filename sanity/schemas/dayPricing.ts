import { defineType } from 'sanity'

export default defineType({
  name: 'dayPricing',
  title: '📅 Prix par Jour',
  type: 'document',
  description: '🎯 Définissez le prix et la disponibilité pour des jours spécifiques (prioritaire sur les périodes)',
  fields: [
    {
      name: 'date',
      title: '📅 Date',
      type: 'date',
      validation: Rule => Rule.required(),
      options: {
        dateFormat: 'DD/MM/YYYY',
      },
      description: '📆 Jour spécifique à configurer',
    },
    {
      name: 'pricePerNight',
      title: '💶 Prix pour cette nuit',
      type: 'number',
      validation: Rule => Rule.min(0).max(2000),
      description: '💰 Prix en euros pour cette date spécifique (laissez vide pour utiliser le prix de période)',
      placeholder: 'Ex: 180',
    },
    {
      name: 'minimumNights',
      title: '🌙 Nuits minimum si réservation ce jour',
      type: 'number',
      validation: Rule => Rule.min(1).max(30),
      description: '⏰ Nuits minimum si la réservation commence ce jour (laissez vide pour utiliser la règle par défaut)',
      placeholder: '2',
    },
    {
      name: 'isAvailable',
      title: '✅ Disponible',
      type: 'boolean',
      initialValue: true,
      description: '🔓 Cochez pour disponible / Décochez pour bloquer ce jour',
    },
    {
      name: 'blockReason',
      title: '🏷️ Raison du blocage',
      type: 'string',
      hidden: ({ parent }) => parent?.isAvailable !== false,
      options: {
        list: [
          { title: '📅 Réservé', value: 'booking' },
          { title: '🔧 Maintenance', value: 'maintenance' },
          { title: '👤 Usage personnel', value: 'personal' },
          { title: '🚫 Autre', value: 'other' },
        ],
      },
      description: 'Pourquoi ce jour est bloqué ?',
    },
    {
      name: 'comment',
      title: '💬 Commentaire',
      type: 'text',
      rows: 2,
      description: '📝 Note privée pour ce jour',
      placeholder: 'Ex: Client VIP, check-in tardif...',
    },
    {
      name: 'highlightColor',
      title: '🎨 Couleur de surbrillance',
      type: 'string',
      options: {
        list: [
          { title: 'Aucune', value: 'none' },
          { title: '🟢 Vert (Prix bas)', value: 'green' },
          { title: '🟡 Jaune (Attention)', value: 'yellow' },
          { title: '🟠 Orange (Prix élevé)', value: 'orange' },
          { title: '🔴 Rouge (Bloqué/Premium)', value: 'red' },
          { title: '🔵 Bleu (Info)', value: 'blue' },
          { title: '🟣 Violet (VIP)', value: 'purple' },
        ],
      },
      initialValue: 'none',
      description: 'Couleur pour repérer facilement ce jour dans le calendrier',
    },
  ],
  preview: {
    select: {
      date: 'date',
      price: 'pricePerNight',
      isAvailable: 'isAvailable',
      comment: 'comment',
      color: 'highlightColor',
      blockReason: 'blockReason',
    },
    prepare({ date, price, isAvailable, comment, color, blockReason }) {
      // Safe date parsing to avoid timezone offsets
      const parts = date ? date.split('-') : []
      const formattedDate = parts.length === 3
        ? new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])).toLocaleDateString('fr-FR', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
        : 'Date invalide'

      const colorEmojis = {
        none: '',
        green: '🟢',
        yellow: '🟡',
        orange: '🟠',
        red: '🔴',
        blue: '🔵',
        purple: '🟣',
      }

      const statusEmoji = isAvailable ? '✅' : '🔒'
      const colorEmoji = colorEmojis[color as keyof typeof colorEmojis] || ''

      const reasonLabels = {
        booking: '📅',
        maintenance: '🔧',
        personal: '👤',
        other: '🚫',
      }
      const reasonEmoji = !isAvailable && blockReason
        ? reasonLabels[blockReason as keyof typeof reasonLabels]
        : ''

      let subtitle = ''
      if (price) {
        subtitle = `${price}€/nuit`
      }
      if (comment) {
        subtitle += subtitle ? ` | ${comment}` : comment
      }
      if (!isAvailable && !subtitle) {
        subtitle = 'Bloqué'
      }

      return {
        title: `${statusEmoji} ${colorEmoji} ${reasonEmoji} ${formattedDate}`,
        subtitle: subtitle || 'Utilise le prix de période',
      }
    },
  },
  orderings: [
    {
      title: 'Date (récent → ancien)',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
    {
      title: 'Date (ancien → récent)',
      name: 'dateAsc',
      by: [{ field: 'date', direction: 'asc' }],
    },
  ],
})
