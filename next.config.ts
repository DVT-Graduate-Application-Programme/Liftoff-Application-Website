import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // CVs / transcripts are uploaded through the submitApplication server
      // action, so lift the default 1MB body cap.
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
