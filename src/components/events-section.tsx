import { useState } from "react";
import { useContent } from "@/hooks/use-content";
import { SectionHeading } from "./section-heading";
import type { EventItem } from "@/lib/store";

function EventModal({ event, onClose }: { event: EventItem; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-md flex items-start md:items-center justify-center p-4 md:p-10 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-card border border-border shadow-[0_20px_80px_rgba(0,0,0,0.6)] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 size-9 grid place-items-center bg-background/80 border border-border hover:border-led hover:text-led transition-colors"
          aria-label="Close"
        >
          ✕
        </button>
        <div className="aspect-[16/9] overflow-hidden bg-panel">
          <img src={event.cover} alt={event.title} className="w-full h-full object-cover" />
        </div>
        <div className="p-6 md:p-10">
          <div className="text-[10px] tracking-[0.22em] uppercase text-led mb-3">
            {new Date(event.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            · {event.venue}
          </div>
          <h3 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">{event.title}</h3>
          <p className="text-muted-foreground leading-relaxed text-pretty">{event.description}</p>
          {event.photos.length > 1 && (
            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-3">
              {event.photos.map((p, i) => (
                <div
                  key={i}
                  className="aspect-square overflow-hidden bg-panel border border-border"
                >
                  <img
                    src={p}
                    alt={`${event.title} photo ${i + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function EventsSection() {
  const [content] = useContent();
  const [active, setActive] = useState<EventItem | null>(null);

  return (
    <section id="events" className="border-t border-border section-anchor">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-12 md:py-16">
        <div className="mb-8 md:mb-10 reveal">
          <SectionHeading number="05" label="Past Events" />
          <h2 className="mt-6 text-3xl md:text-6xl font-semibold tracking-tight max-w-[20ch] text-balance">
            A record of what we've built together.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {content.events.map((e) => (
            <button
              key={e.id}
              onClick={() => setActive(e)}
              className="group text-left bg-card border border-border overflow-hidden hover:border-led/40 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.22)] transition-all duration-500 reveal"
            >
              <div className="aspect-[4/3] overflow-hidden bg-panel relative">
                <img
                  src={e.cover}
                  alt={e.title}
                  loading="lazy"
                  className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                <div className="absolute bottom-3 left-4 text-[10px] tracking-[0.2em] uppercase text-led font-medium">
                  {new Date(e.date).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-semibold tracking-tight group-hover:text-led transition-colors">
                  {e.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {e.shortDescription}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-foreground/70 group-hover:text-led transition-colors">
                  View details →
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
      {active && <EventModal event={active} onClose={() => setActive(null)} />}
    </section>
  );
}
