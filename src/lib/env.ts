import "server-only";

/**
 * Server-only environment access. The backend URL is never exposed to the
 * browser — all calls to the C# API go through the server action / BFF.
 */
const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:5000";
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ?? "";
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY ?? "";
const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID ?? "";

export const env = {
  BACKEND_URL,
  GOOGLE_SERVICE_ACCOUNT_EMAIL,
  GOOGLE_PRIVATE_KEY,
  GOOGLE_DRIVE_FOLDER_ID,
} as const;
