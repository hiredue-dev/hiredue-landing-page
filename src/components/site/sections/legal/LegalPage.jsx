import { PortableText } from "next-sanity";
import { Eyebrow } from "@/components/site/ui/Primitives";

const components = {
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
  return (
    <section className="relative pt-[140px] pb-[100px] min-[810px]:pt-[170px] min-[810px]:pb-[160px] min-[1200px]:pt-[194px] min-[1200px]:pb-[200px]">
      <div className="mx-auto w-full max-w-[760px] px-[30px]">
        <div className="flex flex-col items-center gap-2.5 text-center">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="t-h2 text-center">{title}</h1>
          {(effectiveDate || lastUpdated) && (
            <p className="t-body-sm">
              {effectiveDate && `Effective ${formatDate(effectiveDate)}`}
              {effectiveDate && lastUpdated && " · "}
              {lastUpdated && `Last updated ${formatDate(lastUpdated)}`}
            </p>
          )}
        </div>

        <div className="legal-body mt-[50px] border-t border-line pt-[50px]">
          <PortableText value={body} components={components} />
        </div>
      </div>
    </section>
  );
}
