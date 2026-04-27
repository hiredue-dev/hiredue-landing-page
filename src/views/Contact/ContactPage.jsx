"use client";

import { CheckCircle2, Mail, MapPin, Phone } from "lucide-react";
import { contactConfig } from "@/lib/config.js";
import Button from "@/components/ui/Button/Button.jsx";
import Input from "@/components/ui/Input/Input.jsx";
import Textarea from "@/components/ui/Textarea/Textarea.jsx";
import { contactPageContent } from "@/content/pages/contactPageContent.js";
import getFieldError from "@/utils/getFieldError.js";
import useContactForm from "@/features/contact/hooks/useContactForm.js";
import styles from "./ContactPage.module.css";

const ContactPage = () => {
  const form = useContactForm();

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <p className={styles.eyebrow}>{contactPageContent.eyebrow}</p>
          <h1 className={styles.heading}>{contactPageContent.heading}</h1>
          <p className={styles.lead}>{contactPageContent.lead}</p>
        </header>

        <div className={styles.layout}>
          <div className={styles.formColumn}>
            <form className={styles.form} onSubmit={form.handleSubmit}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="contact-name">{contactPageContent.form.nameLabel}</label>
                <Input
                  id="contact-name"
                  name="name"
                  type="text"
                  placeholder={contactPageContent.form.namePlaceholder}
                  value={form.values.name}
                  onChange={form.handleChange}
                />
                {getFieldError(form.errors, "name") ? <p className={styles.error}>{getFieldError(form.errors, "name")}</p> : null}
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="contact-email">{contactPageContent.form.emailLabel}</label>
                <Input
                  id="contact-email"
                  name="email"
                  type="email"
                  placeholder={contactPageContent.form.emailPlaceholder}
                  value={form.values.email}
                  onChange={form.handleChange}
                />
                {getFieldError(form.errors, "email") ? <p className={styles.error}>{getFieldError(form.errors, "email")}</p> : null}
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="contact-message">{contactPageContent.form.messageLabel}</label>
                <Textarea
                  id="contact-message"
                  name="message"
                  placeholder={contactPageContent.form.messagePlaceholder}
                  value={form.values.message}
                  onChange={form.handleChange}
                />
                {getFieldError(form.errors, "message") ? <p className={styles.error}>{getFieldError(form.errors, "message")}</p> : null}
              </div>

              <Button type="submit" size="lg" className={styles.button} disabled={form.status === "submitting"}>
                {form.status === "submitting" ? contactPageContent.form.submittingLabel : contactPageContent.form.submitLabel}
              </Button>

              {form.message ? (
                <p className={form.status === "success" ? styles.success : styles.errorMessage}>{form.message}</p>
              ) : null}
            </form>

            <div className={styles.altContact}>
              <p className={styles.altContactHeading}>{contactPageContent.alternateContactHeading}</p>
              <div className={styles.altContactRow}>
                <div className={styles.altContactItem}>
                  <span className={styles.altIconWrap}>
                    <Mail size={16} />
                  </span>
                  <span>{contactConfig.supportEmail}</span>
                </div>
                <div className={styles.altContactItem}>
                  <span className={styles.altIconWrap}>
                    <Phone size={16} />
                  </span>
                  <span>{contactConfig.phone}</span>
                </div>
              </div>
            </div>
          </div>

          <aside className={styles.infoColumn}>
            <h2 className={styles.infoTitle}>{contactPageContent.benefits.heading}</h2>
            <ul className={styles.benefitsList}>
              {contactPageContent.benefits.items.map((item) => (
                <li key={item} className={styles.benefitItem}>
                  <CheckCircle2 size={18} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className={styles.offices}>
              {contactConfig.offices.map((office) => (
                <div key={office.country} className={styles.officeCard}>
                  <div className={styles.officeHeader}>
                    <MapPin size={18} />
                    <h3>{office.country}</h3>
                  </div>
                  <div className={styles.officeLines}>
                    {office.lines.map((line) => (
                      <p key={`${office.country}-${line}`}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
