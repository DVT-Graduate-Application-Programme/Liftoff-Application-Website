import Link from "next/link";

const NAV_LINKS = [
  { name: "About Us", href: "/" },
  { name: "Services", href: "/" },
  { name: "Solutions", href: "/" },
  { name: "Industries", href: "/" },
  { name: "Clients", href: "/" },
  { name: "Academy", href: "/" },
  { name: "Media", href: "/" },
  { name: "Careers", href: "/careers" },
  { name: "Contact Us", href: "/" },
];

function DvtLogo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <div className="w-11 h-11 rounded-full border border-dvt-blue/60 flex items-center justify-center">
        <span className="text-dvt-blue text-lg font-bold tracking-tight select-none lowercase">
          dvt
        </span>
      </div>
      <div className="hidden sm:block leading-tight">
        <p className="text-[9px] text-gray-400 tracking-wide">smart people</p>
        <p className="text-[9px] text-gray-400 tracking-wide">smart solutions</p>
      </div>
    </Link>
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
            <Link
              key={item.name}
              href={item.href}
              className="text-[12px] text-gray-200 hover:text-dvt-blue transition-colors whitespace-nowrap"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
