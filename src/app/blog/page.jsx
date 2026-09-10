import { BlogHero } from "@/components/site/blog/BlogHero";
import { BlogGrid } from "@/components/site/blog/BlogGrid";
import { assets } from "@/lib/assets";
import { blog, getPosts } from "@/lib/blog";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "AI Job Search, Resume & Career Guides",
  description:
    "Notes on running a modern job search: AI tooling, applicant tracking systems, tailoring applications, and getting to the interview faster.",
  path: "/blog",
});

export default async function BlogIndexPage() {
  const posts = await getPosts();

  return (
    <>
      <BlogHero
        bg={assets.hero.sky}
        className="pb-[60px] min-[810px]:pb-20 min-[1200px]:pb-[100px]"
      >
        <h1 className="t-blog-title text-center">{blog.title}</h1>
      </BlogHero>

      <section className="relative flex flex-col items-center pb-[30px] min-[810px]:pb-20 min-[1200px]:pb-[100px]">
        <div className="container-page flex flex-col items-center">
          <BlogGrid posts={posts} />
        </div>
      </section>
    </>
  );
}
