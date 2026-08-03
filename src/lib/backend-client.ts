import "server-only";

import { env } from "./env";

type IngestArgs = {
  candidateName: string;
  candidateEmail: string;
  cv: File;
  transcript?: File | null;
  vacancyId?: string | null;
  idempotencyKey: string;
};

/**
 * Thin, server-only wrapper around the C# ingest endpoint. This is the single
 * place that knows the backend's URL and multipart contract.
 */
export async function ingestApplication(args: IngestArgs): Promise<void> {
  const body = new FormData();
  body.append("CandidateName", args.candidateName);
  body.append("CandidateEmail", args.candidateEmail);
  body.append("CvFile", args.cv);
  if (args.vacancyId) {
    body.append("VacancyId", args.vacancyId);
  }
  if (args.transcript && args.transcript.size > 0) {
    body.append("TranscriptFile", args.transcript);
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
