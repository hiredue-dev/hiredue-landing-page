import { z } from "zod";

export const waitlistSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  name: z.string().trim().min(2, "Enter your name."),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number."),
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
