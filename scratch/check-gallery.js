import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://dptzxtuyraeeftesuzuy.supabase.co";
const supabaseAnonKey = "sb_publishable_95pJROXUd3qvlNHJ-iASUA_ugEqOJSx";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkGallery() {
  console.log("Checking gallery data in Supabase...");
  const { data, error } = await supabase.from("site_content").select("data").eq("id", 1).single();

  if (error) {
    console.error("Error:", error.message);
  } else {
    const content = data.data;
    console.log("Gallery length:", content.gallery ? content.gallery.length : "undefined");
    if (content.gallery && content.gallery.length > 0) {
      console.log("First gallery item:", JSON.stringify(content.gallery[0], null, 2));
    } else {
      console.log("Gallery is empty!");
    }
  }
}

checkGallery();
