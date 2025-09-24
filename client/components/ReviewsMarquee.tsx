import React from "react";
import { useRef, useEffect, useMemo } from "react";

const BASE = [
  { text: "Service was fast", user: "@alex", note: "Verified purchase", rating: 5 },
  { text: "So cheap bro", user: "@ale", note: "Great value", rating: 5 },
  { text: "Trusted", user: "@david", note: "3rd order", rating: 5 },
  { text: "Instant delivery", user: "@lee", note: "Arrived in seconds", rating: 5 },
  { text: "Top quality", user: "@demna", note: "Exactly as described", rating: 4 },
  { text: "Great support", user: "@omar", note: "Helpful team", rating: 5 },
  { text: "10/10 would recommend", user: "@ivy", note: "Smooth checkout", rating: 5 },
  { text: "Will buy again", user: "@rob", note: "Returning customer", rating: 5 },
  { text: "Secure checkout", user: "@zoe", note: "Protected payment", rating: 5 },
  { text: "Best prices", user: "@ken", note: "Saved money", rating: 4 },
  { text: "Lightning quick", user: "@mei", note: "Super fast", rating: 5 },
  { text: "Excellent experience", user: "@liam", note: "Flawless", rating: 5 },
];

// Custom review profile images provided by the user
const ATTACHMENTS = [
  "https://cdn.builder.io/api/v1/image/assets%2F1f105010e6eb4580a2d84c1550b6ea46%2Fdab9f297854a4c35b3ffe8055634ed4d?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F1f105010e6eb4580a2d84c1550b6ea46%2Fd93f663b91cf45c793e7a428dd62502b?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F1f105010e6eb4580a2d84c1550b6ea46%2F64af4197b7b3413cad9229860c4ce23e?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F1f105010e6eb4580a2d84c1550b6ea46%2F73ff0253db334ac2ac12beed500546a5?format=webp&width=800",
  "https://cdn.builder.io/api/v1/image/assets%2F1f105010e6eb4580a2d84c1550b6ea46%2Fc3911b0b2cfd4c60927c16fcca6995d9?format=webp&width=800",
];

function pickAvatarForInitial(initial: string) {
  if (!initial) return ATTACHMENTS[0];
  const key = initial.toUpperCase();
  // Specific mapping: H -> first, L -> second, A -> third, D -> fourth, W -> fifth
  const specific: Record<string, string> = {
    H: ATTACHMENTS[0],
    L: ATTACHMENTS[1],
    A: ATTACHMENTS[2],
    D: ATTACHMENTS[3],
    W: ATTACHMENTS[4],
  };
  if (specific[key]) return specific[key];
  // Fallback deterministic selection based on letter
  const code = key.charCodeAt(0) - 65;
  const idx = ((code % ATTACHMENTS.length) + ATTACHMENTS.length) % ATTACHMENTS.length;
  return ATTACHMENTS[idx];
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5 text-emerald-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          className={i < rating ? "fill-current" : "fill-transparent"}
          stroke="currentColor"
          strokeWidth="1.2"
        >
          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" />
        </svg>
      ))}
    </div>
  );
}

export function ReviewsMarquee({ count = 982 }: { count?: number }) {
  // duplicate items so CSS animation can loop seamlessly
  const items = [...BASE, ...BASE];
  const trackRef = useRef<HTMLDivElement | null>(null);

  // enrich each review with a randomized (but stable per-mount) country and relative time
  const enriched = useMemo(() => {
    const countries = [
      "United Kingdom","United States","Canada","Australia","Germany","France","Brazil","Netherlands","Sweden","Norway","Spain","Italy","Poland","India","Japan","Mexico","South Africa","Portugal","Denmark","Finland",
    ];
    return items.map((it) => {
      const days = Math.floor(Math.random() * 365) + 1; // 1..365
      let timeLabel = "";
      if (days === 0) timeLabel = "today";
      else if (days === 1) timeLabel = "1 day ago";
      else if (days < 30) timeLabel = `${days} days ago`;
      else if (days < 365) timeLabel = `${Math.max(1, Math.floor(days / 30))} months ago`;
      else timeLabel = `${Math.floor(days / 365)} years ago`;
      const country = countries[Math.floor(Math.random() * countries.length)];
      return { ...it, __country: country, __timeLabel: timeLabel };
    });
  }, []);

  // set animation speed based on viewport width for responsive feel
  useEffect(() => {
    function updateSpeed() {
      const el = trackRef.current;
      if (!el) return;
      const w = Math.max(320, window.innerWidth || 1024);
      // larger viewports scroll slightly slower (bigger distance)
      const secs = Math.max(10, Math.round(w / 60));
      el.style.animationDuration = `${secs}s`;
    }
    updateSpeed();
    window.addEventListener("resize", updateSpeed);
    return () => window.removeEventListener("resize", updateSpeed);
  }, []);

  function pauseAnimation(ms = 800) {
    const el = trackRef.current;
    if (!el) return;
    el.style.animationPlayState = "paused";
    setTimeout(() => {
      el.style.animationPlayState = "running";
    }, ms);
  }

  function prev() {
    pauseAnimation();
  }
  function next() {
    pauseAnimation();
  }

  return (
    <div className="w-full h-full">
      <div className="w-full h-full">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="flex w-full items-start justify-between gap-4">
            <div>
  
              <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-slate-100 leading-tight flex items-center gap-3">
                <img src="https://cdn.builder.io/api/v1/image/assets%2Fd298c54982d64a0783c9a8a3d1e480c1%2F7886c15a725e4268bb981fb1c2969734?format=webp&width=800" alt="trusted icon" className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-2xl" />
                <span>Trusted by <span className="text-emerald-400">1000+</span> - customers</span>
              </h2>
            </div>

            <div className="hidden md:flex flex-col items-end gap-3">
              <div className="rounded-xl bg-slate-900/70 px-4 py-3 text-slate-50 border border-slate-800 w-44 mt-2">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="text-sm font-semibold">Excellent <span className="text-emerald-400">4.7</span></div>
                    <div className="text-xs text-slate-400">out of 5.0</div>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-400">
                    <Stars rating={5} />
                  </div>
                </div>
                <div className="mt-2 text-xs text-slate-400">Based on 1300+ reviews</div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative w-full overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#071427]/80 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#071427]/80 to-transparent" />

          <div
            ref={trackRef}
            className="marquee-track flex items-stretch gap-4 py-4 w-max"
            role="list"
            style={{ pointerEvents: 'none' }}
          >
            {enriched.map((r, i) => {
              const name = (r.user || "").replace(/^@/, "");
              const initial = name.charAt(0).toUpperCase() || "U";
              const country = (r as any).__country || "United Kingdom";
              const timeLabel = (r as any).__timeLabel || "134 days ago";
              return (
                <article
                  key={`${r.text}-${i}`}
                  role="listitem"
                  className="snap-center flex-shrink-0 w-[260px] sm:w-[300px] md:w-[320px] lg:w-[360px] h-[160px] sm:h-[180px] md:h-[190px] cursor-default rounded-2xl border border-slate-700 bg-slate-900/70 p-4 sm:p-5 text-left text-slate-100 transition-all duration-200"
                >
                  <div className="flex items-start gap-4" style={{ pointerEvents: 'auto' }}>
                    <div className="flex-shrink-0">
                      <img src={pickAvatarForInitial(initial)} alt={name} className="h-10 w-10 rounded-full object-cover border border-white/5 bg-slate-800" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold">{name}</div>
                          <div className="text-xs text-slate-400">{country}</div>
                        </div>
                        <div className="text-xs text-slate-400">{timeLabel}</div>
                      </div>

                      <div className="mt-3 flex items-center gap-2 text-emerald-400">
                        <Stars rating={r.rating} />
                      </div>

                      <p className="mt-3 text-sm text-slate-200 leading-snug">{r.text} — <span className="text-slate-400">{r.note}</span></p>

                    </div>
                  </div>
                </article>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
