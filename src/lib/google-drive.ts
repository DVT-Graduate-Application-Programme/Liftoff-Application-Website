import { google } from "googleapis";
import { Readable } from "stream";
import { env } from "./env";

/**
 * Helper to upload a file (as a Buffer/Readable) to Google Drive,
 * make it public, and return the shareable webViewLink.
 */
export async function uploadToGoogleDrive(
  file: File,
): Promise<{ fileId: string; webViewLink: string }> {
  const clientId = env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = env.GOOGLE_OAUTH_CLIENT_SECRET;
  const refreshToken = env.GOOGLE_OAUTH_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      "Google OAuth credentials are not configured. Please check your environment variables."
    );
  }

  // Authenticate as a real Google account via OAuth2. The refresh token lets us
  // mint access tokens without user interaction; uploaded files are owned by
  // (and count against the quota of) that account.
  const auth = new google.auth.OAuth2(clientId, clientSecret);
  auth.setCredentials({ refresh_token: refreshToken });

  const drive = google.drive({ version: "v3", auth });

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const mediaStream = Readable.from(buffer);

  const fileMetadata: { name: string; parents?: string[] } = {
    name: file.name,
  };

  // If a destination folder is configured, put the file inside it
  if (env.GOOGLE_DRIVE_FOLDER_ID) {
    fileMetadata.parents = [env.GOOGLE_DRIVE_FOLDER_ID];
  }

  const driveFile = await drive.files.create({
    requestBody: fileMetadata,
    media: {
      mimeType: file.type || "application/octet-stream",
      body: mediaStream,
    },
    fields: "id",
  });

  const fileId = driveFile.data.id;
  if (!fileId) {
    throw new Error("Failed to create file on Google Drive (no file ID returned).");
  }

  // Create permission to make the file public (anyone with the link can read)
  await drive.permissions.create({
    fileId: fileId,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });

  // Retrieve the public webViewLink
  const fileInfo = await drive.files.get({
    fileId: fileId,
    fields: "webViewLink",
  });

  const webViewLink = fileInfo.data.webViewLink;
  if (!webViewLink) {
    throw new Error("Failed to retrieve public webViewLink from Google Drive.");
  }

  return {
    fileId,
    webViewLink,
  };
}
