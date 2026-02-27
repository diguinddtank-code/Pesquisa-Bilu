import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("feedback.db");

// Initialize DB
db.exec(`
  CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    q1 TEXT,
    q2 TEXT,
    q3 TEXT,
    q4 TEXT,
    q5 TEXT,
    q6 TEXT,
    q7 TEXT,
    q8 TEXT,
    q9 TEXT,
    q10 TEXT,
    language TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.post("/api/feedback", (req, res) => {
    const { q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, language } = req.body;
    try {
      const stmt = db.prepare(`
        INSERT INTO feedback (q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, language)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, language);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to save feedback" });
    }
  });

  app.get("/api/feedback", (req, res) => {
    try {
      const stmt = db.prepare("SELECT * FROM feedback ORDER BY created_at DESC");
      const rows = stmt.all();
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch feedback" });
    }
  });

  app.post("/api/feedback/reset", (req, res) => {
    console.log("POST /api/feedback/reset called");
    try {
      const result = db.prepare("DELETE FROM feedback").run();
      console.log("Deleted rows:", result.changes);
      res.json({ success: true, deleted: result.changes });
    } catch (err) {
      console.error("Error deleting feedback:", err);
      res.status(500).json({ error: "Failed to delete feedback" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
