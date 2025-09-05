import { useEffect, useMemo, useState } from "react";
import { ITEMS } from "@/pages/GrowGarden";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Admin() {
  const [codeOk, setCodeOk] = useState<boolean>(() => sessionStorage.getItem("adminCodeOk") === "1");
  const [code, setCode] = useState("");
  const [q, setQ] = useState("");
  const [overrides, setOverrides] = useState<Record<string, number>>({});
  const [stockOverrides, setStockOverrides] = useState<Record<string, number>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem("priceOverrides");
      if (raw) setOverrides(JSON.parse(raw) || {});
      const sraw = localStorage.getItem("stockOverrides");
      if (sraw) setStockOverrides(JSON.parse(sraw) || {});
    } catch {}
  }, []);

  // Hooks must be consistent across renders
  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    return ITEMS.filter(i => i.name.toLowerCase().includes(query) || i.id.toLowerCase().includes(query));
  }, [q]);

  const getPrice = (id: string, base: number) => overrides[id] ?? base;
  const getStock = (id: string, base: number) => stockOverrides[id] ?? base;

  const save = () => {
    try {
      localStorage.setItem("priceOverrides", JSON.stringify(overrides));
      localStorage.setItem("stockOverrides", JSON.stringify(stockOverrides));
      window.dispatchEvent(new Event("prices:update"));
      window.dispatchEvent(new Event("stock:update"));
      alert("Saved");
    } catch (e) { alert("Failed to save"); }
  };

  return (
    codeOk ? (
      <div className="min-h-screen text-blue-50">
        <div className="container py-8">
          <h1 className="text-xl font-semibold">Admin panel</h1>
          <p className="text-sm text-emerald-200/80">Edit item prices. Changes apply immediately on the site.</p>

          <div className="mt-4 flex items-center gap-2">
            <Input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search by name or id" className="max-w-sm" />
            <Button onClick={save} className="bg-emerald-500 text-slate-900 hover:bg-emerald-400">Save changes</Button>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {list.map(it => (
              <div key={it.id} className="rounded-xl border border-blue-800/50 bg-[#081433]/60 p-4">
                <div className="flex items-center gap-3">
                  <img src={it.image} alt="" className="h-12 w-12 rounded-md object-cover" />
                  <div className="min-w-0">
                    <div className="truncate font-semibold">{it.name}</div>
                    <div className="text-xs text-emerald-200/70">{it.id}</div>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-[auto_1fr_auto] items-center gap-2">
                  <span className="text-xs text-emerald-200/80">Base price:</span>
                  <span className="text-sm">${it.priceUSD}</span>
                  <span className="text-xs text-emerald-200/60 justify-self-end">USD</span>

                  <span className="text-xs text-emerald-200/80">Override price:</span>
                  <Input
                    value={String(getPrice(it.id, it.priceUSD))}
                    onChange={(e)=>{
                      const v = Number(e.target.value.replace(/[^0-9.]/g, ""));
                      setOverrides(o => ({...o, [it.id]: isFinite(v) ? v : 0 }));
                    }}
                  />
                  <span className="text-xs text-emerald-200/60 justify-self-end">USD</span>

                  <span className="text-xs text-emerald-200/80">Base stock:</span>
                  <span className="text-sm">{it.stock}</span>
                  <span />

                  <span className="text-xs text-emerald-200/80">Override stock:</span>
                  <Input
                    value={String(getStock(it.id, it.stock))}
                    onChange={(e)=>{
                      const v = Number(e.target.value.replace(/[^0-9]/g, ""));
                      setStockOverrides(o => ({...o, [it.id]: isFinite(v) ? v : 0 }));
                    }}
                  />
                  <span />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ) : (
      <div className="min-h-screen grid place-content-center bg-background">
        <div className="w-[min(92vw,420px)] rounded-xl border p-6">
          <h1 className="text-lg font-semibold">Admin access</h1>
          <p className="mt-1 text-sm text-muted-foreground">Enter access code to continue.</p>
          <Input className="mt-4" type="password" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Access code" />
          <Button className="mt-3 w-full" onClick={() => {
            if (code === "mia123") { sessionStorage.setItem("adminCodeOk", "1"); setCodeOk(true); }
            else alert("Invalid code");
          }}>Continue</Button>
        </div>
      </div>
    )
  );
}
