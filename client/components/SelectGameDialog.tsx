import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function SelectGameDialog({ children }: { children: React.ReactNode }) {
  const items = [
    {
      id: "mm",
      name: "Murder Mystery",
      image:
        "https://cdn.builder.io/api/v1/image/assets%2Fb2458d5aab5847128a2b754080dc1712%2F155ecd3b276d4626afdb8f1be5054597?format=webp&width=800",
    },
    {
      id: "grow",
      name: "Grow a Garden",
      image:
        "https://cdn.builder.io/api/v1/image/assets%2Fb2458d5aab5847128a2b754080dc1712%2F824f285113f54ff094f70b7dac6cb138?format=webp&width=800",
    },
    {
      id: "blade",
      name: "Blade Ball",
      image:
        "https://cdn.builder.io/api/v1/image/assets%2Fb2458d5aab5847128a2b754080dc1712%2F87d9886f76244cb5ba71707762c2fcd1?format=webp&width=800",
    },
    {
      id: "brainrot",
      name: "Steal a Brainrot",
      image:
        "https://cdn.builder.io/api/v1/image/assets%2Fb2458d5aab5847128a2b754080dc1712%2Fd5e8426a3e46435f9c8be0bc746e8e68?format=webp&width=800",
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="max-w-3xl bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage:
            "url(https://cdn.builder.io/api/v1/image/assets%2F63c936af87bb4092b7300f333f376cfe%2F7521b0d700404c0ea553f70afb05386d?format=webp&width=1200)",
        }}
      >
        <div className="p-6 pt-4">
          <DialogHeader className="-mt-1">
            <DialogTitle className="text-2xl md:text-3xl font-extrabold tracking-wider uppercase text-foreground drop-shadow-sm">Choose a Game</DialogTitle>
          </DialogHeader>
          <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {items.map((it) => (
              <Button
                key={it.id}
                className="group h-28 w-full justify-start rounded-2xl border border-white/10 bg-white/5 p-3 text-left hover:bg-white/10"
                onClick={() => {
                  const e = new CustomEvent("game:selected", { detail: it });
                  window.dispatchEvent(e);
                  if (it.id === "grow") window.location.assign("/grow"); else if (it.id === "mm") window.location.assign("/mm"); else if (it.id === "brainrot") window.location.assign("/brainrot");
                }}
              >
                <span className="relative inline-flex h-20 w-24 shrink-0 overflow-hidden rounded-xl border border-white/10">
                  <img src={it.image} alt={`${it.name} cover`} className="h-full w-full object-cover" />
                </span>
                <span className="ml-4">
                  <span className="block text-base font-semibold">{it.name}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">Tap to view items</span>
                </span>
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
