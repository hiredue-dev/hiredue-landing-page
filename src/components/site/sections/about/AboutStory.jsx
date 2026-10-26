"use client";

import { PortableText } from "next-sanity";
import { PageHero } from "@/components/site/ui/PageHero";
import { Reveal } from "@/components/site/ui/Primitives";
import { aboutPage } from "@/lib/content";

const components = {
  block: {
    normal: ({ children }) => <p className="t-body-lg">{children}</p>,
    h2: ({ children }) => <h2 className="t-h5 mt-6">{children}</h2>,
  },
  list: {
    bullet: ({ children }) => (
      <ul className="t-body-lg flex list-disc flex-col gap-3 pl-6">
        {children}
      </ul>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold">{children}</strong>
    ),
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand underline"
      >
        {children}
      </a>
    ),
  },
};

function FallbackManifesto() {
  return (
    <>
      <p className="t-body-lg font-semibold">{aboutPage.intro}</p>
      {aboutPage.sections.map((section) => (
        <div key={section.heading} className="flex flex-col gap-6">
          <h2 className="t-h5 mt-6">{section.heading}</h2>
          {section.paragraphs?.map((paragraph, i) => (
            <p key={i} className="t-body-lg">
              {paragraph}
            </p>
          ))}
          {section.points && (
            <ul className="t-body-lg flex list-disc flex-col gap-3 pl-6">
              {section.points.map((point) => (
                <li key={point.title}>
                  <strong className="font-semibold">{point.title}</strong>{" "}
                  {point.text}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </>
  );
}

export function AboutStory({
  eyebrow = aboutPage.eyebrow,
  title = aboutPage.title,
  body,
}) {
  return (
    <PageHero eyebrow={eyebrow} title={title} className="pb-[60px] min-[810px]:pb-[100px]">
      <Reveal y={30} delay={0.1} className="flex flex-col gap-6">
        {body ? <PortableText value={body} components={components} /> : <FallbackManifesto />}
      </Reveal>
    </PageHero>
  );
}
