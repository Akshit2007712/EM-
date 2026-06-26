import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTheme } from "../hooks/use-theme";
import { Sun, Moon, Menu, X } from "lucide-react";
import logoUrl from "../assets/logo.jpg";

const NAV_LINKS = [
  { href: "#team", label: "Team" },
  { href: "#events", label: "Events" },
  { href: "#gallery", label: "Gallery" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-500 ${
        scrolled || menuOpen
          ? "bg-background/90 backdrop-blur-xl border-b border-border"
          : "bg-transparent"
      }`}
    >
      {/* Top bar */}
      <div className="max-w-[1440px] mx-auto flex items-center justify-between px-5 md:px-10 py-4 md:py-5">
        <Link
          to="/"
          className="flex items-center gap-3 text-xs font-semibold tracking-[0.18em] uppercase group"
        >
          <img
            src={logoUrl}
            alt="The Empirical Society Logo"
            className="size-8 rounded-lg object-cover border border-border group-hover:scale-105 transition-transform"
          />
          <span className="truncate">The Empirical Society</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-8 text-xs font-medium tracking-widest uppercase text-muted-foreground">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-foreground transition-colors">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-3 md:p-2 rounded-full border border-border bg-card/40 hover:bg-accent hover:text-accent-foreground transition-all duration-300 flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none relative overflow-hidden"
            aria-label="Toggle theme"
          >
            <div className="relative size-4">
              <Sun
                className={`absolute inset-0 transition-transform duration-500 ease-out size-full ${
                  mounted && theme === "light"
                    ? "rotate-0 scale-100 opacity-100"
                    : "rotate-90 scale-0 opacity-0"
                }`}
              />
              <Moon
                className={`absolute inset-0 transition-transform duration-500 ease-out size-full ${
                  !mounted || theme === "dark"
                    ? "rotate-0 scale-100 opacity-100"
                    : "-rotate-90 scale-0 opacity-0"
                }`}
              />
            </div>
          </button>

          {/* Join Us — desktop only */}
          <a
            href="#team"
            className="hidden md:inline-block px-4 py-2 text-[10px] font-semibold tracking-[0.18em] uppercase bg-foreground text-background hover:bg-led hover:text-background transition-colors duration-300"
          >
            Join Us
          </a>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden p-2 rounded-full border border-border bg-card/40 hover:bg-accent transition-all duration-300 flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <div className="relative size-4">
              <Menu
                className={`absolute inset-0 size-full transition-all duration-300 ${
                  menuOpen ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
                }`}
              />
              <X
                className={`absolute inset-0 size-full transition-all duration-300 ${
                  menuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile slide-down menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          menuOpen ? "max-h-[28rem] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        <nav className="flex flex-col px-5 pb-6 pt-2 gap-0 border-t border-border/40">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="py-3.5 text-sm font-semibold tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground transition-colors border-b border-border/30 last:border-0"
            >
              {link.label}
            </a>
          ))}
          
          {/* Mobile Theme Toggle Row */}
          <div className="flex items-center justify-between py-3.5 border-b border-border/30">
            <span className="text-sm font-semibold tracking-[0.18em] uppercase text-muted-foreground">
              Theme Mode
            </span>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card/60 hover:bg-accent text-xs font-semibold tracking-[0.1em] uppercase text-foreground cursor-pointer"
            >
              {theme === "light" ? (
                <>
                  <Sun className="size-3.5 text-led" /> Light
                </>
              ) : (
                <>
                  <Moon className="size-3.5 text-led" /> Dark
                </>
              )}
            </button>
          </div>

          <a
            href="#team"
            onClick={() => setMenuOpen(false)}
            className="mt-4 py-3 text-[11px] font-semibold tracking-[0.18em] uppercase bg-foreground text-background hover:bg-led hover:text-background transition-colors duration-300 text-center"
          >
            Join Us
          </a>
        </nav>
      </div>
    </header>
  );
}
