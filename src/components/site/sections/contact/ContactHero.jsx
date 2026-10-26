"use client";

import Image from "next/image";
import { Eyebrow } from "@/components/site/ui/Primitives";
import { Field, FormCard, FormInput, controlClass } from "@/components/site/ui/FormField";
import { assets } from "@/lib/assets";
import { contactPage } from "@/lib/content";
import { appear } from "@/lib/motion";
import useContactForm from "@/features/contact/hooks/useContactForm";
import getFieldError from "@/utils/getFieldError";

const { hero } = contactPage;

export function ContactHero() {
  const form = useContactForm();

  return (
    <section className="relative isolate flex flex-col overflow-hidden bg-white pt-[128px] pb-[100px] min-[810px]:pt-[158px] min-[810px]:pb-[160px] min-[1200px]:pt-[194px] min-[1200px]:pb-[200px]">
      <div className="container-page relative z-[2]">
        <div className="grid gap-[60px] min-[1200px]:grid-cols-[1fr_520px] min-[1200px]:items-start min-[1200px]:gap-[50px]">
          <div
            style={appear(0.1)}
            className="appear flex flex-col items-start gap-5 min-[1200px]:gap-8 min-[1200px]:pt-2.5"
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
          </div>

          <div style={appear(0.25)} className="appear">
            <ContactForm form={form} />
          </div>
        </div>
      </div>
    </section>
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
