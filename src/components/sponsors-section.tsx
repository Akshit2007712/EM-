import { useContent } from "@/hooks/use-content";
import { SectionHeading } from "./section-heading";

export function SponsorsSection() {
  const [content] = useContent();

  return (
    <section id="sponsors" className="border-t border-border section-anchor">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-16 md:py-24">
        <div className="mb-8 md:mb-10">
          <div className="space-y-4 md:space-y-6">
            <SectionHeading number="02" label="Sponsors" />
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight max-w-[24ch] text-balance reveal">
              Previous sponsors who power our events and student growth.
            </h2>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {content.sponsors.map((sponsor) => (
            <article
              key={sponsor.id}
              className="rounded-[1.5rem] border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
<div className="flex flex-col items-start gap-4 mb-5">
          {sponsor.image ? (
            <img
              src={sponsor.image}
              alt={`${sponsor.name} logo`}
              className="h-16 w-auto max-w-[180px] object-contain"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-muted text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground text-center px-2">
              {sponsor.abbr ?? sponsor.name.split(" ").slice(0, 2).map((part) => part[0]).join("")}
            </div>
          )}
          <div className="w-full">
                  <h3 className="text-xl font-semibold tracking-tight">{sponsor.name}</h3>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {sponsor.category ?? "Previous sponsor"}
                  </p>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground">{sponsor.description}</p>

              {sponsor.website ? (
                <a
                  href={sponsor.website}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex text-sm font-semibold text-led hover:text-foreground"
                >
                  Visit website →
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
