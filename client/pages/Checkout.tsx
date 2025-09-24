import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export type CheckoutLine = {
  id: string;
  name: string;
  qty: number;
  priceLocal: number; // total for the line
  thumb?: string;
};

type Payload = {
  currency: string;
  lines: CheckoutLine[];
};

export default function Checkout() {
  const [payload, setPayload] = useState<Payload>({ currency: "USD", lines: [] });
  const [method, setMethod] = useState<"card" | "checking">("card");
  const [paying, setPaying] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [robloxUser, setRobloxUser] = useState("");
  const [email, setEmail] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);

  // Card fields
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  // Checking fields
  const [acctName, setAcctName] = useState("");
  const [routing, setRouting] = useState("");
  const [account, setAccount] = useState("");

  const [payError, setPayError] = useState<string | null>(null);
  const [payStatus, setPayStatus] = useState<"processing" | "succeeded">("processing");
  const [typing, setTyping] = useState("Checking out");

  // Particle burst animation when clicking pay
  const cardRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const burst = (x: number, y: number) => {
    const canvas = canvasRef.current; const card = cardRef.current; if (!canvas || !card) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = card.getBoundingClientRect();
    const w = Math.floor(rect.width); const h = Math.floor(rect.height);
    canvas.width = Math.max(1, Math.floor(w * dpr));
    canvas.height = Math.max(1, Math.floor(h * dpr));
    canvas.style.width = w + "px"; canvas.style.height = h + "px";
    const ctx = canvas.getContext("2d"); if (!ctx) return; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = 60; const parts: {x:number;y:number;vx:number;vy:number;r:number;a:number}[] = [];
    for (let i = 0; i < count; i++) {
      const ang = Math.random() * Math.PI * 2; const sp = 120 + Math.random() * 200;
      parts.push({ x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, r: 2 + Math.random() * 3, a: 1 });
    }
    let last = performance.now(); const dur = 800; const g = 360; let t0 = last;
    const tick = (now: number) => {
      const dt = Math.min(32, now - last) / 1000; last = now; const elapsed = now - t0;
      ctx.clearRect(0,0,w,h);
      for (const p of parts) {
        p.vy += g * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.a *= 0.975;
        ctx.globalAlpha = Math.max(0, p.a);
        ctx.beginPath(); ctx.fillStyle = "#ef4444"; ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      if (elapsed < dur && parts.some(p => p.a > 0.05)) requestAnimationFrame(tick); else ctx.clearRect(0,0,w,h);
    };
    requestAnimationFrame(tick);
  };

  // animate typing while paying
  useEffect(() => {
    if (!paying) return;
    let i = 0; const frames = ["Checking out", "Checking out.", "Checking out..", "Checking out...", "Checking out...."];
    const id = setInterval(() => { i = (i + 1) % frames.length; setTyping(frames[i]); }, 250);
    return () => clearInterval(id);
  }, [paying]);

  // Load payload from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("checkout:payload");
      if (raw) {
        const data = JSON.parse(raw) as Payload;
        if (Array.isArray(data?.lines)) setPayload({ currency: data.currency || "USD", lines: data.lines });
      }
    } catch {}
  }, []);

  const totalLocal = useMemo(() => payload.lines.reduce((s, l) => s + (Number(l.priceLocal) || 0), 0), [payload.lines]);

  const digits = (s: string) => s.replace(/\D+/g, "");
  const detectCardType = (nRaw: string): "visa" | "mastercard" | "amex" | "discover" | "unknown" => {
    const n = digits(nRaw);
    if (/^4/.test(n)) return "visa";
    if (/^(5[1-5]|2(2[2-9]|[3-6][0-9]|7[01]))/.test(n)) return "mastercard";
    if (/^(34|37)/.test(n)) return "amex";
    if (/^(6011|65|64[4-9])/.test(n)) return "discover";
    return "unknown";
  };
  const luhn = (numRaw: string) => {
    const num = digits(numRaw);
    let sum = 0, dbl = false;
    for (let i = num.length - 1; i >= 0; i--) { let d = Number(num[i]); if (dbl) { d *= 2; if (d > 9) d -= 9; } sum += d; dbl = !dbl; }
    return num.length >= 12 && num.length <= 19 && sum % 10 === 0;
  };
  const validExpiry = (exp: string) => {
    const m = exp.match(/^\s*(\d{1,2})\s*\/?\s*(\d{2})\s*$/); if (!m) return false;
    let mm = Number(m[1]); const yy = Number(m[2]); if (mm < 1 || mm > 12) return false;
    const now = new Date(); const curYY = now.getFullYear() % 100; const curMM = now.getMonth() + 1;
    if (yy < curYY) return false; if (yy === curYY && mm < curMM) return false; return true;
  };
  const validCvc = (cvcRaw: string, type: string) => { const c = digits(cvcRaw); return type === "amex" ? c.length === 4 : c.length === 3; };
  const validRouting = (rRaw: string) => { const r = digits(rRaw); if (r.length !== 9) return false; const d = r.split("").map(Number); const sum = 3*(d[0]+d[3]+d[6]) + 7*(d[1]+d[4]+d[7]) + (d[2]+d[5]+d[8]); return sum % 10 === 0; };
  const validAccount = (aRaw: string) => { const a = digits(aRaw); return a.length >= 4 && a.length <= 17; };

  const validate = (): string | null => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Enter a valid email.";
    if (method === "card") {
      const type = detectCardType(cardNumber);
      if (!cardName.trim()) return "Enter cardholder name.";
      if (!luhn(cardNumber)) return "Enter a valid card number.";
      if (!validExpiry(cardExp)) return "Enter a valid expiry (MM/YY).";
      if (!validCvc(cardCvc, type)) return type === "amex" ? "CVC must be 4 digits." : "CVC must be 3 digits.";
      return null;
    }
    if (!acctName.trim()) return "Enter account holder name.";
    if (!validRouting(routing)) return "Enter a valid 9‑digit routing number.";
    if (!validAccount(account)) return "Enter a valid account number.";
    return null;
  };

  const updateLines = (fn: (lines: CheckoutLine[]) => CheckoutLine[]) => {
    setPayload((p) => {
      const lines = fn(p.lines);
      const next = { ...p, lines };
      try { localStorage.setItem("checkout:payload", JSON.stringify(next)); } catch {}
      return next;
    });
  };

  return (
    <main className="container py-6 md:py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <a href="/grow" className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-white shadow hover:bg-emerald-700">Continue shopping</a>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_480px]">
        {/* Payment column */}
        <div className="space-y-4">
          <div ref={cardRef} className="relative overflow-hidden rounded-xl border border-emerald-900/80 bg-[rgba(0,14,9,0.82)] p-4">
            <p className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-400"><path d="M12 2l7 4v5c0 5-3.5 9-7 11-3.5-2-7-6-7-11V6l7-4z"/></svg>
              Protected by Stripe
            </p>
            <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-[60]" />

            <div className="mb-3">
              <Input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" />
            </div>

            <div className="mb-3 inline-flex rounded-md ring-1 ring-emerald-800/50 overflow-hidden">
              <button onClick={() => setMethod("card")} className={`px-3 py-1.5 text-sm ${method === "card" ? "bg-emerald-700 text-white" : "bg-[#07120d] text-emerald-200"}`}>Card</button>
              <button onClick={() => setMethod("checking")} className={`px-3 py-1.5 text-sm ${method === "checking" ? "bg-emerald-700 text-white" : "bg-[#07120d] text-emerald-200"}`}>Checking</button>
            </div>

            {method === "card" ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Input value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="Cardholder name" />
                </div>
                <div className="col-span-2 relative">
                  <Input value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="Card number" inputMode="numeric" className="pr-20" />

                  {/* Card brand icons overlaid on the input */}
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {(() => {
                      const type = detectCardType(cardNumber);
                      const common = "w-9 h-6 object-contain transition-opacity";
                      return (
                        <>
                          <img src="https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/assets/visa.sxIq5Dot.svg" alt="VISA" className={`${common} ${type === 'visa' ? 'opacity-100' : 'opacity-30'}`} />
                          <img src="https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/assets/mastercard.1c4_lyMp.svg" alt="MASTERCARD" className={`${common} ${type === 'mastercard' ? 'opacity-100' : 'opacity-30'}`} />
                          <img src="https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/assets/amex.Csr7hRoy.svg" alt="AMEX" className={`${common} ${type === 'amex' ? 'opacity-100' : 'opacity-30'}`} />
                          <img src="https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1/assets/discover.C7UbFpNb.svg" alt="DISCOVER" className={`${common} ${type === 'discover' ? 'opacity-100' : 'opacity-30'}`} />
                        </>
                      );
                    })()}
                  </div>
                </div>
                <Input value={cardExp} onChange={(e) => setCardExp(e.target.value)} placeholder="MM/YY" inputMode="numeric" />
                <Input value={cardCvc} onChange={(e) => setCardCvc(e.target.value)} placeholder="CVC" inputMode="numeric" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Input value={acctName} onChange={(e) => setAcctName(e.target.value)} placeholder="Account holder name" />
                </div>
                <Input value={routing} onChange={(e) => setRouting(e.target.value)} placeholder="Routing number" inputMode="numeric" />
                <Input value={account} onChange={(e) => setAccount(e.target.value)} placeholder="Account number" inputMode="numeric" />
              </div>
            )}

            {payError && <p className="mt-2 text-xs text-destructive">{payError}</p>}
            <div className="mt-3">
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 border border-emerald-600"
                disabled={paying || payload.lines.length === 0}
                onClick={async (e) => {
                  const err = validate();
                  if (err) { setPayError(err); return; }
                  setPayError(null);
                  try {
                    // Particle burst at button center
                    try {
                      const btn = e.currentTarget as HTMLElement;
                      const b = btn.getBoundingClientRect();
                      const card = cardRef.current?.getBoundingClientRect();
                      if (card) burst((b.left + b.width / 2) - card.left, (b.top + b.height / 2) - card.top);
                    } catch {}
                    // show typing
                    setPaying(true);
                    setPaying(true);
                    const res = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, lines: payload.lines.map(l => ({ name: l.name, qty: l.qty, priceLocal: l.priceLocal })), currency: payload.currency }) });
                    const data = await res.json();
                    if (res.ok && data?.url) { await new Promise(r=>setTimeout(r, 1200)); window.location.assign(data.url); return; }
                    setPayError(data?.error || "Failed to start Stripe Checkout.");
                  } catch (e: any) {
                    setPayError(e?.message || "Failed to start Stripe Checkout.");
                  } finally {
                    setPaying(false);
                  }
                }}
              >
                {paying ? typing : `${method === "checking" ? "Pay from checking" : "Pay with card"} (${new Intl.NumberFormat(undefined, { style: "currency", currency: payload.currency }).format(totalLocal)})`}
              </Button>
            </div>

            {paying && (
              <div className="pointer-events-none absolute inset-0 z-40 grid place-content-center bg-background/60 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-3 animate-in fade-in-0">
                  {payStatus === "processing" ? (
                    <>
                      <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-700/60 border-t-transparent" />
                      <div className="text-sm text-muted-foreground">Processing payment…</div>
                    </>
                  ) : (
                    <>
                      <div className="grid h-10 w-10 place-content-center rounded-full bg-emerald-700 text-foreground">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      <div className="text-sm">Payment succeeded</div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Summary column */}
        <aside className="space-y-3 rounded-xl border border-emerald-900/80 bg-[rgba(0,14,9,0.75)] p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Order Summary</h3>
          </div>
          <ul className="space-y-2 max-h-64 overflow-auto pr-1 scrollbar-blue">
            {payload.lines.map((l) => (
              <li key={l.id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {l.thumb ? (
                    <img src={l.thumb} alt="" className="h-10 w-10 shrink-0 rounded-md object-cover" />
                  ) : null}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{l.name} × {l.qty}</p>
                    <p className="text-xs text-muted-foreground">{new Intl.NumberFormat(undefined, { style: "currency", currency: payload.currency }).format(l.priceLocal)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button size="sm" variant="ghost" onClick={() => updateLines((lines) => {
                    const idx = lines.findIndex(x => x.id === l.id);
                    if (idx === -1) return lines;
                    const next = lines.slice();
                    const cur = next[idx];
                    // Special behavior for Blade Ball Tokens: decrement by 100, min 2000
                    if (cur.id === 'blade-tokens') {
                      const newQty = Math.max(2000, cur.qty - 100);
                      // If quantity would drop below 2000, keep at 2000
                      next[idx] = { ...cur, qty: newQty, priceLocal: Math.round((newQty / 1000) * 5) };
                      return next;
                    }
                    // Fallback behaviour for other items: decrement by 1, remove if <= 1
                    if (cur.qty <= 1) { next.splice(idx, 1); return next; }
                    const unit = Math.max(1, Math.round(cur.priceLocal / cur.qty));
                    next[idx] = { ...cur, qty: cur.qty - 1, priceLocal: Math.max(0, cur.priceLocal - unit) };
                    return next;
                  })}>−</Button>
                  <Button size="sm" variant="ghost" onClick={() => updateLines((lines) => {
                    const idx = lines.findIndex(x => x.id === l.id);
                    if (idx === -1) return lines;
                    const next = lines.slice();
                    const cur = next[idx];
                    // Special behavior for Blade Ball Tokens: increment by 100, max 300000
                    if (cur.id === 'blade-tokens') {
                      const newQty = Math.min(300000, cur.qty + 100);
                      next[idx] = { ...cur, qty: newQty, priceLocal: Math.round((newQty / 1000) * 5) };
                      return next;
                    }
                    // Fallback behaviour for other items: increment by 1
                    const unit = Math.max(1, Math.round(cur.priceLocal / cur.qty));
                    next[idx] = { ...cur, qty: cur.qty + 1, priceLocal: cur.priceLocal + unit };
                    return next;
                  })}>+</Button>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between border-t border-white/10 pt-3">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="text-sm font-semibold">{new Intl.NumberFormat(undefined, { style: "currency", currency: payload.currency }).format(totalLocal)}</span>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-emerald-100">
            <div className="rounded-md p-3 bg-[rgba(255,255,255,0.02)] border border-emerald-900/30">
              <div className="h-28 flex items-center justify-center">
                <img src="https://cdn.builder.io/api/v1/image/assets%2Fd298c54982d64a0783c9a8a3d1e480c1%2Fb9379ca3e3334a6aa1ab84e500788e98?format=webp&width=400" alt="support" className="h-24 sm:h-28" />
              </div>
              <h4 className="mt-3 font-semibold">Support</h4>
              <p className="mt-1 text-xs text-emerald-200/70">We have a team of human customer support agents available 24/7 to assist you.</p>
              <div className="mt-2 flex justify-center">
                <img src="https://cdn.builder.io/api/v1/image/assets%2Fb2458d5aab5847128a2b754080dc1712%2F59703aedd2134312974c10a72e7d28f4?format=webp&width=220" alt="brand" className="h-4 opacity-90 object-contain" />
              </div>
            </div>

            <div className="rounded-md p-3 bg-[rgba(255,255,255,0.02)] border border-emerald-900/30">
              <div className="h-28 flex items-center justify-center">
                <img src="https://cdn.builder.io/api/v1/image/assets%2Fd298c54982d64a0783c9a8a3d1e480c1%2Fd01de641dfbe43719a6f93c8ba65e095?format=webp&width=400" alt="guarantee" className="h-24 sm:h-28" />
              </div>
              <h4 className="mt-3 font-semibold">Guarantee</h4>
              <p className="mt-1 text-xs text-emerald-200/70">We guarantee delivery. If your order is not delivered, you'll receive a refund automatically.</p>
              <div className="mt-2 flex justify-center">
                <img src="https://cdn.builder.io/api/v1/image/assets%2Fb2458d5aab5847128a2b754080dc1712%2F59703aedd2134312974c10a72e7d28f4?format=webp&width=220" alt="brand" className="h-4 opacity-90 object-contain" />
              </div>
            </div>

            <div className="rounded-md p-3 bg-[rgba(255,255,255,0.02)] border border-emerald-900/30">
              <div className="h-28 flex items-center justify-center">
                <img src="https://cdn.builder.io/api/v1/image/assets%2Fd298c54982d64a0783c9a8a3d1e480c1%2F39f3a2e18c7940f9b770d9ecfaeace72?format=webp&width=400" alt="delivery" className="h-24 sm:h-28" />
              </div>
              <h4 className="mt-3 font-semibold">Delivery</h4>
              <p className="mt-1 text-xs text-emerald-200/70">We have instant delivery bots available 24/7 to deliver your items instantly.</p>
              <div className="mt-2 flex justify-center">
                <img src="https://cdn.builder.io/api/v1/image/assets%2Fb2458d5aab5847128a2b754080dc1712%2F59703aedd2134312974c10a72e7d28f4?format=webp&width=220" alt="brand" className="h-4 opacity-90 object-contain" />
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Delivery chat modal retained */}
      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="max-w-md overflow-hidden border border-white/15 bg-white/5 bg-none backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle>Delivery Chat</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg border border-white/12 bg-white/5 p-3">
              <div className="text-sm text-muted-foreground">Order ID</div>
              <div className="mt-1 flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm">
                <span className="truncate font-mono">{orderId}</span>
                <Button size="sm" onClick={() => orderId && navigator.clipboard.writeText(orderId!)}>
                  Copy
                </Button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Keep this ID handy for support.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm">Your Roblox username</label>
              <Input
                value={robloxUser}
                onChange={(e) => setRobloxUser(e.target.value)}
                placeholder="Enter Roblox username"
              />
              <p className="text-xs text-muted-foreground">A staff member will message you on Roblox shortly to deliver your items.</p>
            </div>

            <div className="space-y-2 rounded-lg border border-white/12 bg-white/5 p-3">
              <div className="text-xs text-muted-foreground">Status</div>
              <div className="mt-1 flex items-center gap-2">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-primary" />
                <span className="text-sm">Waiting for staff…</span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setChatOpen(false)}>
                Close
              </Button>
              <Button
                disabled={!robloxUser.trim()}
                onClick={() => {
                  const u = robloxUser.trim();
                  const id = orderId || "";
                  setChatOpen(false);
                  const url = `/chat?orderId=${encodeURIComponent(id)}&user=${encodeURIComponent(u)}`;
                  window.open(url, "_blank");
                }}
              >
                Start Chat
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
