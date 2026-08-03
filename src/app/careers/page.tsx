import { SiteHeader } from "@/components/layout/site-header";
import { TechStackBackground } from "@/components/tech-stack-background";
import { CareersClient } from "@/components/careers/careers-client";

export default function CareersPage() {
  return (
    <div className="relative min-h-screen bg-dvt-navy text-white overflow-x-hidden">
      {/* Tech Stack Animation Background */}
      <TechStackBackground />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(10,15,26,0.95)_0%,rgba(10,15,26,0.75)_50%,rgba(10,15,26,0.95)_100%)]"
      />

      <div className="relative z-10">
        <SiteHeader />

        <main className="max-w-7xl mx-auto px-6 py-12">
          {/* Header Banner */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-dvt-blue/15 px-3 py-1 text-xs font-semibold text-dvt-blue border border-dvt-blue/30 backdrop-blur-md mb-4">
              <span>🚀</span> DVT Graduate & Junior Intakes 2026
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
              Explore Careers at <span className="text-dvt-blue">DVT</span>
            </h1>
            <p className="text-sm text-gray-300 leading-relaxed">
              Join South Africa's premier technology & software engineering consultancy. Discover open graduate programs, apply directly online, and take the first step towards a world-class IT career.
            </p>
          </div>

          <CareersClient />
        </main>
      </div>
    </div>
  );
}
