"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BlogCard } from "@/components/site/blog/BlogCard";
import { blog } from "@/lib/blog";
import { inView, rise } from "@/lib/motion";

/**
 * The article grid. Six cards show first; "Load More" reveals the rest and
 * then removes itself, exactly as the template's collection does.
 */
export function BlogGrid({ posts }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? posts : posts.slice(0, blog.pageSize);

  /* the CMS can come back empty (nothing published yet, or a failed fetch) —
     say so rather than leaving a blank space under the headline */
  if (!posts.length) {
    return (
      <div className="flex w-full max-w-[560px] flex-col items-center gap-2 rounded-[20px] bg-surface px-6 py-10 text-center">
        <p className="t-h5">No articles yet</p>
        <p className="t-body">New guides and comparisons are on the way. Check back soon.</p>
      </div>
    );
  }

  return (
    <>
      <motion.div
        {...inView}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
        className="grid w-full gap-[30px] min-[810px]:grid-cols-2 min-[1200px]:grid-cols-3"
      >
        {/* cards revealed later mount into the parent's "visible" state, so
            they fade up on their own without any extra wiring */}
        {visible.map((post) => (
          <motion.div key={post.slug} variants={rise(20)}>
            <BlogCard post={post} />
          </motion.div>
        ))}
      </motion.div>

      {!expanded && posts.length > blog.pageSize && (
        <div className="flex justify-center pt-[60px]">
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="rounded-full bg-ink px-11 py-[18px] text-[18px] leading-[1.3] font-semibold text-white transition-colors duration-300 hover:bg-charcoal"
          >
            {blog.loadMore}
          </button>
        </div>
      )}
    </>
  );
}
