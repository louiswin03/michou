import { defineType } from 'sanity'

export default defineType({
  name: 'homePage',
  title: '🏠 Page d\'Accueil',
  type: 'document',
  fields: [
    {
      name: 'hero',
      title: 'Section Hero (Haut de page)',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Titre principal',
          type: 'string',
          validation: Rule => Rule.required(),
        },
        {
          name: 'subtitle',
          title: 'Sous-titre',
          type: 'text',
          rows: 2,
        },
        {
          name: 'ctaText',
          title: 'Texte du bouton',
          type: 'string',
        },
        {
          name: 'backgroundImage',
          title: 'Image de fond',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    },
    {
      name: 'about',
      title: 'Section À Propos',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Titre',
          type: 'string',
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 5,
        },
        {
          name: 'image',
          title: 'Image',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    },
    {
      name: 'features',
      title: 'Caractéristiques',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'icon',
              title: 'Icône (emoji)',
              type: 'string',
            },
            {
              name: 'title',
              title: 'Titre',
              type: 'string',
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2,
            },
          ],
          preview: {
            select: {
              title: 'title',
              icon: 'icon',
            },
            prepare({ title, icon }) {
              return {
                title: `${icon} ${title}`,
              }
            },
          },
        },
      ],
    },
    {
      name: 'gallery',
      title: 'Galerie Photos',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'caption',
              title: 'Légende',
              type: 'string',
            },
          ],
        },
      ],
    },
    {
      name: 'testimonials',
      title: 'Témoignages',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Nom',
              type: 'string',
            },
            {
              name: 'text',
              title: 'Témoignage',
              type: 'text',
              rows: 3,
            },
            {
              name: 'rating',
              title: 'Note (sur 5)',
              type: 'number',
              validation: Rule => Rule.min(1).max(5),
            },
            {
              name: 'date',
              title: 'Date',
              type: 'date',
            },
          ],
          preview: {
            select: {
              title: 'name',
              rating: 'rating',
            },
            prepare({ title, rating }) {
              return {
                title,
                subtitle: `${'⭐'.repeat(rating || 0)}`,
              }
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
        title: '🏠 Page d\'Accueil',
      }
    },
  },
})
