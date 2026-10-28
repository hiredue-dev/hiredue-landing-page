import {defineField, defineType} from 'sanity'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role / result',
      type: 'string',
      description: 'Shown under the name, e.g. "Got interview call from Amazon".',
      validation: (Rule) => Rule.required(),
    }),
    // change_v4 : added an optional Photo field so editors can upload the person's picture;
    // the testimonial card shows it instead of the initials (initials stay when it's empty)
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      description: 'Optional. Shown in the circle instead of the initials. Square images work best.',
      options: {hotspot: true},
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Lower numbers show first in the marquee.',
      validation: (Rule) => Rule.required().integer(),
    }),
  ],
  orderings: [
    {
      title: 'Display order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
  preview: {
    select: {title: 'name', subtitle: 'quote'},
  },
})
