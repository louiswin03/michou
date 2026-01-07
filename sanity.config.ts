import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas'
import { structure } from './sanity/structure'
import { calendarPlugin } from './sanity/plugins/calendar'

export default defineConfig({
  name: 'default',
  title: 'Michou Bo Premium - Gestion',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

  basePath: '/studio',

  plugins: [
    structureTool({
      structure,
    }),
    visionTool(),
    calendarPlugin(),
  ],

  schema: {
    types: schemaTypes,
  },
})
