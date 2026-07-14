"use client";

import dynamic from "next/dynamic";

// WebGL is client-only and non-critical, so the scene is lazily loaded with no
// SSR. This wrapper exists because `ssr: false` isn't allowed directly inside a
// Server Component (which is what page.tsx now is).
const TechStackScene = dynamic(() => import("./tech-stack-scene"), {
  ssr: false,
});

export function TechStackBackground() {
  return <TechStackScene />;
}
