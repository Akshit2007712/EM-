// Supabase client for The Empirical Society
// Reads VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from environment.
// If not configured the client is null and the app falls back to localStorage.

import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

function isValidUrl(url: string | undefined): url is string {
  return !!url && (url.startsWith("http://") || url.startsWith("https://"));
}

let _client: SupabaseClient | null = null;

if (isValidUrl(supabaseUrl) && supabaseAnonKey) {
  _client = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn(
    "[Supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not set. " +
      "Content will be stored in localStorage as a fallback."
  );
}

/** The Supabase client – null when env vars are not configured. */
export const supabase: SupabaseClient | null = _client;

/** Name of the public Storage bucket used for all site images. */
export const IMAGES_BUCKET = "site-images";
