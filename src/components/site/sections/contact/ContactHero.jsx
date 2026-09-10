"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Eyebrow } from "@/components/site/ui/Primitives";
import { assets } from "@/lib/assets";
import { contactPage } from "@/lib/content";
import { spring } from "@/lib/motion";
import useContactForm from "@/features/contact/hooks/useContactForm";
import getFieldError from "@/utils/getFieldError";

const appear = (delay) => ({
  initial: { opacity: 0.001, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: spring(1, delay),
});

const { hero } = contactPage;

export function ContactHero() {
  const form = useContactForm();

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
            <ContactForm form={form} />
          </motion.div>
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
            className="w-full resize-none rounded-[12px] border border-line bg-white px-4 py-3 text-[15px] leading-[1.4] font-medium text-ink placeholder:text-dim/70 focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none"
          />
        </Field>

        <button
          type="submit"
          disabled={form.status === "submitting"}
          className="inline-flex w-full items-center justify-center rounded-full bg-ink px-8 py-4 text-[16px] font-semibold text-white transition-opacity duration-200 hover:opacity-90 disabled:opacity-60 sm:w-auto"
        >
          {form.status === "submitting" ? copy.submittingLabel : copy.submitLabel}
        </button>

        {form.message && (
          <p
            className={
              form.status === "success"
                ? "text-[14px] font-medium text-success"
                : "text-[14px] font-medium text-danger"
            }
          >
            {form.message}
          </p>
        )}
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

function Field({ label, required, error, children }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[14px] leading-[1.3] font-medium text-ink">
        {label}
        {required && <span className="text-brand">*</span>}
      </span>
      {children}
      {error && <span className="text-[13px] leading-[1.3] font-medium text-danger">{error}</span>}
    </label>
  );
}

function Input({ className, ...rest }) {
  return (
    <input
      {...rest}
      className={`w-full rounded-[12px] border border-line bg-white px-4 py-3 text-[15px] font-medium text-ink placeholder:text-dim/70 focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none ${className ?? ""}`}
    />
  );
}
