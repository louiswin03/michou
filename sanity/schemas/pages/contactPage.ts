import { defineType } from 'sanity'

export default defineType({
  name: 'contactPage',
  title: '📞 Page Contact',
  type: 'document',
  fields: [
    {
      name: 'hero',
      title: 'Section Hero',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Titre',
          type: 'string',
          validation: Rule => Rule.required(),
        },
        {
          name: 'subtitle',
          title: 'Sous-titre',
          type: 'text',
          rows: 2,
        },
      ],
    },
    {
      name: 'contactInfo',
      title: 'Informations de Contact',
      type: 'object',
      fields: [
        {
          name: 'address',
          title: 'Adresse',
          type: 'text',
          rows: 2,
        },
        {
          name: 'phone',
          title: 'Téléphone',
          type: 'string',
        },
        {
          name: 'email',
          title: 'Email',
          type: 'string',
        },
        {
          name: 'hours',
          title: 'Horaires',
          type: 'text',
          rows: 3,
        },
      ],
    },
    {
      name: 'map',
      title: 'Carte Google Maps',
      type: 'object',
      fields: [
        {
          name: 'embedUrl',
          title: 'URL d\'intégration Google Maps',
          type: 'url',
        },
        {
          name: 'latitude',
          title: 'Latitude',
          type: 'number',
        },
        {
          name: 'longitude',
          title: 'Longitude',
          type: 'number',
        },
      ],
    },
    {
      name: 'access',
      title: 'Section Accès',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Titre',
          type: 'string',
        },
        {
          name: 'carDirections',
          title: 'Directions en voiture',
          type: 'text',
          rows: 4,
        },
        {
          name: 'publicTransport',
          title: 'Transports en commun',
          type: 'text',
          rows: 4,
        },
      ],
    },
    {
      name: 'faq',
      title: 'FAQ',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'question',
              title: 'Question',
              type: 'string',
            },
            {
              name: 'answer',
              title: 'Réponse',
              type: 'text',
              rows: 3,
            },
          ],
          preview: {
            select: {
              title: 'question',
            },
          },
        },
      ],
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          title: 'Titre Meta',
          type: 'string',
        },
        {
          name: 'metaDescription',
          title: 'Description Meta',
          type: 'text',
          rows: 2,
        },
      ],
    },
  ],
  preview: {
    prepare() {
      return {
        title: '📞 Page Contact',
      }
    },
  },
})
