import { z } from "zod";

/* Any country: Indian numbers keep the strict mobile check (10 digits,
   starting 6-9); elsewhere, 5-14 digits — E.164 caps the whole number at 15,
   and the country code takes at least one. */
export const waitlistSchema = z
  .object({
    email: z.string().trim().email("Enter a valid email address."),
    name: z.string().trim().min(2, "Enter your name."),
    countryCode: z.string().trim().min(2),
    phone: z.string().trim(),
  })
  .superRefine(({ countryCode, phone }, ctx) => {
    const valid = countryCode === "IN" ? /^[6-9]\d{9}$/.test(phone) : /^\d{5,14}$/.test(phone);
    if (!valid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["phone"],
        message: countryCode === "IN" ? "Enter a valid 10-digit mobile number." : "Enter a valid phone number, digits only.",
      });
    }
  });

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z.string().trim().optional(),
  subject: z.string().trim().optional(),
  message: z.string().trim().min(10, "Tell us a little more so we can help."),
});

export const onboardingCallSchema = z.object({
  name: z.string().trim().min(2, "Enter your name."),
  phone: z
    .string()
    .trim()
    .refine((val) => (val.match(/\d/g) || []).length >= 5, "Enter a valid phone number."),
  email: z.string().trim().email("Enter a valid email address."),
  preferredDate: z.string().trim().min(1, "Choose a preferred date."),
});

export const formatZodErrors = (error) =>
  error.issues.reduce((accumulator, issue) => {
    const fieldName = issue.path[0] || "root";
    if (!accumulator[fieldName]) {
      accumulator[fieldName] = [];
    }
    accumulator[fieldName].push(issue.message);
    return accumulator;
  }, {});
