import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://dptzxtuyraeeftesuzuy.supabase.co";
const supabaseAnonKey =
  process.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_95pJROXUd3qvlNHJ-iASUA_ugEqOJSx";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInsertInt() {
  console.log("Testing insert/upsert into 'site_content' with integer ID...");
  try {
    const { data, error } = await supabase.from("site_content").upsert({
      id: 1,
      data: { test: true },
      updated_at: new Date().toISOString()
    }).select();

    if (error) {
      console.error("Upsert failed:", error.message);
    } else {
      console.log("Upsert succeeded! Data:", data);
    }
  } catch (err) {
    console.error("Exception during upsert:", err);
  }
}

testInsertInt();
