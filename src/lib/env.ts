import "server-only";

/**
 * Server-only environment access. The backend URL is never exposed to the
 * browser — all calls to the C# API go through the server action / BFF.
 */
const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:5000";

export const env = {
  BACKEND_URL,
} as const;
