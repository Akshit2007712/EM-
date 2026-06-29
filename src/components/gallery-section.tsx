import { useEffect, useState, useCallback } from "react";
import { useContent } from "@/hooks/use-content";
import { SectionHeading } from "./section-heading";

export function GallerySection() {
  const [content] = useContent();
  const [index, setIndex] = useState<number | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const next = useCallback(() => {
    setIndex((i) => (i === null ? null : (i + 1) % content.gallery.length));
  }, [content.gallery.length]);
  const prev = useCallback(() => {
    setIndex((i) =>
      i === null ? null : (i - 1 + content.gallery.length) % content.gallery.length,
    );
  }, [content.gallery.length]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, close, next, prev]);

  return (
    <section id="gallery" className="border-t border-border section-anchor">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-12 md:py-16">
        <div className="mb-8 md:mb-10 reveal">
          <SectionHeading number="05" label="Gallery" />
          <h2 className="mt-6 text-3xl md:text-6xl font-semibold tracking-tight max-w-[20ch] text-balance">
            Moments from the field.
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {content.gallery.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setIndex(i)}
              className="group relative aspect-square overflow-hidden bg-panel border border-border hover:border-led/40 hover:scale-[1.01] transition-all duration-500 reveal"
            >
              <img
                src={img.url}
                loading="lazy"
                alt={img.caption ?? "Gallery image"}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-led/0 group-hover:bg-led/10 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {index !== null && (
        <div
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={close}
        >
          <button
            onClick={close}
            className="absolute top-6 right-6 size-10 grid place-items-center bg-card border border-border hover:border-led hover:text-led transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 size-12 grid place-items-center bg-card border border-border hover:border-led hover:text-led transition-colors text-xl"
            aria-label="Previous"
          >
            ←
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 size-12 grid place-items-center bg-card border border-border hover:border-led hover:text-led transition-colors text-xl"
            aria-label="Next"
          >
            →
          </button>
          <img
            src={content.gallery[index].url.replace("w=800&h=800", "w=1600&h=1600")}
            alt=""
            className="max-w-[92vw] max-h-[85vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.22em] uppercase text-muted-foreground tabular-nums">
            {String(index + 1).padStart(2, "0")} / {String(content.gallery.length).padStart(2, "0")}
          </div>
        </div>
      )}
    </section>
  );
}
