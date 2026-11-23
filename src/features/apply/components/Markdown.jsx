import { Fragment } from "react";
import { parseMarkdown } from "../markdown.js";

/* Renders parseMarkdown's tree as React elements; nothing is set as raw HTML. */

function Inline({ nodes }) {
  return nodes.map((node, i) => {
    switch (node.type) {
      case "strong":
        return (
          <strong key={i} className="font-semibold text-ink">
            <Inline nodes={node.children} />
          </strong>
        );
      case "em":
        return (
          <em key={i}>
            <Inline nodes={node.children} />
          </em>
        );
      case "code":
        return (
          <code key={i} className="rounded bg-surface px-1.5 py-0.5 text-[0.9em]">
            {node.value}
          </code>
        );
      case "link":
        return (
          <a key={i} href={node.href} target="_blank" rel="noopener noreferrer nofollow" className="font-medium text-brand underline-offset-4 hover:underline">
            <Inline nodes={node.children} />
          </a>
        );
      default:
        return <Fragment key={i}>{node.value}</Fragment>;
    }
  });
}

const HEADING_CLASS = {
  1: "text-[20px]",
  2: "text-[19px]",
  3: "text-[17px]",
};

export function Markdown({ source }) {
  const blocks = parseMarkdown(source);
  return (
    <div className="flex flex-col gap-3.5 text-[15px] leading-[1.65] text-ink/90 [overflow-wrap:anywhere]">
      {blocks.map((block, i) => {
        if (block.type === "heading") {
          // The page's h1 is the job title, so description headings start at h2.
          const Tag = `h${Math.min(block.level + 1, 6)}`;
          return (
            <Tag key={i} className={`${HEADING_CLASS[block.level] ?? "text-[15.5px]"} mt-2 font-semibold text-ink first:mt-0`}>
              <Inline nodes={block.children} />
            </Tag>
          );
        }
        if (block.type === "rule") return <hr key={i} className="border-line" />;
        if (block.type === "list") {
          const Tag = block.ordered ? "ol" : "ul";
          return (
            <Tag
              key={i}
              start={block.ordered && block.start !== 1 ? block.start : undefined}
              className={`${block.ordered ? "list-decimal" : "list-disc"} flex flex-col gap-1.5 pl-5 marker:text-dim`}
            >
              {block.items.map((item, j) => (
                <li key={j} className="pl-1">
                  <Inline nodes={item} />
                </li>
              ))}
            </Tag>
          );
        }
        return (
          <p key={i}>
            {block.lines.map((line, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                <Inline nodes={line} />
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
