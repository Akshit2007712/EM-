import { useEffect, useRef } from "react";
import heroImg from "@/assets/hero-campus.jpg";

type Props = {
  tagline: string;
  subtitle: string;
};

export function Hero({ tagline, subtitle }: Props) {
  const imgRef = useRef<HTMLDivElement>(null);

  // Subtle parallax on hero background
  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    const onScroll = () => {
      const y = window.scrollY;
      el.style.transform = `translate3d(0, ${y * 0.25}px, 0) scale(${
        1 + Math.min(y, 600) * 0.0002
      })`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Split tagline at last space for the gradient line break
  const parts = tagline.split(" ");
  const firstHalf = parts.slice(0, Math.ceil(parts.length / 2)).join(" ");
  const secondHalf = parts.slice(Math.ceil(parts.length / 2)).join(" ");

  return (
    <section className="relative min-h-dvh flex flex-col justify-center items-center px-5 sm:px-6 pt-24 sm:pt-32 pb-12 sm:pb-16 text-center overflow-hidden">
      {/* Parallax background image */}
      <div ref={imgRef} className="absolute inset-0 -z-20 will-change-transform" aria-hidden>
        <img
          src={heroImg}
          alt=""
          width={1920}
          height={1080}
          className="w-full h-[120%] object-cover opacity-40"
        />
      </div>

      {/* Soft overlay + LED radial */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/60 via-background/85 to-background" />
      <div className="absolute top-0 inset-x-0 h-[800px] hero-radial -z-10 pointer-events-none" />
      <div className="absolute top-[72px] inset-x-0 h-px led-line opacity-50" />

      <h1 className="text-5xl sm:text-6xl md:text-8xl font-semibold tracking-tighter text-balance mb-8 max-w-[16ch] reveal">
        {firstHalf}{" "}
        <span className="block text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/20">
          {secondHalf}
        </span>
      </h1>

      <p className="text-base md:text-xl text-muted-foreground max-w-[55ch] text-pretty mb-12 font-medium reveal">
        {subtitle}
      </p>

      <a
        href="#about"
        className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-foreground/5 backdrop-blur-md border border-foreground/15 shadow-md hover:border-led/60 hover:bg-led/10 hover:shadow-lg overflow-hidden transition-all duration-500 reveal"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-led/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        <span className="relative z-10 text-sm font-semibold tracking-[0.18em] uppercase group-hover:text-led transition-colors duration-300">
          Explore
        </span>
        <span className="relative z-10 group-hover:translate-y-1 transition-transform duration-300">↓</span>
      </a>


    </section>
  );
}
