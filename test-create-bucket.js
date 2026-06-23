import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://dptzxtuyraeeftesuzuy.supabase.co";
const supabaseAnonKey =
  process.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_95pJROXUd3qvlNHJ-iASUA_ugEqOJSx";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createBucket() {
  console.log("Trying to create 'site-images' bucket...");
  try {
    const { data, error } = await supabase.storage.createBucket("site-images", {
      public: true,
      allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "image/webp"],
      fileSizeLimit: 5242880 // 5MB
    });

    if (error) {
      console.error("Error creating bucket:", error.message);
    } else {
      console.log("Bucket created successfully:", data);
    }
  } catch (err) {
    console.error("Exception during bucket creation:", err);
  }
}

createBucket();
