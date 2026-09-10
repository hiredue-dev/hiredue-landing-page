import {defineField, defineType} from 'sanity'

export const linkedinPost = defineType({
  name: 'linkedinPost',
  title: 'LinkedIn Post',
  type: 'document',
  description:
    'Posts customers write about HireDue on LinkedIn. No section on the site reads this yet — content is being collected ahead of that section shipping.',
  fields: [
    defineField({
      name: 'authorName',
      title: 'Author name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'authorRole',
      title: 'Author role',
      type: 'string',
      description: 'e.g. "Product Manager at Acme"',
    }),
    defineField({
      name: 'authorAvatar',
      title: 'Author photo',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'authorProfileUrl',
      title: 'Author LinkedIn profile URL',
      type: 'url',
    }),
    defineField({
      name: 'postUrl',
      title: 'Link to the live post',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'screenshot',
      title: 'Post screenshot',
      type: 'image',
      description: 'Screenshot of the post — LinkedIn embeds are unreliable to render.',
      options: {hotspot: true},
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Short quote from the post, used if no screenshot is set.',
    }),
    defineField({
      name: 'postedAt',
      title: 'Posted on',
      type: 'date',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Highlight this one / show it first once the section exists.',
      initialValue: false,
    }),
    defineField({
      name: 'published',
      title: 'Published',
      type: 'boolean',
      description: 'Uncheck to hide without deleting.',
      initialValue: true,
    }),
  ],
  preview: {
    select: {title: 'authorName', subtitle: 'authorRole', media: 'screenshot'},
  },
})
