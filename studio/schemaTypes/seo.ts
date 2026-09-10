import {defineField, defineType} from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO and social sharing',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'SEO title',
      description: 'Optional override. The article title is used when this is empty.',
      type: 'string',
      validation: (Rule) =>
        Rule.max(60).warning('Search titles are usually clearest below 60 characters.'),
    }),
    defineField({
      name: 'description',
      title: 'SEO description',
      description: 'Optional override. The article description is used when this is empty.',
      type: 'text',
      rows: 3,
      validation: (Rule) =>
        Rule.max(160).warning('Search descriptions are usually clearest below 160 characters.'),
    }),
    defineField({
      name: 'image',
      title: 'Social sharing image',
      description: 'Optional 1200 × 630 image. The cover image is used when this is empty.',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      description: 'Enable only when this article should not appear in search or the sitemap.',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
