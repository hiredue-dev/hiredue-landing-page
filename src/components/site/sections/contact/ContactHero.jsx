"use client";

import Image from "next/image";
import { Eyebrow } from "@/components/site/ui/Primitives";
import { Field, FormStatus, Input, controlClass } from "@/components/site/ui/FormField";
import { assets } from "@/lib/assets";
import { contactPage } from "@/lib/content";
import { appear } from "@/lib/motion";
import useContactForm from "@/features/contact/hooks/useContactForm";
import getFieldError from "@/utils/getFieldError";
import { Busy } from "@/components/site/ui/Spinner";

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
    <div className="relative w-full overflow-hidden rounded-[30px] bg-surface shadow-[0_24px_60px_rgba(29,29,29,0.12)]">
      <form
        onSubmit={form.handleSubmit}
        className="relative z-10 flex flex-col gap-5 p-[26px] pb-[150px] min-[810px]:p-10 min-[810px]:pb-[170px]"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label={copy.nameLabel}
            required
            error={getFieldError(form.errors, "name")}
          >
            <Input
              name="name"
              autoComplete="name"
              placeholder={copy.namePlaceholder}
              value={form.values.name}
              onChange={form.handleChange}
            />
          </Field>
          <Field
            label={copy.emailLabel}
            required
            error={getFieldError(form.errors, "email")}
          >
            <Input
              type="email"
              name="email"
              autoComplete="email"
              placeholder={copy.emailPlaceholder}
              value={form.values.email}
              onChange={form.handleChange}
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={copy.phoneLabel}>
            <Input
              type="tel"
              name="phone"
              autoComplete="tel"
              placeholder={copy.phonePlaceholder}
              value={form.values.phone}
              onChange={form.handleChange}
            />
          </Field>
          <Field label={copy.subjectLabel}>
            <Input
              name="subject"
              placeholder={copy.subjectPlaceholder}
              value={form.values.subject}
              onChange={form.handleChange}
            />
          </Field>
        </div>

        <Field
          label={copy.messageLabel}
          required
          error={getFieldError(form.errors, "message")}
        >
          <textarea
            name="message"
            rows={4}
            placeholder={copy.messagePlaceholder}
            value={form.values.message}
            onChange={form.handleChange}
            className={`${controlClass} resize-none leading-[1.4]`}
          />
        </Field>

        <button
          type="submit"
          disabled={form.status === "submitting"}
          className="inline-flex w-full items-center justify-center rounded-full bg-ink px-8 py-4 text-[16px] font-semibold text-white transition-opacity duration-200 hover:opacity-90 disabled:opacity-60 sm:w-auto"
        >
          <Busy busy={form.status === "submitting"} label={copy.submittingLabel}>{copy.submitLabel}</Busy>
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
