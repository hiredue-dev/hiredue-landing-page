import Image from "next/image";
import { notFound } from "next/navigation";
import { BlogHero } from "@/components/site/blog/BlogHero";
import { BlogCard } from "@/components/site/blog/BlogCard";
import { PostBody } from "@/components/site/blog/PostBody";
import { JsonLd } from "@/components/site/seo/JsonLd";
import {
  Reveal,
  RevealGroup,
  RevealItem,
} from "@/components/site/ui/Primitives";
import { assets } from "@/lib/assets";
import {
  blog,
  formatDate,
  getOtherPosts,
  getPostBySlug,
  getPostSlugs,
} from "@/lib/blog";
import { absoluteUrl, createPageMetadata, SITE_URL } from "@/lib/seo";

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const title = post.seo?.title ?? post.title;
  const description = post.seo?.description ?? post.description;
  const image = post.seo?.image ?? post.cover;
  const authorName = post.author?.name ?? "HireDue Editorial Team";
  const metadata = createPageMetadata({
    title,
    description,
    path: `/blog/${slug}`,
    image,
    imageAlt: post.seo?.imageAlt ?? post.coverAlt,
    noIndex: post.seo?.noIndex,
  });

  return {
    ...metadata,
    authors: [{ name: authorName }],
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updatedAt,
      authors: [authorName],
    },
  };
}

export default async function BlogPostPage({ params }) {
  const post = await getPostBySlug((await params).slug);
  if (!post) notFound();

  const others = await getOtherPosts(post.slug);
  const authorName = post.author?.name ?? "HireDue Editorial Team";
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${absoluteUrl(`/blog/${post.slug}`)}#article`,
    headline: post.title,
    description: post.seo?.description ?? post.description,
    image: [post.seo?.image ?? post.cover],
    datePublished: post.date,
    dateModified: post.updatedAt ?? post.date,
    articleSection: post.category,
    inLanguage: "en",
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    author: post.author
      ? {
          "@type": "Person",
          name: authorName,
          url: post.author.linkedInUrl,
        }
      : {
          "@type": "Organization",
          name: "HireDue",
          url: SITE_URL,
        },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <BlogHero bg={assets.blog.postBg} className="pb-[50px]">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center rounded-full bg-surface px-3.5 pt-1 pb-1.5 text-[14px] leading-[1.3] font-medium text-ink">
            {post.category}
          </span>
          <time dateTime={post.date} className="t-body-sm">
            {formatDate(post.date)}
          </time>
        </div>
        <h1 className="t-h2-feature text-center">{post.title}</h1>
        <p className="t-body-lg text-center">{post.description}</p>
      </BlogHero>

      <article className="relative flex flex-col items-center pb-[100px] min-[810px]:pb-[160px] min-[1200px]:pb-[200px]">
        <div className="container-page flex flex-col items-center gap-[50px]">
          <Reveal y={30} className="w-full">
            <Image
              src={post.cover}
              alt={post.coverAlt ?? `${post.title} article cover`}
              width={1200}
              height={680}
              priority
              sizes="(max-width: 1260px) 100vw, 1200px"
              className="aspect-[1200/680] w-full rounded-[20px] object-cover"
            />
          </Reveal>

          <Reveal className="flex w-full justify-center">
            <PostBody value={post.body} />
          </Reveal>
        </div>
      </article>

      <section className="relative flex flex-col items-center pb-[30px] min-[810px]:pb-20 min-[1200px]:pb-[100px]">
        <div className="container-page flex flex-col gap-10 min-[1200px]:gap-[50px]">
          <Reveal>
            <h2 className="t-h2-feature">{blog.otherArticles}</h2>
          </Reveal>

          {/* at the tablet tier the template lets the third card run the
                full width rather than leaving a gap beside it */}
          <RevealGroup
            step={0.08}
            className="grid gap-[30px] min-[810px]:grid-cols-2 min-[810px]:[&>*:nth-child(3)]:col-span-2 min-[1200px]:grid-cols-3 min-[1200px]:[&>*:nth-child(3)]:col-span-1"
          >
            {others.map((other) => (
              <RevealItem key={other.slug}>
                <BlogCard post={other} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>
    </>
  );
}
