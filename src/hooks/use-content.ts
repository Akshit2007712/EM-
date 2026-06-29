import { useEffect, useState } from "react";
import { loadContent, fetchFromSupabase, type SiteContent } from "@/lib/store";

export function useContent(): [SiteContent, (c: SiteContent) => void] {
  const [content, setContent] = useState<SiteContent>(() => loadContent());

  useEffect(() => {
    if (typeof window === "undefined") return;

    const cached = loadContent();
    if (cached) setContent(cached);

    const handler = () => setContent(loadContent());
    window.addEventListener("empirical:content-updated", handler);
    window.addEventListener("storage", handler);

    const shouldRefresh = navigator.onLine && window.location.hostname !== "localhost";
    if (!shouldRefresh) return () => {
      window.removeEventListener("empirical:content-updated", handler);
      window.removeEventListener("storage", handler);
    };

    const timer = window.setTimeout(() => {
      fetchFromSupabase().then((remote) => {
        if (!remote) return;
        try {
          localStorage.setItem("empirical-society-content-v2", JSON.stringify(remote));
        } catch {
          // best-effort
        }
        setContent(remote);
      });
    }, 180);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("empirical:content-updated", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  return [content, setContent];
}
