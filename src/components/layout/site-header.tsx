const NAV_LINKS = [
  "About Us",
  "Services",
  "Solutions",
  "Industries",
  "Clients",
  "Academy",
  "Media",
  "Careers",
  "Contact Us",
];

function DvtLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-11 h-11 rounded-full border border-dvt-blue/60 flex items-center justify-center">
        <span className="text-dvt-blue text-lg font-bold tracking-tight select-none lowercase">
          dvt
        </span>
      </div>
      <div className="hidden sm:block leading-tight">
        <p className="text-[9px] text-gray-400 tracking-wide">smart people</p>
        <p className="text-[9px] text-gray-400 tracking-wide">smart solutions</p>
      </div>
    </div>
  );
}

/** Static site header — a Server Component (ships no client JS). */
export function SiteHeader() {
  return (
    <header className="relative z-20">
      <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between gap-4">
        <DvtLogo />
        <nav className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map((item) => (
            <a
              key={item}
              href="#"
              className="text-[12px] text-gray-200 hover:text-dvt-blue transition-colors whitespace-nowrap"
            >
              {item}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
