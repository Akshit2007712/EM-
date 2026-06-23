import { useEffect, useState } from "react";
import { loadContent, fetchFromSupabase, type SiteContent } from "@/lib/store";

export function useContent(): [SiteContent, (c: SiteContent) => void] {
  // Show cached content immediately (zero flicker for visitors)
  const [content, setContent] = useState<SiteContent>(() => loadContent());

  useEffect(() => {
    // Always pull fresh content from Supabase on mount.
    // If Supabase is not configured, fetchFromSupabase() returns null
    // and we keep showing the localStorage cache.
    fetchFromSupabase().then((remote) => {
      if (remote) {
        // Update the localStorage read-cache
        try {
          localStorage.setItem(
            "empirical-society-content-v1",
            JSON.stringify(remote)
          );
        } catch {
          // Cache write is best-effort
        }
        setContent(remote);
      }
    });

    // Keep multiple tabs in sync via storage events
    const handler = () => setContent(loadContent());
    window.addEventListener("empirical:content-updated", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("empirical:content-updated", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  return [content, setContent];
}
