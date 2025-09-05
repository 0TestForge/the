import { Button } from "@/components/ui/button";
import { SelectGameDialog } from "@/components/SelectGameDialog";
import { ReviewsMarquee } from "@/components/ReviewsMarquee";

export default function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2Fb2458d5aab5847128a2b754080dc1712%2F9a2afb70ccde4b09ae6f1817c0abebd1?format=webp&width=1600"
          alt="Hero banner"
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/10 via-background/15 to-background/20" />
        <div className="container pt-20 md:pt-28 pb-20">
          <div className="mx-auto max-w-6xl">
            <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-transparent backdrop-blur-sm text-center">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fb2458d5aab5847128a2b754080dc1712%2F3af3d652d1b7456abc1b7ab7bd0ec9c4?format=webp&width=1600"
                alt="container background"
                className="absolute inset-0 -z-10 h-full w-full object-cover opacity-20"
              />
              <div className="px-6 py-10 md:px-12 md:py-14">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-emerald-300">
                    <img src="https://cdn.builder.io/api/v1/image/assets%2Fb2458d5aab5847128a2b754080dc1712%2Fb416b769d9a641f7b46b99fef8220342?format=webp&width=64" alt="icon" className="h-3.5 w-3.5 object-contain" />
                    4.9 stars rating
                  </span>
                  Safe checkout • Instant delivery
                </div>
                <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl leading-tight">
                  Instantly Buy Your Favorite Items Fast, Safe, and Easy!
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                  The fastest, safest shop for in‑game items with automated delivery. Get what you need in seconds.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <SelectGameDialog>
                    <Button className="h-12 px-6 text-base bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/25">Shop Now</Button>
                  </SelectGameDialog>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="container py-16 md:py-24">
        <h2 className="text-2xl md:text-3xl font-bold text-center">How RoCart Works?</h2>
        <p className="mt-2 text-sm text-center text-muted-foreground">Buying items on RoCart is designed to be simple, fast, and reliable! Here's how you can get started:</p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 flex gap-4 items-start">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 12h18M3 12l4-4M3 12l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Choose Your Game</h3>
              <p className="mt-2 text-sm text-muted-foreground">Begin by selecting the game you're interested in, such as Murder Mystery 2, Grow a Garden, steal a brainrot or bladeball.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 flex gap-4 items-start">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-violet-700 text-white shadow-md">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Follow the Tutorial</h3>
              <p className="mt-2 text-sm text-muted-foreground">Choose a product you like, add it to your cart, and proceed to checkout. After completing your purchase, send us your Roblox username. Our staff will message you shortly and deliver your items in-game.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 flex gap-4 items-start">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 7h16v10H4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Instant Delivery</h3>
              <p className="mt-2 text-sm text-muted-foreground">With our cutting-edge automated system, items are delivered to your account within minutes after your purchase. No delays, no hassle — just instant gratification!</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 flex gap-4 items-start">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M18 8a6 6 0 11-12 0 6 6 0 0112 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 20v-1a6 6 0 016-6h8a6 6 0 016 6v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold">24/7 Support</h3>
              <p className="mt-2 text-sm text-muted-foreground">If you have any questions or encounter any issues, our friendly live chat support team is available around the clock to assist you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mid-page decorative background section */}
      <section className="container py-10 md:py-16">
        <div className="relative h-64 md:h-80 rounded-3xl border border-white/15 overflow-hidden bg-[#071427]">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-700/20 via-emerald-600/10 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="w-full">
              <ReviewsMarquee count={982} />
            </div>
          </div>
        </div>
      </section>


      {/* FAQ */}
      <section id="faq" className="container py-16 md:py-24">
        <h2 className="text-2xl md:text-3xl font-bold">Frequently Asked Questions</h2>
        <p className="mt-2 text-sm text-muted-foreground">Got Questions? We've Got Answers!</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            { q: "Is RoCart a trusted place to buy game items?", a: "Yes — we operate an automated fulfillment system and work with trusted sellers. We also provide secure payments to protect buyers." },
            { q: "What is your refund policy?", a: "If an order cannot be fulfilled we will refund you promptly. For disputes, contact support and provide your order ID so we can investigate." },
            { q: "Can I get free items?", a: "Occasionally we run promotions or giveaway events. Follow our socials or check the site banners for active offers." },
            { q: "How do I receive my purchased items?", a: "Most items are delivered automatically within seconds to your in‑game account or linked platform as soon as payment completes." },
            { q: "Can I trade my in-game items for items on RoCart?", a: "We do not currently support peer-to-peer trades through the site. You can sell or buy items via supported listings instead." },
            { q: "What if I don't receive my items after purchasing?", a: "If delivery doesn't arrive, open a support chat with your order ID and our team will assist and refund if necessary." },
          ].map((i) => (
            <details key={i.q} className="group rounded-xl border border-white/15 bg-transparent p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                <span>{i.q}</span>
                <span className="ml-4 grid place-content-center rounded-md border border-white/10 p-1 text-muted-foreground group-open:rotate-45 transition-transform">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2"/></svg>
                </span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{i.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
