import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { SiteNav } from "@/components/site-nav";
import { Hero } from "@/components/hero";
import { AboutSection, SiteFooter } from "@/components/about-section";
import { TeamSection } from "@/components/team-section";
import { EventsSection } from "@/components/events-section";
import { GallerySection } from "@/components/gallery-section";
import { useContent } from "@/hooks/use-content";
import { useReveal, useSmoothScroll } from "@/hooks/use-smooth-scroll";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Empirical Society — Empowering Minds, Building Futures" },
      {
        name: "description",
        content:
          "Empirical Society is a college community of curious students hosting events, publishing writing, and shipping creative initiatives across campus.",
      },
      { property: "og:title", content: "Empirical Society" },
      {
        property: "og:description",
        content: "Empowering Minds, Building Futures.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [content] = useContent();
  useSmoothScroll();
  useReveal();

  // Re-run reveal observer when content changes (admin edits)
  useEffect(() => {
    const ev = new Event("rerun-reveal");
    window.dispatchEvent(ev);
  }, [content]);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SiteNav />
      <main>
        <Hero tagline={content.heroTagline} subtitle={content.heroSubtitle} />
        <AboutSection />
        <TeamSection />
        <EventsSection />
        <GallerySection />
      </main>
      <SiteFooter />
    </div>
  );
}
