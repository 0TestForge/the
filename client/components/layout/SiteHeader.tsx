import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { useGeo } from "@/hooks/useGeo";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [gameOpen, setGameOpen] = useState(false);
  const [curSearch, setCurSearch] = useState("");
  const geo = useGeo();
  const override = typeof window !== "undefined" ? localStorage.getItem("currencyOverride") : null;
  const activeCurrency = override || geo.currency || "USD";

  const list = useMemo(
    () => [
      "USD","EUR","GBP","GEL","TRY","INR","JPY","CNY","AUD","CAD","BRL","CHF","RUB","PLN","SEK","NOK","DKK","HUF","CZK","AED","SAR","ZAR","MXN"
    ].filter((c) => c.toLowerCase().includes(curSearch.toLowerCase())),
    [curSearch],
  );

  const setCurrency = (code: string) => {
    localStorage.setItem("currencyOverride", code);
    window.dispatchEvent(new CustomEvent("currency:override", { detail: code }));
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur supports-[backdrop-filter]:bg-background/60 bg-background/70 border-b border-white/5">
      <div className="container flex h-16 items-center gap-3">
        <a href="/" className="flex items-center gap-2">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2Fb2458d5aab5847128a2b754080dc1712%2F59703aedd2134312974c10a72e7d28f4?format=webp&width=220"
            alt="RO-CART logo"
            className="h-8 md:h-9 w-auto object-contain"
          />
          <span className="sr-only">RO-CART</span>
        </a>

        {/* Game selector popover beside logo */}
        <Popover open={gameOpen} onOpenChange={setGameOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="hidden sm:inline-flex mr-2 items-center gap-2 bg-slate-900/80 text-white border border-white/10 px-3 py-2 rounded-md shadow-sm hover:bg-slate-900/95">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
                <rect x="2" y="6" width="20" height="12" rx="3" stroke="currentColor" strokeWidth="1.5" opacity="0.9" />
                <circle cx="9" cy="11" r="1.3" fill="currentColor" />
                <circle cx="15" cy="11" r="1.3" fill="currentColor" />
                <path d="M7 15c0 .8.6 1.4 1.4 1.4H9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Pick a Game</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className={`opacity-80 transition-transform duration-200 ${gameOpen ? 'rotate-180' : 'rotate-0'}`}><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 rounded-lg bg-slate-900/90 border border-white/10 p-2 shadow-lg">
            <div className="grid gap-2">
              {[
                { id: "mm", name: "Murder Mystery", image: "https://cdn.builder.io/api/v1/image/assets%2Fb2458d5aab5847128a2b754080dc1712%2F155ecd3b276d4626afdb8f1be5054597?format=webp&width=400" },
                { id: "grow", name: "Grow a Garden", image: "https://cdn.builder.io/api/v1/image/assets%2Fb2458d5aab5847128a2b754080dc1712%2F824f285113f54ff094f70b7dac6cb138?format=webp&width=400" },
                { id: "blade", name: "Blade Ball", image: "https://cdn.builder.io/api/v1/image/assets%2Fb2458d5aab5847128a2b754080dc1712%2F87d9886f76244cb5ba71707762c2fcd1?format=webp&width=400" },
                { id: "brainrot", name: "Steal a Brainrot", image: "https://cdn.builder.io/api/v1/image/assets%2Fb2458d5aab5847128a2b754080dc1712%2Fd5e8426a3e46435f9c8be0bc746e8e68?format=webp&width=400" },
              ].map((it) => (
                <button
                  key={it.id}
                  onClick={() => {
                    if (it.id === "grow") window.location.assign("/grow"); else if (it.id === "mm") window.location.assign("/mm"); else if (it.id === "brainrot") window.location.assign("/brainrot"); else if (it.id === "blade") window.location.assign("/mm2");
                  }}
                  className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-white/5"
                >
                  <img src={it.image} alt={it.name} className="h-10 w-12 rounded-md object-cover" />
                  <div className="text-left">
                    <div className="text-sm font-medium">{it.name}</div>
                    <div className="text-xs text-muted-foreground">Tap to view items</div>
                  </div>
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <div className="ml-auto flex items-center gap-2">
          <nav className="hidden md:flex items-center gap-1 text-sm">
            
            <a href="#how" className="px-3 py-2 rounded-md hover:bg-white/5 transition">How it works</a>
            <a href="#faq" className="px-3 py-2 rounded-md hover:bg-white/5 transition">FAQ</a>
          </nav>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="hidden sm:inline-flex">Currency · {activeCurrency}</Button>
            </PopoverTrigger>
            <PopoverContent className="w-72">
              <div className="space-y-2">
                <Input autoFocus placeholder="Search currency..." value={curSearch} onChange={(e) => setCurSearch(e.target.value)} />
                <div className="grid max-h-64 gap-1 overflow-auto pr-1" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
                  {list.map((c) => (
                    <Button key={c} size="sm" variant={c === activeCurrency ? "default" : "secondary"} onClick={() => setCurrency(c)}>
                      {c}
                    </Button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <button
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-white/10"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-current">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden border-t border-white/5 bg-background/80 backdrop-blur">
          <div className="container py-3 grid gap-2">
            <div className="text-xs text-muted-foreground">Currency · {activeCurrency} {geo.country ? `· ${geo.country}` : ""}</div>
            
            <a href="#how" className="px-3 py-2 rounded-md hover:bg-white/5 transition">How it works</a>
            <a href="#faq" className="px-3 py-2 rounded-md hover:bg-white/5 transition">FAQ</a>
          </div>
        </div>
      )}
    </header>
  );
}
