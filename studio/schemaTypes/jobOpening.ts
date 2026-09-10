import {defineField, defineType} from 'sanity'

export const jobOpening = defineType({
  name: 'jobOpening',
  title: 'Job Opening',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'team',
      title: 'Team',
      type: 'string',
      options: {
        list: ["Founder's Office", 'Engineering', 'Design', 'Growth', 'Operations'],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      initialValue: 'Hybrid (Bengaluru)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {list: ['Internship', 'Full-time', 'Contract']},
      initialValue: 'Internship',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'jdUrl',
      title: 'Job description URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isOpen',
      title: 'Open',
      type: 'boolean',
      description: 'Turn off to hide this role from the site without deleting it.',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Lower numbers show first.',
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
    select: {title: 'title', subtitle: 'team', isOpen: 'isOpen'},
    prepare: ({title, subtitle, isOpen}) => ({
      title,
      subtitle: isOpen === false ? `${subtitle} · Closed` : subtitle,
    }),
  },
})
