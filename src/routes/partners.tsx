import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { SiteNav } from "@/components/site-nav";
import { SponsorsSection } from "@/components/sponsors-section";
import { SiteFooter } from "@/components/about-section";
import { useContent } from "@/hooks/use-content";
import { useReveal, useSmoothScroll } from "@/hooks/use-smooth-scroll";

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: "Our Partners & Collaborations | The Empirical Society" },
      {
        name: "description",
        content: "Explore the organisations and collaborators who support The Empirical Society.",
      },
    ],
  }),
  component: PartnersPage,
});

function PartnersPage() {
  const [content] = useContent();
  useSmoothScroll();
  useReveal();

  useEffect(() => {
    const ev = new Event("rerun-reveal");
    window.dispatchEvent(ev);
  }, [content]);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SiteNav />
      <main className="pt-24">
        <SponsorsSection />
      </main>
      <SiteFooter />
    </div>
  );
}
