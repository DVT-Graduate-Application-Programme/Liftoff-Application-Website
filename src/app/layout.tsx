import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Graduate Enquiries | DVT",
  description: "Apply to DVT's graduate developer programme.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
