import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Msg = { id: string; who: "me" | "staff"; text: string; at: number };

export default function Chat() {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const orderId = params.get("orderId") || "";
  const user = params.get("user") || "";
  const [statusDots, setStatusDots] = useState(".");
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: "m1", who: "staff", text: `Hi ${user || "there"}! Share your request and keep Roblox messages open.`, at: Date.now() },
  ]);
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => setStatusDots((d) => (d.length >= 3 ? "." : d + ".")), 600);
    return () => clearInterval(t);
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs.length]);

  const send = () => {
    const t = text.trim();
    if (!t) return;
    setMsgs((m) => [...m, { id: crypto.randomUUID(), who: "me", text: t, at: Date.now() }]);
    setText("");
    setTimeout(() => {
      setMsgs((m) => [...m, { id: crypto.randomUUID(), who: "staff", text: "Thanks! A staff member will respond shortly.", at: Date.now() }]);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050B1F] to-[#081433] text-blue-50">
      <div className="mx-auto max-w-2xl p-6">
        <h1 className="text-xl font-semibold text-blue-100">Delivery Chat</h1>
        <p className="mt-1 text-sm text-blue-200/80">We will contact you on Roblox to deliver your items.</p>

        <div className="mt-6 space-y-4">
          <div className="rounded-lg border border-blue-800/60 bg-[#081433]/60 p-4">
            <div className="text-xs text-blue-200/70">Order ID</div>
            <div className="mt-1 font-mono text-sm">{orderId || "N/A"}</div>
          </div>

          <div className="rounded-lg border border-blue-800/60 bg-[#081433]/60 p-4">
            <div className="text-xs text-blue-200/70">Roblox username</div>
            <div className="mt-1 text-sm">{user || "N/A"}</div>
          </div>

          <div className="rounded-lg border border-blue-800/60 bg-[#081433]/60 p-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-violet-400" />
              Waiting for staff{statusDots}
            </div>
            <p className="mt-2 text-xs text-blue-200/70">Keep this tab open. You'll be messaged on Roblox shortly.</p>
          </div>

          <div className="rounded-xl border border-blue-800/60 bg-[#081433]/60 p-3 h-[50vh] overflow-auto">
            <div className="space-y-2">
              {msgs.map(m => (
                <div key={m.id} className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${m.who === "me" ? "ml-auto bg-emerald-500/90 text-slate-900" : "bg-[#050B1F]/80"}`}>
                  {m.text}
                </div>
              ))}
              <div ref={endRef} />
            </div>
          </div>

          <div className="flex gap-2">
            <Input value={text} onChange={(e)=>setText(e.target.value)} placeholder="Type a message" onKeyDown={(e)=>{ if(e.key==='Enter') send(); }} />
            <Button className="bg-emerald-400 text-slate-900 hover:bg-emerald-300" onClick={send}>Send</Button>
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => (window.location.href = "/")}>Back to Home</Button>
            <Button className="bg-slate-200 text-slate-900 hover:bg-white" onClick={() => window.close()}>Close</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
