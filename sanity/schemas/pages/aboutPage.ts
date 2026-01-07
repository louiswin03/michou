import { defineType } from 'sanity'

export default defineType({
  name: 'aboutPage',
  title: 'ℹ️ Page À Propos',
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
      name: 'story',
      title: 'Notre Histoire',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Titre',
          type: 'string',
        },
        {
          name: 'content',
          title: 'Contenu',
          type: 'array',
          of: [{ type: 'block' }],
        },
      ],
    },
    {
      name: 'owner',
      title: 'Le Propriétaire',
      type: 'object',
      fields: [
        {
          name: 'name',
          title: 'Nom',
          type: 'string',
        },
        {
          name: 'bio',
          title: 'Biographie',
          type: 'text',
          rows: 5,
        },
        {
          name: 'photo',
          title: 'Photo',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    },
    {
      name: 'values',
      title: 'Nos Valeurs',
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
        title: 'ℹ️ Page À Propos',
      }
    },
  },
})
