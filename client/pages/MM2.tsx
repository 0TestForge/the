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

type FilterKey = "all" | "pets" | "plants" | "best" | "bundles" | "sheckle" | "mutated" | "mega";

type CartLine = { id: string; qty: number; item: Item };

// Catalog (Murder Mystery 2)
export const ITEMS: Item[] = [
  { id: "chroma-blade", name: "Chroma Blade", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F205ad800b7024ca2b7155e38798bae3b?format=webp&width=800", category: "pet", stock: 5, priceUSD: 15, tags: ["best"] },
  { id: "tree-knife", name: "Tree Knife", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F6423c1dd754049b1a5cffcc85838ee79?format=webp&width=800", category: "pet", stock: 4, priceUSD: 12 },
  { id: "spiked-bat", name: "Spiked Bat", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2Fdfae1ac3507e4cb4a594ffa1807de385?format=webp&width=800", category: "pet", stock: 6, priceUSD: 10, tags: ["mutated"] },
  { id: "tree-gun", name: "Tree Gun", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F5e22f58e53294ed6a26f2c6ab50df3d6?format=webp&width=800", category: "pet", stock: 3, priceUSD: 14 },
  { id: "candy-cane", name: "Candy Cane", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2Ff134024984cb4ad698648a754fd0a2be?format=webp&width=800", category: "plant", stock: 7, priceUSD: 9, tags: ["bundles"] },
  { id: "amethyst-shard", name: "Amethyst Shard", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F496984993eb143918635d20040f77302?format=webp&width=800", category: "plant", stock: 2, priceUSD: 20, tags: ["mega"] },
  { id: "batwing-scythe", name: "Batwing Scythe", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F29e30af1b2cc4e5595d15c28ed76d848?format=webp&width=800", category: "plant", stock: 2, priceUSD: 25 },
  { id: "chroma-luger", name: "Chroma Luger", image: "https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F12b3665e7d564c778d3163afd561a555?format=webp&width=800", category: "plant", stock: 5, priceUSD: 22 },
];

export default function MM2() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [q, setQ] = useState("");
  const [currencyOverride, setCurrencyOverride] = useState<string | null>(null);
  const [cart, setCart] = useState<Item[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const bestScrollRef = useRef<HTMLDivElement | null>(null);
  const geo = useGeo();

  useEffect(() => {
    const root = bestScrollRef.current;
    if (!root) return;
    const scrollEl = (root.classList && root.classList.contains('best-scroll')) ? root : (root.querySelector ? (root.querySelector('.best-scroll') as HTMLElement | null) : null);
    if (!scrollEl) {
      root.style.setProperty('--best-progress', '0');
      return;
    }
    const onScroll = () => {
      const max = scrollEl.scrollWidth - scrollEl.clientWidth;
      const p = max > 0 ? scrollEl.scrollLeft / max : 0;
      root.style.setProperty('--best-progress', String(p));
    };
    if (filter === 'best') {
      onScroll();
      scrollEl.addEventListener('scroll', onScroll, { passive: true });
    } else {
      root.style.setProperty('--best-progress', '0');
    }
    return () => scrollEl.removeEventListener('scroll', onScroll as EventListener);
  }, [filter]);

  const { dismiss } = useToast();
  useEffect(() => { if (cartOpen) { try { dismiss(); } catch {} } }, [cartOpen, dismiss]);
  const [rate, setRate] = useState<number>(1);
  const prevY = useRef(0);
  useEffect(() => { const onScroll = () => { prevY.current = window.scrollY; }; window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll); }, []);
  useEffect(() => { const saved = localStorage.getItem("currencyOverride"); if (saved) setCurrencyOverride(saved); const handler = (e: Event) => { const detail = (e as CustomEvent<string>).detail; setCurrencyOverride(detail); localStorage.setItem("currencyOverride", detail); }; window.addEventListener("currency:override", handler as EventListener); return () => window.removeEventListener("currency:override", handler as EventListener); }, []);
  const currency = currencyOverride || geo.currency || "USD";
  useEffect(() => { let mounted = true; const loadRate = async () => { try { if (currency === "USD") { setRate(1); return; } let r = 1; try { const res = await fetch(`/api/rates?base=USD&symbols=${encodeURIComponent(currency)}`); if (res.ok) { const data = await res.json(); r = Number(data?.rate) || 1; } } catch {} if (mounted) setRate(r); } catch { if (mounted) setRate(1); } }; loadRate(); setTimeout(() => window.scrollTo({ top: prevY.current, behavior: "instant" as ScrollBehavior }), 0); return () => { mounted = false; }; }, [currency]);
  useEffect(() => { setTimeout(() => window.scrollTo({ top: prevY.current, behavior: "instant" as ScrollBehavior }), 0); }, [rate]);
  const priceFmt = useMemo(() => new Intl.NumberFormat(undefined, { style: "currency", currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }), [currency]);
  const toLocal = (usd: number) => usd * rate;
  const toLocalRounded = (usd: number) => Math.round(toLocal(usd));
  const [overrides, setOverrides] = useState<Record<string, number>>({});
  useEffect(() => { try { const raw = localStorage.getItem("priceOverrides"); if (raw) setOverrides(JSON.parse(raw) || {}); } catch {} const onPrices = () => { try { const raw = localStorage.getItem("priceOverrides"); setOverrides(raw ? JSON.parse(raw) : {}); } catch {} }; window.addEventListener("prices:update", onPrices as EventListener); window.addEventListener("storage", onPrices as EventListener); return () => { window.removeEventListener("prices:update", onPrices as EventListener); window.removeEventListener("storage", onPrices as EventListener); }; }, []);
  const itemsCurrent: Item[] = useMemo(() => ITEMS.map(i => ({ ...i, priceUSD: overrides[i.id] ?? i.priceUSD })), [overrides]);
  const [stockOverrides, setStockOverrides] = useState<Record<string, number>>({});
  useEffect(() => { try { const raw = localStorage.getItem("stockOverrides"); if (raw) setStockOverrides(JSON.parse(raw) || {}); } catch {} const onStock = () => { try { const raw = localStorage.getItem("stockOverrides"); setStockOverrides(raw ? JSON.parse(raw) : {}); } catch {} }; window.addEventListener("stock:update", onStock as EventListener); window.addEventListener("storage", onStock as EventListener); return () => { window.removeEventListener("stock:update", onStock as EventListener); window.removeEventListener("storage", onStock as EventListener); }; }, []);
  const groupedCart: CartLine[] = useMemo(() => { const map = new Map<string, CartLine>(); for (const it of cart) { const g = map.get(it.id); if (g) g.qty += 1; else map.set(it.id, { id: it.id, qty: 1, item: it }); } return Array.from(map.values()); }, [cart]);
  const totalUSD = groupedCart.reduce((s, l) => s + (overrides[l.id] ?? l.item.priceUSD) * l.qty, 0);
  const totalLocalRounded = Math.round(toLocal(totalUSD));
  const filtered = useMemo(() => { const byFilter = itemsCurrent.filter((i) => (filter === "plants" ? i.category === "plant" : filter === "pets" ? i.category === "pet" : true)); const query = q.trim().toLowerCase(); return query ? byFilter.filter((i) => i.name.toLowerCase().includes(query)) : byFilter; }, [filter, q, itemsCurrent]);
  const qtyInCart = (id: string) => groupedCart.find((l) => l.id === id)?.qty || 0;
  const addToCart = (item: Item) => { const qty = qtyInCart(item.id); const effStock = stockOverrides[item.id] ?? item.stock; if (qty >= effStock) { toast({ title: "Max stock reached", description: `${item.name} stock: ${effStock}` }); return; } setCart((c) => [...c, item]); setShowHint(true); setShowBubble(true); setTimeout(() => setShowBubble(false), 4000); toast({ title: "Added to cart", description: `${item.name} • ${priceFmt.format(toLocalRounded(item.priceUSD))}` }); };
  const removeOne = (id: string) => { setCart((c) => { const idx = c.findIndex((x) => x.id === id); if (idx === -1) return c; const next = c.slice(); next.splice(idx, 1); return next; }); };
  const removeAll = (id: string) => { setCart((c) => c.filter((x) => x.id !== id)); };
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-emerald-900 via-emerald-950 to-black" />
        <div className="container py-10 md:py-14 pt-20">

          <div className="mt-6">
            <div className="w-full rounded-2xl border border-emerald-700/20 bg-emerald-900/20 p-4 fixed top-16 left-0 right-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-2 rounded-md bg-slate-900/80 text-white border border-white/10 px-2 py-1">
                    <img src="https://cdn.builder.io/api/v1/image/assets%2Fb2458d5aab5847128a2b754080dc1712%2F155ecd3b276d4626afdb8f1be5054597?format=webp&width=400" alt="Murder Mystery 2" className="h-7 w-10 rounded object-cover" />
                    <span className="font-semibold">Murder Mystery 2</span>
                  </div>
                  <div className="flex items-center gap-2 mr-4 pr-4 border-r border-white/6">
                    <Button className={`filter-custom isolate-filter ${filter === "all" ? "active" : ""} bg-slate-900/80 text-white border border-white/10 px-3 py-2 rounded-md shadow-sm hover:bg-slate-900/95`} size="sm" onClick={() => setFilter("all")}>
                      <span className="laser" aria-hidden />All
                    </Button>

                    <Button className={`filter-custom isolate-filter ${filter === "best" ? "active" : ""} bg-slate-900/80 text-white border border-white/10 px-3 py-2 rounded-md shadow-sm hover:bg-slate-900/95`} size="sm" onClick={() => setFilter("best")}>
                      <span className="laser" aria-hidden />
                      <span className="inline-flex items-center gap-2">
                        <img src="https://cdn.builder.io/api/v1/image/assets%2Fd298c54982d64a0783c9a8a3d1e480c1%2Fa52a865175de4ee0b13ba303cef212f7?format=webp&width=800" alt="fire" className="h-7 w-7 object-contain" aria-hidden />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-orange-400 to-yellow-300 font-extrabold tracking-wide">BestSellers</span>
                      </span>
                      <div className="best-slider" />
                    </Button>
                  </div>

                  <Button className={`filter-custom ${filter === "bundles" ? "active" : ""} bg-slate-900/80 text-white border border-white/10 px-3 py-2 rounded-md shadow-sm hover:bg-slate-900/95`} size="sm" onClick={() => setFilter("bundles")}>
                    <span className="laser" aria-hidden />Bundles
                  </Button>
                </div>
                <div className="w-full md:w-80">
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
            {filter === "best" && (
              <div className="mb-3 flex items-center gap-3">
                <img src="https://cdn.builder.io/api/v1/image/assets%2Fd298c54982d64a0783c9a8a3d1e480c1%2Fa52a865175de4ee0b13ba303cef212f7?format=webp&width=800" alt="fire" className="h-10 w-10 object-contain" aria-hidden />
                <h2 className="best-heading text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">BEST SELLERS</h2>
              </div>
            )}
            <div ref={filter === "best" ? bestScrollRef : undefined} className={filter === "best" ? "best-scroll-wrapper relative" : ""}>
              <div className={filter === "best" ? "best-scroll flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory" : "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"}>
              {filtered.map((it, idx) => {
                const qty = qtyInCart(it.id);
                const effStock = stockOverrides[it.id] ?? it.stock;
                const soldOut = qty >= effStock;
                return (
                  <div key={it.id} className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-0 transition-transform duration-500 ease-out hover:bg-slate-900/95 hover:shadow-sm hover:-translate-y-0.5 hover:scale-[1.02] animate-in fade-in-0 slide-in-from-bottom-2 ${filter === "best" ? "flex-none w-72" : ""}`} style={{ animationDelay: `${(idx % 12) * 40}ms` }}>
                    <div className="relative aspect-square overflow-hidden rounded-xl ring-1 ring-emerald-700/20 group-hover:ring-emerald-500/30 transition">
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
              {filter === "best" && <div className="best-scroll-progress" aria-hidden />}
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
                      <Button className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 inline-flex items-center gap-2 bg-slate-900/80 text-white border border-white/10 px-3 py-2 rounded-md shadow-sm hover:bg-slate-900/95">
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
                {/* Illustration */}
                <img src="https://cdn.builder.io/api/v1/image/assets%2Fd298c54982d64a0783c9a8a3d1e480c1%2F10eceadf204c44b98902bc8d6f09be5d?format=webp&width=800" alt="cart art" className="h-28" />

                {/* Discount card */}
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

                {/* Items list or empty state */}
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
                              <p className="truncate text-sm font-medium">{l.item.name} �� {l.qty}</p>
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
