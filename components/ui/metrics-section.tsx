"use client"
import { MetricsCard } from "./metrics-card"
import { useContent } from "@/components/contexts/content-provider";


export function MetricsSection() {
  const {whyHiredueTitle, whyHiredueTitleDescription, whyHiredueNumberHeading1, whyHiredueNumber1, whyHiredueNumberDescription1, whyHiredueNumberHeading2, whyHiredueNumber2, whyHiredueNumberDescription2, whyHiredueNumberHeading3, whyHiredueNumber3, whyHiredueNumberDescription3, whyHiredueNumberHeading4, whyHiredueNumber4, whyHiredueNumberDescription4,}=useContent()

  const items = [
  {
      label: whyHiredueNumberHeading1,
      value: whyHiredueNumber1,
      // suffix: "k",
      description: whyHiredueNumberDescription1
  },
  {
      label: whyHiredueNumberHeading2,
      value: whyHiredueNumber2,
      // suffix: "k",
      description: whyHiredueNumberDescription2
  },
  {
      label: whyHiredueNumberHeading3,
      value: whyHiredueNumber3,
      description: whyHiredueNumberDescription3
  },
  {
      label: whyHiredueNumberHeading4,
      value: whyHiredueNumber4,
      // suffix: "k",
      description: whyHiredueNumberDescription4
  },
]
  return (
    <section className="relative  w-full  px-6 md:px-25 py-16 md:py-24 justify-between ">
      <div className="grid items-start gap-12 md:grid-cols-2 md:gap-16">
        {/* Left copy */}
        <div>
          <h2 className="text-3xl leading-tight font-semibold sm:text-5xl sm:leading-tight">
            {whyHiredueTitle}
          </h2>
          <p className="mt-6 max-w-xl text-base leading-6 text-muted-foreground md:text-lg md:leading-7">
            {whyHiredueTitleDescription}
          </p>
        </div>

        {/* Right stats grid */}
        <div className="grid gap-5 md:grid-cols-2">
          {items && items.map((item, index) => (
            <MetricsCard 
              key={index}
              label={item.label}
              value={item.value}
              // suffix={item.suffix}
              description={item.description}
            >

              </MetricsCard>))}
        </div>
      </div>
    </section>
  )
}
