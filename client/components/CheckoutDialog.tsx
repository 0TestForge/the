import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export interface CheckoutLine {
  id: string;
  name: string;
  qty: number;
  priceLocal: number;
  thumb?: string;
}

export function CheckoutDialog({
  open,
  onOpenChange,
  currency,
  lines,
  totalLocal,
  onRemoveOne,
  onRemoveAll,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  currency: string;
  lines: CheckoutLine[];
  totalLocal: number;
  onRemoveOne: (id: string) => void;
  onRemoveAll: (id: string) => void;
}) {
  const [method, setMethod] = useState<"card" | "checking">("card");
  const [paying, setPaying] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [robloxUser, setRobloxUser] = useState("");
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
    let sum = 0;
    let dbl = false;
    for (let i = num.length - 1; i >= 0; i--) {
      let d = Number(num[i]);
      if (dbl) { d *= 2; if (d > 9) d -= 9; }
      sum += d;
      dbl = !dbl;
    }
    return num.length >= 12 && num.length <= 19 && sum % 10 === 0;
  };

  const validExpiry = (exp: string) => {
    const m = exp.match(/^\s*(\d{1,2})\s*\/?\s*(\d{2})\s*$/);
    if (!m) return false;
    let mm = Number(m[1]);
    const yy = Number(m[2]);
    if (mm < 1 || mm > 12) return false;
    const now = new Date();
    const curYY = now.getFullYear() % 100;
    const curMM = now.getMonth() + 1;
    if (yy < curYY) return false;
    if (yy === curYY && mm < curMM) return false;
    return true;
  };

  const validCvc = (cvcRaw: string, type: string) => {
    const c = digits(cvcRaw);
    if (type === "amex") return c.length === 4;
    return c.length === 3;
  };

  const validRouting = (rRaw: string) => {
    const r = digits(rRaw);
    if (r.length !== 9) return false;
    const d = r.split("").map(Number);
    const sum = 3*(d[0]+d[3]+d[6]) + 7*(d[1]+d[4]+d[7]) + (d[2]+d[5]+d[8]);
    return sum % 10 === 0;
  };

  const validAccount = (aRaw: string) => {
    const a = digits(aRaw);
    return a.length >= 4 && a.length <= 17;
  };

  const validate = (): string | null => {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[98vw] max-w-[1400px] h-[94vh] max-h-[94vh] overflow-hidden border border-emerald-900/80 bg-gradient-to-br from-[#00120a] to-[#01240f] backdrop-blur-xl text-foreground rounded-2xl">
        <img src="https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2Fc630797a0b754af594c3525e8c687bba?format=webp&width=800" alt="banner" className="absolute top-0 left-0 w-full h-16 object-cover rounded-t-2xl" />
        <div className="flex h-full flex-col pt-16">
          <DialogHeader className="sticky top-0 z-10 bg-transparent">
            <DialogTitle className="sr-only">Checkout</DialogTitle>
          </DialogHeader>

          <div className="grid flex-1 gap-6 overflow-auto p-5 md:p-6 md:grid-cols-[1fr_480px]">
            {/* Payment column */}
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-xl border border-emerald-900/80 bg-[rgba(0,14,9,0.82)] p-4">
                <p className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-400"><path d="M12 2l7 4v5c0 5-3.5 9-7 11-3.5-2-7-6-7-11V6l7-4z"/></svg>
                  Protected by Stripe
                </p>

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
                      <Input value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="Card number" inputMode="numeric" className="pr-16" />
                      {(() => {
                        const type = detectCardType(cardNumber);
                        const iconClass = "pointer-events-none absolute inset-y-0 right-2 grid place-content-center text-[10px] font-semibold text-foreground/70 rounded px-1.5";
                        if (type === "visa") return (<span className={iconClass} aria-hidden><svg width="36" height="14" viewBox="0 0 36 14" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="36" height="14" rx="2" fill="#1A5F9E" /><text x="6" y="10" fill="#fff" fontSize="8" fontWeight="700" fontFamily="Arial">VISA</text></svg></span>);
                        if (type === "mastercard") return (<span className={iconClass} aria-hidden><svg width="36" height="14" viewBox="0 0 36 14" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="36" height="14" rx="2" fill="#000" /><circle cx="14" cy="7" r="5" fill="#EB001B" /><circle cx="20" cy="7" r="5" fill="#F79E1B" /></svg></span>);
                        if (type === "amex") return (<span className={iconClass} aria-hidden><svg width="36" height="14" viewBox="0 0 36 14" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="36" height="14" rx="2" fill="#2E77BC" /><text x="4" y="10" fill="#fff" fontSize="6" fontWeight="700" fontFamily="Arial">AMEX</text></svg></span>);
                        if (type === "discover") return (<span className={iconClass} aria-hidden><svg width="36" height="14" viewBox="0 0 36 14" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="36" height="14" rx="2" fill="#F36E21" /><text x="6" y="10" fill="#fff" fontSize="6" fontWeight="700" fontFamily="Arial">DISC</text></svg></span>);
                        return (<span className={iconClass} aria-hidden><svg width="36" height="14" viewBox="0 0 36 14" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0.5" y="0.5" width="35" height="13" rx="2" fill="#FFFFFF" stroke="#E5E7EB" /><rect x="4" y="4" width="6" height="4" rx="0.5" fill="#F3F4F6" /></svg></span>);
                      })()}
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
                    disabled={paying}
                    onClick={async () => {
                      const err = validate();
                      if (err) { setPayError(err); return; }
                      setPayError(null);
                      try {
                        setPaying(true);
                        const res = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lines: (Array.isArray(lines)? lines:[]).map(l=>({ name: l.name, qty: l.qty, priceLocal: l.priceLocal })), currency }) });
                        const data = await res.json();
                        if (res.ok && data?.url) { window.location.assign(data.url); return; }
                        setPayError(data?.error || "Failed to start Stripe Checkout.");
                      } catch (e: any) {
                        setPayError(e?.message || "Failed to start Stripe Checkout.");
                      } finally {
                        setPaying(false);
                      }
                    }}
                  >
                    {paying ? "Redirecting…" : `${method === "checking" ? "Pay from checking" : "Pay with card"} (${new Intl.NumberFormat(undefined, { style: "currency", currency }).format(totalLocal)})`}
                  </Button>
                </div>

                {paying && (
                  <div className="pointer-events-none absolute inset-0 grid place-content-center bg-background/60 backdrop-blur-sm">
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
                {lines.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={() => lines.forEach((l) => onRemoveAll(l.id))}>Clear all</Button>
                )}
              </div>
              <ul className="space-y-2 max-h-64 overflow-auto pr-1 scrollbar-blue">
                {lines.map((l) => (
                  <li key={l.id} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {l.thumb ? (
                        <img src={l.thumb} alt="" className="h-10 w-10 shrink-0 rounded-md object-cover" />
                      ) : null}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{l.name} × {l.qty}</p>
                        <p className="text-xs text-muted-foreground">{new Intl.NumberFormat(undefined, { style: "currency", currency }).format(l.priceLocal)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" onClick={() => onRemoveOne(l.id)}>−</Button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between border-t border-white/10 pt-3">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="text-sm font-semibold">{new Intl.NumberFormat(undefined, { style: "currency", currency }).format(totalLocal)}</span>
              </div>

              {/* Feature highlights similar to the provided image */}
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

              <div className="hidden" />
            </aside>
          </div>
        </div>
      </DialogContent>

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
                <Button size="sm" onClick={() => orderId && navigator.clipboard.writeText(orderId)}>
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
    </Dialog>
  );
}
