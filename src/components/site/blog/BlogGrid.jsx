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
