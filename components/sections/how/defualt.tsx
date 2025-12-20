"use client";
import { Section } from "@/components/ui/section";
import Horizontal from "./horizontal";
import Vertical from "./vertical";
import { useContent } from "@/components/contexts/content-provider";

export type HowWeDoItSection = {
  heading: string;
  description: string;
};
export default function How() {
  const {
    howWeDoItTitle,
    howWeDoItHeading1,
    howWeDoItHeading2,
    howWeDoItHeading3,
    howWeDoItHeading4,
    howWeDoItHeading5,
    howWeDoItHeading6,
    howWeDoItDescription1,
    howWeDoItDescription2,
    howWeDoItDescription3,
    howWeDoItDescription4,
    howWeDoItDescription5,
    howWeDoItDescription6,
    howWeDoItTitleDescription,
  } = useContent();

  // Pack headings and descriptions into an array
  const howWeDoItSections: HowWeDoItSection[] = [
    { heading: howWeDoItHeading1, description: howWeDoItDescription1 },
    { heading: howWeDoItHeading2, description: howWeDoItDescription2 },
    { heading: howWeDoItHeading3, description: howWeDoItDescription3 },
    { heading: howWeDoItHeading4, description: howWeDoItDescription4 },
    { heading: howWeDoItHeading5, description: howWeDoItDescription5 },
    { heading: howWeDoItHeading6, description: howWeDoItDescription6 },
  ];

  return (
    <Section>
      <div className="mx-auto flex flex-col gap-12">
        <div className="flex flex-col items-center gap-4 px-4 text-center sm:gap-8">
          {howWeDoItTitle && (
            <h2 className="text-3xl leading-tight font-semibold sm:text-5xl sm:leading-tight">
              {howWeDoItTitle}
            </h2>
          )}
          {howWeDoItTitleDescription && (
            <p className="text-md text-muted-foreground max-w-[600px] font-medium sm:text-xl">
              {howWeDoItTitleDescription}
            </p>
          )}
        </div>
        <Horizontal className="hidden lg:block" events={howWeDoItSections} />

        <Vertical className="block lg:hidden" events={howWeDoItSections} />
      </div>
    </Section>
  );
}
