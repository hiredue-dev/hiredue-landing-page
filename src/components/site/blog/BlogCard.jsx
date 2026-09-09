import Image from "next/image";
import Link from "next/link";

/**
 * One article card. The cover sits at 1.05 scale behind a clipped frame and
 * settles to 1.01 at rest, so hovering pushes it out past the edges while the
 * title picks up the brand blue — both straight from the template.
 */
export function BlogCard({ post, sizes }) {
  return (
    <div className="p-1">
      <Link
        href={`/blog/${post.slug}`}
        className="group flex h-full flex-col gap-2.5 overflow-hidden rounded-[20px] bg-white p-2.5 shadow-[0_0_0_4px_rgba(221,229,237,0.7)]"
      >
        <div className="relative aspect-[1200/680] w-full overflow-hidden rounded-[10px]">
          <Image
            src={post.cover}
            alt=""
            fill
            sizes={sizes ?? "(max-width: 810px) 100vw, (max-width: 1200px) 50vw, 352px"}
            className="scale-[1.01] object-cover transition-transform duration-500 ease-[cubic-bezier(0.44,0,0.56,1)] group-hover:scale-105"
          />
        </div>

        <div className="flex flex-col gap-2.5 p-2.5 min-[810px]:p-4">
          <span className="inline-flex w-fit items-center rounded-full bg-surface px-3.5 pt-1 pb-1.5 text-[14px] leading-[1.3] font-medium text-ink">
            {post.category}
          </span>
          <h2 className="font-display text-[20px] leading-[1.2] font-semibold text-ink transition-colors duration-300 group-hover:text-brand min-[810px]:text-[22px]">
            {post.title}
          </h2>
        </div>
      </Link>
    </div>
  );
}
