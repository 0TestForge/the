import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMemo, useState, useEffect, useRef } from "react";
import { useToast, toast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useGeo } from "@/hooks/useGeo";
import { CheckoutDialog } from "@/components/CheckoutDialog";

// Domain types
type Item = {
  id: string;
  name: string;
  image: string;
  category: "pet" | "plant";
  stock: number;
  priceUSD: number;
  tags?: string[];
};

type FilterKey = "all" | "pets" | "plants" | "best" | "bundles" | "sheckle" | "fruits" | "mutated" | "mega";

type CartLine = { id: string; qty: number; item: Item };

// Catalog
export const ITEMS: Item[] = [
  // Pets
  { id: "red-bee", name: "Red Bee", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F40acc6f230a14be08df9c83c5a4cd86b?format=webp&width=800", category: "pet", stock: 2, priceUSD: 12, tags: ["best"] },
  { id: "duck-rider", name: "Duck Rider", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2Fe0a787ae09e544ad86c9e7539ba74673?format=webp&width=800", category: "pet", stock: 5, priceUSD: 10, tags: ["best"] },
  { id: "queen-bee", name: "Queen Bee", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F831fc4b380f74e84807494f864231c10?format=webp&width=800", category: "pet", stock: 3, priceUSD: 20, tags: ["best"] },
  { id: "wasp", name: "Neon Wasp", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F68399c1d84594269b8f08b17a00b1cfe?format=webp&width=800", category: "pet", stock: 4, priceUSD: 8 },
  { id: "shiba", name: "Shiba", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F51c35bbfa0e048d7afd6486443420b28?format=webp&width=800", category: "pet", stock: 7, priceUSD: 15, tags: ["best"] },
  { id: "octo", name: "Octo", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2Fe36ba05f95ec473bb9a3f3c57a5b9c5a?format=webp&width=800", category: "pet", stock: 2, priceUSD: 25, tags: ["best"] },
  { id: "phoenix", name: "Phoenix", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F9a6dd0d8e0c045c5aed3027e21a03d42?format=webp&width=800", category: "pet", stock: 1, priceUSD: 30, tags: ["mega"] },
  { id: "rainbow-bee", name: "Rainbow Bee", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2Fbb714220133840b29940ad0dccecbcdd?format=webp&width=800", category: "pet", stock: 3, priceUSD: 18, tags: ["mutated"] },
  { id: "rainbow-wasp", name: "Rainbow Wasp", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F91504519181b4952af7ec765f387df90?format=webp&width=800", category: "pet", stock: 2, priceUSD: 19, tags: ["mutated"] },
  { id: "gold-wasp", name: "Gold Wasp", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2Fff742625b1a243cfa235fdb3907709a7?format=webp&width=800", category: "pet", stock: 1, priceUSD: 40, tags: ["mega"] },
  { id: "rainbow-queen", name: "Rainbow Queen Bee", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F2d1eaecfc0244aa5a8868c12666ab96b?format=webp&width=800", category: "pet", stock: 1, priceUSD: 45, tags: ["mutated"] },
  { id: "orange-queen", name: "Orange Queen Bee", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F01330ed5e86942bca9fa7baeffce32c4?format=webp&width=800", category: "pet", stock: 2, priceUSD: 28 },
  { id: "pink-bee", name: "Pink Bee", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F78eb5b34035f45c8955032974100aa81?format=webp&width=800", category: "pet", stock: 4, priceUSD: 14 },
  { id: "dino", name: "Dino", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F39e5c800109f4927aee8f94d892c985c?format=webp&width=800", category: "pet", stock: 2, priceUSD: 22 },
  { id: "masked-dog", name: "Masked Dog", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F1b31d21ebe104f6ab0e12819d6415b9a?format=webp&width=800", category: "pet", stock: 6, priceUSD: 13 },
  { id: "rainbow-dog", name: "Rainbow Dog", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F94bd90a7d545485c9c48ce81ff1c70a5?format=webp&width=800", category: "pet", stock: 3, priceUSD: 21 },
  { id: "griffin", name: "Griffin", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F3a8f470936c44599b6a1abb84450d540?format=webp&width=800", category: "pet", stock: 1, priceUSD: 55 },
  { id: "wyrm", name: "Wyrm", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F0107e74ca582478bba915fdfd7926563?format=webp&width=800", category: "pet", stock: 1, priceUSD: 38 },
  // Plants
  { id: "sprout-pack", name: "Purple Sprout Pack", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2Fbe60cc732b1b44f28e3af656696011b5?format=webp&width=800", category: "plant", stock: 8, priceUSD: 9, tags: ["bundles","fruits"] },
  { id: "sprout-single", name: "Purple Sprout", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F68f58bd0f45b49ba8cb0aa48accb095b?format=webp&width=800", category: "plant", stock: 20, priceUSD: 3, tags: ["fruits"] },
  { id: "sprout-trio", name: "Sprout Trio", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2Fb468b81480d949fba738072a39790a00?format=webp&width=800", category: "plant", stock: 10, priceUSD: 6, tags: ["bundles","fruits"] },
  { id: "sheckles-8qd", name: "8QD Sheckles", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2Faf8dccb5646b4daa91e9036be29a7e2a?format=webp&width=800", category: "plant", stock: 5, priceUSD: 12, tags: ["sheckle"] },
  { id: "sheckles-744t", name: "744T Sheckles", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2Fd8fdd0b63ad242cabb2077fe8a1612e9?format=webp&width=800", category: "plant", stock: 5, priceUSD: 14, tags: ["sheckle"] },
  { id: "sheckles-8qd-single", name: "8QD Sheckles Single", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F4a894719237a4270879984e87ef2d897?format=webp&width=800", category: "plant", stock: 12, priceUSD: 4, tags: ["sheckle"] },
];

export default function GrowGarden() {
  // Filters and search
  const [filter, setFilter] = useState<FilterKey>("all");
  const [q, setQ] = useState("");

  // Currency override from header
  const [currencyOverride, setCurrencyOverride] = useState<string | null>(null);

  // Cart state
  const [cart, setCart] = useState<Item[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showBubble, setShowBubble] = useState(false);

  const { dismiss } = useToast();
  useEffect(() => {
    if (cartOpen) {
      // dismiss any visible toasts immediately when opening the cart
      try { dismiss(); } catch {}
    }
  }, [cartOpen, dismiss]);

  // Geo + currency conversion
  const geo = useGeo();
  const [rate, setRate] = useState<number>(1);

  // Prevent scroll jump when currency/rate resolves
  const prevY = useRef(0);
  useEffect(() => {
    const onScroll = () => { prevY.current = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Listen to currency override from header
  useEffect(() => {
    const saved = localStorage.getItem("currencyOverride");
    if (saved) setCurrencyOverride(saved);
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      setCurrencyOverride(detail);
      localStorage.setItem("currencyOverride", detail);
    };
    window.addEventListener("currency:override", handler as EventListener);
    return () => window.removeEventListener("currency:override", handler as EventListener);
  }, []);

  const currency = currencyOverride || geo.currency || "USD";

  useEffect(() => {
    let mounted = true;
    const loadRate = async () => {
      try {
        if (currency === "USD") { setRate(1); return; }
        // Call our server proxy to avoid CORS and blockers
        let r = 1;
        try {
          const res = await fetch(`/api/rates?base=USD&symbols=${encodeURIComponent(currency)}`);
          if (res.ok) {
            const data = await res.json();
            r = Number(data?.rate) || 1;
          }
        } catch {}
        if (mounted) setRate(r);
      } catch { if (mounted) setRate(1); }
    };
    loadRate();
    // restore scroll
    setTimeout(() => window.scrollTo({ top: prevY.current, behavior: "instant" as ScrollBehavior }), 0);
    return () => { mounted = false; };
  }, [currency]);
  useEffect(() => {
    setTimeout(() => window.scrollTo({ top: prevY.current, behavior: "instant" as ScrollBehavior }), 0);
  }, [rate]);

  const priceFmt = useMemo(
    () => new Intl.NumberFormat(undefined, { style: "currency", currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }),
    [currency],
  );
  const toLocal = (usd: number) => usd * rate;
  const toLocalRounded = (usd: number) => Math.round(toLocal(usd));

  const filterTitleMap: Record<FilterKey, string> = {
    all: "All Items",
    pets: "Pets",
    plants: "Plants",
    best: "Best Sellers",
    bundles: "Bundles",
    sheckle: "Sheckle",
    fruits: "Fruits",
    mutated: "Mutated Pets",
    mega: "Mega Pets",
  };
  const currentFilterTitle = filterTitleMap[filter];

  // Admin price overrides support
  const [overrides, setOverrides] = useState<Record<string, number>>({});
  useEffect(() => {
    try {
      const raw = localStorage.getItem("priceOverrides");
      if (raw) setOverrides(JSON.parse(raw) || {});
    } catch {}
    const onPrices = () => {
      try {
        const raw = localStorage.getItem("priceOverrides");
        setOverrides(raw ? JSON.parse(raw) : {});
      } catch {}
    };
    window.addEventListener("prices:update", onPrices as EventListener);
    window.addEventListener("storage", onPrices as EventListener);
    return () => {
      window.removeEventListener("prices:update", onPrices as EventListener);
      window.removeEventListener("storage", onPrices as EventListener);
    };
  }, []);

  const itemsCurrent: Item[] = useMemo(() => ITEMS.map(i => ({ ...i, priceUSD: overrides[i.id] ?? i.priceUSD })), [overrides]);

  // Stock overrides (admin)
  const [stockOverrides, setStockOverrides] = useState<Record<string, number>>({});
  useEffect(() => {
    try {
      const raw = localStorage.getItem("stockOverrides");
      if (raw) setStockOverrides(JSON.parse(raw) || {});
    } catch {}
    const onStock = () => {
      try {
        const raw = localStorage.getItem("stockOverrides");
        setStockOverrides(raw ? JSON.parse(raw) : {});
      } catch {}
    };
    window.addEventListener("stock:update", onStock as EventListener);
    window.addEventListener("storage", onStock as EventListener);
    return () => {
      window.removeEventListener("stock:update", onStock as EventListener);
      window.removeEventListener("storage", onStock as EventListener);
    };
  }, []);

  const groupedCart: CartLine[] = useMemo(() => {
    const map = new Map<string, CartLine>();
    for (const it of cart) {
      const g = map.get(it.id);
      if (g) g.qty += 1; else map.set(it.id, { id: it.id, qty: 1, item: it });
    }
    return Array.from(map.values());
  }, [cart]);

  const totalUSD = groupedCart.reduce((s, l) => s + (overrides[l.id] ?? l.item.priceUSD) * l.qty, 0);
  const totalLocalRounded = Math.round(toLocal(totalUSD));

  const itemsForFilter = (key: FilterKey): Item[] => {
    let list = itemsCurrent;
    if (key === "plants") list = list.filter((i) => i.category === "plant");
    else if (key === "pets") list = list.filter((i) => i.category === "pet");
    else if (key === "best") list = list.filter((i) => i.tags?.includes("best"));
    else if (key === "bundles") list = list.filter((i) => i.tags?.includes("bundles"));
    else if (key === "sheckle") list = list.filter((i) => i.tags?.includes("sheckle"));
    else if (key === "fruits") list = list.filter((i) => i.tags?.includes("fruits"));
    else if (key === "mutated") list = list.filter((i) => i.tags?.includes("mutated"));
    else if (key === "mega") list = list.filter((i) => i.tags?.includes("mega"));
    return list;
  };

  const filtered = useMemo(() => {
    const base = itemsForFilter(filter);
    const query = q.trim().toLowerCase();
    return query ? base.filter((i) => i.name.toLowerCase().includes(query)) : base;
  }, [filter, q, itemsCurrent]);

  const qtyInCart = (id: string) => groupedCart.find((l) => l.id === id)?.qty || 0;

  const addToCart = (item: Item) => {
    const qty = qtyInCart(item.id);
    const effStock = stockOverrides[item.id] ?? item.stock;
    if (qty >= effStock) { toast({ title: "Max stock reached", description: `${item.name} stock: ${effStock}` }); return; }
    setCart((c) => [...c, item]);
    setShowHint(true);
    setShowBubble(true);
    setTimeout(() => setShowBubble(false), 4000);
    toast({ title: "Added to cart", description: `${item.name} • ${priceFmt.format(toLocalRounded(item.priceUSD))}` });
  };

  const removeOne = (id: string) => {
    setCart((c) => {
      const idx = c.findIndex((x) => x.id === id);
      if (idx === -1) return c;
      const next = c.slice();
      next.splice(idx, 1);
      return next;
    });
  };

  const removeAll = (id: string) => {
    setCart((c) => c.filter((x) => x.id !== id));
  };

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-emerald-900 via-emerald-950 to-black" />
        <div className="container py-10 md:py-14 pt-20">
          <div className="mt-6">
            <div className="w-full rounded-2xl border border-emerald-700/20 bg-emerald-900/20 p-4 fixed top-16 left-0 right-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="order-[-2] flex items-center gap-2 rounded-md bg-slate-900/80 text-white border border-white/10 px-2 py-1">
                    <img src="https://cdn.builder.io/api/v1/image/assets%2Fb2458d5aab5847128a2b754080dc1712%2F824f285113f54ff094f70b7dac6cb138?format=webp&width=400" alt="Grow a Garden" className="h-7 w-10 rounded object-cover" />
                    <span className="font-semibold">Grow a Garden</span>
                  </div>
                  <div className="order-[-1] mx-2 h-6 border-r border-white/6" />
                  <Button className={`filter-custom isolate-filter ${filter === "all" ? "active" : ""} bg-slate-900/80 text-white border border-white/10 px-3 py-2 rounded-md shadow-sm hover:bg-slate-900/95`} size="sm" onClick={() => setFilter("all")}>
                    <span className="laser" aria-hidden />
                    <span className="inline-flex items-center gap-2">
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/></svg>
                      <span>All</span>
                    </span>
                  </Button>
                  <Button className={`filter-custom ${filter === "pets" ? "active" : ""} bg-slate-900/80 text-white border border-white/10 px-3 py-2 rounded-md shadow-sm hover:bg-slate-900/95`} size="sm" onClick={() => setFilter("pets")}>
                    <span className="laser" aria-hidden />
                    <span className="inline-flex items-center gap-2">
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><circle cx="5" cy="8" r="2"/><circle cx="12" cy="5" r="2"/><circle cx="19" cy="8" r="2"/><path d="M7 19c0-3 2.5-5 5-5s5 2 5 5v1H7z"/></svg>
                      <span>Pets</span>
                    </span>
                  </Button>
                  <Button className={`filter-custom isolate-filter ${filter === "best" ? "active" : ""} bg-slate-900/80 text-white border border-white/10 px-3 py-2 rounded-md shadow-sm hover:bg-slate-900/95`} size="sm" onClick={() => setFilter("best")}>
                    <span className="laser" aria-hidden />
                    <span className="inline-flex items-center gap-2">
                      <img src="https://cdn.builder.io/api/v1/image/assets%2Fd298c54982d64a0783c9a8a3d1e480c1%2Fa52a865175de4ee0b13ba303cef212f7?format=webp&width=800" alt="fire" className="h-7 w-7 object-contain" aria-hidden />
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-orange-400 to-yellow-300 font-extrabold tracking-wide">BestSellers</span>
                    </span>
                    <div className="best-slider" />
                  </Button>
                  <div className="mx-2 h-6 border-r border-white/6" />
                  <Button className={`filter-custom ${filter === "bundles" ? "active" : ""} bg-slate-900/80 text-white border border-white/10 px-3 py-2 rounded-md shadow-sm hover:bg-slate-900/95`} size="sm" onClick={() => setFilter("bundles")}>
                    <span className="laser" aria-hidden />
                    <span className="inline-flex items-center gap-2">
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8v13M3 12h18"/><path d="M12 8c-2 0-4-1.5-4-3s2-2 4 1c2-3 4-2 4-1s-2 3-4 3z"/></svg>
                      <span>Bundles</span>
                    </span>
                  </Button>
                  <Button className={`filter-custom ${filter === "sheckle" ? "active" : ""} bg-slate-900/80 text-white border border-white/10 px-3 py-2 rounded-md shadow-sm hover:bg-slate-900/95`} size="sm" onClick={() => setFilter("sheckle")}>
                    <span className="laser" aria-hidden />
                    <span className="inline-flex items-center gap-2">
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20"/><path d="M7 7a5 5 0 0 1 5-5"/><path d="M17 17a5 5 0 0 1-5 5"/></svg>
                      <span>Sheckle</span>
                    </span>
                  </Button>
                  <Button className={`filter-custom ${filter === "fruits" ? "active" : ""} bg-slate-900/80 text-white border border-white/10 px-3 py-2 rounded-md shadow-sm hover:bg-slate-900/95`} size="sm" onClick={() => setFilter("fruits")}>
                    <span className="laser" aria-hidden />
                    <span className="inline-flex items-center gap-2">
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M12 4c-2.5 0-4 1.5-4 3.5S10 11 12 11s4-1.5 4-3.5S14.5 4 12 4zm0 7c-4 0-7 3-7 7h14c0-4-3-7-7-7z"/></svg>
                      <span>Fruits</span>
                    </span>
                  </Button>
                  <Button className={`filter-custom ${filter === "mutated" ? "active" : ""} bg-slate-900/80 text-white border border-white/10 px-3 py-2 rounded-md shadow-sm hover:bg-slate-900/95`} size="sm" onClick={() => setFilter("mutated")}>
                    <span className="laser" aria-hidden />
                    <span className="inline-flex items-center gap-2">
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="7" cy="12" r="3"/><circle cx="17" cy="12" r="3"/><path d="M9.5 10.5l5 3M14.5 10.5l-5 3"/></svg>
                      <span>Mutated Pets</span>
                    </span>
                  </Button>
                  <Button className={`filter-custom ${filter === "mega" ? "active" : ""} bg-slate-900/80 text-white border border-white/10 px-3 py-2 rounded-md shadow-sm hover:bg-slate-900/95`} size="sm" onClick={() => setFilter("mega")}>
                    <span className="laser" aria-hidden />
                    <span className="inline-flex items-center gap-2">
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M12 2l3 6 6 .9-4.5 4.3 1 6.3L12 16l-5.5 3.5 1-6.3L3 8.9 9 8z"/></svg>
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-yellow-400 to-indigo-500 font-extrabold tracking-wide">Mega Pets</span>
                    </span>
                  </Button>
                </div>
                <div className="w-56 sm:w-64 md:w-72">
                  <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" className="bg-emerald-950/40 border-emerald-800/50" />
                </div>
              </div>
            </div>
            <div className="h-20" />
          </div>

          {showHint && (
            <div className="mt-4 rounded-lg border border-emerald-700/40 bg-emerald-900/40 p-3 text-sm text-emerald-100 flex items-center justify-between">
              <span>Item added. Check your cart to proceed to checkout.</span>
              <Button size="sm" onClick={() => setCartOpen(true)}>Open Cart</Button>
            </div>
          )}

          <div className="mt-6">
            {(() => {
              const Icon = (key: FilterKey) => {
                const cls = "h-10 w-10 text-emerald-300";
                switch (key) {
                  case "best":
                    return (<img src="https://cdn.builder.io/api/v1/image/assets%2Fd298c54982d64a0783c9a8a3d1e480c1%2Fa52a865175de4ee0b13ba303cef212f7?format=webp&width=800" alt="fire" className="h-10 w-10 object-contain" aria-hidden />);
                  case "all":
                    return (<svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/></svg>);
                  case "pets":
                    return (<svg viewBox="0 0 24 24" className={cls} fill="currentColor"><circle cx="5" cy="8" r="2"/><circle cx="12" cy="5" r="2"/><circle cx="19" cy="8" r="2"/><path d="M7 19c0-3 2.5-5 5-5s5 2 5 5v1H7z"/></svg>);
                  case "bundles":
                    return (<svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8v13M3 12h18"/><path d="M12 8c-2 0-4-1.5-4-3s2-2 4 1c2-3 4-2 4-1s-2 3-4 3z"/></svg>);
                  case "sheckle":
                    return (<svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20"/><path d="M7 7a5 5 0 0 1 5-5"/><path d="M17 17a5 5 0 0 1-5 5"/></svg>);
                  case "fruits":
                    return (<svg viewBox="0 0 24 24" className={cls} fill="currentColor"><path d="M12 4c-2.5 0-4 1.5-4 3.5S10 11 12 11s4-1.5 4-3.5S14.5 4 12 4zm0 7c-4 0-7 3-7 7h14c0-4-3-7-7-7z"/></svg>);
                  case "mutated":
                    return (<svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2"><circle cx="7" cy="12" r="3"/><circle cx="17" cy="12" r="3"/><path d="M9.5 10.5l5 3M14.5 10.5l-5 3"/></svg>);
                  case "mega":
                    return (<svg viewBox="0 0 24 24" className={cls} fill="currentColor"><path d="M12 2l3 6 6 .9-4.5 4.3 1 6.3L12 16l-5.5 3.5 1-6.3L3 8.9 9 8z"/></svg>);
                  default:
                    return null;
                }
              };

              const SectionSlider = ({ fkey, items }: { fkey: FilterKey; items: Item[] }) => {
                const wrapperRef = useRef<HTMLDivElement | null>(null);
                useEffect(() => {
                  const root = wrapperRef.current;
                  if (!root) return;
                  const scrollEl = root.querySelector('.best-scroll') as HTMLElement | null;
                  if (!scrollEl) { root.style.setProperty('--best-progress', '0'); return; }
                  const onScroll = () => {
                    const max = scrollEl.scrollWidth - scrollEl.clientWidth;
                    const p = max > 0 ? scrollEl.scrollLeft / max : 0;
                    root.style.setProperty('--best-progress', String(p));
                  };
                  onScroll();
                  scrollEl.addEventListener('scroll', onScroll, { passive: true });
                  return () => scrollEl.removeEventListener('scroll', onScroll as EventListener);
                }, []);

                return (
                  <div className="mb-10">
                    <div className="mb-3 flex items-center gap-3">
                      {Icon(fkey)}
                      <h2 className="best-heading text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">{filterTitleMap[fkey].toUpperCase()}</h2>
                    </div>
                    <div ref={wrapperRef} className="best-scroll-wrapper relative">
                      <div className="best-scroll flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
                        {items.map((it, idx) => {
                          const qty = qtyInCart(it.id);
                          const effStock = stockOverrides[it.id] ?? it.stock;
                          const soldOut = qty >= effStock;
                          return (
                            <div key={it.id} className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-0 transition-transform duration-500 ease-out hover:bg-slate-900/95 hover:shadow-sm hover:-translate-y-0.5 hover:scale-[1.02] animate-in fade-in-0 slide-in-from-bottom-2 flex-none w-72`} style={{ animationDelay: `${(idx % 12) * 40}ms` }}>
                              <div className="relative h-80 overflow-hidden rounded-xl ring-1 ring-emerald-700/20 group-hover:ring-emerald-500/30 transition">
                                <img src={it.image} alt={it.name} className="h-full w-full object-cover brightness-110 contrast-105 transition-transform transform duration-500 ease-out group-hover:brightness-125 group-hover:contrast-110 group-hover:scale-105" />
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                                <div className="pointer-events-none absolute inset-0 opacity-20 transition-opacity duration-500 group-hover:opacity-90">
                                  <div className="absolute -inset-10 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.25),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(16,185,129,0.18),transparent_40%)]" />
                                </div>
                                <div className="absolute right-2 top-2 rounded-md bg-[#050B1F]/80 px-2 py-1 text-xs text-blue-100 ring-1 ring-blue-900/60">Stock: {Math.max(0, (stockOverrides[it.id] ?? it.stock) - qty)}</div>
                                <div className="absolute inset-x-2 bottom-2 translate-y-8 opacity-0 will-change-transform transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                                  <Button disabled={soldOut} onClick={() => addToCart(it)} className="w-full h-9 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 disabled:opacity-60">{soldOut ? "Sold Out" : "Add to Cart"}</Button>
                                </div>
                              </div>
                              <div className="px-3 mt-3">
                                <div className="flex items-center gap-2">
                                  <h3 className="text-sm font-semibold">{it.name}</h3>
                                  <span className="ml-2 text-2xl font-extrabold tracking-tight text-emerald-300 drop-shadow-sm">{priceFmt.format(toLocalRounded(it.priceUSD))}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="best-scroll-progress" aria-hidden />
                    </div>
                  </div>
                );
              };

              if (filter === "all") {
                const order: FilterKey[] = ["best", "pets", "bundles", "sheckle", "fruits", "mutated", "mega"];
                return (
                  <div>
                    {order.map((key) => {
                      const base = itemsForFilter(key);
                      const query = q.trim().toLowerCase();
                      const items = query ? base.filter((i) => i.name.toLowerCase().includes(query)) : base;
                      if (items.length === 0) return null;
                      return <SectionSlider key={key} fkey={key} items={items} />;
                    })}
                  </div>
                );
              }

              return <SectionSlider fkey={filter} items={filtered} />;
            })()}
          </div>
        </div>

        {/* Floating Cart (page only) with bubble */}
        {showBubble && !cartOpen && (
          <div className="fixed bottom-28 left-1/2 z-50 -translate-x-1/2 rounded-md px-3 py-2 bg-slate-900/80 text-white border border-white/10 shadow-lg animate-in fade-in-0">
            Click to open cart
            <svg className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-white" width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 0 L9 8 L18 0 Z" fill="currentColor"/></svg>
          </div>
        )}

        <div>
          <Button onClick={() => setCartOpen((s) => !s)} className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 inline-flex items-center gap-2 bg-slate-900/80 text-white border border-white/10 px-3 py-2 rounded-md shadow-sm hover:bg-slate-900/95">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M6 6h15l-1.5 9h-12L6 6Z" stroke="currentColor" strokeWidth="2"/>
              <circle cx="9" cy="20" r="1" fill="currentColor"/>
              <circle cx="18" cy="20" r="1" fill="currentColor"/>
            </svg>
            <span className="font-semibold hidden sm:inline">View Cart</span>
            {cart.length > 0 && (
              <span className="absolute -top-2 right-0 grid h-5 w-5 place-content-center rounded-full bg-white text-[11px] font-bold text-slate-900 ring-2 ring-white/20">{cart.length}</span>
            )}
          </Button>

          {cartOpen && (
            <div className="fixed right-6 bottom-6 z-50 w-80 rounded-lg bg-gradient-to-br from-[#0b0d1a] to-[#111221] border border-white/5 p-4 shadow-xl">
              <div className="relative">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">Cart</h4>
                  <button onClick={() => setCartOpen(false)} className="h-8 w-8 rounded-md bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center text-white">×</button>
                </div>

                <div className="mt-4 flex flex-col items-center gap-4">
                  <img src="https://cdn.builder.io/api/v1/image/assets%2Fd298c54982d64a0783c9a8a3d1e480c1%2F10eceadf204c44b98902bc8d6f09be5d?format=webp&width=800" alt="cart art" className="h-28" />

                  <div className="w-full rounded-lg p-3 bg-gradient-to-r from-indigo-600 to-rose-500 text-white shadow-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold">CREATOR DISCOUNT</div>
                        <div className="text-xs opacity-80">Support your favorite creators</div>
                      </div>
                      <div className="text-xs font-semibold">Active</div>
                    </div>
                    <div className="mt-3 flex items-center justify-between bg-white/5 rounded-md p-2">
                      <div className="text-xs">Your Savings</div>
                      <div className="text-sm font-bold">$0</div>
                    </div>
                  </div>

                  <div className="w-full text-left">
                    {groupedCart.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Your cart is empty.</p>
                    ) : (
                      <ul className="space-y-2 max-h-44 overflow-auto pr-1 mb-3">
                        {groupedCart.map((l) => (
                          <li key={l.id} className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <img src={l.item.image} alt="" className="h-10 w-10 shrink-0 rounded-md object-cover" />
                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium">{l.item.name} × {l.qty}</p>
                                <p className="text-xs text-muted-foreground">{priceFmt.format(Math.round(toLocal((overrides[l.id] ?? l.item.priceUSD) * l.qty)))}</p>
                                <p className="text-xs text-muted-foreground">Stock: {Math.max(0, (stockOverrides[l.id] ?? l.item.stock) - l.qty)}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="ghost" onClick={() => removeOne(l.id)}>−</Button>
                              <Button size="sm" variant="ghost" onClick={() => addToCart(l.item)} disabled={((stockOverrides[l.id] ?? l.item.stock) - l.qty) <= 0}>+</Button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="text-lg font-bold">{priceFmt.format(totalLocalRounded)} USD</div>
                    <div className="text-xs text-muted-foreground">Discounts Applied at Checkout</div>
                  </div>

                  <button disabled={groupedCart.length === 0} onClick={() => { if (groupedCart.length === 0) return; setCartOpen(false); setCheckoutOpen(true); }} className="w-full mt-2 rounded-lg bg-rose-700 hover:bg-rose-800 text-white py-3 flex items-center justify-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 6h15l-1.5 9h-12L6 6Z" stroke="currentColor" strokeWidth="1.5"/></svg>
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <CheckoutDialog
          open={checkoutOpen}
          onOpenChange={setCheckoutOpen}
          currency={currency}
          lines={groupedCart.map((l) => ({ id: l.id, name: l.item.name, qty: l.qty, priceLocal: Math.round(toLocal(l.item.priceUSD * l.qty)), thumb: l.item.image }))}
          totalLocal={totalLocalRounded}
          onRemoveOne={removeOne}
          onRemoveAll={removeAll}
        />
      </section>
    </div>
  );
}
