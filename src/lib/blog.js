import { client } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";
import {
  POSTS_QUERY,
  POST_QUERY,
  POST_SLUGS_QUERY,
} from "@/lib/sanity/queries";

/**
 * The blog's content lives in Sanity now (see /studio). Every fetcher below
 * returns the same shape the components already render, so swapping the
 * source didn't touch BlogCard, BlogGrid, BlogHero, or PostBody's props
 * except `body`, which is now real Portable Text instead of a hand-rolled
 * block array.
 */
export const blog = {
  title: "Our blog",
  loadMore: "Load More",
  /** How many cards show before "Load More" — the template starts at six. */
  pageSize: 6,
  otherArticles: "Other articles",
};

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

const FETCH_OPTIONS = { next: { revalidate: 60 } };

const coverUrl = (image) =>
  image ? urlFor(image).width(1200).height(680).fit("crop").url() : null;

const socialImageUrl = (image) =>
  image ? urlFor(image).width(1200).height(630).fit("crop").url() : null;

const withCover = (post) => ({
  ...post,
  cover: coverUrl(post.cover),
  seo: post.seo
    ? {
        ...post.seo,
        image: socialImageUrl(post.seo.image),
      }
    : undefined,
});

export async function getPosts() {
  const posts = await client.fetch(POSTS_QUERY, {}, FETCH_OPTIONS);
  return (posts ?? []).map(withCover);
}

export async function getPostSlugs() {
  return client.fetch(POST_SLUGS_QUERY, {}, FETCH_OPTIONS);
}

export async function getPostBySlug(slug) {
  const post = await client.fetch(POST_QUERY, { slug }, FETCH_OPTIONS);
  return post ? withCover(post) : null;
}

/** Three other posts to show under an article, in publication order. */
export async function getOtherPosts(slug) {
  const posts = await getPosts();
  return posts.filter((p) => p.slug !== slug).slice(0, 3);
}
