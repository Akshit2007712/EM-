import { useEffect } from "react";
import Lenis from "lenis";

export function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    let raf = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
}

// Reveal-on-scroll observer for elements with .reveal class
export function useReveal() {
  useEffect(() => {
    const scan = () => {
      const els = document.querySelectorAll<HTMLElement>(".reveal:not(.in-view)");
      els.forEach((el) => io.observe(el));
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    scan();

    window.addEventListener("empirical:content-updated", scan);
    window.addEventListener("rerun-reveal", scan);

    return () => {
      io.disconnect();
      window.removeEventListener("empirical:content-updated", scan);
      window.removeEventListener("rerun-reveal", scan);
    };
  }, []);
}
