import { Outlet } from "react-router-dom";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0d1a] via-[#0f1224] to-[#0b0d1a] text-foreground relative">
      {/* decorative site background accents */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {/* grid pattern */}
        <div className="absolute inset-0 bg-grid opacity-35" />
        {/* top-to-bottom green wash (subtle, full height) */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-700/10 via-emerald-600/5 to-transparent" />
        {/* soft blobs */}
        <div className="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute bottom-[-6rem] right-1/5 h-80 w-80 rounded-full bg-teal-400/10 blur-[100px]" />
      </div>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-primary text-primary-foreground px-3 py-2 rounded-md"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" className="relative">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
