import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useMemo, useState, useEffect, useRef } from "react";
import { useToast, toast } from "@/hooks/use-toast";
import { useGeo } from "@/hooks/useGeo";
import { useNavigate } from "react-router-dom";

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

type FilterKey = "all" | "pets" | "plants" | "best" | "bundles" | "sheckle" | "fruits" | "mutated" | "mega" | "brainrots" | "lucky";

type CartLine = { id: string; qty: number; item: Item };

// Catalog (Steal a Brainrot)
export const ITEMS: Item[] = [
  { id: "rainbow-jelly", name: "Rainbow Jelly", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F169a88c0acba49598cbd59a09cecf89b?format=webp&width=800", category: "pet", stock: 3, priceUSD: 24, tags: ["best","brainrots"] },
  { id: "pink-jelly", name: "Pink Jelly", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2Fea97cb06c9f94dcdab63d483c3045b29?format=webp&width=800", category: "pet", stock: 6, priceUSD: 12, tags: ["brainrots"] },
  { id: "blue-buddy", name: "Blue Buddy", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2Fa96746eea6de44398e517335bbeaff31?format=webp&width=800", category: "pet", stock: 5, priceUSD: 10, tags: ["mutated"] },
  { id: "clock-man", name: "Clock Man", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F373e5049046e407ea9297de000a34c67?format=webp&width=800", category: "plant", stock: 2, priceUSD: 18, tags: ["brainrots"] },
  { id: "orb-guardian", name: "Orb Guardian", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F83efa1150ae34674af248da0f970dd84?format=webp&width=800", category: "plant", stock: 7, priceUSD: 9, tags: ["bundles"] },
  { id: "rainbow-orb-guardian", name: "Rainbow Orb Guardian", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2Fc484f773196d4d0ea2201b746fd2a424?format=webp&width=800", category: "plant", stock: 3, priceUSD: 22, tags: ["mega","brainrots"] },
  { id: "mystery-box-rainbow", name: "Mystery Box (Rainbow)", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2Fb2caaccf03164e9d8e36bf9a222132da?format=webp&width=800", category: "pet", stock: 4, priceUSD: 15, tags: ["lucky"] },
  { id: "mystery-box-black", name: "Mystery Box (Black)", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2Fa7a5daba5aa6401ba4bb382ca655e928?format=webp&width=800", category: "pet", stock: 5, priceUSD: 11, tags: ["lucky"] },
  { id: "mystery-box-red", name: "Mystery Box (Red)", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F8e6163635e3a4b61bf9f1170fee344ef?format=webp&width=800", category: "pet", stock: 5, priceUSD: 13, tags: ["lucky"] },
];

export default function Brainrot() {
  // Filters and search
  const [filter, setFilter] = useState<FilterKey>("all");
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  // Handle global search from navbar
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail || "";
      setFilter("all");
      setQ(String(detail || ""));
    };
    window.addEventListener('global:search', handler as EventListener);
    const onFilter = (e: Event) => {
      const key = (e as CustomEvent<FilterKey>).detail as FilterKey | undefined;
      if (key) setFilter(key);
    };
    window.addEventListener('filter:set', onFilter as EventListener);
    try {
      const saved = sessionStorage.getItem('search:q');
      if (saved != null) { setFilter("all"); setQ(saved); }
    } catch {}
    return () => {
      window.removeEventListener('global:search', handler as EventListener);
      window.removeEventListener('filter:set', onFilter as EventListener);
    };
  }, []);

  // Currency override from header
  const [currencyOverride, setCurrencyOverride] = useState<string | null>(null);

  // Cart state
  const [cart, setCart] = useState<Item[]>(() => {
    try { const raw = localStorage.getItem('app:cart'); return raw ? JSON.parse(raw) : []; } catch { return []; }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  // Overlay message visibility (separate from cart)
  const [showCartOverlay, setShowCartOverlay] = useState(false);
  useEffect(() => { if (cartOpen) setShowCartOverlay(true); }, [cartOpen]);

  // Persist cart and sync across tabs
  useEffect(() => { try { localStorage.setItem('app:cart', JSON.stringify(cart || [])); window.dispatchEvent(new CustomEvent('cart:update', { detail: cart })); } catch {} }, [cart]);
  useEffect(() => { const onStorage = (e: StorageEvent) => { if (e.key === 'app:cart') { try { setCart(JSON.parse(e.newValue || '[]')); } catch {} } }; window.addEventListener('storage', onStorage); const onUpdate = (e: Event) => { try { const detail = (e as CustomEvent<Item[]>)?.detail; if (Array.isArray(detail)) setCart(detail); } catch {} }; window.addEventListener('cart:update', onUpdate as EventListener); return () => { window.removeEventListener('storage', onStorage); window.removeEventListener('cart:update', onUpdate as EventListener); }; }, []);

  const { dismiss } = useToast();
  useEffect(() => { if (cartOpen) { try { dismiss(); } catch {} } }, [cartOpen, dismiss]);

  // Geo + currency conversion
  const geo = useGeo();
  const [rate, setRate] = useState<number>(1);

  // Prevent scroll jump when currency/rate resolves
  const prevY = useRef(0);
  useEffect(() => { const onScroll = () => { prevY.current = window.scrollY; }; window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll); }, []);

  // Listen to currency override from header
  useEffect(() => { const saved = localStorage.getItem("currencyOverride"); if (saved) setCurrencyOverride(saved); const handler = (e: Event) => { const detail = (e as CustomEvent<string>).detail; setCurrencyOverride(detail); localStorage.setItem("currencyOverride", detail); }; window.addEventListener("currency:override", handler as EventListener); return () => window.removeEventListener("currency:override", handler as EventListener); }, []);

  const currency = currencyOverride || geo.currency || "USD";

  useEffect(() => { let mounted = true; const loadRate = async () => { try { if (currency === "USD") { setRate(1); return; } let r = 1; try { const res = await fetch(`/api/rates?base=USD&symbols=${encodeURIComponent(currency)}`); if (res.ok) { const data = await res.json(); r = Number(data?.rate) || 1; } } catch {} if (mounted) setRate(r); } catch { if (mounted) setRate(1); } }; loadRate(); setTimeout(() => window.scrollTo({ top: prevY.current, behavior: "instant" as ScrollBehavior }), 0); return () => { mounted = false; }; }, [currency]);
  useEffect(() => { setTimeout(() => window.scrollTo({ top: prevY.current, behavior: "instant" as ScrollBehavior }), 0); }, [rate]);

  const priceFmt = useMemo(() => new Intl.NumberFormat('en-US', { style: "currency", currency, currencyDisplay: 'narrowSymbol', minimumFractionDigits: 0, maximumFractionDigits: 0 }), [currency]);
  const toLocal = (usd: number) => usd * rate;
  const toLocalRounded = (usd: number) => Math.round(toLocal(usd));

  // Disable list item entrance animations after initial mount to prevent flicker on re-renders (e.g., when opening cart)
  const animationsDisabledRef = useRef(false);
  const bottomScrollRef = useRef<HTMLDivElement | null>(null);
  const [bottomScrollable, setBottomScrollable] = useState(false);
  useEffect(() => { animationsDisabledRef.current = true; }, []);

  useEffect(() => {
    const el = bottomScrollRef.current;
    if (!el) return;
    const check = () => setBottomScrollable(el.scrollWidth > el.clientWidth);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    window.addEventListener('resize', check);
    return () => { ro.disconnect(); window.removeEventListener('resize', check); };
  }, []);

  const filterTitleMap: Record<FilterKey, string> = {
    all: "All Items",
    pets: "Pets",
    plants: "Plants",
    best: "Best Sellers",
    bundles: "Bundles",
    sheckle: "Sheckles",
    fruits: "Fruits",
    mutated: "Mutated Pets",
    mega: "Mega Pets",
    brainrots: "Brainrots",
    lucky: "Lucky Blocks",
  };

  // Admin price overrides support
  const [overrides, setOverrides] = useState<Record<string, number>>({});
  const [customProducts, setCustomProducts] = useState<Item[]>([]);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  useEffect(() => { try { const raw = localStorage.getItem("priceOverrides"); if (raw) setOverrides(JSON.parse(raw) || {}); } catch {} const onPrices = () => { try { const raw = localStorage.getItem("priceOverrides"); setOverrides(raw ? JSON.parse(raw) : {}); } catch {} }; window.addEventListener("prices:update", onPrices as EventListener); window.addEventListener("storage", onPrices as EventListener); return () => { window.removeEventListener("prices:update", onPrices as EventListener); window.removeEventListener("storage", onPrices as EventListener); }; }, []);

  // Load admin-managed entries for Brainrot
  useEffect(() => {
    const keyC = "admin:customProducts:brainrot";
    const keyD = "admin:deletedIds:brainrot";
    const load = () => {
      try {
        const c = JSON.parse(localStorage.getItem(keyC) || "[]");
        const d = JSON.parse(localStorage.getItem(keyD) || "[]");
        setCustomProducts(Array.isArray(c) ? c : []);
        setDeletedIds(Array.isArray(d) ? d : []);
      } catch {
        setCustomProducts([]);
        setDeletedIds([]);
      }
    };
    load();
    const onUpdate = () => load();
    window.addEventListener("storage", onUpdate as EventListener);
    window.addEventListener("catalog:update", onUpdate as EventListener);
    return () => {
      window.removeEventListener("storage", onUpdate as EventListener);
      window.removeEventListener("catalog:update", onUpdate as EventListener);
    };
  }, []);

  const itemsCurrent: Item[] = useMemo(() => { const base = ITEMS.filter(i => !deletedIds.includes(i.id)).map(i => ({ ...i, priceUSD: overrides[i.id] ?? i.priceUSD })); const custom = (customProducts || []).map(i => ({ ...i, priceUSD: overrides[i.id] ?? i.priceUSD })); return [...base, ...custom]; }, [overrides, customProducts, deletedIds]);

  // Stock overrides (admin)
  const [stockOverrides, setStockOverrides] = useState<Record<string, number>>({});
  useEffect(() => { try { const raw = localStorage.getItem("stockOverrides"); if (raw) setStockOverrides(JSON.parse(raw) || {}); } catch {} const onStock = () => { try { const raw = localStorage.getItem("stockOverrides"); setStockOverrides(raw ? JSON.parse(raw) : {}); } catch {} }; window.addEventListener("stock:update", onStock as EventListener); window.addEventListener("storage", onStock as EventListener); return () => { window.removeEventListener("stock:update", onStock as EventListener); window.removeEventListener("storage", onStock as EventListener); }; }, []);

  const groupedCart: CartLine[] = useMemo(() => { const map = new Map<string, CartLine>(); for (const it of cart) { const g = map.get(it.id); if (g) g.qty += 1; else map.set(it.id, { id: it.id, qty: 1, item: it }); } return Array.from(map.values()); }, [cart]);

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
    else if (key === "brainrots") list = list.filter((i) => i.tags?.includes("brainrots"));
    else if (key === "lucky") list = list.filter((i) => i.tags?.includes("lucky"));
    return list;
  };

  const filtered = useMemo(() => { const base = itemsForFilter(filter); const query = q.trim().toLowerCase(); return query ? base.filter((i) => i.name.toLowerCase().includes(query)) : base; }, [filter, q, itemsCurrent]);

  const qtyInCart = (id: string) => groupedCart.find((l) => l.id === id)?.qty || 0;

  const addToCart = (item: Item) => { const qty = qtyInCart(item.id); setCart((c) => [...c, item]); setShowHint(true); setShowBubble(true); setTimeout(() => setShowBubble(false), 4000); };

  const removeOne = (id: string) => { setCart((c) => { const idx = c.findIndex((x) => x.id === id); if (idx === -1) return c; const next = c.slice(); next.splice(idx, 1); return next; }); };

  const removeAll = (id: string) => { setCart((c) => c.filter((x) => x.id !== id)); };

  // Icon and SectionSlider (copied behavior from GrowGarden)
  const Icon = (key: FilterKey) => {
    const cls = "h-10 w-10 text-emerald-300";
    switch (key) {
      case "best":
        return (<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="#FE5050" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 10.941c2.333 -3.308 .167 -7.823 -1 -8.941c0 3.395 -2.235 5.299 -3.667 6.706c-1.43 1.408 -2.333 3.621 -2.333 5.588c0 3.704 3.134 6.706 7 6.706s7 -3.002 7 -6.706c0 -1.712 -1.232 -4.403 -2.333 -5.588c-2.084 3.353 -3.257 3.353 -4.667 2.235"/></svg>);
      case "all":
        return (<svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/></svg>);
      case "pets":
        return (<svg viewBox="0 0 24 24" className={cls} fill="currentColor"><circle cx="5" cy="8" r="2"/><circle cx="12" cy="5" r="2"/><circle cx="19" cy="8" r="2"/><path d="M7 19c0-3 2.5-5 5-5s5 2 5 5v1H7z"/></svg>);
      case "bundles":
        return (
          <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="42" height="42" rx="10" fill="#22c55e" fillOpacity="0.1"></rect>
            <g transform="translate(4, 4)">
              <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
                <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path>
              </svg>
            </g>
          </svg>
        );
      case "sheckle":
        return (<svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20"/><path d="M7 7a5 5 0 0 1 5-5"/><path d="M17 17a5 5 0 0 1-5 5"/></svg>);
      case "fruits":
        return (<svg viewBox="0 0 24 24" className={cls} fill="currentColor"><path d="M12 4c-2.5 0-4 1.5-4 3.5S10 11 12 11s4-1.5 4-3.5S14.5 4 12 4zm0 7c-4 0-7 3-7 7h14c0-4-3-7-7-7z"/></svg>);
      case "mutated":
        return (
          <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="42" height="42" rx="10" fill="#22c55e" fillOpacity="0.1"></rect>
            <g transform="translate(4, 4)">
              <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tabler-icon tabler-icon-paw size-8">
                <path d="M14.7 13.5c-1.1 -2 -1.441 -2.5 -2.7 -2.5c-1.259 0 -1.736 .755 -2.836 2.747c-.942 1.703 -2.846 1.845 -3.321 3.291c-.097 .265 -.145 .677 -.143 .962c0 1.176 .787 2 1.8 2c1.259 0 3 -1 4.5 -1s3.241 1 4.5 1c1.013 0 1.8 -.823 1.8 -2c0 -.285 -.049 -.697 -.146 -.962c-.475 -1.451 -2.512 -1.835 -3.454 -3.538z"></path>
                <path d="M20.188 8.082a1.039 1.039 0 0 0 -.406 -.082h-.015c-.735 .012 -1.56 .75 -1.993 1.866c-.519 1.335 -.28 2.7 .538 3.052c.129 .055 .267 .082 .406 .082c.739 0 1.575 -.742 2.011 -1.866c.516 -1.335 .273 -2.7 -.54 -3.052z"></path>
                <path d="M9.474 9c.055 0 .109 0 .163 -.011c.944 -.128 1.533 -1.346 1.32 -2.722c-.203 -1.297 -1.047 -2.267 -1.932 -2.267c-.055 0 -.109 0 -.163 .011c-.944 .128 -1.533 1.346 -1.32 2.722c.204 1.293 1.048 2.267 1.933 2.267z"></path>
                <path d="M16.456 6.733c.214 -1.376 -.375 -2.594 -1.32 -2.722a1.164 1.164 0 0 0 -.162 -.011c-.885 0 -1.728 .97 -1.93 2.267c-.214 1.376 .375 2.594 1.32 2.722c.054 .007 .108 .011 .162 .011c.885 0 1.73 -.974 1.93 -2.267z"></path>
                <path d="M5.69 12.918c.816 -.352 1.054 -1.719 .536 -3.052c-.436 -1.124 -1.271 -1.866 -2.009 -1.866c-.14 0 -.277 .027 -.407 .082c-.816 .352 -1.054 1.719 -.536 3.052c.436 1.124 1.271 1.866 2.009 1.866c.14 0 .277 -.027 .407 -.082z"></path>
              </svg>
            </g>
          </svg>
        );
      case "mega":
        return (<svg viewBox="0 0 24 24" className={cls} fill="currentColor"><path d="M12 2l3 6 6 .9-4.5 4.3 1 6.3L12 16l-5.5 3.5 1-6.3L3 8.9 9 8z"/></svg>);
      case "brainrots":
        return (
          <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="42" height="42" rx="10" fill="#22c55e" fillOpacity="0.1"></rect>
            <g transform="translate(4, 4)">
              <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tabler-icon tabler-icon-brain size-8">
                <path d="M15.5 13a3.5 3.5 0 0 0 -3.5 3.5v1a3.5 3.5 0 0 0 7 0v-1.8"></path>
                <path d="M8.5 13a3.5 3.5 0 0 1 3.5 3.5v1a3.5 3.5 0 0 1 -7 0v-1.8"></path>
                <path d="M17.5 16a3.5 3.5 0 0 0 0 -7h-.5"></path>
                <path d="M19 9.3v-2.8a3.5 3.5 0 0 0 -7 0"></path>
                <path d="M6.5 16a3.5 3.5 0 0 1 0 -7h.5"></path>
                <path d="M5 9.3v-2.8a3.5 3.5 0 0 1 7 0v10"></path>
              </svg>
            </g>
          </svg>
        );
      case "lucky":
        return (
          <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="42" height="42" rx="10" fill="#22c55e" fillOpacity="0.1"></rect>
            <g transform="translate(4, 4)">
              <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tabler-icon tabler-icon-blocks size-8">
                <path d="M14 4a1 1 0 0 1 1 -1h5a1 1 0 0 1 1 1v5a1 1 0 0 1 -1 1h-5a1 1 0 0 1 -1 -1z"></path>
                <path d="M3 14h12a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h3a2 2 0 0 1 2 2v12"></path>
              </svg>
            </g>
          </svg>
        );
      default:
        return null;
    }
  };

  const SectionSlider = ({ fkey, items, doAnimate }: { fkey: FilterKey; items: Item[]; doAnimate: boolean }) => {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const [isScrollable, setIsScrollable] = useState(false);
    useEffect(() => {
      const root = wrapperRef.current;
      if (!root) return;
      const scrollEl = root.querySelector('.best-scroll') as HTMLElement | null;
      if (!scrollEl) { root.style.setProperty('--best-progress', '0'); setIsScrollable(false); return; }
      const onScroll = () => {
        const max = scrollEl.scrollWidth - scrollEl.clientWidth;
        const p = max > 0 ? scrollEl.scrollLeft / max : 0;
        root.style.setProperty('--best-progress', String(p));
      };
      const checkScrollable = () => setIsScrollable(scrollEl.scrollWidth > scrollEl.clientWidth);
      onScroll();
      checkScrollable();
      const ro = new ResizeObserver(() => { onScroll(); checkScrollable(); });
      ro.observe(scrollEl);
      window.addEventListener('resize', checkScrollable);
      scrollEl.addEventListener('scroll', onScroll, { passive: true });
      return () => { scrollEl.removeEventListener('scroll', onScroll as EventListener); ro.disconnect(); window.removeEventListener('resize', checkScrollable); };
    }, []);

    return (
      <div className="mb-10">
        <div className="mb-3 flex items-center gap-3">
          {Icon(fkey)}
          <h2 className="best-heading text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">{filterTitleMap[fkey].toUpperCase()}</h2>
          <div className="ml-auto flex items-center gap-12">
            <button
              type="button"
              onClick={() => navigate(`/brainrot/all?filter=${fkey}`)}
              className="flex items-center justify-center disabled:opacity-75 text-white transition-all duration-300 ease-in-out font-sans rounded-[12px] bg-input border-border border-[2px] text-base font-medium leading-6 px-6 xs:px-10 py-2 lg:px-5 hover:opacity-80 active:opacity-100 active:scale-95 whitespace-nowrap"
            >
              View All
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="tabler-icon tabler-icon-arrow-right ml-2 size-5">
                <path d="M5 12l14 0"></path>
                <path d="M13 18l6 -6"></path>
                <path d="M13 6l6 6"></path>
              </svg>
            </button>
          </div>
        </div>
        <div ref={wrapperRef} className="best-scroll-wrapper relative">
          <div className="best-scroll flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory overscroll-contain">
            {items.map((it, idx) => {
              const qty = qtyInCart(it.id);
              const soldOut = false;
              return (
                <div role="group" aria-roledescription="slide" key={it.id} className="min-w-0 shrink-0 grow-0 pl-4 h-[inherit] basis-[250px]">
                      <div className="h-full">
                        <article className="group relative h-full w-full cursor-pointer overflow-hidden rounded-2xl border-2 border-transparent bg-[#14142580] transition-all duration-500 hover:border-primary hover:bg-[rgba(20,20,37,0.5)]">
                          <div className="relative h-[240px] w-full overflow-hidden bg-[#2A1F47] transition-all duration-500 group-hover:bg-[#3a2a5f]">
                            <img src={it.image} alt={it.name} className="hidden" />
                            <div className="absolute inset-0">
                              <img src={it.image} alt={it.name} draggable={false} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            </div>
                            <button className="touch-manipulation select-none active:scale-95 absolute right-3 bottom-3 flex items-center justify-center rounded-full bg-primary p-2.5 text-white shadow-lg transition-all duration-300 md:hidden" type="button" aria-label="Add to Cart" style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent', userSelect: 'none' }} onClick={() => addToCart(it)}>
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="tabler-icon tabler-icon-shopping-cart-filled size-5">
    <path d="M6 2a1 1 0 0 1 .993 .883l.007 .117v1.068l13.071 .935a1 1 0 0 1 .929 1.024l-.01 .114l-1 7a1 1 0 0 1 -.877 .853l-.113 .006h-12v2h10a3 3 0 1 1 -2.995 3.176l-.005 -.176l.005 -.176c.017 -.288 .074 -.564 .166 -.824h-5.342a3 3 0 1 1 -5.824 1.176l-.005 -.176l.005 -.176a3.002 3.002 0 0 1 1.995 -2.654v-12.17h-1a1 1 0 0 1 -.993 -.883l-.007 -.117a1 1 0 0 1 .883 -.993l.117 -.007h2zm0 16a1 1 0 1 0 0 2a1 1 0 0 0 0 -2zm11 0a1 1 0 1 0 0 2a1 1 0 0 0 0 -2z"></path>
  </svg>
</button>
<div role="button" tabIndex={0} className="absolute right-0 bottom-0 left-0 hidden md:flex translate-y-full cursor-pointer items-center justify-center bg-gradient-to-t from-[#141425]/90 via-[#141425]/50 to-transparent p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                              <button type="button" onClick={() => addToCart(it)} className="flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm text-white shadow-lg transition-all duration-300 hover:bg-p-hover hover:shadow-primary/25">
                                <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Add to Cart
                              </button>
                            </div>
                            <div className="absolute top-2 left-2 flex select-none items-center gap-1.5 rounded-lg bg-gradient-to-r from-red-600/90 to-red-500/90 px-3 py-1.5 shadow-sm backdrop-blur-sm">
                              <div className="rounded-full bg-red-500/30 p-1">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="size-5" fill="currentColor">
                                  <rect width="256" height="256" fill="none"></rect>
                                  <path d="M96,104a8,8,0,1,1,8-8A8,8,0,0,1,96,104Zm64,48a8,8,0,1,0,8,8A8,8,0,0,0,160,152Zm80-24c0,10.44-7.51,18.27-14.14,25.18-3.77,3.94-7.67,8-9.14,11.57-1.36,3.27-1.44,8.69-1.52,13.94-.15,9.76-.31,20.82-8,28.51s-18.75,7.85-28.51,8c-5.25.08-10.67.16-13.94,1.52-3.57,1.47-7.63,5.37-11.57,9.14C146.27,232.49,138.44,240,128,240s-18.27-7.51-25.18-14.14c-3.94-3.77-8-7.67-11.57-9.14-3.27-1.36-8.69-1.44-13.94-1.52-9.76-.15-20.82-.31-28.51-8s-7.85-18.75-8-28.51c-.08-5.25-.16-10.67-1.52-13.94-1.47-3.57-5.37-7.63-9.14-11.57C23.51,146.27,16,138.44,16,128s7.51-18.27,14.14-25.18c3.77-3.94,7.67-8,9.14-11.57,1.36-3.27,1.44-8.69,1.52-13.94.15-9.76.31-20.82,8-28.51s18.75-7.85,28.51-8c5.25-.08,10.67-.16,13.94-1.52,3.57-1.47,7.63-5.37,11.57-9.14C109.73,23.51,117.56,16,128,16s18.27,7.51,25.18,14.14c3.94,3.77,8,7.67,11.57,9.14,3.27,1.36,8.69,1.44,13.94,1.52,9.76.15,20.82.31,28.51,8s7.85,18.75,8,28.51c.08,5.25.16,10.67,1.52,13.94,1.47,3.57,5.37,7.63,9.14,11.57C232.49,109.73,240,117.56,240,128ZM96,120A24,24,0,1,0,72,96,24,24,0,0,0,96,120Zm77.66-26.34a8,8,0,0,0-11.32-11.32l-80,80a8,8,0,0,0,11.32,11.32ZM184,160a24,24,0,1,0-24,24A24,24,0,0,0,184,160Z" />
                                </svg>
                              </div>
                              {(() => { try { const raw = localStorage.getItem('stockOverrides'); const so = raw ? JSON.parse(raw) : {}; const s = (so && Object.prototype.hasOwnProperty.call(so, it.id)) ? Number(so[it.id]) : it.stock; if (s <= 0) return (<div className="absolute top-2 left-2 z-20 rounded-md bg-gray-700 px-2 py-1 shadow-sm"><p className="font-medium text-gray-300 text-xs whitespace-nowrap">Out of Stock</p></div>); return (<p className="font-medium text-sm text-white">Save {priceFmt.format(toLocalRounded(7))}</p>); } catch (e) { return (<p className="font-medium text-sm text-white">Save {priceFmt.format(toLocalRounded(7))}</p>); } })() }
                            </div>
                          </div>
                          <div className="relative h-full bg-[#141425] p-5 transition-colors duration-500 group-hover:bg-[#1a1a2f]">
                            <div className="space-y-1">
                              <div className="flex items-baseline gap-4">
                                <span className="font-normal text-3xl ml-2 tracking-wider transition-all duration-500 group-hover:font-medium text-[#22c55e]">{priceFmt.format(toLocalRounded(it.priceUSD))}</span>
                                <span className="relative text-[#9595BC] text-xl ml-3">{priceFmt.format(toLocalRounded(it.priceUSD + 7))}
                                  <svg width="65" height="17" viewBox="0 0 54 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-[50px] w-[70px]"><path d="M1 12.5L53 1.5" stroke="#FE5050" stroke-width="2"></path></svg>
                                </span>
                              </div>
                              <h2 className="text-xl font-medium text-[#B8B8ED] line-clamp-2 transition-all duration-500 group-hover:text-white group-hover:translate-y-1">{it.name}</h2>
                            </div>
                          </div>
                        </article>
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

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-emerald-900 via-emerald-950 to-black" />
        <div className="container py-6 md:py-12 pt-8 md:pt-16">

          <div className="mt-6">
            <div className="hidden md:block w-full rounded-2xl border border-emerald-700/20 bg-emerald-900/20 p-4 fixed top-16 left-0 right-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-2 rounded-md bg-slate-900/80 text-white border border-white/10 px-2 py-1">
                    <img src="https://cdn.builder.io/api/v1/image/assets%2Fb2458d5aab5847128a2b754080dc1712%2Fd5e8426a3e46435f9c8be0bc746e8e68?format=webp&width=400" alt="Steal a Brainrot" className="h-7 w-10 rounded object-cover" />
                    <span className="font-semibold">Steal a Brainrot</span>
                  </div>
                  <div className="order-[-2] mx-2 h-6 border-r border-white/6" />
                  <Button variant="ghost" size="sm" className={`px-2 py-2 text-white ${filter === "all" ? "underline" : ""}`} onClick={() => setFilter("all")}>
                    All
                  </Button>
                  <Button variant="ghost" size="sm" className={`px-2 py-2 text-white ${filter === "best" ? "underline" : ""}`} onClick={() => setFilter("best")}>
                    Best Sellers
                  </Button>
                  <Button variant="ghost" size="sm" className={`px-2 py-2 text-white ${filter === "brainrots" ? "underline" : ""}`} onClick={() => setFilter("brainrots")}>
                    Brainrots
                  </Button>
                  <div className="mx-2 h-6 border-r border-white/6" />
                  <Button variant="ghost" size="sm" className={`px-2 py-2 text-white ${filter === "bundles" ? "underline" : ""}`} onClick={() => setFilter("bundles")}>
                    Bundles
                  </Button>
                </div>
                <div className="flex items-center">
                  <Button size="sm" onClick={() => window.open('https://discord.gg/sf9asFwhfz', '_blank') } className="ml-3 bg-[#5865F2] hover:bg-[#4752d8] text-white inline-flex items-center gap-2"><img src="https://cdn.builder.io/api/v1/image/assets%2Fd298c54982d64a0783c9a8a3d1e480c1%2F089bab54f66146c99ffa3d1c62c667c7?format=webp&width=800" alt="discord" className="h-6 w-6 object-contain"/>Join Discord</Button>
                </div>
              </div>
            </div>
            <div className="hidden md:block h-20" />
          </div>

          {showHint && (
            <div className="mx-auto w-[92%] md:w-auto mb-4 z-[2147483651] -mt-6 md:mt-0 md:fixed md:left-1/2 md:-translate-x-1/2 md:top-36">
              <div className="rounded-lg border border-emerald-700/40 bg-emerald-900/40 p-3 text-sm text-emerald-100 flex items-center justify-between">
                <span>Item added. Check your cart to proceed to checkout.</span>
                <Button size="sm" className="ml-3 md:ml-4" onClick={() => setCartOpen(true)}>Open Cart</Button>
              </div>
            </div>
          )}

          {cartOpen && showCartOverlay && (
            <div className="fixed left-1/2 top-1/2 z-[2147483647] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="pointer-events-none relative max-w-[10000px] w-[min(100%,10000px)] bg-emerald-700/95 border border-emerald-500 p-6 pr-14 rounded-lg text-white text-center shadow-2xl">
                <button aria-label="Close message" onClick={() => setShowCartOverlay(false)} className="absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-600 hover:bg-red-700 text-white pointer-events-auto">×</button>
                <p className="mb-0 text-sm whitespace-nowrap">Close the cart to add more items to the catalog</p>
              </div>
            </div>
          )}

          <div className="grow-grid mt-2 grid grid-cols-[120px,1fr] gap-4 md:mt-0 md:block">
            <aside className="mobile-filters hidden md:hidden rounded-2xl border border-white/10 bg-slate-900/60 p-2 min-h-[calc(100vh-6rem)]">
              <div className="sticky top-20 space-y-2">
                <div className="flex items-center gap-2 rounded-md bg-slate-900/80 text-white border border-white/10 px-2 py-1">
                  <img src="https://cdn.builder.io/api/v1/image/assets%2Fb2458d5aab5847128a2b754080dc1712%2Fd5e8426a3e46435f9c8be0bc746e8e68?format=webp&width=400" alt="Steal a Brainrot" className="h-7 w-10 rounded object-cover" />
                  <span className="font-semibold text-xs sm:text-sm">Steal a Brainrot</span>
                </div>
                <div className="h-px bg-white/10 my-2" />
                <div className="grid gap-2">
                  <Button className="filter-custom justify-start w-full px-3 py-2 bg-transparent hover:bg-transparent border-0 shadow-none text-white" size="sm" onClick={() => setFilter("all")}>
                    All
                  </Button>
                  <Button className="filter-custom justify-start w-full px-3 py-2 bg-transparent hover:bg-transparent border-0 shadow-none text-white" size="sm" onClick={() => setFilter("best")}>
                    Best Sellers
                  </Button>
                  <Button className="filter-custom justify-start w-full px-3 py-2 bg-transparent hover:bg-transparent border-0 shadow-none text-white" size="sm" onClick={() => setFilter("brainrots")}>
                    Brainrots
                  </Button>
                  <Button className="filter-custom justify-start w-full px-3 py-2 bg-transparent hover:bg-transparent border-0 shadow-none text-white" size="sm" onClick={() => setFilter("bundles")}>
                    Bundles
                  </Button>
                </div>
                  <div className="pt-2">
                    <Button size="sm" className="w-full bg-[#5865F2] hover:bg-[#4752d8] text-white inline-flex items-center justify-center gap-2" onClick={() => window.open('https://discord.gg/sf9asFwhfz', '_blank') }><img src="https://cdn.builder.io/api/v1/image/assets%2Fd298c54982d64a0783c9a8a3d1e480c1%2F089bab54f66146c99ffa3d1c62c667c7?format=webp&width=800" alt="discord" className="h-6 w-6 object-contain"/>Join Discord</Button>
                  </div>
                              </div>
            </aside>
            <div className="min-w-0">
            {(() => {
              if (filter === "all") {
                const order: FilterKey[] = ["best", "bundles", "brainrots"];
                return (
                  <div>
                    {order.map((key) => {
                      const base = itemsForFilter(key);
                      const query = q.trim().toLowerCase();
                      const items = query ? base.filter((i) => i.name.toLowerCase().includes(query)) : base;
                      if (items.length === 0) return null;
                      return <SectionSlider key={key} fkey={key} items={items} doAnimate={!animationsDisabledRef.current} />;
                    })}
                  </div>
                );
              }

              return <SectionSlider fkey={filter} items={filtered} doAnimate={!animationsDisabledRef.current} />;
            })()}
            </div>
          </div>
        </div>

        {/* Mobile bottom filter slider */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-[120] border-t border-white/10 bg-background/90 backdrop-blur">
          <div className="container py-2 best-scroll-wrapper relative">
            <button type="button" aria-label="Scroll left" className={`absolute left-1 top-1/2 -translate-y-1/2 z-20 rounded-full bg-input border-border border-[2px] text-white p-2 active:scale-95 ${bottomScrollable ? '' : 'hidden'}`}  onClick={() => { const el = bottomScrollRef.current; if (!el) return; const btn = el?.querySelector('button'); const w = (btn ? (btn as HTMLElement).getBoundingClientRect().width : 90) + 8; el.scrollBy({ left: -(w * 2), behavior: 'smooth' }); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 6l-6 6l6 6"/></svg>
            </button>
            <button type="button" aria-label="Scroll right" className={`absolute right-1 top-1/2 -translate-y-1/2 z-20 rounded-full bg-input border-border border-[2px] text-white p-2 active:scale-95 ${bottomScrollable ? '' : 'hidden'}`}  onClick={() => { const el = bottomScrollRef.current; if (!el) return; const btn = el?.querySelector('button'); const w = (btn ? (btn as HTMLElement).getBoundingClientRect().width : 90) + 8; el.scrollBy({ left: (w * 2), behavior: 'smooth' }); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 6l6 6l-6 6"/></svg>
            </button>
            <div ref={bottomScrollRef} className="best-scroll flex items-center px-2 py-2 gap-1 overflow-x-auto">
              {[
                { key: 'best', label: 'Best Sellers', color: 'text-red-400 hover:bg-gradient-to-t hover:from-red-500/10 hover:text-red-300', rect: '#FE5050', stroke: '#FE5050' },
                { key: 'brainrots', label: 'Brainrots', color: 'text-gray-400 hover:bg-gradient-to-t hover:from-emerald-500/10 hover:text-emerald-300', rect: '#22c55e', stroke: '#22c55e' },
                { key: 'bundles', label: 'Bundles', color: 'text-gray-400 hover:bg-gradient-to-t hover:from-emerald-500/10 hover:text-emerald-300', rect: '#22c55e', stroke: '#22c55e' },
              ].map((b) => (
                <button key={b.key as string}
                  type="button"
                  onClick={() => setFilter(b.key as any)}
                  className={cn('relative flex h-[70px] min-w-[80px] flex-col items-center justify-center gap-1 overflow-hidden rounded-lg px-3 py-2 text-center transition-all duration-200 touch-manipulation select-none active:scale-95', b.color)}
                  style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent', userSelect: 'none' } as any}
                >
                  <div className="mb-1 flex items-center justify-center">
                    <div className="scale-75">
                      <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="42" height="42" rx="10" fill={b.rect} fillOpacity="0.1"></rect>
                        <g transform="translate(4, 4)">
                          {b.key === 'best' && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke={b.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M12 10.941c2.333 -3.308 .167 -7.823 -1 -8.941c0 3.395 -2.235 5.299 -3.667 6.706c-1.43 1.408 -2.333 3.621 -2.333 5.588c0 3.704 3.134 6.706 7 6.706s7 -3.002 7 -6.706c0 -1.712 -1.232 -4.403 -2.333 -5.588c-2.084 3.353 -3.257 3.353 -4.667 2.235"/></svg>
                          )}
                          {b.key === 'brainrots' && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke={b.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tabler-icon tabler-icon-brain size-8">
                              <path d="M15.5 13a3.5 3.5 0 0 0 -3.5 3.5v1a3.5 3.5 0 0 0 7 0v-1.8"></path>
                              <path d="M8.5 13a3.5 3.5 0 0 1 3.5 3.5v1a3.5 3.5 0 0 1 -7 0v-1.8"></path>
                              <path d="M17.5 16a3.5 3.5 0 0 0 0 -7h-.5"></path>
                              <path d="M19 9.3v-2.8a3.5 3.5 0 0 0 -7 0"></path>
                              <path d="M6.5 16a3.5 3.5 0 0 1 0 -7h.5"></path>
                              <path d="M5 9.3v-2.8a3.5 3.5 0 0 1 7 0v10"></path>
                            </svg>
                          )}
                          {b.key === 'lucky' && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke={b.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tabler-icon tabler-icon-blocks size-8">
                              <path d="M14 4a1 1 0 0 1 1 -1h5a1 1 0 0 1 1 1v5a1 1 0 0 1 -1 1h-5a1 1 0 0 1 -1 -1z"></path>
                              <path d="M3 14h12a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h3a2 2 0 0 1 2 2v12"></path>
                            </svg>
                          )}
                          {b.key === 'bundles' && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke={b.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                              <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path>
                            </svg>
                          )}
                          {b.key === 'mutated' && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke={b.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tabler-icon tabler-icon-paw size-8">
                              <path d="M14.7 13.5c-1.1 -2 -1.441 -2.5 -2.7 -2.5c-1.259 0 -1.736 .755 -2.836 2.747c-.942 1.703 -2.846 1.845 -3.321 3.291c-.097 .265 -.145 .677 -.143 .962c0 1.176 .787 2 1.8 2c1.259 0 3 -1 4.5 -1s3.241 1 4.5 1c1.013 0 1.8 -.823 1.8 -2c0 -.285 -.049 -.697 -.146 -.962c-.475 -1.451 -2.512 -1.835 -3.454 -3.538z"></path>
                              <path d="M20.188 8.082a1.039 1.039 0 0 0 -.406 -.082h-.015c-.735 .012 -1.56 .75 -1.993 1.866c-.519 1.335 -.28 2.7 .538 3.052c.129 .055 .267 .082 .406 .082c.739 0 1.575 -.742 2.011 -1.866c.516 -1.335 .273 -2.7 -.54 -3.052z"></path>
                              <path d="M9.474 9c.055 0 .109 0 .163 -.011c.944 -.128 1.533 -1.346 1.32 -2.722c-.203 -1.297 -1.047 -2.267 -1.932 -2.267c-.055 0 -.109 0 -.163 .011c-.944 .128 -1.533 1.346 -1.32 2.722c.204 1.293 1.048 2.267 1.933 2.267z"></path>
                              <path d="M16.456 6.733c.214 -1.376 -.375 -2.594 -1.32 -2.722a1.164 1.164 0 0 0 -.162 -.011c-.885 0 -1.728 .97 -1.93 2.267c-.214 1.376 .375 2.594 1.32 2.722c.054 .007 .108 .011 .162 .011c.885 0 1.73 -.974 1.93 -2.267z"></path>
                              <path d="M5.69 12.918c.816 -.352 1.054 -1.719 .536 -3.052c-.436 -1.124 -1.271 -1.866 -2.009 -1.866c-.14 0 -.277 .027 -.407 .082c-.816 .352 -1.054 1.719 -.536 3.052c.436 1.124 1.271 1.866 2.009 1.866c.14 0 .277 -.027 .407 -.082z"></path>
                            </svg>
                          )}
                          {!(['best','brainrots','lucky','bundles','mutated'] as string[]).includes(b.key as any) && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke={b.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><circle cx="12" cy="12" r="9"></circle></svg>
                          )}
                        </g>
                      </svg>
                    </div>
                  </div>
                  <div className="text-xs font-semibold leading-3">{b.label}</div>
                </button>
              ))}
              <div className="w-4" />
            </div>
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
          {/* Desktop cart button */}
          <Button onClick={() => setCartOpen((s) => !s)} className="hidden md:inline-flex fixed bottom-6 left-1/2 z-[2147483650] -translate-x-1/2 items-center gap-2 px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_0_20px_rgba(16,185,129,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" className="text-white">
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
            <div className="hidden md:block fixed right-6 bottom-6 z-[2147483650] w-80 rounded-lg bg-gradient-to-br from-[#0b0d1a] to-[#111221] border border-white/5 p-4 shadow-xl animate-in fade-in-0 slide-in-from-right-5">
              <div className="relative">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">Cart</h4>
                  <button onClick={() => setCartOpen(false)} className="h-8 w-8 rounded-md bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center text-white">×</button>
                </div>

                <div className="mt-4 flex flex-col items-center gap-4">
                  <img src="https://cdn.builder.io/api/v1/image/assets%2Fd298c54982d64a0783c9a8a3d1e480c1%2F10eceadf204c44b98902bc8d6f09be5d?format=webp&width=800" alt="cart art" className="h-28" />


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
                                                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="ghost" onClick={() => removeOne(l.id)} onPointerUp={() => removeOne(l.id)} className="h-12 w-12 p-0 md:h-8 md:w-8 touch-manipulation select-none active:scale-95" aria-label="Remove one">
                                <img src="https://cdn.builder.io/api/v1/image/assets%2F3c749f6f09c54a9eb8fcb348ed15bfb7%2F0f5bb2e690f54ef0889dd8b7bf262b5b?format=webp&width=800" alt="Remove" className="pointer-events-none h-6 w-6 md:h-8 md:w-8" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => addToCart(l.item)} onPointerUp={() => addToCart(l.item)} className="h-12 w-12 p-0 md:h-8 md:w-8 touch-manipulation select-none active:scale-95" aria-label="Add one">
                                <img src="https://cdn.builder.io/api/v1/image/assets%2F3c749f6f09c54a9eb8fcb348ed15bfb7%2F39039b2a76914a6d9fd1d30b977f07b5?format=webp&width=800" alt="Add" className="pointer-events-none h-6 w-6 md:h-8 md:w-8" />
                              </Button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="text-lg font-bold">{priceFmt.format(totalLocalRounded)}</div>
                    <div className="text-xs text-muted-foreground">Discounts Applied at Checkout</div>
                  </div>

                  <button disabled={groupedCart.length === 0} onClick={() => { if (groupedCart.length === 0) return; try { const lines = groupedCart.map((l) => ({ id: l.id, name: l.item.name, qty: l.qty, priceLocal: Math.round(toLocal((overrides[l.id] ?? l.item.priceUSD) * l.qty)), thumb: l.item.image })); const payload = { currency, lines }; localStorage.setItem("checkout:payload", JSON.stringify(payload)); } catch {} setCartOpen(false); window.location.assign("/checkout"); }} className="w-full mt-2 rounded-lg bg-rose-700 hover:bg-rose-800 text-white py-3 flex items-center justify-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 6h15l-1.5 9h-12L6 6Z" stroke="currentColor" strokeWidth="1.5"/></svg>
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile full-screen cart */}
        {cartOpen && (
          <div className="md:hidden fixed inset-0 z-[2147483651] bg-gradient-to-b from-[#0b0d1a] to-[#111221] border border-white/5">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <h4 className="text-base font-semibold">Cart</h4>
                <button type="button" onPointerDown={(e) => { e.stopPropagation(); setCartOpen(false); }} onClick={(e) => { e.stopPropagation(); setCartOpen(false); }} className="h-9 w-9 rounded-md bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center text-white">×</button>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <div className="flex flex-col items-center gap-4">
                  <img src="https://cdn.builder.io/api/v1/image/assets%2Fd298c54982d64a0783c9a8a3d1e480c1%2F10eceadf204c44b98902bc8d6f09be5d?format=webp&width=800" alt="cart art" className="h-28" />
                  <div className="w-full text-left">
                    {groupedCart.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Your cart is empty.</p>
                    ) : (
                      <ul className="space-y-2 max-h-[50vh] overflow-auto pr-1 mb-3">
                        {groupedCart.map((l) => (
                          <li key={l.id} className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <img src={l.item.image} alt="" className="h-10 w-10 shrink-0 rounded-md object-cover" />
                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium">{l.item.name} × {l.qty}</p>
                                <p className="text-xs text-muted-foreground">{priceFmt.format(Math.round(toLocal((overrides[l.id] ?? l.item.priceUSD) * l.qty)))}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="ghost" onClick={() => removeOne(l.id)} onPointerUp={() => removeOne(l.id)} className="h-12 w-12 p-0 md:h-8 md:w-8 touch-manipulation select-none active:scale-95" aria-label="Remove one">
                                <img src="https://cdn.builder.io/api/v1/image/assets%2F3c749f6f09c54a9eb8fcb348ed15bfb7%2F0f5bb2e690f54ef0889dd8b7bf262b5b?format=webp&width=800" alt="Remove" className="pointer-events-none h-6 w-6 md:h-8 md:w-8" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => addToCart(l.item)} onPointerUp={() => addToCart(l.item)} className="h-12 w-12 p-0 md:h-8 md:w-8 touch-manipulation select-none active:scale-95" aria-label="Add one">
                                <img src="https://cdn.builder.io/api/v1/image/assets%2F3c749f6f09c54a9eb8fcb348ed15bfb7%2F39039b2a76914a6d9fd1d30b977f07b5?format=webp&width=800" alt="Add" className="pointer-events-none h-6 w-6 md:h-8 md:w-8" />
                              </Button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-white/10">
                <div className="text-lg font-bold">{priceFmt.format(totalLocalRounded)}</div>
                <div className="text-xs text-muted-foreground">Discounts Applied at Checkout</div>
                <button
                  disabled={groupedCart.length === 0}
                  onClick={() => {
                    if (groupedCart.length === 0) return;
                    try {
                      const lines = groupedCart.map((l) => ({ id: l.id, name: l.item.name, qty: l.qty, priceLocal: Math.round(toLocal((overrides[l.id] ?? l.item.priceUSD) * l.qty)), thumb: l.item.image }));
                      const payload = { currency, lines };
                      localStorage.setItem("checkout:payload", JSON.stringify(payload));
                    } catch {}
                    setCartOpen(false);
                    window.location.assign("/checkout");
                  }}
                  className="w-full mt-3 rounded-lg bg-rose-700 hover:bg-rose-800 text-white py-3 flex items-center justify-center gap-2"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden><title>Shopping Cart</title><path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                  Checkout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile cart button (phones) */}
        <div className="md:hidden" style={{ position: 'fixed', zIndex: 2147483650, bottom: 120, left: 20, opacity: 1, transform: 'none', display: cartOpen ? 'none' : undefined }}>
          <button
            className="touch-manipulation select-none active:scale-95 relative flex cursor-pointer items-center justify-center rounded-2xl border-2 border-[#fe5198] bg-[#FE5198] px-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#fe5198] focus:ring-offset-2 focus:ring-offset-[#141425]"
            aria-label={`Open cart with ${cart.length} items`}
            type="button"
            tabIndex={0}
            style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent', userSelect: 'none', transform: 'none' } as any}
            onClick={() => setCartOpen((s) => !s)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <title>Shopping Cart</title>
              <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
            <span className="ml-2 whitespace-nowrap font-bold">{cart.length} {cart.length === 1 ? 'item' : 'items'} in cart</span>
            {cart.length > 0 && (
              <div className="-top-2 -right-2 absolute flex h-6 w-6 items-center justify-center rounded-full bg-red-500" aria-hidden>
                <span className="font-bold text-xs">{cart.length}</span>
              </div>
            )}
          </button>
        </div>
      </section>
    </div>
  );
}
