const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * POST /api/auth/login
 * Body: { password: string }
 * Returns: { token: string, expiresIn: string }
 */
router.post("/login", (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "Bad Request", message: "Password is required." });
  }

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized", message: "Incorrect password." });
  }

  const token = jwt.sign({ role: "admin", iat: Math.floor(Date.now() / 1000) }, JWT_SECRET, {
    expiresIn: "8h",
  });

  return res.json({
    token,
    expiresIn: "8h",
    message: "Login successful.",
  });
});

/**
 * GET /api/auth/me
 * Header: Authorization: Bearer <token>
 * Returns: decoded token payload
 */
router.get("/me", (req, res) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ authenticated: false });
  }

  try {
    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.json({ authenticated: true, user: decoded });
  } catch {
    return res.json({ authenticated: false });
  }
});

/**
 * POST /api/auth/logout
 * Client should discard the token — nothing server-side to invalidate
 * (stateless JWT). Returns a success confirmation.
 */
router.post("/logout", (req, res) => {
  return res.json({ message: "Logged out. Please discard your token on the client." });
});

module.exports = router;
