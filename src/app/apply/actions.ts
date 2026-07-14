"use server";

import {
  applicationSchema,
  type ApplicationFormState,
  type ApplicationInput,
} from "@/lib/application-schema";
import { ingestApplication } from "@/lib/backend-client";

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
    };
  }

  return { status: "success" };
}
