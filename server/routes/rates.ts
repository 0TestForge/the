import type { RequestHandler } from "express";

async function fetchWithTimeout(url: string, ms = 2000): Promise<Response> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), ms);
  try {
    // @ts-ignore - Node 18+ global fetch
    const res: Response = await fetch(url, { signal: controller.signal, headers: { Accept: "application/json" } });
    return res;
  } finally {
    clearTimeout(t);
  }
}

export const handleRates: RequestHandler = async (req, res) => {
  const base = (req.query.base as string) || "USD";
  const symbols = (req.query.symbols as string) || "USD";
  try {
    // Primary provider
    let rate: number | undefined;
    const url1 = `https://api.exchangerate.host/latest?base=${encodeURIComponent(base)}&symbols=${encodeURIComponent(symbols)}`;
    try {
      const r1 = await fetchWithTimeout(url1, 2500);
      if (r1.ok) {
        const d1 = await r1.json();
        const key = symbols;
        rate = Number(d1?.rates?.[key]);
      }
    } catch {}

    // Fallback provider
    if (!rate || !isFinite(rate)) {
      const url2 = `https://open.er-api.com/v6/latest/${encodeURIComponent(base)}`;
      try {
        const r2 = await fetchWithTimeout(url2, 2500);
        if (r2.ok) {
          const d2 = await r2.json();
          const key = symbols;
          rate = Number(d2?.rates?.[key]);
        }
      } catch {}
    }

    if (!rate || !isFinite(rate)) {
      return res.status(200).json({ base, symbols, rate: 1 });
    }

    res.json({ base, symbols, rate });
  } catch (err) {
    res.status(200).json({ base, symbols, rate: 1 });
  }
};
