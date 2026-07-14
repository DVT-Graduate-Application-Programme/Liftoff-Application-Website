"use client";

import { useActionState } from "react";
import { submitApplication } from "@/app/apply/actions";
import {
  SA_LOCATIONS,
  COUNTRIES,
  initialApplicationState,
  type ApplicationFormState,
} from "@/lib/application-schema";
import { FileInput } from "./file-input";
import { SuccessMessage } from "./success-message";

const inputCls =
  "w-full border border-gray-300 rounded-[3px] px-3 py-2 text-[13px] text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-dvt-primary transition-colors";

function FieldError({
  errors,
  name,
}: {
  errors: ApplicationFormState["fieldErrors"];
  name: string;
}) {
  const message = errors?.[name as keyof typeof errors];
  if (!message) return null;
  return <p className="text-[11px] text-red-500 -mt-1">{message}</p>;
}

/** Interactive client island — the whole apply form, driven by useActionState. */
export function ApplicationForm() {
  const [state, formAction, isPending] = useActionState(
    submitApplication,
    initialApplicationState,
  );

  if (state.status === "success") return <SuccessMessage />;

  const errors = state.fieldErrors;

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-2xl px-8 py-7">
      <h2 className="text-[26px] font-light text-gray-500 mb-5">
        <span className="font-bold text-dvt-primary">Graduate</span> Enquiries
      </h2>

      <form action={formAction} className="flex flex-col gap-3" noValidate>
        <input
          type="text"
          name="firstName"
          placeholder="Name"
          required
          className={inputCls}
        />
        <FieldError errors={errors} name="firstName" />

        <input
          type="text"
          name="surname"
          placeholder="Surname"
          required
          className={inputCls}
        />
        <FieldError errors={errors} name="surname" />

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className={inputCls}
        />
        <FieldError errors={errors} name="email" />

        <input
          type="tel"
          name="phone"
          placeholder="Phone no"
          className={inputCls}
        />

        {/* City preference */}
        <div className="flex flex-col gap-1.5 py-1">
          {SA_LOCATIONS.map((location) => (
            <label
              key={location}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                name="locations"
                value={location}
                className="accent-dvt-primary w-3.5 h-3.5"
              />
              <span className="text-[12px] text-gray-600">{location}</span>
            </label>
          ))}
        </div>

        <FileInput name="cv" label="Upload your CV" required />
        <FieldError errors={errors} name="cv" />

        <FileInput name="transcript" label="Upload your Academic transcript" />
        <FieldError errors={errors} name="transcript" />

        <input
          type="text"
          name="university"
          placeholder="University where you studied"
          className={inputCls}
        />

        <input
          type="text"
          name="degree"
          placeholder="Degree"
          className={inputCls}
        />

        <input
          type="text"
          name="yearOfCompletion"
          placeholder="Year/expected year of completion"
          className={inputCls}
        />

        <select name="country" defaultValue="" aria-label="Country" className={inputCls}>
          <option value="" disabled>
            Please select a country
          </option>
          {COUNTRIES.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="city"
          placeholder="City"
          className={inputCls}
        />

        <label className="flex items-start gap-2 cursor-pointer pt-0.5">
          <input
            type="checkbox"
            name="privacyConsent"
            value="yes"
            required
            className="accent-dvt-primary mt-0.5 w-3.5 h-3.5 shrink-0"
          />
          <span className="text-[11px] text-gray-500 leading-relaxed">
            I have read, understand and accept the{" "}
            <a href="#" className="text-dvt-primary underline">
              Privacy Notice
            </a>{" "}
            and{" "}
            <a href="#" className="text-dvt-primary underline">
              terms of service
            </a>{" "}
            and I grant DVT permission to process the personal information
            provided.
          </span>
        </label>
        <FieldError errors={errors} name="privacyConsent" />

        {state.status === "error" && state.message && (
          <p className="text-[11px] text-red-500 -mt-1">{state.message}</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="mt-2 w-full rounded-[3px] py-2.5 text-sm font-medium text-white bg-dvt-primary hover:bg-[#006a9e] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Submitting…" : "Submit Application"}
        </button>
      </form>
    </div>
  );
}
