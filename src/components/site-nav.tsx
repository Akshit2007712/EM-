import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-500 ${
        scrolled ? "bg-background/70 backdrop-blur-xl border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="max-w-[1440px] mx-auto flex items-center justify-between px-6 md:px-10 py-5">
        <Link
          to="/"
          className="flex items-center gap-3 text-xs font-semibold tracking-[0.22em] uppercase"
        >
          <span className="block size-1.5 rounded-full bg-led led-dot" />
          Empirical Society
        </Link>
        <nav className="hidden md:flex gap-8 text-xs font-medium tracking-widest uppercase text-muted-foreground">
          <a href="#about" className="hover:text-foreground transition-colors">
            About
          </a>
          <a href="#team" className="hover:text-foreground transition-colors">
            Team
          </a>
          <a href="#events" className="hover:text-foreground transition-colors">
            Events
          </a>
          <a href="#gallery" className="hover:text-foreground transition-colors">
            Gallery
          </a>
        </nav>
        <a
          href="#about"
          className="px-4 py-2 text-[10px] font-semibold tracking-[0.18em] uppercase bg-foreground text-background hover:bg-led transition-colors duration-300"
        >
          Join Us
        </a>
      </div>
    </header>
  );
}
