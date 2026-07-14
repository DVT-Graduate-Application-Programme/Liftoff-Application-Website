import { SiteHeader } from "@/components/layout/site-header";
import { TechStackBackground } from "@/components/tech-stack-background";
import { ApplicationForm } from "@/components/apply/application-form";

/**
 * Server Component shell. Static header/hero render on the server (fast first
 * paint, no client JS); only the two interactive islands ship to the browser:
 * the 3D background and the application form.
 */
export default function ApplicationPage() {
  return (
    <div className="relative min-h-screen bg-dvt-navy overflow-hidden">
      {/* Animated 3D cloud of DVT tech-stack logos (client island) */}
      <TechStackBackground />
      {/* Gradient scrim keeps the hero copy readable over the animation */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(10,15,26,0.92)_0%,rgba(10,15,26,0.55)_45%,rgba(10,15,26,0.25)_100%)]"
      />

      <div className="relative z-10">
        <SiteHeader />

        <main className="max-w-7xl mx-auto px-8 pb-20">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-6">
            {/* Left hero copy */}
            <section className="w-full lg:w-1/2 pt-10 lg:pt-24">
              <div className="max-w-md">
                <h1 className="text-3xl font-bold leading-tight mb-4">
                  <span className="text-dvt-blue">World Class IT services.</span>
                  <br />
                  <span className="text-white">
                    Regional presence to partner with you for{" "}
                  </span>
                  <span className="text-dvt-blue">success.</span>
                </h1>
                <p className="text-[12px] text-gray-400 leading-relaxed">
                  <span className="text-dvt-blue underline">DVT</span> leadership
                  and experts are located across South Africa (Cape Town,
                  Johannesburg and Durban) and key customer regions, including
                  the United Kingdom, Ireland, Netherlands, Australia, Kenya,
                  and the United Arab Emirates. We offer local capability to
                  partner with you for all your service requirements and global
                  scalability to ensure fast, efficient, and effective
                  fulfilment of your IT service and staffing needs. We are ready
                  to partner with you.{" "}
                  <span className="text-dvt-blue underline">Contact</span> your
                  local DVT leadership today to get started.
                </p>
              </div>
            </section>

            {/* Right form island */}
            <section className="w-full lg:w-1/2 flex lg:justify-end">
              <ApplicationForm />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
