import { useEffect, useMemo, useState } from "react";

export interface GeoInfo {
  country?: string;
  currency?: string;
  language?: string;
}

export function useGeo(): GeoInfo {
  const [info, setInfo] = useState<GeoInfo>({});

  useEffect(() => {
    let mounted = true;

    // Respect user override and avoid network if set
    try {
      const override = localStorage.getItem("currencyOverride");
      if (override) {
        setInfo((prev) => ({ ...prev, currency: override || undefined }));
        mounted = false; // skip remote geo if overridden
      }
    } catch {}

    // create controller/timeout here so cleanup can access them
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    // If running in a dev/preview host or locally, skip remote geo lookups to avoid CORS or blocked requests
    const host = typeof window !== 'undefined' ? window.location.hostname : '';
    const isPreviewHost = Boolean(
      import.meta.env && (import.meta.env.DEV || import.meta.env.VITE_PREVIEW) ||
      host === 'localhost' || host.startsWith('127.') || host.includes('fly.dev') || host.includes('preview') || host.endsWith('.ngrok.io')
    );

    const safeFetchJson = async (url: string, opts: RequestInit = {}) => {
      if (isPreviewHost) return null; // skip external fetches in preview/dev
      try {
        if (!('fetch' in window)) return null;
        const res = await fetch(url, opts);
        if (!res) return null;
        if (!res.ok) return null;
        try {
          return await res.json();
        } catch {
          return null;
        }
      } catch {
        return null;
      }
    };

    const fetchGeo = async () => {
      if (!mounted) return;
      try {
        let country: string | undefined;
        let currency: string | undefined;

        // If preview/dev host, skip any network geo lookups entirely
        if (isPreviewHost) {
          // we still want to set a reasonable default language/currency if possible
          // leave info as-is (which may include overrides) and return early
          return;
        }

        // Primary provider
        const data = await safeFetchJson("https://ipapi.co/json/", { signal: controller.signal, headers: { Accept: "application/json" } } as RequestInit);
        if (data) {
          country = data?.country || data?.country_code || undefined;
          currency = data?.currency || undefined;
        }

        // Fallback provider (country only)
        if (!country) {
          const data2 = await safeFetchJson("https://ipwho.is/?fields=country,currency", { signal: controller.signal } as RequestInit);
          if (data2) {
            country = data2?.country || undefined;
            currency = data2?.currency?.code || currency || undefined;
          }
        }

        if (!mounted) return;
        if (country || currency) setInfo((prev) => ({ ...prev, country, currency }));
      } finally {
        try { clearTimeout(timeout); } catch {}
      }
    };

    // only trigger fetch if not overridden and not preview
    if (mounted && !isPreviewHost) fetchGeo();

    return () => {
      mounted = false;
      try {
        clearTimeout(timeout);
      } catch {}
      try {
        controller.abort();
      } catch {}
    };
  }, []);

  const languageName = useMemo(() => {
    try {
      const langCode = navigator?.language || "en";
      // Use Intl to render a human-readable language name
      // Some environments may not support Intl.DisplayNames
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const DN: any = (Intl as any).DisplayNames;
      if (DN) {
        const dn = new DN([langCode], { type: "language" });
        return dn.of(langCode) || "English";
      }
      return langCode.startsWith("en") ? "English" : langCode;
    } catch {
      return "English";
    }
  }, []);

  return { ...info, language: languageName };
}
