import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { useGeo } from "@/hooks/useGeo";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LoginDialog } from "@/components/LoginDialog";
import { useAuth } from "@/hooks/useAuth";
import { ChevronDown, Gamepad2, User } from "lucide-react";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [gameOpen, setGameOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const geo = useGeo();
  const override = typeof window !== "undefined" ? localStorage.getItem("currencyOverride") : null;
  const activeCurrency = override || geo.currency || "USD";
  const location = useLocation();
  const { user, logout } = useAuth();

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    try {
      if (menuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    } catch {}
    return () => {
      try { document.body.style.overflow = ''; } catch {}
    };
  }, [menuOpen]);

  const games = [
    { id: "mm", name: "Murder Mystery", image: "https://cdn.builder.io/api/v1/image/assets%2Fb2458d5aab5847128a2b754080dc1712%2F155ecd3b276d4626afdb8f1be5054597?format=webp&width=400" },
    { id: "grow", name: "Grow a Garden", image: "https://cdn.builder.io/api/v1/image/assets%2Fb2458d5aab5847128a2b754080dc1712%2F824f285113f54ff094f70b7dac6cb138?format=webp&width=400" },
    { id: "blox", name: "Blox Fruits", image: "https://cdn.builder.io/api/v1/image/assets%2Fa17b3953a32448139f60d7c2bcda706b%2F1e72998e48794cf699143ac972a8c060?format=webp&width=400" },
    { id: "blade", name: "Blade Ball", image: "https://cdn.builder.io/api/v1/image/assets%2Fb2458d5aab5847128a2b754080dc1712%2F87d9886f76244cb5ba71707762c2fcd1?format=webp&width=400" },
    { id: "brainrot", name: "Steal a Brainrot", image: "https://cdn.builder.io/api/v1/image/assets%2Fb2458d5aab5847128a2b754080dc1712%2Fd5e8426a3e46435f9c8be0bc746e8e68?format=webp&width=400" },
  ];

  const setCurrency = (code: string) => {
    localStorage.setItem("currencyOverride", code);
    window.dispatchEvent(new CustomEvent("currency:override", { detail: code }));
  };

  return (
    <header className="sticky top-0 z-[100] w-full bg-[#060606] border-b border-white/5">
      <div className="w-full max-w-none px-4 md:px-20 flex h-16 md:h-[103px] items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/7f6ed5fe497c1603363103f83d865c275745d301?width=318"
            alt="RO CART"
            className="h-8 md:h-10 w-auto object-contain"
          />
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {/* Game Selector */}
          <Popover open={gameOpen} onOpenChange={setGameOpen}>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-3 h-12 px-4 bg-[#0F0F0F] rounded-xl hover:bg-[#1a1a1a] transition-colors">
                {/* Gamepad Icon with Green Accent */}
                <div className="relative">
                  <Gamepad2 className="h-7 w-7 text-white" />
                  <div className="absolute -top-1 -left-1 w-8 h-6 bg-[#3DFF88] rounded-sm opacity-80" style={{ zIndex: -1 }} />
                </div>
                <span className="text-white font-semibold text-sm">THE</span>
                <ChevronDown className={cn(
                  "h-3 w-3 text-gray-400 transition-transform duration-200",
                  gameOpen && "rotate-180"
                )} />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 bg-[#060606] border border-white/10 p-2 mt-2">
              <div className="grid gap-2">
                {games.map((game) => (
                  <button
                    key={game.id}
                    onClick={() => {
                      if (game.id === "grow") window.location.assign("/grow");
                      else if (game.id === "mm") window.location.assign("/mm");
                      else if (game.id === "brainrot") window.location.assign("/brainrot");
                      else if (game.id === "blox") window.location.assign("/blox");
                      else if (game.id === "blade") window.location.assign("/blade");
                      setGameOpen(false);
                    }}
                    className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-white/5 transition-colors"
                  >
                    <img src={game.image} alt={game.name} className="h-10 w-12 rounded-md object-cover" />
                    <div className="text-left">
                      <div className="text-sm font-medium text-white">{game.name}</div>
                      <div className="text-xs text-gray-400">Tap to view items</div>
                    </div>
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Language/Currency Selector */}
          <Popover open={languageOpen} onOpenChange={setLanguageOpen}>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-3 h-12 px-4 bg-gradient-to-r from-[#0F0F0F] to-[#0D0D0D] rounded-xl hover:bg-gradient-to-r hover:from-[#1a1a1a] hover:to-[#171717] transition-all">
                {/* US Flag */}
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/6309b4935e76c38f096dd565d605ad609d633229?width=60"
                  alt="English"
                  className="h-4 w-8 rounded-sm object-cover"
                />
                <span className="text-white font-semibold text-sm">English/{activeCurrency}</span>
                <ChevronDown className={cn(
                  "h-3 w-3 text-gray-400 transition-transform duration-200",
                  languageOpen && "rotate-180"
                )} />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-72 bg-[#060606] border border-white/10 p-4 mt-2">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-white mb-2">Language</h3>
                  <div className="p-3 bg-[#0F0F0F] rounded-lg border border-white/5">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://api.builder.io/api/v1/image/assets/TEMP/6309b4935e76c38f096dd565d605ad609d633229?width=60"
                        alt="English"
                        className="h-4 w-8 rounded-sm object-cover"
                      />
                      <span className="text-white font-medium">English</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white mb-2">Currency</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {["USD", "EUR", "GBP", "JPY", "CNY", "AUD", "CAD", "CHF", "SEK"].map((currency) => (
                      <button
                        key={currency}
                        onClick={() => {
                          setCurrency(currency);
                          setLanguageOpen(false);
                        }}
                        className={cn(
                          "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                          currency === activeCurrency
                            ? "bg-[#3DFF88] text-black"
                            : "bg-[#0F0F0F] text-white hover:bg-white/10"
                        )}
                      >
                        {currency}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Auth */}
          {user ? (
            <div className="flex items-center gap-3">
              <div className="h-8 px-3 rounded-lg bg-white/10 border border-white/10 text-white text-sm flex items-center">
                {user.username}
              </div>
              <button onClick={logout} className="h-8 px-3 rounded-lg bg-[#0F0F0F] hover:bg-[#1a1a1a] text-white text-xs border border-white/10">
                Logout
              </button>
            </div>
          ) : (
            <LoginDialog>
              <button className="flex items-center gap-2 h-9 px-6 bg-gradient-to-b from-[#3DFF88] to-[#259951] rounded-xl hover:from-[#34e077] hover:to-[#228a47] transition-all shadow-lg">
                <User className="h-5 w-5 text-white" />
                <span className="text-white font-semibold text-sm">Log in</span>
              </button>
            </LoginDialog>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="md:hidden flex items-center justify-center h-10 w-10 rounded-lg bg-[#0F0F0F] hover:bg-[#1a1a1a] transition-colors"
          aria-label="Open menu"
        >
          <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && createPortal(
        <div className="md:hidden fixed inset-0 z-[200] bg-[#060606] overflow-auto">
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/7f6ed5fe497c1603363103f83d865c275745d301?width=318"
                alt="RO CART"
                className="h-8 w-auto object-contain"
              />
              <button
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center h-10 w-10 rounded-lg bg-[#0F0F0F] hover:bg-[#1a1a1a] transition-colors"
                aria-label="Close menu"
              >
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile Navigation Items */}
            <div className="space-y-4">
              {/* Game Selector */}
              <div className="p-4 bg-[#0F0F0F] rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <Gamepad2 className="h-6 w-6 text-white" />
                    <div className="absolute -top-1 -left-1 w-7 h-5 bg-[#3DFF88] rounded-sm opacity-80" style={{ zIndex: -1 }} />
                  </div>
                  <span className="text-white font-semibold">THE GAMES</span>
                </div>
                <div className="grid gap-3">
                  {games.map((game) => (
                    <button
                      key={game.id}
                      onClick={() => {
                        if (game.id === "grow") window.location.assign("/grow");
                        else if (game.id === "mm") window.location.assign("/mm");
                        else if (game.id === "brainrot") window.location.assign("/brainrot");
                        else if (game.id === "blox") window.location.assign("/blox");
                        else if (game.id === "blade") window.location.assign("/blade");
                        setMenuOpen(false);
                      }}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <img src={game.image} alt={game.name} className="h-10 w-12 rounded-md object-cover" />
                      <div className="text-left">
                        <div className="text-sm font-medium text-white">{game.name}</div>
                        <div className="text-xs text-gray-400">Tap to view items</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Language/Currency */}
              <div className="p-4 bg-gradient-to-r from-[#0F0F0F] to-[#0D0D0D] rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/6309b4935e76c38f096dd565d605ad609d633229?width=60"
                    alt="English"
                    className="h-4 w-8 rounded-sm object-cover"
                  />
                  <span className="text-white font-semibold">English / {activeCurrency}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {["USD", "EUR", "GBP", "JPY", "CNY", "AUD"].map((currency) => (
                    <button
                      key={currency}
                      onClick={() => {
                        setCurrency(currency);
                        setMenuOpen(false);
                      }}
                      className={cn(
                        "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        currency === activeCurrency
                          ? "bg-[#3DFF88] text-black"
                          : "bg-black/20 text-white hover:bg-white/10"
                      )}
                    >
                      {currency}
                    </button>
                  ))}
                </div>
              </div>

              {/* Auth (mobile) */}
              {user ? (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 h-12 px-4 rounded-xl bg-white/10 border border-white/10 text-white font-semibold flex items-center">
                    {user.username}
                  </div>
                  <button onClick={logout} className="h-12 px-4 rounded-xl bg-[#0F0F0F] hover:bg-[#1a1a1a] text-white border border-white/10">
                    Logout
                  </button>
                </div>
              ) : (
                <LoginDialog>
                  <button className="w-full flex items-center justify-center gap-2 h-12 px-6 bg-gradient-to-b from-[#3DFF88] to-[#259951] rounded-xl hover:from-[#34e077] hover:to-[#228a47] transition-all shadow-lg">
                    <User className="h-5 w-5 text-white" />
                    <span className="text-white font-semibold">Log in</span>
                  </button>
                </LoginDialog>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}
