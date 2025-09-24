import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ITEMS } from "./BloxFruits";
import { useGeo } from "@/hooks/useGeo";

export default function BloxFruitsAll() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const filter = (params.get("filter") || "all") as string;

  const geo = useGeo();
  const [rate, setRate] = useState<number>(1);

  useEffect(() => {
    let mounted = true;
    const loadRate = async () => {
      try {
        const currency = geo.currency || "USD";
        if (currency === "USD") { setRate(1); return; }
        let r = 1;
        try {
          const res = await fetch(`/api/rates?base=USD&symbols=${encodeURIComponent(currency)}`);
          if (res.ok) { const data = await res.json(); r = Number(data?.rate) || 1; }
        } catch {}
        if (mounted) setRate(r);
      } catch { if (mounted) setRate(1); }
    };
    loadRate();
    return () => { mounted = false; };
  }, [geo.currency]);

  const priceFmt = useMemo(() => new Intl.NumberFormat("en-US", { style: "currency", currency: geo.currency || "USD", currencyDisplay: "narrowSymbol", minimumFractionDigits: 0, maximumFractionDigits: 0 }), [geo.currency]);
  const toLocal = (usd: number) => usd * rate;
  const toLocalRounded = (usd: number) => Math.round(toLocal(usd));

  const [overrides, setOverrides] = useState<Record<string, number>>({});
  const [customProducts, setCustomProducts] = useState<any[]>([]);
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

  const itemsCurrent = useMemo(() => {
    const base = ITEMS.filter(i => !deletedIds.includes(i.id)).map(i => ({ ...i, priceUSD: overrides[i.id] ?? i.priceUSD }));
    const custom = (customProducts || []).map(i => ({ ...i, priceUSD: overrides[i.id] ?? i.priceUSD }));
    return [...base, ...custom];
  }, [overrides, customProducts, deletedIds]);

  const itemsForFilter = (key: string) => {
    let list = itemsCurrent as any[];
    if (key === "best") list = list.filter((i) => (i.tags || []).includes("best"));
    else if (key === "permanent") list = list.filter((i) => (i.tags || []).includes("permanent"));
    return list;
  };

  const items = filter === "all" ? itemsCurrent : itemsForFilter(filter);

  const [cart, setCart] = useState<any[]>(() => { try { const raw = localStorage.getItem("app:cart"); return raw ? JSON.parse(raw) : []; } catch { return []; } });
  useEffect(() => { try { localStorage.setItem("app:cart", JSON.stringify(cart || [])); window.dispatchEvent(new CustomEvent('cart:update', { detail: cart })); } catch {} }, [cart]);

  const addToCart = (item: any) => { setCart((c) => [...c, item]); };

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">{(filter || "All").toString().toUpperCase()}</h1>
          <p className="text-sm text-muted-foreground">Showing {items.length} items</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="rounded-md bg-input border-border border-2 px-4 py-2 text-white">Back</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((it: any) => (
          <div role="group" aria-roledescription="card" key={it.id} className="h-full">
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
                <div className="absolute top-2 left-2 flex select-none items-center gap-1.5 rounded-lg bg-gradient-to-r from-red-600/90 to-red-500/90 px-3 py-1.5 shadow-sm backdrop-blur-sm">
                  <div className="rounded-full bg-red-500/30 p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="size-5" fill="currentColor"><rect width="256" height="256" fill="none"></rect><path d="M96,104a8,8,0,1,1,8-8A8,8,0,0,1,96,104Zm64,48a8,8,0,1,0,8,8A8,8,0,0,0,160,152Zm80-24c0,10.44-7.51,18.27-14.14,25.18-3.77,3.94-7.67,8-9.14,11.57-1.36,3.27-1.44,8.69-1.52,13.94-.15,9.76-.31,20.82-8,28.51s-18.75,7.85-28.51,8c-5.25.08-10.67.16-13.94,1.52-3.57,1.47-7.63,5.37-11.57,9.14C146.27,232.49,138.44,240,128,240s-18.27-7.51-25.18-14.14c-3.94-3.77-8-7.67-11.57-9.14-3.27-1.36-8.69-1.44-13.94-1.52-9.76-.15-20.82-.31-28.51-8s-7.85-18.75-8-28.51c-.08-5.25-.16-10.67-1.52-13.94-1.47-3.57-5.37-7.63-9.14-11.57C23.51,146.27,16,138.44,16,128s7.51-18.27,14.14-25.18c3.77-3.94,7.67-8,9.14-11.57,1.36-3.27,1.44-8.69,1.52-13.94.15-9.76.31-20.82,8-28.51s18.75-7.85,28.51-8c5.25-.08,10.67-.16,13.94-1.52,3.57-1.47,7.63-5.37,11.57-9.14C109.73,23.51,117.56,16,128,16s18.27,7.51,25.18,14.14c3.94,3.77,8,7.67,11.57,9.14,3.27,1.36,8.69,1.44,13.94,1.52,9.76.15,20.82.31,28.51,8s7.85,18.75,8,28.51c.08,5.25.16,10.67,1.52,13.94,1.47,3.57,5.37,7.63,9.14,11.57C232.49,109.73,240,117.56,240,128Z"/></svg>
                  </div>
                  {(() => { try { const raw = localStorage.getItem('stockOverrides'); const so = raw ? JSON.parse(raw) : {}; const s = (so && Object.prototype.hasOwnProperty.call(so, it.id)) ? Number(so[it.id]) : it.stock; if (s <= 0) return (<div className="absolute top-2 left-2 z-20 rounded-md bg-gray-700 px-2 py-1 shadow-sm"><p className="font-medium text-gray-300 text-xs whitespace-nowrap">Out of Stock</p></div>); return (<p className="font-medium text-sm text-white">Save {priceFmt.format(toLocalRounded(7))}</p>); } catch (e) { return (<p className="font-medium text-sm text-white">Save {priceFmt.format(toLocalRounded(7))}</p>); } })() }
                </div>
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
        ))}
      </div>
    </div>
  );
}
