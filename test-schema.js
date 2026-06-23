

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://dptzxtuyraeeftesuzuy.supabase.co";
const supabaseAnonKey =
  process.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_95pJROXUd3qvlNHJ-iASUA_ugEqOJSx";

async function fetchSchema() {
  console.log("Fetching API schema...");
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`
      }
    });
    const schema = await res.json();
    const table = schema.definitions && schema.definitions.site_content;
    if (table) {
      console.log("site_content definition:", JSON.stringify(table, null, 2));
    } else {
      console.log("site_content definition not found. Available tables:", Object.keys(schema.definitions || {}));
    }
  } catch (err) {
    console.error("Failed to fetch schema:", err);
  }
}

fetchSchema();
