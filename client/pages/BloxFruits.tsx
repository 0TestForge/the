import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useGeo } from "@/hooks/useGeo";

// Domain types
 type Item = { id: string; name: string; image: string; category: "pet" | "plant"; stock: number; priceUSD: number; tags?: string[] };
 type FilterKey = "all" | "best" | "permanent";
 type CartLine = { id: string; qty: number; item: Item };

// Catalog (Blox Fruits) — sample data with tags "best" and "permanent"
export const ITEMS: Item[] = [
  { id: "perm-ice", name: "Permanent Ice", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2Fbe60cc732b1b44f28e3af656696011b5?format=webp&width=800", category: "plant", stock: 8, priceUSD: 19, tags: ["permanent"] },
  { id: "perm-light", name: "Permanent Light", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F68f58bd0f45b49ba8cb0aa48accb095b?format=webp&width=800", category: "plant", stock: 5, priceUSD: 25, tags: ["best","permanent"] },
  { id: "perm-electric", name: "Permanent Electric", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2Fb468b81480d949fba738072a39790a00?format=webp&width=800", category: "plant", stock: 6, priceUSD: 22, tags: ["permanent"] },
  { id: "perm-buddha", name: "Permanent Buddha", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2Fbb714220133840b29940ad0dccecbcdd?format=webp&width=800", category: "plant", stock: 2, priceUSD: 45, tags: ["best","permanent"] },
  { id: "perm-portal", name: "Permanent Portal", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F91504519181b4952af7ec765f387df90?format=webp&width=800", category: "plant", stock: 3, priceUSD: 38, tags: ["permanent"] },
  { id: "perm-venom", name: "Permanent Venom", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F2d1eaecfc0244aa5a8868c12666ab96b?format=webp&width=800", category: "plant", stock: 1, priceUSD: 60, tags: ["best","permanent"] },
  { id: "perm-rumble", name: "Permanent Rumble", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F94bd90a7d545485c9c48ce81ff1c70a5?format=webp&width=800", category: "plant", stock: 4, priceUSD: 29, tags: ["permanent"] },
  { id: "perm-magma", name: "Permanent Magma", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F39e5c800109f4927aee8f94d892c985c?format=webp&width=800", category: "plant", stock: 5, priceUSD: 27, tags: ["permanent"] },
];

export default function BloxFruits() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [q, setQ] = useState("");
  useEffect(() => {
    const handler = (e: Event) => { const detail = (e as CustomEvent<string>).detail || ""; setFilter("all"); setQ(String(detail || "")); };
    window.addEventListener('global:search', handler as EventListener);
    const onFilter = (e: Event) => { const key = (e as CustomEvent<FilterKey>).detail as FilterKey | undefined; if (key) setFilter(key); };
    window.addEventListener('filter:set', onFilter as EventListener);
    try { const saved = sessionStorage.getItem('search:q'); if (saved != null) { setFilter("all"); setQ(saved); } } catch {}
    return () => { window.removeEventListener('global:search', handler as EventListener); window.removeEventListener('filter:set', onFilter as EventListener); };
  }, []);

  const [currencyOverride, setCurrencyOverride] = useState<string | null>(null);
  const [cart, setCart] = useState<Item[]>(() => { try { const raw = localStorage.getItem('app:cart'); return raw ? JSON.parse(raw) : []; } catch { return []; } });
  const [cartOpen, setCartOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [showCartOverlay, setShowCartOverlay] = useState(false);
  useEffect(() => { if (cartOpen) setShowCartOverlay(true); }, [cartOpen]);
  useEffect(() => { try { localStorage.setItem('app:cart', JSON.stringify(cart || [])); window.dispatchEvent(new CustomEvent('cart:update', { detail: cart })); } catch {} }, [cart]);
  useEffect(() => { const onStorage = (e: StorageEvent) => { if (e.key === 'app:cart') { try { setCart(JSON.parse(e.newValue || '[]')); } catch {} } }; window.addEventListener('storage', onStorage); const onUpdate = (e: Event) => { try { const detail = (e as CustomEvent<Item[]>)?.detail; if (Array.isArray(detail)) setCart(detail); } catch {} }; window.addEventListener('cart:update', onUpdate as EventListener); return () => { window.removeEventListener('storage', onStorage); window.removeEventListener('cart:update', onUpdate as EventListener); }; }, []);

  const { dismiss } = useToast();
  useEffect(() => { if (cartOpen) { try { dismiss(); } catch {} } }, [cartOpen, dismiss]);

  const geo = useGeo();
  const [rate, setRate] = useState<number>(1);
  const prevY = useRef(0);
  useEffect(() => { const onScroll = () => { prevY.current = window.scrollY; }; window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll); }, []);
  useEffect(() => { const saved = localStorage.getItem("currencyOverride"); if (saved) setCurrencyOverride(saved); const handler = (e: Event) => { const detail = (e as CustomEvent<string>).detail; setCurrencyOverride(detail); localStorage.setItem("currencyOverride", detail); }; window.addEventListener("currency:override", handler as EventListener); return () => window.removeEventListener("currency:override", handler as EventListener); }, []);
  const currency = currencyOverride || geo.currency || "USD";
  useEffect(() => { let mounted = true; const loadRate = async () => { try { if (currency === "USD") { setRate(1); return; } let r = 1; try { const res = await fetch(`/api/rates?base=USD&symbols=${encodeURIComponent(currency)}`); if (res.ok) { const data = await res.json(); r = Number(data?.rate) || 1; } } catch {} if (mounted) setRate(r); } catch { if (mounted) setRate(1); } }; loadRate(); setTimeout(() => window.scrollTo({ top: prevY.current, behavior: "instant" as ScrollBehavior }), 0); return () => { mounted = false; }; }, [currency]);
  useEffect(() => { setTimeout(() => window.scrollTo({ top: prevY.current, behavior: "instant" as ScrollBehavior }), 0); }, [rate]);

  const priceFmt = useMemo(() => new Intl.NumberFormat('en-US', { style: "currency", currency, currencyDisplay: 'narrowSymbol', minimumFractionDigits: 0, maximumFractionDigits: 0 }), [currency]);
  const toLocal = (usd: number) => usd * rate;
  const toLocalRounded = (usd: number) => Math.round(toLocal(usd));

  const animationsDisabledRef = useRef(false);
  useEffect(() => { animationsDisabledRef.current = true; }, []);

  const filterTitleMap: Record<FilterKey, string> = { all: "All Items", best: "Best Sellers", permanent: "Permanent Fruits" };

  // Admin price overrides support
  const [overrides, setOverrides] = useState<Record<string, number>>({});
  const [customProducts, setCustomProducts] = useState<Item[]>([]);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  useEffect(() => {
    try { const raw = localStorage.getItem("priceOverrides"); if (raw) setOverrides(JSON.parse(raw) || {}); } catch {}
    const onPrices = () => { try { const raw = localStorage.getItem("priceOverrides"); setOverrides(raw ? JSON.parse(raw) : {}); } catch {} };
    window.addEventListener("prices:update", onPrices as EventListener);
    window.addEventListener("storage", onPrices as EventListener);
    return () => { window.removeEventListener("prices:update", onPrices as EventListener); window.removeEventListener("storage", onPrices as EventListener); };
  }, []);

  // Stock overrides (admin)
  const [stockOverrides, setStockOverrides] = useState<Record<string, number>>({});
  useEffect(() => {
    try { const raw = localStorage.getItem("stockOverrides"); if (raw) setStockOverrides(JSON.parse(raw) || {}); } catch {}
    const onStock = () => { try { const raw = localStorage.getItem("stockOverrides"); setStockOverrides(raw ? JSON.parse(raw) : {}); } catch {} };
    window.addEventListener("stock:update", onStock as EventListener);
    window.addEventListener("storage", onStock as EventListener);
    return () => { window.removeEventListener("stock:update", onStock as EventListener); window.removeEventListener("storage", onStock as EventListener); };
  }, []);

  // Load admin custom products / deletions for Blox Fruits
  useEffect(() => {
    const keyC = "admin:customProducts:blox";
    const keyD = "admin:deletedIds:blox";
    const load = () => {
      try {
        const c = JSON.parse(localStorage.getItem(keyC) || "[]");
        const d = JSON.parse(localStorage.getItem(keyD) || "[]");
        setCustomProducts(Array.isArray(c) ? c : []);
        setDeletedIds(Array.isArray(d) ? d : []);
      } catch { setCustomProducts([]); setDeletedIds([]); }
    };
    load();
    const onUpdate = () => load();
    window.addEventListener("storage", onUpdate as EventListener);
    window.addEventListener("catalog:update", onUpdate as EventListener);
    return () => { window.removeEventListener("storage", onUpdate as EventListener); window.removeEventListener("catalog:update", onUpdate as EventListener); };
  }, []);

  const itemsCurrent: Item[] = useMemo(() => {
    const base = ITEMS.filter(i => !deletedIds.includes(i.id)).map(i => ({ ...i, priceUSD: overrides[i.id] ?? i.priceUSD }));
    const custom = (customProducts || []).map(i => ({ ...i, priceUSD: overrides[i.id] ?? i.priceUSD }));
    return [...base, ...custom];
  }, [overrides, customProducts, deletedIds]);

  const itemsForFilter = (key: FilterKey): Item[] => {
    let list = itemsCurrent;
    if (key === "best") list = list.filter((i) => i.tags?.includes("best"));
    else if (key === "permanent") list = list.filter((i) => i.tags?.includes("permanent"));
    return list;
  };

  const filtered = useMemo(() => { const base = itemsForFilter(filter); const query = q.trim().toLowerCase(); return query ? base.filter((i) => i.name.toLowerCase().includes(query)) : base; }, [filter, q, itemsCurrent]);

  const groupedCart: CartLine[] = useMemo(() => { const map = new Map<string, CartLine>(); for (const it of cart) { const g = map.get(it.id); if (g) g.qty += 1; else map.set(it.id, { id: it.id, qty: 1, item: it }); } return Array.from(map.values()); }, [cart]);
  const qtyInCart = (id: string) => groupedCart.find((l) => l.id === id)?.qty || 0;
  const totalUSD = groupedCart.reduce((s, l) => s + (overrides[l.id] ?? l.item.priceUSD) * l.qty, 0);
  const totalLocalRounded = Math.round(toLocal(totalUSD));

  const addToCart = (item: Item) => { setCart((c) => [...c, item]); setShowHint(true); setShowBubble(true); setTimeout(() => setShowBubble(false), 4000); };
  const removeOne = (id: string) => { setCart((c) => { const idx = c.findIndex((x) => x.id === id); if (idx === -1) return c; const next = c.slice(); next.splice(idx, 1); return next; }); };

  const Icon = (key: FilterKey) => {
    switch (key) {
      case "best":
        return (<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="#FE5050" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 10.941c2.333 -3.308 .167 -7.823 -1 -8.941c0 3.395 -2.235 5.299 -3.667 6.706c-1.43 1.408 -2.333 3.621 -2.333 5.588c0 3.704 3.134 6.706 7 6.706s7 -3.002 7 -6.706c0 -1.712 -1.232 -4.403 -2.333 -5.588c-2.084 3.353 -3.257 3.353 -4.667 2.235"/></svg>);
      case "permanent":
        return (
          <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="42" height="42" rx="10" fill="#22c55e" fillOpacity="0.1"></rect>
            <g transform="translate(4, 4)">
              <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
                <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
                <path d="M12 2a3 3 0 0 1 3 3c0 .562 -.259 1.442 -.776 2.64l-.724 1.36l1.76 -1.893c.499 -.6 .922 -1 1.27 -1.205a2.968 2.968 0 0 1 4.07 1.099a3.011 3.011 0 0 1 -1.09 4.098c-.374 .217 -.99 .396 -1.846 .535l-2.664 .366l2.4 .326c1 .145 1.698 .337 2.11 .576a3.011 3.011 0 0 1 1.09 4.098a2.968 2.968 0 0 1 -4.07 1.098c-.348 -.202 -.771 -.604 -1.27 -1.205l-1.76 -1.893l.724 1.36c.516 1.199 .776 2.079 .776 2.64a3 3 0 0 1 -6 0c0 -.562 .259 -1.442 .776 -2.64l.724 -1.36l-1.76 1.893c-.499 .601 -.922 1 -1.27 1.205a2.968 2.968 0 0 1 -4.07 -1.098a3.011 3.011 0 0 1 1.09 -4.098c.374 -.218 .99 -.396 1.846 -.536l2.664 -.366l-2.4 -.325c-1 -.145 -1.698 -.337 -2.11 -.576a3.011 3.011 0 0 1 -1.09 -4.099a2.968 2.968 0 0 1 4.07 -1.099c.348 .203 .771 .604 1.27 1.205l1.76 1.894c-1 -2.292 -1.5 -3.625 -1.5 -4a3 3 0 0 1 3 -3z"></path>
              </svg>
            </g>
          </svg>
        );
      default:
        return null;
    }
  };

  const navigate = useNavigate();
  const SectionSlider = ({ fkey, items, doAnimate }: { fkey: FilterKey; items: Item[]; doAnimate: boolean }) => {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const [isScrollable, setIsScrollable] = useState(false);
    useEffect(() => {
      const root = wrapperRef.current; if (!root) return; const scrollEl = root.querySelector('.best-scroll') as HTMLElement | null; if (!scrollEl) { root.style.setProperty('--best-progress', '0'); setIsScrollable(false); return; }
      const onScroll = () => { const max = scrollEl.scrollWidth - scrollEl.clientWidth; const p = max > 0 ? scrollEl.scrollLeft / max : 0; root.style.setProperty('--best-progress', String(p)); };
      const checkScrollable = () => setIsScrollable(scrollEl.scrollWidth > scrollEl.clientWidth);
      onScroll(); checkScrollable();
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
            <button type="button" onClick={() => navigate(`/blox/all?filter=${fkey}`)} className="flex items-center justify-center disabled:opacity-75 text-white transition-all duration-300 ease-in-out font-sans rounded-[12px] bg-input border-border border-[2px] text-base font-medium leading-6 px-6 xs:px-10 py-2 lg:px-5 hover:opacity-80 active:opacity-100 active:scale-95 whitespace-nowrap">
              View All
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tabler-icon tabler-icon-arrow-right ml-2 size-5"><path d="M5 12l14 0"></path><path d="M13 18l6 -6"></path><path d="M13 6l6 6"></path></svg>
            </button>
          </div>
        </div>
        <div ref={wrapperRef} className="best-scroll-wrapper relative">
          <div className="best-scroll flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory overscroll-contain">
            {items.map((it) => {
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
                        <button className="touch-manipulation select-none active:scale-95 absolute right-3 bottom-3 flex items-center justify-center rounded-full bg-primary p-2.5 text-white shadow-lg transition-all duration-300 md:hidden" type="button" aria-label="Add to Cart" style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent', userSelect: 'none' } as any} onClick={() => addToCart(it)}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="tabler-icon tabler-icon-shopping-cart-filled size-5"><path d="M6 2a1 1 0 0 1 .993 .883l.007 .117v1.068l13.071 .935a1 1 0 0 1 .929 1.024l-.01 .114l-1 7a1 1 0 0 1 -.877 .853l-.113 .006h-12v2h10a3 3 0 1 1 -2.995 3.176l-.005 -.176l.005 -.176c.017 -.288 .074 -.564 .166 -.824h-5.342a3 3 0 1 1 -5.824 1.176l-.005 -.176l.005 -.176a3.002 3.002 0 0 1 1.995 -2.654v-12.17h-1a1 1 0 0 1 -.993 -.883l-.007 -.117a1 1 0 0 1 .883 -.993l.117 -.007h2zm0 16a1 1 0 1 0 0 2a1 1 0 0 0 0 -2zm11 0a1 1 0 1 0 0 2a1 1 0 0 0 0 -2z"/></svg>
                        </button>
                        <div role="button" tabIndex={0} className="absolute right-0 bottom-0 left-0 hidden md:flex translate-y-full cursor-pointer items-center justify-center bg-gradient-to-t from-[#141425]/90 via-[#141425]/50 to-transparent p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                          <button type="button" onClick={() => addToCart(it)} className="flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm text-white shadow-lg transition-all duration-300 hover:bg-p-hover hover:shadow-primary/25">
                            <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                            Add to Cart
                          </button>
                        </div>
                        {(() => {
                          try {
                            const raw = localStorage.getItem('stockOverrides');
                            const so = raw ? JSON.parse(raw) : {};
                            const s = (so && Object.prototype.hasOwnProperty.call(so, it.id)) ? Number(so[it.id]) : it.stock;
                            if (!isFinite(s) || s > 0) {
                              return (<div className="absolute top-2 left-2 flex select-none items-center gap-1.5 rounded-lg bg-gradient-to-r from-red-600/90 to-red-500/90 px-3 py-1.5 shadow-sm backdrop-blur-sm">
                                <div className="rounded-full bg-red-500/30 p-1">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="size-5" fill="currentColor"><rect width="256" height="256" fill="none"></rect><path d="M96,104a8,8,0,1,1,8-8A8,8,0,0,1,96,104Zm64,48a8,8,0,1,0,8,8A8,8,0,0,0,160,152Zm80-24c0,10.44-7.51,18.27-14.14,25.18-3.77,3.94-7.67,8-9.14,11.57-1.36,3.27-1.44,8.69-1.52,13.94-.15,9.76-.31,20.82-8,28.51s-18.75,7.85-28.51,8c-5.25.08-10.67.16-13.94,1.52-3.57,1.47-7.63,5.37-11.57,9.14C146.27,232.49,138.44,240,128,240s-18.27-7.51-25.18-14.14c-3.94-3.77-8-7.67-11.57-9.14-3.27-1.36-8.69-1.44-13.94-1.52-9.76-.15-20.82-.31-28.51-8s-7.85-18.75-8-28.51c-.08-5.25-.16-10.67-1.52-13.94-1.47-3.57-5.37-7.63-9.14-11.57C23.51,146.27,16,138.44,16,128s7.51-18.27,14.14-25.18c3.77-3.94,7.67-8,9.14-11.57,1.36-3.27,1.44-8.69,1.52-13.94.15-9.76.31-20.82,8-28.51s18.75-7.85,28.51-8c5.25-.08,10.67-.16,13.94-1.52,3.57-1.47,7.63-5.37,11.57-9.14C109.73,23.51,117.56,16,128,16s18.27,7.51,25.18,14.14c3.94,3.77,8,7.67,11.57,9.14,3.27,1.36,8.69,1.44,13.94,1.52,9.76.15,20.82.31,28.51,8s7.85,18.75,8,28.51c.08,5.25.16,10.67,1.52,13.94,1.47,3.57,5.37,7.63,9.14,11.57C232.49,109.73,240,117.56,240,128Z"/></svg>
                                </div>
                                <p className="font-medium text-sm text-white">Save {priceFmt.format(toLocalRounded(7))}</p>
                              </div>);
                            }
                            return (<div className="absolute top-2 left-2 z-20 rounded-md bg-gray-700 px-2 py-1 shadow-sm"><p className="font-medium text-gray-300 text-xs whitespace-nowrap">Out of Stock</p></div>);
                          } catch (e) {
                            return (<div className="absolute top-2 left-2 flex select-none items-center gap-1.5 rounded-lg bg-gradient-to-r from-red-600/90 to-red-500/90 px-3 py-1.5 shadow-sm backdrop-blur-sm">
                              <div className="rounded-full bg-red-500/30 p-1">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="size-5" fill="currentColor"><rect width="256" height="256" fill="none"></rect><path d="M96,104a8,8,0,1,1,8-8A8,8,0,0,1,96,104Zm64,48a8,8,0,1,0,8,8A8,8,0,0,0,160,152Zm80-24c0,10.44-7.51,18.27-14.14,25.18-3.77,3.94-7.67,8-9.14,11.57-1.36,3.27-1.44,8.69-1.52,13.94-.15,9.76-.31,20.82-8,28.51s-18.75,7.85-28.51,8c-5.25.08-10.67.16-13.94,1.52-3.57,1.47-7.63,5.37-11.57,9.14C146.27,232.49,138.44,240,128,240s-18.27-7.51-25.18-14.14c-3.94-3.77-8-7.67-11.57-9.14-3.27-1.36-8.69-1.44-13.94-1.52-9.76-.15-20.82-.31-28.51-8s-7.85-18.75-8-28.51c-.08-5.25-.16-10.67-1.52-13.94-1.47-3.57-5.37-7.63-9.14-11.57C23.51,146.27,16,138.44,16,128s7.51-18.27,14.14-25.18c3.77-3.94,7.67-8,9.14-11.57,1.36-3.27,1.44-8.69,1.52-13.94.15-9.76.31-20.82,8-28.51s18.75-7.85,28.51-8c5.25-.08,10.67-.16,13.94-1.52,3.57-1.47,7.63-5.37,11.57-9.14C109.73,23.51,117.56,16,128,16s18.27,7.51,25.18,14.14c3.94,3.77,8,7.67,11.57,9.14,3.27,1.36,8.69,1.44,13.94,1.52,9.76.15,20.82.31,28.51,8s7.85,18.75,8,28.51c.08,5.25.16,10.67,1.52,13.94,1.47,3.57,5.37,7.63,9.14,11.57C232.49,109.73,240,117.56,240,128Z"/></svg>
                              </div>
                              <p className="font-medium text-sm text-white">Save {priceFmt.format(toLocalRounded(7))}</p>
                            </div>);
                          }
                        })()}
                      </div>
                      <div className="relative h-full bg-[#141425] p-5 transition-colors duration-500 group-hover:bg-[#1a1a2f]">
                        <div className="space-y-1">
                          <div className="flex items-baseline gap-4">
                            <span className="font-normal text-3xl ml-2 tracking-wider transition-all duration-500 group-hover:font-medium text-[#22c55e]">{priceFmt.format(toLocalRounded(it.priceUSD))}</span>
                            <span className="relative text-[#9595BC] text-xl ml-3">{priceFmt.format(toLocalRounded(it.priceUSD + 7))}
                              <svg width="65" height="17" viewBox="0 0 54 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-[50px] w-[70px]"><path d="M1 12.5L53 1.5" stroke="#FE5050" strokeWidth="2"></path></svg>
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
                  <div className="order-[-2] flex items-center gap-2 rounded-md bg-slate-900/80 text-white border border-white/10 px-2 py-1">
                    <img src="https://cdn.builder.io/api/v1/image/assets%2Fa17b3953a32448139f60d7c2bcda706b%2F1e72998e48794cf699143ac972a8c060?format=webp&width=800" alt="Blox Fruits" className="h-7 w-10 rounded object-cover" />
                    <span className="font-semibold">Blox Fruits</span>
                  </div>
                  <div className="order-[-1] mx-2 h-6 border-r border-white/6" />
                  <Button variant="ghost" size="sm" className={`px-2 py-2 text-white ${filter === "all" ? "underline" : ""}`} onClick={() => setFilter("all")}>
                    All
                  </Button>
                  <Button variant="ghost" size="sm" className={`px-2 py-2 text-white ${filter === "best" ? "underline" : ""}`} onClick={() => setFilter("best")}>
                    Best Sellers
                  </Button>
                  <Button variant="ghost" size="sm" className={`px-2 py-2 text-white ${filter === "permanent" ? "underline" : ""}`} onClick={() => setFilter("permanent")}>
                    Permanent Fruits
                  </Button>
                </div>
                <div className="flex items-center">
                  <Button size="sm" onClick={() => window.open('https://discord.gg/sf9asFwhfz', '_blank') } className="ml-3 bg-[#5865F2] hover:bg[#4752d8] text-white inline-flex items-center gap-2"><img src="https://cdn.builder.io/api/v1/image/assets%2Fd298c54982d64a0783c9a8a3d1e480c1%2F089bab54f66146c99ffa3d1c62c667c7?format=webp&width=800" alt="discord" className="h-6 w-6 object-contain"/>Join Discord</Button>
                </div>
              </div>
            </div>
            <div className="hidden md:block h-20" />
          </div>

          {/* Mobile bottom filter slider */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-[120] border-t border-white/10 bg-background/90 backdrop-blur">
            <div className="container py-2 best-scroll-wrapper relative">
              <div className="best-scroll flex items-center px-2 py-2 gap-1 overflow-x-auto">
                {[
                  { key: 'best', label: 'Best Sellers', rect: '#FE5050', stroke: '#FE5050', color: 'text-red-400 hover:bg-gradient-to-t hover:from-red-500/10 hover:text-red-300' },
                  { key: 'permanent', label: 'Permanent Fruits', rect: '#22c55e', stroke: '#22c55e', color: 'text-gray-400 hover:bg-gradient-to-t hover:from-emerald-500/10 hover:text-emerald-300' },
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
                              <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke={b.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M12 10.941c2.333 -3.308 .167 -7.823 -1 -8.941c0 3.395 -2.235 5.299 -3.667 6.706c-1.43 1.408 -2.333 3.621 -2.333 5.588c0 3.704 3.134 6.706 7 6.706s7 -3.002 7 -6.706c0 -1.712 -1.232 -4.403 -2.333 -5.588c-2.084 3.353 -3.257 3.353 -4.667 2.235"></path></svg>
                            )}
                            {b.key === 'permanent' && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke={b.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path><path d="M12 2a3 3 0 0 1 3 3c0 .562 -.259 1.442 -.776 2.64l-.724 1.36l1.76 -1.893c.499 -.6 .922 -1 1.27 -1.205a2.968 2.968 0 0 1 4.07 1.099a3.011 3.011 0 0 1 -1.09 4.098c-.374 .217 -.99 .396 -1.846 .535l-2.664 .366l2.4 .326c1 .145 1.698 .337 2.11 .576a3.011 3.011 0 0 1 1.09 4.098a2.968 2.968 0 0 1 -4.07 1.098c-.348 -.202 -.771 -.604 -1.27 -1.205l-1.76 -1.893l.724 1.36c.516 1.199 .776 2.079 .776 2.64a3 3 0 0 1 -6 0c0 -.562 .259 -1.442 .776 -2.64l.724 -1.36l-1.76 1.893c-.499 .601 -.922 1 -1.27 1.205a2.968 2.968 0 0 1 -4.07 -1.098a3.011 3.011 0 0 1 1.09 -4.098c.374 -.218 .99 -.396 1.846 -.536l2.664 -.366l-2.4 -.325c-1 -.145 -1.698 -.337 -2.11 -.576a3.011 3.011 0 0 1 -1.09 -4.099a2.968 2.968 0 0 1 4.07 -1.099c.348 .203 .771 .604 1.27 1.205l1.76 1.894c-1 -2.292 -1.5 -3.625 -1.5 -4a3 3 0 0 1 3 -3z"></path></svg>
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
              <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-background/90 to-transparent flex items-center justify-start pl-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/50"><path d="M15 6l-6 6l6 6"/></svg>
              </div>
              <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-background/90 to-transparent flex items-center justify-end pr-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/70 animate-pulse"><path d="M9 6l6 6l-6 6"/></svg>
              </div>
            </div>
          </div>

          <div className="grow-grid mt-2 grid grid-cols-[120px,1fr] gap-4 md:mt-0 md:block">
            <aside className="mobile-filters hidden md:hidden rounded-2xl border border-white/10 bg-slate-900/60 p-2 min-h-[calc(100vh-6rem)]">
              <div className="sticky top-20 space-y-2">
                <div className="flex items-center gap-2 rounded-md bg-slate-900/80 text-white border border-white/10 px-2 py-1">
                  <img src="https://cdn.builder.io/api/v1/image/assets%2Fa17b3953a32448139f60d7c2bcda706b%2F1e72998e48794cf699143ac972a8c060?format=webp&width=800" alt="Blox Fruits" className="h-7 w-10 rounded object-cover" />
                  <span className="font-semibold text-xs sm:text-sm">Blox Fruits</span>
                </div>
                <div className="h-px bg-white/10 my-2" />
                <div className="grid gap-2">
                  <Button className="filter-custom justify-start w-full px-3 py-2 bg-transparent hover:bg-transparent border-0 shadow-none text-white" size="sm" onClick={() => setFilter("all")}>
                    All
                  </Button>
                  <Button className="filter-custom justify-start w-full px-3 py-2 bg-transparent hover:bg-transparent border-0 shadow-none text-white" size="sm" onClick={() => setFilter("best")}>
                    Best Sellers
                  </Button>
                  <Button className="filter-custom justify-start w-full px-3 py-2 bg-transparent hover:bg-transparent border-0 shadow-none text-white" size="sm" onClick={() => setFilter("permanent")}>
                    Permanent Fruits
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
                  const order: FilterKey[] = ["best", "permanent"];
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

        {showBubble && !cartOpen && (
          <div className="fixed bottom-28 left-1/2 z-50 -translate-x-1/2 rounded-md px-3 py-2 bg-slate-900/80 text-white border border-white/10 shadow-lg animate-in fade-in-0">
            Click to open cart
            <svg className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-white" width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 0 L9 8 L18 0 Z" fill="currentColor"/></svg>
          </div>
        )}

        <div>
          <Button onClick={() => setCartOpen((s) => !s)} className="hidden md:inline-flex fixed bottom-6 left-1/2 z-[2147483650] -translate-x-1/2 items-center gap-2 px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_0_20px_rgba(16,185,129,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" className="text-white"><path d="M6 6h15l-1.5 9h-12L6 6Z" stroke="currentColor" strokeWidth="2"/><circle cx="9" cy="20" r="1" fill="currentColor"/><circle cx="18" cy="20" r="1" fill="currentColor"/></svg>
            <span className="font-semibold hidden sm:inline">View Cart</span>
            {cart.length > 0 && (<span className="absolute -top-2 right-0 grid h-5 w-5 place-content-center rounded-full bg-white text-[11px] font-bold text-slate-900 ring-2 ring-white/20">{cart.length}</span>)}
          </Button>

          {cartOpen && (
            <div className="hidden md:block fixed right-6 bottom-6 z-[2147483650] w-80 rounded-lg bg-gradient-to-br from-[#0b0d1a] to-[#111221] border border-white/5 p-4 shadow-xl animate-in fade-in-0 slide-in-from-right-5">
              <div className="relative">
                <div className="flex items-center justify-between"><h4 className="text-sm font-semibold">Cart</h4><button onClick={() => setCartOpen(false)} className="h-8 w-8 rounded-md bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center text-white">×</button></div>
                <div className="mt-4 flex flex-col items-center gap-4">
                  <img src="https://cdn.builder.io/api/v1/image/assets%2Fd298c54982d64a0783c9a8a3d1e480c1%2F10eceadf204c44b98902bc8d6f09be5d?format=webp&width=800" alt="cart art" className="h-28" />
                  <div className="w-full text-left">
                    {groupedCart.length === 0 ? (<p className="text-sm text-muted-foreground">Your cart is empty.</p>) : (
                      <ul className="space-y-2 max-h-44 overflow-auto pr-1 mb-3">
                        {groupedCart.map((l) => (
                          <li key={l.id} className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <img src={l.item.image} alt="" className="h-10 w-10 shrink-0 rounded-md object-cover" />
                              <div className="min-w-0"><p className="truncate text-sm font-medium">{l.item.name} × {l.qty}</p><p className="text-xs text-muted-foreground">{priceFmt.format(Math.round(toLocal((overrides[l.id] ?? l.item.priceUSD) * l.qty)))}</p></div>
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
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden><title>Shopping Cart</title><path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {cartOpen && (
          <div className="md:hidden fixed inset-0 z-[2147483651] bg-gradient-to-b from-[#0b0d1a] to-[#111221] border border-white/5">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10"><h4 className="text-base font-semibold">Cart</h4><button type="button" onPointerDown={(e) => { e.stopPropagation(); setCartOpen(false); }} onClick={(e) => { e.stopPropagation(); setCartOpen(false); }} className="h-9 w-9 rounded-md bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center text-white">×</button></div>
              <div className="flex-1 overflow-auto p-4">
                <div className="flex flex-col items-center gap-4">
                  <img src="https://cdn.builder.io/api/v1/image/assets%2Fd298c54982d64a0783c9a8a3d1e480c1%2F10eceadf204c44b98902bc8d6f09be5d?format=webp&width=800" alt="cart art" className="h-28" />
                  <div className="w-full text-left">
                    {groupedCart.length === 0 ? (<p className="text-sm text-muted-foreground">Your cart is empty.</p>) : (
                      <ul className="space-y-2 max-h-[50vh] overflow-auto pr-1 mb-3">
                        {groupedCart.map((l) => (
                          <li key={l.id} className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <img src={l.item.image} alt="" className="h-10 w-10 shrink-0 rounded-md object-cover" />
                              <div className="min-w-0"><p className="truncate text-sm font-medium">{l.item.name} × {l.qty}</p><p className="text-xs text-muted-foreground">{priceFmt.format(Math.round(toLocal((overrides[l.id] ?? l.item.priceUSD) * l.qty)))}</p></div>
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
                <button disabled={groupedCart.length === 0} onClick={() => { if (groupedCart.length === 0) return; try { const lines = groupedCart.map((l) => ({ id: l.id, name: l.item.name, qty: l.qty, priceLocal: Math.round(toLocal((overrides[l.id] ?? l.item.priceUSD) * l.qty)), thumb: l.item.image })); const payload = { currency, lines }; localStorage.setItem("checkout:payload", JSON.stringify(payload)); } catch {} setCartOpen(false); window.location.assign("/checkout"); }} className="w-full mt-3 rounded-lg bg-rose-700 hover:bg-rose-800 text-white py-3 flex items-center justify-center gap-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden><title>Shopping Cart</title><path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                  Checkout
                </button>
              </div>
            </div>
          </div>
        )}

      </section>
    </div>
  );
}
