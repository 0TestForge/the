import { useEffect, useMemo, useState } from "react";
import { ITEMS as GROW_ITEMS } from "@/pages/GrowGarden";
import { ITEMS as MM2_ITEMS } from "@/pages/MM2";
import { ITEMS as BRAINROT_ITEMS } from "@/pages/Brainrot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Shared item shape used by all pages
type Item = {
  id: string;
  name: string;
  image: string;
  category: "pet" | "plant";
  stock: number;
  priceUSD: number;
  tags?: string[];
};

type GameKey = "grow" | "mm" | "brainrot";

const BASE_BY_GAME: Record<GameKey, Item[]> = {
  grow: GROW_ITEMS as unknown as Item[],
  mm: MM2_ITEMS as unknown as Item[],
  brainrot: BRAINROT_ITEMS as unknown as Item[],
};

const customKey = (g: GameKey) => `admin:customProducts:${g}`;
const deletedKey = (g: GameKey) => `admin:deletedIds:${g}`;

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function Admin() {
  const [codeOk, setCodeOk] = useState<boolean>(() => sessionStorage.getItem("adminCodeOk") === "1");
  const [code, setCode] = useState("");

  const [game, setGame] = useState<GameKey>("grow");
  const [q, setQ] = useState("");

  // overrides (kept from previous admin)
  const [overrides, setOverrides] = useState<Record<string, number>>({});
  const [stockOverrides, setStockOverrides] = useState<Record<string, number>>({});

  // custom products & deleted ids per game
  const [custom, setCustom] = useState<Item[]>([]);
  const [deleted, setDeleted] = useState<string[]>([]);

  // create dialog state
  const [createOpen, setCreateOpen] = useState(false);
  const [draft, setDraft] = useState<Partial<Item>>({ category: "pet", stock: 1, priceUSD: 1 });

  useEffect(() => {
    try {
      const raw = localStorage.getItem("priceOverrides");
      if (raw) setOverrides(JSON.parse(raw) || {});
      const sraw = localStorage.getItem("stockOverrides");
      if (sraw) setStockOverrides(JSON.parse(sraw) || {});
    } catch {}
  }, []);

  // load per-game data
  useEffect(() => {
    try {
      const c = JSON.parse(localStorage.getItem(customKey(game)) || "[]");
      const d = JSON.parse(localStorage.getItem(deletedKey(game)) || "[]");
      setCustom(Array.isArray(c) ? c : []);
      setDeleted(Array.isArray(d) ? d : []);
    } catch {
      setCustom([]);
      setDeleted([]);
    }
  }, [game]);

  const base = BASE_BY_GAME[game] || [];

  const combined: Item[] = useMemo(() => {
    const byId = new Map<string, Item>();
    for (const it of base) if (!deleted.includes(it.id)) byId.set(it.id, it);
    for (const it of custom) byId.set(it.id, it);
    const list = Array.from(byId.values());
    const query = q.trim().toLowerCase();
    return query ? list.filter(i => i.name.toLowerCase().includes(query) || i.id.toLowerCase().includes(query)) : list;
  }, [base, custom, deleted, q]);

  const getPrice = (id: string, baseP: number) => overrides[id] ?? baseP;
  const getStock = (id: string, baseS: number) => stockOverrides[id] ?? baseS;

  const saveOverrides = () => {
    try {
      localStorage.setItem("priceOverrides", JSON.stringify(overrides));
      localStorage.setItem("stockOverrides", JSON.stringify(stockOverrides));
      window.dispatchEvent(new Event("prices:update"));
      window.dispatchEvent(new Event("stock:update"));
      alert("Saved overrides");
    } catch (e) {
      alert("Failed to save");
    }
  };

  const persistCustom = (next: Item[]) => {
    setCustom(next);
    try { localStorage.setItem(customKey(game), JSON.stringify(next)); } catch {}
    try { window.dispatchEvent(new Event("catalog:update")); } catch {}
  };

  const persistDeleted = (next: string[]) => {
    setDeleted(next);
    try { localStorage.setItem(deletedKey(game), JSON.stringify(next)); } catch {}
    try { window.dispatchEvent(new Event("catalog:update")); } catch {}
  };

  const createProduct = () => {
    const name = (draft.name || "").trim();
    const image = (draft.image || "").trim();
    const category = (draft.category || "pet") as Item["category"];
    const stock = Number(draft.stock ?? 0);
    const priceUSD = Number(draft.priceUSD ?? 0);
    if (!name || !image || !isFinite(stock) || !isFinite(priceUSD)) { alert("Please fill name, image, price and stock."); return; }
    let id = (draft.id || slugify(name)) as string;
    const exists = (x: string) => base.some(i => i.id === x) || custom.some(i => i.id === x);
    let n = 1; const baseId = id; while (exists(id)) { id = `${baseId}-${n++}`; }
    const tags = Array.isArray(draft.tags) ? draft.tags : (typeof draft.tags === 'string' ? (draft.tags as unknown as string).split(',').map(s=>s.trim()).filter(Boolean) : []);
    const item: Item = { id, name, image, category, stock: Math.max(0, Math.floor(stock)), priceUSD: Math.max(0, Math.round(priceUSD)), tags };
    persistCustom([...custom, item]);
    setCreateOpen(false);
    setDraft({ category: "pet", stock: 1, priceUSD: 1 });
  };

  const deleteProduct = (id: string) => {
    if (!confirm("Delete this product?")) return;
    if (custom.some(i => i.id === id)) {
      persistCustom(custom.filter(i => i.id !== id));
      return;
    }
    if (!deleted.includes(id)) persistDeleted([...deleted, id]);
  };

  return codeOk ? (
    <div className="min-h-screen text-foreground">
      <div className="container py-8">
        <h1 className="text-xl font-semibold">Admin panel</h1>
        <p className="text-sm text-emerald-200/80">Manage products per game. Create or delete products, and edit price/stock overrides.</p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="w-56">
            <Select value={game} onValueChange={(v)=>setGame(v as GameKey)}>
              <SelectTrigger>
                <SelectValue placeholder="Pick a game" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grow">Grow a Garden</SelectItem>
                <SelectItem value="mm">Murder Mystery 2</SelectItem>
                <SelectItem value="brainrot">Steal a Brainrot</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search by name or id" className="max-w-sm" />
          <Button onClick={()=>setCreateOpen(true)} className="bg-emerald-500 text-slate-900 hover:bg-emerald-400">Create product</Button>
          <Button onClick={saveOverrides} variant="secondary">Save overrides</Button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {combined.map(it => (
            <div key={it.id} className="rounded-xl border border-emerald-700/40 bg-emerald-900/40 p-4">
              <div className="flex items-center gap-3">
                <img src={it.image} alt="" className="h-12 w-12 rounded-md object-cover" />
                <div className="min-w-0">
                  <div className="truncate font-semibold">{it.name}</div>
                  <div className="text-xs text-emerald-200/70">{it.id}</div>
                </div>
                <Button size="sm" variant="destructive" className="ml-auto" onClick={()=>deleteProduct(it.id)}>Delete</Button>
              </div>

              <div className="mt-3 grid grid-cols-[auto_1fr_auto] items-center gap-2">
                <span className="text-xs text-emerald-200/80">Base price:</span>
                <span className="text-sm">${it.priceUSD}</span>
                <span className="text-xs text-emerald-200/60 justify-self-end">USD</span>

                <span className="text-xs text-emerald-200/80">Override price:</span>
                <Input value={String(getPrice(it.id, it.priceUSD))} onChange={(e)=>{
                  const v = Number(e.target.value.replace(/[^0-9.]/g, ""));
                  setOverrides(o => ({...o, [it.id]: isFinite(v) ? v : 0 }));
                }} />
                <span className="text-xs text-emerald-200/60 justify-self-end">USD</span>

                <span className="text-xs text-emerald-200/80">Base stock:</span>
                <span className="text-sm">{it.stock}</span>
                <span />

                <span className="text-xs text-emerald-200/80">Override stock:</span>
                <Input value={String(getStock(it.id, it.stock))} onChange={(e)=>{
                  const v = Number(e.target.value.replace(/[^0-9]/g, ""));
                  setStockOverrides(o => ({...o, [it.id]: isFinite(v) ? v : 0 }));
                }} />
                <span />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create product</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-1">
              <label className="text-xs text-muted-foreground">Name</label>
              <Input value={draft.name || ""} onChange={(e)=>setDraft(d=>({...d, name: e.target.value}))} />
            </div>
            <div className="grid gap-1">
              <label className="text-xs text-muted-foreground">ID (optional)</label>
              <Input value={draft.id || ""} onChange={(e)=>setDraft(d=>({...d, id: e.target.value}))} placeholder="auto from name" />
            </div>
            <div className="grid gap-1">
              <label className="text-xs text-muted-foreground">Image URL</label>
              <Input value={draft.image || ""} onChange={(e)=>setDraft(d=>({...d, image: e.target.value}))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1">
                <label className="text-xs text-muted-foreground">Price (USD)</label>
                <Input inputMode="numeric" value={String(draft.priceUSD ?? "")} onChange={(e)=>setDraft(d=>({...d, priceUSD: Number(e.target.value.replace(/[^0-9.]/g, ""))}))} />
              </div>
              <div className="grid gap-1">
                <label className="text-xs text-muted-foreground">Stock</label>
                <Input inputMode="numeric" value={String(draft.stock ?? "")} onChange={(e)=>setDraft(d=>({...d, stock: Number(e.target.value.replace(/[^0-9]/g, ""))}))} />
              </div>
            </div>
            <div className="grid gap-1">
              <label className="text-xs text-muted-foreground">Category</label>
              <Select value={draft.category || "pet"} onValueChange={(v)=>setDraft(d=>({...d, category: v as Item["category"]}))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pet">Pet</SelectItem>
                  <SelectItem value="plant">Plant</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1">
              <label className="text-xs text-muted-foreground">Tags (comma separated)</label>
              <Input value={(Array.isArray(draft.tags) ? (draft.tags as string[]).join(", ") : (draft.tags as any) || "")} onChange={(e)=>setDraft(d=>({...d, tags: e.target.value}))} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={()=>setCreateOpen(false)}>Cancel</Button>
              <Button onClick={createProduct}>Create</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
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
  );
}
