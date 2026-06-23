const express = require("express");
const router = express.Router();
const { createClient } = require("@supabase/supabase-js");
const { requireAuth } = require("../middleware/auth");

// Use the service role key — full DB access, only used server-side
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const CONTENT_ID = 1; // single-row content record

/**
 * GET /api/content
 * Public — fetch current site content
 */
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("site_content")
      .select("data, updated_at")
      .eq("id", CONTENT_ID)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // Row not found — return empty
        return res.status(404).json({
          error: "Not Found",
          message: "No site content found. Initialize it via POST /api/content.",
        });
      }
      throw error;
    }

    return res.json({
      content: data.data,
      updatedAt: data.updated_at,
    });
  } catch (err) {
    console.error("[GET /api/content] Error:", err.message);
    return res.status(500).json({ error: "Internal Server Error", message: err.message });
  }
});

/**
 * POST /api/content
 * Protected (admin JWT required) — upsert site content
 * Body: { content: SiteContent }
 */
router.post("/", requireAuth, async (req, res) => {
  const { content } = req.body;

  if (!content || typeof content !== "object") {
    return res.status(400).json({
      error: "Bad Request",
      message: "Request body must include a 'content' object.",
    });
  }

  try {
    const { error } = await supabase.from("site_content").upsert({
      id: CONTENT_ID,
      data: content,
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;

    return res.json({ message: "Site content saved successfully." });
  } catch (err) {
    console.error("[POST /api/content] Error:", err.message);
    return res.status(500).json({ error: "Internal Server Error", message: err.message });
  }
});

/**
 * DELETE /api/content
 * Protected (admin JWT required) — delete/reset content row
 */
router.delete("/", requireAuth, async (req, res) => {
  try {
    const { error } = await supabase
      .from("site_content")
      .delete()
      .eq("id", CONTENT_ID);

    if (error) throw error;

    return res.json({ message: "Site content reset successfully." });
  } catch (err) {
    console.error("[DELETE /api/content] Error:", err.message);
    return res.status(500).json({ error: "Internal Server Error", message: err.message });
  }
});

module.exports = router;
