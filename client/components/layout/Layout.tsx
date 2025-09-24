import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isCheckout = location.pathname.startsWith("/checkout");
  return (
    <div className="min-h-screen text-foreground relative">
      {/* Global site background (applies to ALL pages and scrolls with content) */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        {/* Base dark green */}
        <div className="absolute inset-0 bg-[#06100A]" />
        {/* Black band at top */}
        <div className="absolute top-0 left-0 w-full h-[28vh] bg-black animate-parallax-slowest" />
        {/* Hero image overlay from design */}
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/ed571ffbd0ce06ccb37975827a27a2ccfc7fca0b?width=3840"
          alt="Design background"
          className="absolute top-0 left-0 w-full h-[60vh] md:h-[65vh] lg:h-[72vh] xl:h-[80vh] 2xl:h-[88vh] object-cover [mix-blend-mode:plus-darker] opacity-90 animate-bg-pan-slow"
        />
        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 w-full h-[22vh] bg-[linear-gradient(272deg,_#030B06_78.54%,_rgba(35,113,66,0.10)_136.71%)] animate-parallax-slow" />
        {/* Central vertical gradient */}
              </div>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-primary text-primary-foreground px-3 py-2 rounded-md"
      >
        Skip to content
      </a>
      {isCheckout ? (
        <>
          <div className="fixed top-0 left-0 z-[100] w-full border-b border-white/5 bg-inherit relative overflow-hidden">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F5c5b380fe72143a0b67648f4f64f4bf0%2F1313854b765941a69515b27ddb90a7ff?format=webp&width=800"
              alt="Checkout banner"
              className="w-full h-16 md:h-24 object-contain object-center cursor-pointer"
              onClick={() => navigate('/')}
              role="link"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate('/'); }}
            />

            {/* decorative liquid spill on the left */}
            <svg className="absolute left-0 top-0 bottom-0 w-20 md:w-32 h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
              <path d="M0,0 C40,20 60,20 80,0 C95,10 95,40 80,55 C60,75 40,80 20,70 C5,62 0,50 0,30 Z" fill="#00140d" fillOpacity="0.98" />
            </svg>

            {/* decorative liquid spill on the right (mirrored) */}
            <svg className="absolute right-0 top-0 bottom-0 w-20 md:w-32 h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
              <path d="M100,0 C60,20 40,20 20,0 C5,10 5,40 20,55 C40,75 60,80 80,70 C95,62 100,50 100,30 Z" fill="#00140d" fillOpacity="0.98" />
            </svg>

            {/* Left & right masks to hide exposed background when image is contained */}
            <div className="absolute left-0 top-0 bottom-0 w-12 md:w-20 pointer-events-none bg-gradient-to-r from-[#00140d] to-transparent" aria-hidden />
            <div className="absolute right-0 top-0 bottom-0 w-12 md:w-20 pointer-events-none bg-gradient-to-l from-[#00140d] to-transparent" aria-hidden />
          </div>
          <div className="h-16 md:h-24" />
        </>
      ) : (
        <SiteHeader />
      )}
      <main id="main" className="relative">
        <Outlet />
      </main>
      {isCheckout ? null : <SiteFooter />}
    </div>
  );
}
