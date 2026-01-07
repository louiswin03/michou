import { definePlugin } from 'sanity'
import { CalendarIcon } from '@sanity/icons'
import CalendarTool from './CalendarTool'

export const calendarPlugin = definePlugin({
  name: 'calendar-plugin',
  tools: [
    {
      name: 'calendar',
      title: '📅 Calendrier Visuel',
      icon: CalendarIcon,
      component: CalendarTool,
    },
  ],
})
