// Data store for The Empirical Society
// Supabase is the source of truth; localStorage acts as a read cache.

import { supabase, IMAGES_BUCKET } from "./supabase";
import { defaultContent } from "./data";

const STORAGE_KEY = "empirical-society-content-v2";
const LEGACY_STORAGE_KEY = "empirical-society-content-v1";

/* ---------- Types ---------- */

export type Person = {
  id: string;
  name: string;
  role: string;
  photo: string;
  description?: string;
};

export type Team = {
  id: string;
  name: string;
  leads?: Person[];
  lead?: Person;
  members: Person[];
};

export type Sponsor = {
  id: string;
  name: string;
  abbr?: string;
  category?: string;
  description: string;
  website?: string;
  image?: string;
};

export type EventItem = {
  id: string;
  title: string;
  date: string;
  shortDescription: string;
  description: string;
  venue: string;
  cover: string;
  photos: string[];
};

export type GalleryImage = {
  id: string;
  url: string;
  caption?: string;
};

export type SiteContent = {
  heroTagline: string;
  heroSubtitle: string;
  about: string;
  mission: string;
  socialLinks: {
    instagram: string;
    twitter: string;
    linkedin: string;
    email: string;
    phone?: string;
  };
  mentors: Person[];
  faculty: Person[];
  leads: Person[];
  sponsors: Sponsor[];
  teams: Team[];
  events: EventItem[];
  gallery: GalleryImage[];
};

/* ---------- localStorage helpers ---------- */

function isBrowser() {
  return typeof window !== "undefined";
}

function mergeSponsors(sponsors?: Sponsor[]): Sponsor[] {
  if (!sponsors) return defaultContent.sponsors;

  const defaultSponsorsById = new Map(
    defaultContent.sponsors.map((sponsor) => [sponsor.id, sponsor])
  );

  const storedSponsorsById = new Map(
    sponsors.map((sponsor) => [sponsor.id, sponsor])
  );

  const merged = defaultContent.sponsors.map((defaultSponsor) => ({
    ...defaultSponsor,
    ...storedSponsorsById.get(defaultSponsor.id),
  }));

  const extraSponsors = sponsors
    .filter((sponsor) => !defaultSponsorsById.has(sponsor.id))
    .map((sponsor) => ({ ...sponsor }));

  return [...merged, ...extraSponsors];
}

export function loadContent(): SiteContent {
  if (!isBrowser()) return defaultContent;
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      raw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (raw) {
        localStorage.setItem(STORAGE_KEY, raw);
        localStorage.removeItem(LEGACY_STORAGE_KEY);
      }
    }
    if (!raw) return defaultContent;
    const parsed = { ...defaultContent, ...JSON.parse(raw) };
    parsed.sponsors = mergeSponsors(parsed.sponsors as Sponsor[]);
    // Back-compat: normalise legacy `lead` → `leads` array
    if (parsed.teams) {
      parsed.teams = parsed.teams.map((t: Team) => {
        if (t.lead && !t.leads) t.leads = [t.lead];
        return t;
      });
    }
    return parsed;
  } catch {
    return defaultContent;
  }
}

/** Write to localStorage (used as a read-cache only). */
function cacheContent(c: SiteContent) {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
    window.dispatchEvent(new Event("empirical:content-updated"));
  } catch {
    // Quota exceeded – cache write is best-effort
  }
}

/* ---------- Supabase helpers ---------- */

/** Fetch the latest content from Supabase. Returns null if unavailable. */
export async function fetchFromSupabase(): Promise<SiteContent | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("site_content")
      .select("data")
      .eq("id", "main")
      .single();

    if (error || !data?.data) return null;
    return { ...defaultContent, ...data.data } as SiteContent;
  } catch (err) {
    console.error("[store] fetchFromSupabase:", err);
    return null;
  }
}

/** Upsert content to Supabase. Throws on failure so callers can surface errors. */
export async function saveToSupabase(content: SiteContent): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from("site_content").upsert({
    id: "main",
    data: content,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
}

/**
 * Upload an image Blob to Supabase Storage.
 * Returns the permanent public URL on success, or null on failure.
 */
export async function uploadImage(blob: Blob): Promise<string | null> {
  if (!supabase) return null;
  try {
    const ext = blob.type === "image/png" ? "png" : "jpg";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { data, error } = await supabase.storage
      .from(IMAGES_BUCKET)
      .upload(path, blob, { contentType: blob.type, upsert: false });

    if (error) throw new Error(error.message);

    const {
      data: { publicUrl },
    } = supabase.storage.from(IMAGES_BUCKET).getPublicUrl(data.path);

    return publicUrl;
  } catch (err) {
    console.error("[store] uploadImage:", err);
    return null;
  }
}

/* ---------- Public save API ---------- */

/**
 * Save content to Supabase (primary) and update the localStorage cache.
 * This is the main save function used by the admin panel.
 */
export async function saveContent(
  c: SiteContent
): Promise<{ ok: boolean; error?: string }> {
  if (!isBrowser()) return { ok: false, error: "Not in browser" };
  try {
    await saveToSupabase(c);
    cacheContent(c);
    return { ok: true };
  } catch (err) {
    // Supabase failed — try to at least cache locally
    cacheContent(c);
    const msg =
      err instanceof Error ? err.message : "Failed to save to database";
    console.error("[store] saveContent:", msg);
    return {
      ok: false,
      error: supabase
        ? `Database error: ${msg}`
        : "Database not configured — saved locally only.",
    };
  }
}

/* ---------- Reset ---------- */

export async function resetContent() {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEY);
  if (supabase) {
    try {
      await supabase
        .from("site_content")
        .upsert({ id: "main", data: defaultContent });
    } catch {
      // best-effort
    }
  }
  window.dispatchEvent(new Event("empirical:content-updated"));
}

/* ---------- Auth helpers (local, no backend needed) ---------- */

const ADMIN_KEY = "empirical-admin-token";
const ADMIN_PASSWORD = "empirical2024";

function mintLocalToken(): string {
  const expiry = Math.floor(Date.now() / 1000) + 8 * 3600;
  const header = btoa(JSON.stringify({ alg: "local" })).replace(/=/g, "");
  const body = btoa(JSON.stringify({ role: "admin", exp: expiry })).replace(
    /=/g,
    ""
  );
  return `${header}.${body}.local`;
}

export function isAdmin(): boolean {
  if (!isBrowser()) return false;
  const token = localStorage.getItem(ADMIN_KEY);
  if (!token) return false;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return false;
    const padded = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padding = (4 - (padded.length % 4)) % 4;
    const decoded = atob(padded + "=".repeat(padding));
    const payload = JSON.parse(decoded);
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      localStorage.removeItem(ADMIN_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function loginAdmin(pw: string): Promise<boolean> {
  if (pw !== ADMIN_PASSWORD) return false;
  localStorage.setItem(ADMIN_KEY, mintLocalToken());
  return true;
}

export function logoutAdmin() {
  localStorage.removeItem(ADMIN_KEY);
}

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}
