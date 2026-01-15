import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'pricingRule',
  title: 'Règle de Prix',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: '📛 Nom de la règle',
      type: 'string',
      description: 'Ex: Week-end, Haute saison, Semaine calme...',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pricePerNight',
      title: '💶 Prix par nuit',
      type: 'number',
      description: 'Prix en euros',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'minimumNights',
      title: '🌙 Nombre de nuits minimum',
      type: 'number',
      description: 'Nombre minimum de nuits à réserver',
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: 'isAvailable',
      title: '✅ Disponible à la réservation',
      type: 'boolean',
      description: 'Si décoché, les jours seront bloqués',
      initialValue: true,
    }),
    defineField({
      name: 'comment',
      title: '💬 Commentaire',
      type: 'string',
      description: 'Note qui apparaîtra sur le calendrier',
    }),
    defineField({
      name: 'color',
      title: '🎨 Couleur (visuel)',
      type: 'string',
      description: 'Couleur pour identifier rapidement la règle',
      options: {
        list: [
          { title: 'Orange (Jours Fériés)', value: 'orange' },
          { title: 'Bleu (Vacances)', value: 'blue' },
        ],
      },
      initialValue: 'blue',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      price: 'pricePerNight',
      minNights: 'minimumNights',
      available: 'isAvailable',
    },
    prepare(selection) {
      const { title, price, minNights, available } = selection
      return {
        title: title,
        subtitle: `${price}€/nuit • ${minNights || 'Pas de'} nuits min${available ? ' • Disponible' : ' • Bloqué'}`,
      }
    },
  },
})
