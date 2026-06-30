import { useContent } from "@/hooks/use-content";

type SponsorsSectionProps = {
  heading?: string;
  intro?: string;
};

export function SponsorsSection({
  heading = "Our collaborations and connections who power our events and student growth.",
  intro = "The organisations and collaborators who support our initiatives, community building, and student opportunities.",
}: SponsorsSectionProps) {
  const [content] = useContent();

  return (
    <section id="sponsors" className="border-t border-border section-anchor">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-16 md:py-24">
        <div className="mb-8 md:mb-10">
          <div className="space-y-4 md:space-y-6">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight max-w-[24ch] text-balance reveal">
              {heading}
            </h2>
            <p className="max-w-2xl text-base md:text-lg text-muted-foreground">{intro}</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {content.sponsors.map((sponsor) => {
            const cardContent = (
              <article className="flex h-full flex-col rounded-[1.75rem] border border-border bg-card p-9 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex flex-col items-start gap-6 mb-6">
                  {sponsor.image ? (
                    <img
                      src={sponsor.image}
                      alt={`${sponsor.name} logo`}
                      className="h-24 w-auto max-w-[260px] object-contain"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-muted text-sm font-semibold uppercase tracking-[0.22em] text-foreground text-center px-2">
                      {sponsor.abbr ?? sponsor.name.split(" ").slice(0, 2).map((part) => part[0]).join("")}
                    </div>
                  )}
                  <div className="w-full">
                    <h3 className="text-xl md:text-2xl font-semibold tracking-tight">{sponsor.name}</h3>
                    <p className="mt-3 text-sm uppercase tracking-[0.18em] text-muted-foreground">
                      {sponsor.category ?? "Previous sponsor"}
                    </p>
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground">{sponsor.description}</p>

                {sponsor.website ? (
                  <span className="mt-6 inline-flex text-sm font-semibold text-led group-hover:text-foreground">
                    Visit website →
                  </span>
                ) : null}
              </article>
            );

            return sponsor.website ? (
              <a
                key={sponsor.id}
                href={sponsor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="group block h-full"
                aria-label={`Open ${sponsor.name} website`}
              >
                {cardContent}
              </a>
            ) : (
              <div key={sponsor.id} className="h-full">
                {cardContent}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
