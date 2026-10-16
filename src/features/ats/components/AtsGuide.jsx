import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Reveal } from "@/components/site/ui/Primitives";
import { atsChecker } from "@/lib/content";

const { scoring, steps, faq } = atsChecker.guide;

/**
 * The reading under the checker: what the score measures, how to use it, and
 * the common questions. Server-rendered so search engines get all of it,
 * answers included (native <details> keeps them in the HTML while closed).
 */
export function AtsGuide() {
  return (
    <section className="relative pb-[120px] md:pb-[160px]">
      <div className="container-page flex flex-col gap-[80px] md:gap-[110px]">
        <Reveal className="flex flex-col gap-8">
          <div className="flex max-w-[680px] flex-col gap-2.5">
            <h2 className="t-h3">{scoring.title}</h2>
            <p className="t-body-lg">{scoring.body}</p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {scoring.categories.map((category) => (
              <li key={category.label} className="flex flex-col gap-2 rounded-[20px] bg-surface p-6">
                <p className="font-display text-[32px] leading-none font-semibold text-brand tabular-nums">{category.points}</p>
                <h3 className="text-[16px] font-semibold text-ink">{category.label}</h3>
                <p className="t-body-sm">{category.body}</p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="flex flex-col gap-8">
          <h2 className="t-h3">{steps.title}</h2>
          <ol className="grid gap-4 md:grid-cols-3">
            {steps.items.map((step, index) => (
              <li key={step.title} className="flex flex-col gap-2 rounded-[20px] border border-line p-6">
                <span className="grid size-9 place-items-center rounded-full bg-ice text-[15px] font-semibold text-brand">{index + 1}</span>
                <h3 className="text-[17px] font-semibold text-ink">{step.title}</h3>
                <p className="t-body">{step.body}</p>
              </li>
            ))}
          </ol>
          <Link href="#checker" className="self-start text-[15px] font-semibold text-brand hover:underline">
            Check my resume now
          </Link>
        </Reveal>

        <Reveal className="flex flex-col gap-8">
          <h2 className="t-h3">{faq.title}</h2>
          <div className="flex flex-col gap-3">
            {faq.items.map((item) => (
              <details key={item.question} className="group rounded-[20px] ring-1 ring-line open:bg-surface open:ring-0">
                <summary className="flex cursor-pointer list-none items-start gap-3 p-5 [&::-webkit-details-marker]:hidden">
                  <h3 className="flex-1 text-[18px] leading-[1.35] font-medium text-ink">{item.question}</h3>
                  <ChevronRight size={20} className="mt-0.5 shrink-0 text-dim transition-transform group-open:rotate-90" aria-hidden />
                </summary>
                <p className="t-body px-5 pb-5">{item.answer}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
