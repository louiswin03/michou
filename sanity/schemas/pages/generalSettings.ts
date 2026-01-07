import { defineType } from 'sanity'

export default defineType({
  name: 'generalSettings',
  title: '⚙️ Paramètres Généraux',
  type: 'document',
  fields: [
    {
      name: 'siteName',
      title: 'Nom du site',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'siteDescription',
      title: 'Description du site',
      type: 'text',
      rows: 3,
    },
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
    },
    {
      name: 'contactEmail',
      title: 'Email de contact',
      type: 'string',
    },
    {
      name: 'contactPhone',
      title: 'Téléphone de contact',
      type: 'string',
    },
    {
      name: 'socialMedia',
      title: 'Réseaux Sociaux',
      type: 'object',
      fields: [
        {
          name: 'facebook',
          title: 'Facebook URL',
          type: 'url',
        },
        {
          name: 'instagram',
          title: 'Instagram URL',
          type: 'url',
        },
        {
          name: 'twitter',
          title: 'Twitter URL',
          type: 'url',
        },
      ],
    },
    {
      name: 'footer',
      title: 'Footer',
      type: 'object',
      fields: [
        {
          name: 'copyrightText',
          title: 'Texte Copyright',
          type: 'string',
        },
        {
          name: 'legalLinks',
          title: 'Liens légaux',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'label',
                  title: 'Label',
                  type: 'string',
                },
                {
                  name: 'url',
                  title: 'URL',
                  type: 'string',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'siteName',
    },
    prepare({ title }) {
      return {
        title: `⚙️ ${title || 'Paramètres Généraux'}`,
      }
    },
  },
})
