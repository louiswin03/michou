import { defineType } from 'sanity'

export default defineType({
  name: 'bookingRules',
  title: '⚙️ Paramètres Globaux',
  type: 'document',
  fields: [
    {
      name: 'defaultPricePerNight',
      title: 'Prix par défaut par nuit (€)',
      type: 'number',
      validation: Rule => Rule.required().min(50).max(1000),
      initialValue: 150,
      description: 'Prix utilisé quand aucune période de prix spécifique n\'est définie',
    },
    {
      name: 'defaultMinimumNights',
      title: 'Nuits minimum par défaut',
      type: 'number',
      validation: Rule => Rule.required().min(1).max(30),
      initialValue: 2,
      description: 'Nombre minimum de nuits requis par défaut',
    },
    {
      name: 'maximumGuests',
      title: 'Nombre maximum de personnes',
      type: 'number',
      validation: Rule => Rule.required().min(1).max(20),
      initialValue: 6,
      description: 'Nombre maximum de personnes autorisées',
    },
    {
      name: 'advanceBookingDays',
      title: 'Délai minimum de réservation (jours)',
      type: 'number',
      validation: Rule => Rule.min(0).max(90),
      initialValue: 0,
      description: 'Nombre de jours à l\'avance minimum pour réserver (0 = même jour autorisé)',
    },
    {
      name: 'depositPercentage',
      title: 'Pourcentage d\'arrhes (%)',
      type: 'number',
      validation: Rule => Rule.required().min(0).max(100),
      initialValue: 30,
      description: 'Pourcentage du prix total à payer en arrhes',
    },
    {
      name: 'securityDeposit',
      title: 'Dépôt de garantie (€)',
      type: 'number',
      validation: Rule => Rule.required().min(0).max(5000),
      initialValue: 500,
      description: 'Montant du dépôt de garantie',
    },
    {
      name: 'touristTaxPerPersonPerNight',
      title: 'Taxe de séjour (€/pers/nuit)',
      type: 'number',
      validation: Rule => Rule.required().min(0).max(10),
      initialValue: 1.5,
      description: 'Montant de la taxe de séjour par personne et par nuit',
    },
    {
      name: 'cleaningFee',
      title: 'Frais de ménage (€)',
      type: 'number',
      validation: Rule => Rule.required().min(0).max(200),
      initialValue: 60,
      description: 'Frais de ménage fixes par séjour',
    },
    {
      name: 'checkInTime',
      title: 'Heure d\'arrivée',
      type: 'string',
      initialValue: '16:00',
      description: 'Heure standard d\'arrivée (format 24h)',
    },
    {
      name: 'checkOutTime',
      title: 'Heure de départ',
      type: 'string',
      initialValue: '10:00',
      description: 'Heure standard de départ (format 24h)',
    },
    {
      name: 'notes',
      title: 'Notes internes',
      type: 'text',
      rows: 5,
      description: 'Notes générales pour la gestion',
    },
  ],
  preview: {
    select: {
      defaultPrice: 'defaultPricePerNight',
      minNights: 'defaultMinimumNights',
      maxGuests: 'maximumGuests',
    },
    prepare({ defaultPrice, minNights, maxGuests }) {
      return {
        title: '⚙️ Paramètres de Réservation',
        subtitle: `${defaultPrice}€/nuit | ${minNights} nuits min | ${maxGuests} pers max`,
      }
    },
  },
})
