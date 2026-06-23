import { useEffect, useState } from "react";
import { loadContent, fetchFromSupabase, type SiteContent } from "@/lib/store";

export function useContent(): [SiteContent, (c: SiteContent) => void] {
  const [content, setContent] = useState<SiteContent>(() => loadContent());

  useEffect(() => {
    const hasLocalContent =
      typeof window !== "undefined" &&
      localStorage.getItem("empirical-society-content-v1") !== null;

    // Only fetch from remote if no local content exists yet
    // This prevents the API from overwriting admin's in-progress edits
    if (!hasLocalContent) {
      const syncFromRemote = async () => {
        const remoteData = await fetchFromSupabase();
        if (remoteData) {
          localStorage.setItem(
            "empirical-society-content-v1",
            JSON.stringify(remoteData)
          );
          setContent(remoteData);
        }
      };
      syncFromRemote();
    }

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
