"use client";

import Image from "next/image";
import { SplitHero } from "@/components/site/ui/PageHero";
import { Field, FormCard, FormInput, controlClass } from "@/components/site/ui/FormField";
import { assets } from "@/lib/assets";
import { contactPage } from "@/lib/content";
import useContactForm from "@/features/contact/hooks/useContactForm";
import getFieldError from "@/utils/getFieldError";

const { hero } = contactPage;

export function ContactHero() {
  const form = useContactForm();

  return (
    <SplitHero
      eyebrow={hero.eyebrow}
      title={hero.title}
      titleClassName="whitespace-pre-line"
      description={hero.description}
      aside={<ContactForm form={form} />}
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

function ContactForm({ form }) {
  const { form: copy } = hero;

  return (
    <FormCard form={form} submitLabel={copy.submitLabel} submittingLabel={copy.submittingLabel}>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormInput form={form} name="name" label={copy.nameLabel} required autoComplete="name" placeholder={copy.namePlaceholder} />
        <FormInput form={form} name="email" label={copy.emailLabel} required type="email" autoComplete="email" placeholder={copy.emailPlaceholder} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormInput form={form} name="phone" label={copy.phoneLabel} type="tel" autoComplete="tel" placeholder={copy.phonePlaceholder} />
        <FormInput form={form} name="subject" label={copy.subjectLabel} placeholder={copy.subjectPlaceholder} />
      </div>

      <Field label={copy.messageLabel} required error={getFieldError(form.errors, "message")}>
        <textarea
          name="message"
          rows={4}
          placeholder={copy.messagePlaceholder}
          value={form.values.message}
          onChange={form.handleChange}
          className={`${controlClass} resize-none leading-[1.4]`}
        />
      </Field>
    </FormCard>
  );
}
