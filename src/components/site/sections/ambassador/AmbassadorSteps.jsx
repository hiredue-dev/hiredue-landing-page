import { Eyebrow, Reveal, RevealGroup, RevealItem } from "@/components/site/ui/Primitives";
import { ambassadorPage } from "@/lib/content";

const { steps } = ambassadorPage;

export function AmbassadorSteps() {
  return (
    <section className="relative pb-[100px] min-[810px]:pb-[160px] min-[1200px]:pb-[200px]">
      <div className="container-page">
        <div className="flex flex-col gap-[30px] min-[810px]:gap-10 min-[1200px]:gap-[50px]">
          <Reveal className="flex max-w-[720px] flex-col items-start gap-2.5">
            <Eyebrow>{steps.eyebrow}</Eyebrow>
            <h2 className="t-h2">{steps.title}</h2>
          </Reveal>

          <RevealGroup
            step={0.08}
            className="relative grid gap-5 min-[810px]:grid-cols-2 min-[810px]:gap-[30px] min-[1200px]:grid-cols-4"
          >
            {steps.items.map((item, i) => (
              <RevealItem key={item.number} className="relative flex flex-col items-start gap-4">
                {/* rail to the next number, drawn per step so it stops at 04
                    instead of running off the end of the row */}
                {i < steps.items.length - 1 && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute top-[31px] right-[-38px] left-[72px] hidden h-px bg-[repeating-linear-gradient(90deg,var(--color-line)_0_6px,transparent_6px_14px)] min-[1200px]:block"
                  />
                )}
                <span className="grid size-[64px] shrink-0 place-items-center rounded-full bg-white font-display text-[22px] leading-none font-semibold text-brand ring-1 ring-line">
                  {item.number}
                </span>
                <div className="flex flex-col gap-1.5">
                  <h3 className="t-h5">{item.title}</h3>
                  <p className="t-body">{item.description}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
