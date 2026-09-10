import { defineQuery } from "next-sanity";

export const POSTS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    "slug": slug.current,
    category,
    "date": publishedAt,
    "updatedAt": _updatedAt,
    title,
    description,
    cover,
    "coverAlt": coalesce(cover.alt, title),
    "seo": {
      "title": coalesce(seo.title, title),
      "description": coalesce(seo.description, description),
      "image": coalesce(seo.image, cover),
      "imageAlt": coalesce(seo.image.alt, cover.alt, title),
      "noIndex": seo.noIndex == true
    }
  }
`);

export const POST_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0]{
    _id,
    "slug": slug.current,
    category,
    "date": publishedAt,
    "updatedAt": _updatedAt,
    title,
    description,
    cover,
    "coverAlt": coalesce(cover.alt, title),
    author->{
      name,
      role,
      bio,
      linkedInUrl,
      image,
      "imageAlt": coalesce(image.alt, name)
    },
    "seo": {
      "title": coalesce(seo.title, title),
      "description": coalesce(seo.description, description),
      "image": coalesce(seo.image, cover),
      "imageAlt": coalesce(seo.image.alt, cover.alt, title),
      "noIndex": seo.noIndex == true
    },
    body
  }
`);

export const POST_SLUGS_QUERY = defineQuery(
  `*[_type == "post" && defined(slug.current)].slug.current`,
);

export const FAQ_QUERY = defineQuery(`
  *[_type == "faq" && group == "Home"] | order(order asc) {
    question,
    answer
  }
`);

export const TESTIMONIALS_QUERY = defineQuery(`
  *[_type == "testimonial"] | order(order asc) {
    quote,
    name,
    role
  }
`);

export const LEGAL_PAGE_QUERY = defineQuery(`
  *[_type == "legalPage" && slug.current == $slug][0]{
    title,
    effectiveDate,
    lastUpdated,
    body
  }
`);

export const ABOUT_PAGE_QUERY = defineQuery(`
  *[_type == "aboutPage"][0]{
    eyebrow,
    title,
    body
  }
`);

export const CHANGELOG_QUERY = defineQuery(`
  *[_type == "changelogEntry"] | order(date desc) {
    version,
    date,
    title,
    description,
    highlights,
    image
  }
`);

export const JOB_OPENINGS_QUERY = defineQuery(`
  *[_type == "jobOpening" && isOpen == true] | order(order asc) {
    title,
    team,
    location,
    type,
    jdUrl
  }
`);
