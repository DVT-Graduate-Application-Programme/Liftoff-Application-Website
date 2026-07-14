/** Confirmation shown in the form card after a successful submission. */
export function SuccessMessage() {
  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-2xl px-8 py-10 text-center">
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
  );
}
