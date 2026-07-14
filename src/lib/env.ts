import "server-only";

/**
 * Server-only environment access. The backend URL is never exposed to the
 * browser — all calls to the C# API go through the server action / BFF.
 */
const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:5000";
// OAuth2 credentials for a real Google account. A service account can't be used
// with a personal Gmail Drive because it has no storage quota of its own — files
// must be owned by an account with quota, so we authenticate as the user via a
// refresh token instead.
const GOOGLE_OAUTH_CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID ?? "";
const GOOGLE_OAUTH_CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET ?? "";
const GOOGLE_OAUTH_REFRESH_TOKEN = process.env.GOOGLE_OAUTH_REFRESH_TOKEN ?? "";
const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID ?? "";

export const env = {
  BACKEND_URL,
  GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET,
  GOOGLE_OAUTH_REFRESH_TOKEN,
  GOOGLE_DRIVE_FOLDER_ID,
} as const;
