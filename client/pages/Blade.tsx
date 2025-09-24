import { Button } from "@/components/ui/button";
import { useState } from "react";

const img = "https://cdn.builder.io/api/v1/image/assets%2F1f105010e6eb4580a2d84c1550b6ea46%2F3d99c1ce23274e8dbc8f978d2ef7cc50?format=webp&width=1200";

export default function Blade() {
  const [qty, setQty] = useState(2000);
  const [qtyInput, setQtyInput] = useState(String(2000));
  const priceUSD = 16.11;
  const priceFmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

  const clampToStep = (v: number) => Math.min(300000, Math.max(2000, Math.round(v / 100) * 100));
  const parseInput = (s: string) => {
    if (!s) return 0;
    const n = Number(s.replace(/[^0-9]/g, "")) || 0;
    return n;
  };

  const parsed = parseInput(qtyInput);
  const snapped = parsed ? Math.round(parsed / 100) * 100 : 0;
  const displayQty = parsed ? Math.min(300000, Math.max(0, snapped)) : qty;
  const isTooLow = parsed > 0 && parsed < 2000;

  const commitInput = () => {
    const v = parsed ? clampToStep(parsed) : 2000;
    setQty(v);
    setQtyInput(String(v));
  };

  const onAddToCart = () => {
    const final = parsed ? clampToStep(parsed) : qty;
    if (final < 2000) {
      // show validation by keeping input and not navigating
      setQtyInput(String(parsed || ""));
      return;
    }
    const lines = [{ id: 'blade-tokens', name: 'Blade Ball Tokens', qty: final, priceLocal: Math.round((final / 1000) * 5), thumb: img }];
    const payload = { currency: 'USD', lines };
    try { localStorage.setItem('checkout:payload', JSON.stringify(payload)); } catch {}
    window.location.assign('/checkout');
  };

  return (
    <div className="container py-12 md:py-20">
      <div className="grid gap-8 md:grid-cols-2 items-start">
        <div className="w-full">
          <div className="rounded-2xl overflow-visible border-0 bg-transparent p-0">
            <article className="relative h-full w-full max-w-[560px] md:max-w-[700px] mx-auto overflow-visible rounded-none border-0 bg-transparent">
              <div className="relative z-10 mx-auto w-full overflow-hidden aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9]">
                <img src="https://cdn.builder.io/api/v1/image/assets%2F1f105010e6eb4580a2d84c1550b6ea46%2F5b8f6b28f64d4567ae80ecadc8585411?format=webp&width=800" alt="Blade Ball" className="hidden" />
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <img src="https://cdn.builder.io/api/v1/image/assets%2F1f105010e6eb4580a2d84c1550b6ea46%2F5b8f6b28f64d4567ae80ecadc8585411?format=webp&width=800" alt="Blade Ball" draggable={false} className="max-w-full max-h-full object-contain rounded-md shadow-lg" />
                </div>
              </div>
            </article>
          </div>
        </div>

        <div className="w-full">
          <div className="sticky top-24">
            <h1 className="text-3xl md:text-4xl font-extrabold">Blade Ball Tokens</h1>

            <div className="mt-6">
              <div className="text-sm text-muted-foreground">5$ per 1000</div>
              <div className="mt-3 text-2xl font-semibold text-emerald-400">{priceFmt.format((qty / 1000) * 5)}</div>
            </div>

            <div className="mt-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <label htmlFor="qty" className="text-sm text-muted-foreground">Quantity</label>
                <input
                  id="qty"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  min={2000}
                  max={300000}
                  step={100}
                  value={qtyInput}
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (/^[0-9]*$/.test(raw)) setQtyInput(raw);
                  }}
                  onBlur={() => commitInput()}
                  onKeyDown={(e) => { if (e.key === 'Enter') commitInput(); }}
                  className="ml-2 w-36 md:w-44 text-left rounded-md border border-emerald-600 bg-white/5 px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <div className="text-sm text-muted-foreground">min 2000 • max 300000</div>
              </div>

              <div className="flex items-center gap-3">
                <Button onClick={onAddToCart} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3">Add to cart</Button>
                <div className="text-sm text-muted-foreground">Total: <span className="font-semibold">{priceFmt.format(((parsed ? displayQty : qty) / 1000) * 5)}</span></div>
              </div>
              {isTooLow && (<div className="text-sm text-red-400 mt-2">Minimum quantity is 2000</div>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
