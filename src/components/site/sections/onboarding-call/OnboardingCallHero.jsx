"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { SplitHero } from "@/components/site/ui/PageHero";
import { FormCard, FormInput } from "@/components/site/ui/FormField";
import { assets } from "@/lib/assets";
import { onboardingCallPage } from "@/lib/content";
import useOnboardingCallForm from "@/features/onboarding-call/hooks/useOnboardingCallForm";

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
    <SplitHero
      eyebrow={hero.eyebrow}
      title={hero.title}
      titleClassName="whitespace-pre-line"
      description={hero.description}
      aside={<OnboardingCallForm form={form} />}
    >
      <ul className="flex flex-col gap-2.5">
        {hero.points.map((point) => (
          <li key={point} className="flex items-start gap-1.5">
            <Image src={assets.icons.chevronBlue} alt="" width={7} height={10} className="mt-[7px] w-[7px] shrink-0" />
            <span className="text-[16px] leading-[1.3] font-medium text-ink">{point}</span>
          </li>
        ))}
      </ul>
    </SplitHero>
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
    <FormCard form={form} submitLabel={copy.submitLabel} submittingLabel={copy.submittingLabel}>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormInput form={form} name="name" label={copy.nameLabel} required autoComplete="name" placeholder={copy.namePlaceholder} />
        <FormInput form={form} name="phone" label={copy.phoneLabel} required type="tel" autoComplete="tel" placeholder={copy.phonePlaceholder} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormInput form={form} name="email" label={copy.emailLabel} required type="email" autoComplete="email" placeholder={copy.emailPlaceholder} />
        <FormInput form={form} name="preferredDate" label={copy.dateLabel} required hint={timeHint} type="date" min={minDate} />
      </div>
    </FormCard>
  );
}
