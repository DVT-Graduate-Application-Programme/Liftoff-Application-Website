import "server-only";

import { env } from "./env";

type IngestArgs = {
  candidateName: string;
  candidateEmail: string;
  cvUrl: string;
  transcriptUrl?: string | null;
  idempotencyKey: string;
};

/**
 * Thin, server-only wrapper around the C# ingest endpoint. This is the single
 * place that knows the backend's URL and multipart contract. The endpoint takes
 * the files as Google Drive URL strings (not the raw bytes), so we forward the
 * public links produced when the files were uploaded to Drive.
 */
export async function ingestApplication(args: IngestArgs): Promise<void> {
  const body = new FormData();
  body.append("candidateName", args.candidateName);
  body.append("candidateEmail", args.candidateEmail);
  body.append("cvFile", args.cvUrl);
  if (args.transcriptUrl) {
    body.append("transcriptFile", args.transcriptUrl);
  }

  const response = await fetch(`${env.BACKEND_URL}/api/applications/ingest`, {
    method: "POST",
    headers: { "Idempotency-Key": args.idempotencyKey },
    body,
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      detail || `Ingest endpoint responded with ${response.status}.`,
    );
  }
}
