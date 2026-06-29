import { useContent } from "@/hooks/use-content";
import { useState } from "react";
import { SectionHeading } from "./section-heading";
import type { Sponsor } from "@/lib/store";

function SponsorBadge({ sponsor }: { sponsor: Sponsor }) {
  const [logoError, setLogoError] = useState(false);
  const showLogo = sponsor.image && !logoError;

  return (
    <a
      href={sponsor.website || "#"}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-4 rounded-3xl border border-border bg-card/90 px-5 py-3 transition duration-300 hover:border-led hover:bg-accent/10"
    >
      {showLogo ? (
        <img
          src={sponsor.image}
          alt={`${sponsor.name} logo`}
          className="h-10 w-auto max-h-10 object-contain"
          onError={() => setLogoError(true)}
        />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-semibold uppercase tracking-[0.16em] text-foreground">
          {sponsor.abbr ?? sponsor.name.split(" ").slice(0, 2).map((part) => part[0]).join("")}
        </div>
      )}
      <span className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground">
        {sponsor.name}
      </span>
    </a>
  );
}

export function AboutSection() {
  const [content] = useContent();
  return (
    <section id="about" className="border-t border-border section-anchor">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-12 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
        <div className="md:col-span-3 flex flex-col justify-between gap-6">
          <SectionHeading number="01" label="About" />
          <div className="hidden md:block text-[10px] font-medium tracking-[0.22em] uppercase text-muted-foreground">
            Est. MMXIX <br />
            Open Membership
          </div>
        </div>
        <div className="md:col-span-9 space-y-6 md:space-y-8">
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight leading-[1.15] max-w-[28ch] reveal">
            {content.about}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 border-t border-border pt-6 md:pt-8">
            <div className="reveal">
              <div className="text-[10px] tracking-[0.22em] uppercase text-led mb-2">Mission</div>
              <p className="text-muted-foreground leading-relaxed text-pretty">{content.mission}</p>
            </div>
            <div className="grid grid-cols-2 gap-6 reveal">
              <div>
                <div className="text-3xl md:text-4xl font-semibold tracking-tighter mb-1 tabular-nums">
                  120+
                </div>
                <div className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground">
                  Active Members
                </div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-semibold tracking-tighter mb-1 tabular-nums">
                  40+
                </div>
                <div className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground">
                  Events Hosted
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  const [content] = useContent();

  return (
    <footer className="border-t border-border mt-16 md:mt-24">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-8 md:py-10 flex flex-col gap-4 text-[10px] tracking-[0.22em] uppercase text-muted-foreground">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="size-1.5 rounded-full bg-led led-dot" />
            The Empirical Society © {new Date().getFullYear()}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <a href="#team" className="hover:text-foreground transition-colors">
              Team
            </a>
            <a href="#events" className="hover:text-foreground transition-colors">
              Events
            </a>
            <a href="#gallery" className="hover:text-foreground transition-colors">
              Gallery
            </a>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {content.socialLinks?.instagram && (
              <a
                href={content.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                Instagram
              </a>
            )}
            {content.socialLinks?.twitter && (
              <a
                href={content.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                Twitter
              </a>
            )}
            {content.socialLinks?.linkedin && (
              <a
                href={content.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                LinkedIn
              </a>
            )}
            {content.socialLinks?.email && (
              <a href={content.socialLinks.email} className="hover:text-foreground transition-colors">
                Email
              </a>
            )}
            <a href="/admin" className="hover:text-foreground transition-colors text-led ml-4">
              Admin
            </a>
          </div>
        </div>

        {content.sponsors?.length ? (
          <div className="border-t border-border/40 pt-6 mt-8">
            <div className="mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">
             Our Previous Sponsors
            </div>
            <div className="flex flex-wrap items-center gap-4">
              {content.sponsors.map((sponsor) => (
                <SponsorBadge key={sponsor.id} sponsor={sponsor} />
              ))}
            </div>
          </div>
        ) : null}

        {content.socialLinks?.phone && (
          <div className="border-t border-border/40 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 normal-case tracking-normal text-xs text-muted-foreground/80">
              <span className="font-semibold uppercase tracking-wider text-[10px] text-muted-foreground">Contact Numbers:</span>
              <span>{content.socialLinks.phone}</span>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}
