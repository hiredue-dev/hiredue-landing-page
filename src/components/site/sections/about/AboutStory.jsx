"use client";

import { PortableText } from "next-sanity";
import { Eyebrow, Reveal } from "@/components/site/ui/Primitives";
import { aboutPage } from "@/lib/content";

const components = {
  block: {
    normal: ({ children }) => <p className="t-body-lg">{children}</p>,
    h2: ({ children }) => <h2 className="t-h5 mt-4">{children}</h2>,
  },
  marks: {
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

export function AboutStory({ eyebrow = aboutPage.eyebrow, title = aboutPage.title, body }) {
  return (
    <section className="relative pt-[140px] pb-[100px] min-[810px]:pt-[170px] min-[810px]:pb-[160px] min-[1200px]:pt-[194px] min-[1200px]:pb-[200px]">
      <div className="mx-auto w-full max-w-[760px] px-[30px]">
        <Reveal className="flex flex-col items-center gap-2.5 text-center">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="t-h2 text-center">{title}</h1>
        </Reveal>

        <Reveal y={30} delay={0.1} className="mt-10 flex flex-col gap-6">
          {body ? (
            <PortableText value={body} components={components} />
          ) : (
            aboutPage.paragraphs.map((paragraph, i) => (
              <p key={i} className="t-body-lg">
                {paragraph}
              </p>
            ))
          )}
        </Reveal>
      </div>
    </section>
  );
}
