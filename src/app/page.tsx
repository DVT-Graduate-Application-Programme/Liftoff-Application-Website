
"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";

// Three.js scene is client-only (WebGL) and non-critical, so load it lazily.
const TechStackScene = dynamic(() => import("@/components/tech-stack-scene"), {
  ssr: false,
});

const SA_LOCATIONS = ["Johannesburg", "Centurion", "Cape Town", "Durban"];

const COUNTRIES = [
  "South Africa",
  "Australia",
  "Ireland",
  "Kenya",
  "Netherlands",
  "United Arab Emirates",
  "United Kingdom",
];

type SubmitState = "idle" | "loading" | "success" | "error";

function DvtLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-11 h-11 rounded-full border border-dvt-blue/60 flex items-center justify-center">
        <span className="text-dvt-blue text-lg font-bold tracking-tight select-none lowercase">
          dvt
        </span>
      </div>
      <div className="hidden sm:block leading-tight">
        <p className="text-[9px] text-gray-400 tracking-wide">smart people</p>
        <p className="text-[9px] text-gray-400 tracking-wide">smart solutions</p>
      </div>
    </div>
  );
}

function Header() {
  const navLinks = [
    "About Us",
    "Services",
    "Solutions",
    "Industries",
    "Clients",
    "Academy",
    "Media",
    "Careers",
    "Contact Us",
  ];

  return (
    <header className="relative z-20">
      <div className="max-w-screen-xl mx-auto px-8 h-20 flex items-center justify-between gap-4">
        <DvtLogo />
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((item) => (
            <a
              key={item}
              href="#"
              className="text-[12px] text-gray-200 hover:text-dvt-blue transition-colors whitespace-nowrap"
            >
              {item}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

function SuccessScreen() {
  return (
    <div className="min-h-screen bg-dvt-navy flex items-center justify-center px-4">
      <div className="bg-white rounded-lg p-10 max-w-sm w-full text-center shadow-2xl">
        <div className="w-14 h-14 rounded-full bg-dvt-primary/10 flex items-center justify-center mx-auto mb-5">
          <svg
            className="w-7 h-7 text-dvt-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-dvt-midnight mb-2">
          Application Submitted!
        </h2>
        <p className="text-xs text-gray-500 leading-relaxed">
          Thank you for your interest in joining DVT. We&apos;ve received your
          application and will be in touch shortly.
        </p>
      </div>
    </div>
  );
}

function FileInput({
  label,
  required,
  file,
  onChange,
}: {
  label: string;
  required?: boolean;
  file: File | null;
  onChange: (f: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <p className="text-[12px] text-gray-600 mb-1">
        {label}
        {required && <span className="ml-0.5">*</span>}
      </p>
      <div className="flex items-center gap-2 text-[12px]">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="shrink-0 bg-[#e9e9ed] border border-[#b5b5bb] rounded-[3px] px-2.5 py-1 text-[12px] text-black hover:bg-[#dedee2] transition-colors"
        >
          Choose File
        </button>
        <span className="text-gray-500 truncate">
          {file ? file.name : "No file chosen"}
        </span>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          required={required}
          aria-label={label}
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
          className="hidden"
        />
      </div>
    </div>
  );
}

const inputCls =
  "w-full border border-gray-300 rounded-[3px] px-3 py-2 text-[13px] text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-dvt-primary transition-colors";

export default function ApplicationPage() {
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [locations, setLocations] = useState<string[]>([]);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [transcriptFile, setTranscriptFile] = useState<File | null>(null);
  const [university, setUniversity] = useState("");
  const [degree, setDegree] = useState("");
  const [yearOfCompletion, setYearOfCompletion] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const toggleLocation = (loc: string) => {
    setLocations((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc],
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!privacyConsent) {
      setErrorMessage(
        "Please accept the Privacy Notice and terms of service to proceed.",
      );
      return;
    }
    if (!cvFile) {
      setErrorMessage("Please upload your CV.");
      return;
    }

    setSubmitState("loading");
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("CandidateName", `${firstName} ${surname}`.trim());
      formData.append("CandidateEmail", email);
      formData.append("CvFile", cvFile);
      if (transcriptFile) {
        formData.append("TranscriptFile", transcriptFile);
      }

      const response = await fetch("/api/applications/ingest", {
        method: "POST",
        headers: { "Idempotency-Key": crypto.randomUUID() },
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(
          text || "Failed to submit your application. Please try again.",
        );
      }

      setSubmitState("success");
    } catch (err) {
      setSubmitState("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    }
  };

  if (submitState === "success") return <SuccessScreen />;

  return (
    <div className="relative min-h-screen bg-dvt-navy overflow-hidden">
      {/* Animated 3D cloud of DVT tech-stack logos */}
      <TechStackScene />
      {/* Gradient scrim keeps the hero copy readable over the animation */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(10,15,26,0.92)_0%,rgba(10,15,26,0.55)_45%,rgba(10,15,26,0.25)_100%)]"
      />

      <div className="relative z-10">
        <Header />

        <main className="max-w-screen-xl mx-auto px-8 pb-20">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-6">
            {/* Left hero copy */}
            <section className="w-full lg:w-1/2 pt-10 lg:pt-24">
              <div className="max-w-md">
                <h1 className="text-3xl font-bold leading-tight mb-4">
                  <span className="text-dvt-blue">
                    World Class IT services.
                  </span>
                  <br />
                  <span className="text-white">
                    Regional presence to partner with you for{" "}
                  </span>
                  <span className="text-dvt-blue">success.</span>
                </h1>
                <p className="text-[12px] text-gray-400 leading-relaxed">
                  <span className="text-dvt-blue underline">DVT</span> leadership
                  and experts are located across South Africa (Cape Town,
                  Johannesburg and Durban) and key customer regions, including
                  the United Kingdom, Ireland, Netherlands, Australia, Kenya,
                  and the United Arab Emirates. We offer local capability to
                  partner with you for all your service requirements and global
                  scalability to ensure fast, efficient, and effective
                  fulfilment of your IT service and staffing needs. We are ready
                  to partner with you.{" "}
                  <span className="text-dvt-blue underline">Contact</span> your
                  local DVT leadership today to get started.
                </p>
              </div>
            </section>

            {/* Right white form card */}
            <section className="w-full lg:w-1/2 flex lg:justify-end">
              <div className="w-full max-w-md bg-white rounded-lg shadow-2xl px-8 py-7">
                <h2 className="text-[26px] font-light text-gray-500 mb-5">
                  <span className="font-bold text-dvt-primary">Graduate</span>{" "}
                  Enquiries
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={inputCls}
                  />

                  <input
                    type="text"
                    placeholder="Surname"
                    required
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    className={inputCls}
                  />

                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputCls}
                  />

                  <input
                    type="tel"
                    placeholder="Phone no"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={inputCls}
                  />

                  {/* Location checkboxes */}
                  <div className="flex flex-col gap-1.5 py-1">
                    {SA_LOCATIONS.map((loc) => (
                      <label
                        key={loc}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={locations.includes(loc)}
                          onChange={() => toggleLocation(loc)}
                          className="accent-dvt-primary w-3.5 h-3.5"
                        />
                        <span className="text-[12px] text-gray-600">{loc}</span>
                      </label>
                    ))}
                  </div>

                  <FileInput
                    label="Upload your CV"
                    required
                    file={cvFile}
                    onChange={setCvFile}
                  />

                  <FileInput
                    label="Upload your Academic transcript"
                    file={transcriptFile}
                    onChange={setTranscriptFile}
                  />

                  <input
                    type="text"
                    placeholder="University where you studied"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className={inputCls}
                  />

                  <input
                    type="text"
                    placeholder="Degree"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    className={inputCls}
                  />

                  <input
                    type="text"
                    placeholder="Year/expected year of completion"
                    value={yearOfCompletion}
                    onChange={(e) => setYearOfCompletion(e.target.value)}
                    className={inputCls}
                  />

                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    aria-label="Country"
                    className={`${inputCls} ${!country ? "text-gray-400" : ""}`}
                  >
                    <option value="" disabled>
                      Please select a country
                    </option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={inputCls}
                  />

                  {/* Privacy consent */}
                  <label className="flex items-start gap-2 cursor-pointer pt-0.5">
                    <input
                      type="checkbox"
                      checked={privacyConsent}
                      onChange={(e) => setPrivacyConsent(e.target.checked)}
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
                      and I grant DVT permission to process the personal
                      information provided.
                    </span>
                  </label>

                  {errorMessage && (
                    <p className="text-[11px] text-red-500 -mt-1">
                      {errorMessage}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitState === "loading"}
                    className="mt-2 w-full rounded-[3px] py-2.5 text-sm font-medium text-white bg-dvt-primary hover:bg-[#006a9e] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitState === "loading"
                      ? "Submitting…"
                      : "Submit Application"}
                  </button>
                </form>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
