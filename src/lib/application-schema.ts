import { z } from "zod";

export const SA_LOCATIONS = [
  "Johannesburg",
  "Centurion",
  "Cape Town",
  "Durban",
] as const;

export const COUNTRIES = [
  "South Africa",
  "Australia",
  "Ireland",
  "Kenya",
  "Netherlands",
  "United Arab Emirates",
  "United Kingdom",
] as const;

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB

const cvSchema = z
  .instanceof(File, { message: "Please upload your CV." })
  .refine((file) => file.size > 0, "Please upload your CV.")
  .refine(
    (file) => file.size <= MAX_FILE_BYTES,
    "Your CV must be 10MB or smaller.",
  );

const transcriptSchema = z
  .instanceof(File)
  .optional()
  .nullable()
  // An untouched file input still submits an empty File — treat it as "none".
  .transform((file) => (file && file.size > 0 ? file : null))
  .refine(
    (file) => !file || file.size <= MAX_FILE_BYTES,
    "Your transcript must be 10MB or smaller.",
  );

/**
 * Authoritative validation for an application submission. Shared so the client
 * can reuse it for instant feedback if desired; the server action always
 * re-validates with it (never trust the client).
 */
export const applicationSchema = z.object({
  firstName: z.string().trim().min(1, "Name is required."),
  surname: z.string().trim().min(1, "Surname is required."),
  email: z.email("Enter a valid email address."),
  phone: z.string().trim().default(""),
  locations: z.array(z.string()).default([]),
  cv: cvSchema,
  transcript: transcriptSchema,
  university: z.string().trim().default(""),
  degree: z.string().trim().default(""),
  yearOfCompletion: z.string().trim().default(""),
  country: z.string().trim().default(""),
  city: z.string().trim().default(""),
  privacyConsent: z
    .boolean()
    .refine(
      (value) => value === true,
      "Please accept the Privacy Notice and terms of service to continue.",
    ),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

export type ApplicationFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<keyof ApplicationInput, string>>;
};

export const initialApplicationState: ApplicationFormState = { status: "idle" };
