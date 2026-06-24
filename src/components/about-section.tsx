import { useContent } from "@/hooks/use-content";
import { SectionHeading } from "./section-heading";

export function AboutSection() {
  const [content] = useContent();
  return (
    <section id="about" className="border-t border-border">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-24 md:py-32 grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-3 flex flex-col justify-between gap-8">
          <SectionHeading number="01" label="About" />
          <div className="hidden md:block text-[10px] font-medium tracking-[0.22em] uppercase text-muted-foreground">
            Est. MMXIX <br />
            Open Membership
          </div>
        </div>
        <div className="md:col-span-9 space-y-10">
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight leading-[1.1] max-w-[28ch] reveal">
            {content.about}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-border pt-10">
            <div className="reveal">
              <div className="text-[10px] tracking-[0.22em] uppercase text-led mb-3">Mission</div>
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
    <footer className="border-t border-border mt-32">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-12 flex flex-col gap-6 text-[10px] tracking-[0.22em] uppercase text-muted-foreground">
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
