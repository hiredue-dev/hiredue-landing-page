"use client";

import { Check, Minus } from "lucide-react";
import { Eyebrow, Reveal } from "@/components/site/ui/Primitives";
import { ats } from "@/lib/content";
import { getKeywords } from "../domain/report.js";

/**
 * Presents the backend's matched/missing keyword list. A keyword is "matched"
 * when the backend marks it so; "matched" is a data fact from the engine, not
 * something the frontend infers. Consumes only keywords via a domain selector.
 */
export function AtsKeywordReport({ report = null }) {
  const keywords = getKeywords(report);

  return (
    <section className="mt-[120px] md:mt-[160px]">
      <Reveal className="flex flex-col items-start gap-3">
        <Eyebrow>{ats.keyword.eyebrow}</Eyebrow>
        <h2 className="t-h2">{ats.keyword.title}</h2>
      </Reveal>

      {keywords.length === 0 ? (
        <Reveal>
          <p className="t-body mt-6 text-dim">{ats.keyword.noData}</p>
        </Reveal>
      ) : (
        <Reveal className="mt-10 rounded-[20px] bg-white p-8">
          <ul className="flex flex-wrap gap-3">
            {keywords.map((keyword, index) => {
              const matched = Boolean(keyword.matched);
              return (
                <li
                  key={`${keyword.keyword}-${index}`}
                  className={[
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[14px] font-medium",
                    matched
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-line bg-surface text-dim",
                  ].join(" ")}
                >
                  {matched ? (
                    <Check aria-hidden className="size-4" />
                  ) : (
                    <Minus aria-hidden className="size-4" />
                  )}
                  {keyword.keyword}
                </li>
              );
            })}
          </ul>
        </Reveal>
      )}
    </section>
  );
}

export default AtsKeywordReport;