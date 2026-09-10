import { PortableText } from "next-sanity";

/* The template styles a pull quote as an ordinary paragraph in curly quotes
   rather than as a <blockquote>, so override just that one block style. */
const components = {
  block: {
    blockquote: ({ children }) => <p>{"“"}{children}{"”"}</p>,
  },
};

/**
 * Renders an article body from Sanity's Portable Text. Spacing lives in
 * `.blog-body` so the rhythm stays in one place rather than on every element
 * here.
 */
export function PostBody({ value }) {
  return (
    <div className="blog-body w-full max-w-[800px]">
      <PortableText value={value} components={components} />
    </div>
  );
}
