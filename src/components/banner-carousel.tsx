"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const banners = [
  { src: "/banner1.webp", alt: "Banner principal 1" },
  { src: "/banner2.webp", alt: "Banner principal 2" },
  { src: "/banner3.webp", alt: "Banner principal 3" },
  { src: "/banner4.webp", alt: "Banner principal 4" },
];

export function BannerCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % banners.length);
    }, 4500);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="bg-[#f6f8fb] px-4 py-7 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[72rem]">
        <div className="relative overflow-hidden rounded-[2rem] border border-[#d8e4ec] bg-white shadow-[0_24px_80px_rgba(15,93,134,0.12)]">
          <div className="relative aspect-[2.85/1] min-h-[12rem] w-full sm:min-h-[16rem] lg:min-h-[20rem]">
            <Image
              src={banners[activeIndex].src}
              alt={banners[activeIndex].alt}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1152px"
            />
          </div>

          <button
            type="button"
            aria-label="Banner anterior"
            onClick={() =>
              setActiveIndex(
                (activeIndex - 1 + banners.length) % banners.length,
              )
            }
            className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#2271c8] text-white shadow-[0_12px_30px_rgba(34,113,200,0.32)] transition hover:brightness-105"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            aria-label="Próximo banner"
            onClick={() => setActiveIndex((activeIndex + 1) % banners.length)}
            className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#2271c8] text-white shadow-[0_12px_30px_rgba(34,113,200,0.32)] transition hover:brightness-105"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-white/88 px-3 py-2 shadow-[0_8px_24px_rgba(15,93,134,0.18)] backdrop-blur">
            {banners.map((banner, index) => (
              <button
                key={banner.src}
                type="button"
                aria-label={`Ir para banner ${index + 1}`}
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 rounded-full transition ${
                  activeIndex === index
                    ? "w-7 bg-[#2271c8]"
                    : "w-2.5 bg-[#b9c9d6]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
