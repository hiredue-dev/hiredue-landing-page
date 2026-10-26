import { PortableText } from "next-sanity";
import { PageHero } from "@/components/site/ui/PageHero";

/* Section anchors use the block's Sanity _key: unique and stable, and the
   same value the contents list reads, so the two can't drift apart. */
const sectionId = (block) => `section-${block._key}`;

const blockText = (block) => (block.children ?? []).map((child) => child.text ?? "").join("");

const components = {
  block: {
    h2: ({ children, value }) => <h2 id={sectionId(value)}>{children}</h2>,
  },
  marks: {
    link: ({ children, value }) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  },
};

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

export function LegalPage({ eyebrow, title, effectiveDate, lastUpdated, body }) {
  const sections = (body ?? []).filter((block) => block._type === "block" && block.style === "h2" && block._key);

  const dates = (effectiveDate || lastUpdated) && (
    <p className="t-body-sm">
      {effectiveDate && `Effective ${formatDate(effectiveDate)}`}
      {effectiveDate && lastUpdated && " · "}
      {lastUpdated && `Last updated ${formatDate(lastUpdated)}`}
    </p>
  );

  return (
    <PageHero
      eyebrow={eyebrow}
      title={title}
      description={dates}
      className="pb-[100px] min-[810px]:pb-[160px] min-[1200px]:pb-[200px]"
    >
      {/* these run to fifteen-odd sections: give readers a way to jump */}
      {sections.length >= 3 && (
        <nav aria-label="On this page" className="rounded-[20px] bg-surface p-6 sm:p-8">
          <p className="text-[14px] leading-[1.3] font-semibold text-ink">On this page</p>
          <ol className="mt-3 grid gap-x-8 gap-y-1.5 sm:grid-cols-2">
            {sections.map((block) => (
              <li key={block._key}>
                <a
                  href={`#${sectionId(block)}`}
                  className="text-[15px] leading-[1.4] font-medium text-dim transition-colors duration-200 hover:text-ink"
                >
                  {blockText(block)}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className="legal-body border-t border-line pt-[50px]">
        <PortableText value={body} components={components} />
      </div>

      {sections.length >= 3 && (
        <p className="text-center">
          <a href="#main" className="text-[15px] font-semibold text-brand hover:underline">
            Back to top ↑
          </a>
        </p>
      )}
    </PageHero>
  );
}
