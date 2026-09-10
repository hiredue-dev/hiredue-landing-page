import { getPosts } from "@/lib/blog";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 3600;

const INDEXABLE_ROUTES = [
  "/",
  "/feature",
  "/blog",
  "/about",
  "/career",
  "/changelog",
  "/contact",
  "/ambassadors",
];

export default async function sitemap() {
  const staticPages = INDEXABLE_ROUTES.map((path) => ({
    url: absoluteUrl(path),
  }));

  try {
    const posts = await getPosts();
    const articles = posts
      .filter((post) => !post.seo?.noIndex)
      .map((post) => ({
        url: absoluteUrl(`/blog/${post.slug}`),
        lastModified: post.updatedAt ?? post.date,
      }));

    return [...staticPages, ...articles];
  } catch (error) {
    console.error("Unable to include blog posts in sitemap:", error);
    return staticPages;
  }
}
