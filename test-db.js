import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://dptzxtuyraeeftesuzuy.supabase.co";
const supabaseAnonKey =
  process.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_95pJROXUd3qvlNHJ-iASUA_ugEqOJSx";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDatabase() {
  console.log("Testing Supabase connection...");
  try {
    const { data, error } = await supabase.from("site_content").select("id").limit(1);

    if (error) {
      console.error(
        'Database connection failed or error fetching from "site_content":',
        error.message,
      );
    } else {
      console.log("Database connected successfully!");
      console.log('Data fetched from "site_content":', data);
    }
  } catch (err) {
    console.error("Failed to connect to the database:", err);
  }
}

checkDatabase();
