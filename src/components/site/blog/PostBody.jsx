
/**
 * Renders an article from its blocks. Spacing lives in `.blog-body` so the
 * rhythm stays in one place rather than on every element here.
 */
export function PostBody({ blocks }) {
  return (
    <div className="blog-body w-full max-w-[800px]">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "h2":
            return <h2 key={i}>{block.text}</h2>;
          case "h3":
            return <h3 key={i}>{block.text}</h3>;
          case "quote":
            /* the template styles a pull quote as an ordinary paragraph in
               curly quotes rather than as a <blockquote> */
            return <p key={i}>{`“${block.text}”`}</p>;
          case "ul":
            return (
              <ul key={i}>
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          default:
            return <p key={i}>{block.text}</p>;
        }
      })}
    </div>
  );
}
