import Image from "next/image";
import { formatChangelogDate } from "@/lib/changelog";

/**
 * Every card is `position: sticky` at the same offset, so each one parks under
 * the navbar and the next slides up to cover it — the stack the reference site
 * builds with plain CSS rather than a scroll-linked animation.
 */
export function ChangelogTimeline({ entries = [] }) {
  if (!entries.length) return null;

  return (
    <section className="relative pb-[120px] min-[1200px]:pb-[200px]">
      <div className="mx-auto flex w-full max-w-[1220px] flex-col gap-[7px] px-[30px]">
        {entries.map((entry) => (
          <div key={`${entry.version}-${entry.date}`} className="sticky top-[150px]">
            <article className="grid gap-[15px] rounded-[15px] border border-dashed border-line bg-white md:grid-cols-2">
              <div className="p-[25px] pb-0 md:pb-[25px]">
                <p className="text-[15px] leading-[1.1] font-semibold text-ink">
                  Version {entry.version.replace(/^v/i, "")}
                </p>
              </div>

              <div className="flex flex-col gap-[30px] p-[25px] pt-0 md:border-l md:border-dashed md:border-line md:pt-[25px]">
                <div className="flex flex-col gap-[15px]">
                  <p className="text-[13px] leading-none font-medium tracking-[0.03em] text-brand uppercase">
                    {formatChangelogDate(entry.date)}
                  </p>
                  <h2 className="t-h5">{entry.title}</h2>
                  <p className="t-body">{entry.description}</p>

                  {entry.highlights?.length > 0 && (
                    <ul className="t-body list-disc pl-[18px] marker:text-dim">
                      {entry.highlights.map((note) => (
                        <li key={note}>{note}</li>
                      ))}
                    </ul>
                  )}
                </div>

                {entry.image && (
                  <div className="relative aspect-[553/315] w-full overflow-hidden rounded-[10px]">
                    <Image
                      src={entry.image}
                      alt=""
                      fill
                      sizes="(min-width: 1200px) 560px, 100vw"
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}
