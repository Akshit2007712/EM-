import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isUrlValid = (url: string | undefined) => {
  return url && (url.startsWith("http://") || url.startsWith("https://"));
};

export const supabase = isUrlValid(supabaseUrl)
  ? createClient(supabaseUrl!, supabaseAnonKey || "")
  : null;
