import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://dptzxtuyraeeftesuzuy.supabase.co";
const supabaseAnonKey =
  process.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_95pJROXUd3qvlNHJ-iASUA_ugEqOJSx";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testStorage() {
  console.log("Testing Supabase Storage...");
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) {
      console.error("Error listing buckets:", error.message);
    } else {
      console.log("Buckets found:", buckets);
      const siteImages = buckets.find(b => b.name === "site-images");
      if (siteImages) {
        console.log("site-images bucket exists! Public status:", siteImages.public);
      } else {
        console.log("site-images bucket does NOT exist!");
      }
    }
  } catch (err) {
    console.error("Failed to connect to storage:", err);
  }
}

testStorage();
