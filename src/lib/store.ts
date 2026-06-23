// Local data store for The Empirical Society
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

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const ADMIN_KEY = "empirical-admin-token";

import { defaultContent } from "./data";

export async function fetchFromSupabase(): Promise<SiteContent | null> {
  try {
    const res = await fetch(`${API_URL}/api/content`);
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`HTTP error ${res.status}`);
    }
    const data = await res.json();
    return data.content as SiteContent;
  } catch (err) {
    console.error("Error fetching from API:", err);
    return null;
  }
}

export async function saveToSupabase(content: SiteContent) {
  try {
    const token = localStorage.getItem(ADMIN_KEY);
    if (!token) return;
    const res = await fetch(`${API_URL}/api/content`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });

    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  } catch (err) {
    console.error("Error saving to API:", err);
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

export function saveContent(c: SiteContent): { ok: boolean; error?: string } {
  if (!isBrowser()) return { ok: false, error: "Not in browser" };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
  } catch (err: unknown) {
    // Typically a QuotaExceededError — images are too large
    const msg =
      err instanceof Error ? err.message : "localStorage quota exceeded";
    console.error("saveContent failed:", msg);
    return { ok: false, error: "Storage full – try removing some images or using smaller photos." };
  }

  // Sync to backend API in background (best-effort, won't block save)
  saveToSupabase(c);

  window.dispatchEvent(new Event("empirical:content-updated"));
  return { ok: true };
}

export async function resetContent() {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEY);
  try {
    const token = localStorage.getItem(ADMIN_KEY);
    if (token) {
      await fetch(`${API_URL}/api/content`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  } catch (err) {
    console.error("Error resetting content on API:", err);
  }
  window.dispatchEvent(new Event("empirical:content-updated"));
}

const ADMIN_PASSWORD = "empirical2024";

/** Mint a simple local session token valid for 8 hours. */
function mintLocalToken(): string {
  const expiry = Math.floor(Date.now() / 1000) + 8 * 3600;
  const header = btoa(JSON.stringify({ alg: "local" })).replace(/=/g, "");
  const body = btoa(JSON.stringify({ role: "admin", exp: expiry })).replace(/=/g, "");
  return `${header}.${body}.local`;
}

export function isAdmin(): boolean {
  if (!isBrowser()) return false;
  const token = localStorage.getItem(ADMIN_KEY);
  if (!token) return false;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return false;
    // Restore base64 padding before decoding
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

/** Login is entirely local — no backend needed. */
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
