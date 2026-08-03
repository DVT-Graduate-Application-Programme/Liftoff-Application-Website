"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Native file input styled to match the browser's "Choose File / No file
 * chosen" look. Uncontrolled (has a real `name`) so it's part of the form's
 * FormData; a little local state only tracks the chosen file.
 */
export function FileInput({
  name,
  label,
  required,
}: {
  name: string;
  label: string;
  required?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const input = inputRef.current;
    const form = input?.form;
    if (!input || !form || !file) return;

    // React resets the form after every action, failed ones included, which
    // drops the file selection. A file can't be restored via defaultValue like
    // the text fields, so re-attach it once the reset has run.
    const restore = () =>
      queueMicrotask(() => {
        if (input.files?.length) return;
        const transfer = new DataTransfer();
        transfer.items.add(file);
        input.files = transfer.files;
      });

    form.addEventListener("reset", restore);
    return () => form.removeEventListener("reset", restore);
  }, [file]);

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
          {file?.name ?? "No file chosen"}
        </span>
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept=".pdf,.doc,.docx"
          required={required}
          aria-label={label}
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          className="hidden"
        />
      </div>
    </div>
  );
}
