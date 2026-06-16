// Local data store for Empirical Society
// Persisted in localStorage; admin panel writes here, frontend reads.

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
  };
  mentors: Person[];
  faculty: Person[];
  leads: Person[];
  teams: Team[];
  events: EventItem[];
  gallery: GalleryImage[];
};

const STORAGE_KEY = "empirical-society-content-v1";

import { defaultContent } from "./data";
import { supabase } from "./supabase";

export async function fetchFromSupabase(): Promise<SiteContent | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from("site_content").select("data").eq("id", 1).single();

    if (error) {
      if (error.code === "PGRST116") return null; // Not found
      throw error;
    }
    return data.data as SiteContent;
  } catch (err) {
    console.error("Error fetching from Supabase:", err);
    return null;
  }
}

export async function saveToSupabase(content: SiteContent) {
  if (!supabase) return;
  try {
    const { error } = await supabase
      .from("site_content")
      .upsert({ id: 1, data: content, updated_at: new Date() });

    if (error) throw error;
  } catch (err) {
    console.error("Error saving to Supabase:", err);
  }
}

function isBrowser() {
  return typeof window !== "undefined";
}

export function loadContent(): SiteContent {
  if (!isBrowser()) return defaultContent;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultContent;
    const parsed = { ...defaultContent, ...JSON.parse(raw) };
    if (parsed.teams) {
      parsed.teams = parsed.teams.map((t: Team) => {
        if (t.lead && !t.leads) {
          t.leads = [t.lead];
        }
        return t;
      });
    }
    return parsed;
  } catch {
    return defaultContent;
  }
}

export function saveContent(c: SiteContent) {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(c));

  // Sync to Supabase in background if configured
  saveToSupabase(c);

  window.dispatchEvent(new Event("empirical:content-updated"));
}

export function resetContent() {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("empirical:content-updated"));
}

// Admin auth (mock — password gated)
const ADMIN_KEY = "empirical-admin-token";
export const ADMIN_PASSWORD = "empirical2024";

export function isAdmin(): boolean {
  if (!isBrowser()) return false;
  return localStorage.getItem(ADMIN_KEY) === "ok";
}
export function loginAdmin(pw: string): boolean {
  if (pw === ADMIN_PASSWORD) {
    localStorage.setItem(ADMIN_KEY, "ok");
    return true;
  }
  return false;
}
export function logoutAdmin() {
  localStorage.removeItem(ADMIN_KEY);
}

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}
