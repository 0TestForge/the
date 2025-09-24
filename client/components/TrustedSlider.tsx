import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

type Testimonial = {
  name: string;
  text: string;
};

const testimonials: Testimonial[] = [
  { name: "Melony J.", text: "Best process! Super smooth, got my items fast for cheap!" },
  { name: "Marcus K.", text: "Amazing service! Got exactly what I ordered within minutes!" },
  { name: "Sarah L.", text: "Reliable and trustworthy! Will definitely buy again!" },
  { name: "Diego R.", text: "Fast checkout and instant delivery. Highly recommend!" },
  { name: "Nora P.", text: "Support was helpful and quick. Great experience." },
  { name: "Kian A.", text: "Got my items in under 2 minutes. Crazy fast!" },
  { name: "Ava T.", text: "Everything worked perfectly on the first try." },
  { name: "Leo M.", text: "Good prices and reliable delivery every time." },
  { name: "Maya V.", text: "I keep coming back. Smooth and safe." },
  { name: "Owen C.", text: "Five stars. Exactly as described." },
  { name: "Zoe H.", text: "Super friendly staff and quick handoff in-game." },
  { name: "Overall Rating", text: "Amazing 4.5 out of 5.0" },
];

function Stars({ small = false }: { small?: boolean }) {
  const size = small ? "w-3 h-3" : "w-4 h-4";
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`${size} text-[#3DFF88]`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function Verified() {
  return (
    <div className="flex items-center gap-2 ml-auto">
      <svg className="w-4 h-4 text-[#3DFF88]" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
      <span className="text-[#D9D9D9] text-xs font-bold font-['Poppins']">Verified Buy</span>
    </div>
  );
}

export function TrustedSlider() {
  const [api, setApi] = React.useState<CarouselApi | null>(null);

  // Autoplay
  React.useEffect(() => {
    if (!api) return;
    const id = setInterval(() => {
      if (!api) return;
      if (!api.canScrollNext()) {
        api.scrollTo(0);
      } else {
        api.scrollNext();
      }
    }, 3000);
    return () => clearInterval(id);
  }, [api]);

  return (
    <Carousel
      setApi={setApi}
      opts={{ align: "start", loop: true, skipSnaps: false }}
      className="relative"
    >
      <CarouselContent>
        {testimonials.map((t, idx) => (
          <CarouselItem key={idx} className="sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
            {idx === testimonials.length - 1 ? (
              // Rating summary card
              <div className="bg-[#06100A] border border-[#666] rounded-[22px] p-4 md:p-5 h-full">
                <Stars small />
                <div className="mt-2">
                  <div className="text-[#3DFF88] font-['Poppins'] text-sm font-bold">Amazing 4.5</div>
                  <div className="text-[#D9D9D9] font-['Poppins'] text-xs font-bold">out of 5.0</div>
                </div>
              </div>
            ) : (
              <div className="bg-[#06100A] border border-[#666] rounded-[22px] p-4 md:p-5 h-full">
                <div className="flex items-center gap-1 mb-3">
                  <Stars />
                  <Verified />
                </div>
                <h4 className="text-[#D9D9D9] font-['Poppins'] text-sm font-bold mb-2">{t.name}</h4>
                <p className="text-[#D9D9D9] font-['Poppins'] text-xs font-bold">{t.text}</p>
              </div>
            )}
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="bg-black/40 hover:bg-black/60 border-white/20 text-white left-2" />
      <CarouselNext className="bg-black/40 hover:bg-black/60 border-white/20 text-white right-2" />
    </Carousel>
  );
}
