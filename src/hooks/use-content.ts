import { useEffect, useState } from "react";
import { loadContent, fetchFromSupabase, type SiteContent } from "@/lib/store";

export function useContent(): [SiteContent, (c: SiteContent) => void] {
  const [content, setContent] = useState<SiteContent>(() => loadContent());

  useEffect(() => {
    // Sync from Supabase on mount
    const syncWithSupabase = async () => {
      const remoteData = await fetchFromSupabase();
      if (remoteData) {
        localStorage.setItem("empirical-society-content-v1", JSON.stringify(remoteData));
        setContent(remoteData);
      }
    };

    syncWithSupabase();

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
