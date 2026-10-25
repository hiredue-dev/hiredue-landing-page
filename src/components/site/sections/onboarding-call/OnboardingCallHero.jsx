"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Eyebrow } from "@/components/site/ui/Primitives";
import { Field, FormStatus, Input } from "@/components/site/ui/FormField";
import { assets } from "@/lib/assets";
import { onboardingCallPage } from "@/lib/content";
import { spring } from "@/lib/motion";
import useOnboardingCallForm from "@/features/onboarding-call/hooks/useOnboardingCallForm";
import getFieldError from "@/utils/getFieldError";

const appear = (delay) => ({
  initial: { opacity: 0.001, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: spring(1, delay),
});

const { hero } = onboardingCallPage;

/** Earliest selectable date is today, in the visitor's own local time. */
function todayISODate() {
  const now = new Date();
  const tzOffsetMs = now.getTimezoneOffset() * 60000;
  return new Date(now - tzOffsetMs).toISOString().slice(0, 10);
}

/* The call is 9:30 PM IST (UTC+5:30), i.e. 16:00 UTC. */
const CALL_UTC_HOUR = 16;
const IST_OFFSET_MINUTES = -330;

/**
 * "…which is 12:00 PM EDT for you" on the chosen (or today's) date, or null when
 * the visitor is already on IST. Date-specific so daylight saving is right.
 */
function localCallTime(isoDate) {
  if (new Date().getTimezoneOffset() === IST_OFFSET_MINUTES) return null;
  const [y, m, d] = (isoDate || todayISODate()).split("-").map(Number);
  const call = new Date(Date.UTC(y, m - 1, d, CALL_UTC_HOUR, 0));
  const time = call.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", timeZoneName: "short" });
  return `The call starts at 9:30 PM IST, which is ${time} for you.`;
}

export function OnboardingCallHero() {
  const form = useOnboardingCallForm();

  return (
    <section className="relative isolate flex flex-col overflow-hidden bg-white pt-[128px] pb-[100px] min-[810px]:pt-[158px] min-[810px]:pb-[160px] min-[1200px]:pt-[194px] min-[1200px]:pb-[200px]">
      <div className="container-page relative z-[2]">
        <div className="grid gap-[60px] min-[1200px]:grid-cols-[1fr_520px] min-[1200px]:items-start min-[1200px]:gap-[50px]">
          <motion.div
            {...appear(0.1)}
            className="flex flex-col items-start gap-5 min-[1200px]:gap-8 min-[1200px]:pt-2.5"
          >
            <div className="flex flex-col items-start gap-2.5">
              <Eyebrow>{hero.eyebrow}</Eyebrow>
              <h1 className="t-h1-ambassador whitespace-pre-line">{hero.title}</h1>
              <p className="max-w-[520px] text-[18px] leading-[1.3] font-medium text-dim min-[810px]:text-[20px]">
                {hero.description}
              </p>
            </div>

            <ul className="flex flex-col gap-2.5">
              {hero.points.map((point) => (
                <li key={point} className="flex items-start gap-1.5">
                  <Image
                    src={assets.icons.chevronBlue}
                    alt=""
                    width={7}
                    height={10}
                    className="mt-[7px] w-[7px] shrink-0"
                  />
                  <span className="text-[16px] leading-[1.3] font-medium text-ink">{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div {...appear(0.25)}>
            <OnboardingCallForm form={form} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function OnboardingCallForm({ form }) {
  const { form: copy } = hero;
  /* Both depend on the visitor's clock and zone, so they're worked out after
     mount — on the server they'd differ from the browser and break hydration. */
  const [minDate, setMinDate] = useState(undefined);
  const [timeHint, setTimeHint] = useState(null);
  useEffect(() => setMinDate(todayISODate()), []);
  useEffect(() => setTimeHint(localCallTime(form.values.preferredDate)), [form.values.preferredDate]);

  return (
    <div className="relative w-full overflow-hidden rounded-[30px] bg-surface shadow-[0_24px_60px_rgba(29,29,29,0.12)]">
      <form
        onSubmit={form.handleSubmit}
        className="relative z-10 flex flex-col gap-5 p-[26px] pb-[150px] min-[810px]:p-10 min-[810px]:pb-[170px]"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={copy.nameLabel} required error={getFieldError(form.errors, "name")}>
            <Input
              name="name"
              autoComplete="name"
              placeholder={copy.namePlaceholder}
              value={form.values.name}
              onChange={form.handleChange}
            />
          </Field>
          <Field label={copy.phoneLabel} required error={getFieldError(form.errors, "phone")}>
            <Input
              type="tel"
              name="phone"
              autoComplete="tel"
              placeholder={copy.phonePlaceholder}
              value={form.values.phone}
              onChange={form.handleChange}
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={copy.emailLabel} required error={getFieldError(form.errors, "email")}>
            <Input
              type="email"
              name="email"
              autoComplete="email"
              placeholder={copy.emailPlaceholder}
              value={form.values.email}
              onChange={form.handleChange}
            />
          </Field>
          <Field
            label={copy.dateLabel}
            required
            error={getFieldError(form.errors, "preferredDate")}
            hint={timeHint}
          >
            <Input
              type="date"
              name="preferredDate"
              min={minDate}
              value={form.values.preferredDate}
              onChange={form.handleChange}
            />
          </Field>
        </div>

        <button
          type="submit"
          disabled={form.status === "submitting"}
          className="inline-flex w-full items-center justify-center rounded-full bg-ink px-8 py-4 text-[16px] font-semibold text-white transition-opacity duration-200 hover:opacity-90 disabled:opacity-60 sm:w-auto"
        >
          {form.status === "submitting" ? copy.submittingLabel : copy.submitLabel}
        </button>

        <FormStatus status={form.status} message={form.message} />
      </form>

      <Image
        src={assets.hero.hills}
        alt=""
        width={1040}
        height={260}
        className="pointer-events-none absolute right-0 bottom-0 left-0 z-0 h-[140px] w-full object-cover object-top min-[810px]:h-[170px]"
      />
    </div>
  );
}
