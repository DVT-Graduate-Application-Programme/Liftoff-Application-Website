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
  const email = env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = env.GOOGLE_PRIVATE_KEY;

  if (!email || !privateKey) {
    throw new Error(
      "Google Service Account credentials are not configured. Please check your environment variables."
    );
  }

  // Convert literal escape \n sequences to actual newlines
  const formattedPrivateKey = privateKey.replace(/\\n/g, "\n");

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: email,
      private_key: formattedPrivateKey,
    },
    scopes: ["https://www.googleapis.com/auth/drive"],
  });

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
