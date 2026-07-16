"use server";

import {
  applicationSchema,
  type ApplicationFormState,
  type ApplicationInput,
  type ApplicationValues,
} from "@/lib/application-schema";
import { ingestApplication } from "@/lib/backend-client";

const text = (formData: FormData, name: string) => {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
};

/**
 * Reads back exactly what the candidate typed, so a failed submission can be
 * re-rendered with their answers intact rather than an empty form.
 */
function readValues(formData: FormData): ApplicationValues {
  return {
    firstName: text(formData, "firstName"),
    surname: text(formData, "surname"),
    email: text(formData, "email"),
    phone: text(formData, "phone"),
    locations: formData.getAll("locations").filter((v) => typeof v === "string"),
    university: text(formData, "university"),
    degree: text(formData, "degree"),
    yearOfCompletion: text(formData, "yearOfCompletion"),
    country: text(formData, "country"),
    city: text(formData, "city"),
    privacyConsent: formData.get("privacyConsent") === "yes",
  };
}

/**
 * Backend-for-Frontend submission handler. Runs on the Next server: validates
 * with the shared zod schema, generates the idempotency key, and forwards to
 * the C# API via the server-only backend client. The browser never sees the
 * backend URL. (Spam protection / reCAPTCHA verification would live here too.)
 */
export async function submitApplication(
  _previousState: ApplicationFormState,
  formData: FormData,
): Promise<ApplicationFormState> {
  const values = readValues(formData);

  const parsed = applicationSchema.safeParse({
    firstName: formData.get("firstName"),
    surname: formData.get("surname"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    locations: formData.getAll("locations"),
    cv: formData.get("cv"),
    transcript: formData.get("transcript"),
    university: formData.get("university"),
    degree: formData.get("degree"),
    yearOfCompletion: formData.get("yearOfCompletion"),
    country: formData.get("country"),
    city: formData.get("city"),
    privacyConsent: formData.get("privacyConsent") === "yes",
  });

  if (!parsed.success) {
    const fieldErrors: ApplicationFormState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof ApplicationInput | undefined;
      if (key && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }

    return {
      status: "error",
      message: "Please fix the highlighted fields and try again.",
      fieldErrors,
      values,
    };
  }

  const data = parsed.data;

  try {
    await ingestApplication({
      candidateName: `${data.firstName} ${data.surname}`.trim(),
      candidateEmail: data.email,
      cv: data.cv,
      transcript: data.transcript,
      idempotencyKey: crypto.randomUUID(),
    });
  } catch {
    return {
      status: "error",
      message:
        "We couldn't submit your application right now. Please try again in a moment.",
      values,
    };
  }

  return { status: "success" };
}
