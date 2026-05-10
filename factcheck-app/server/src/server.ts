import "dotenv/config";
import cors from "cors";
import express from "express";
import { extractRouter } from "./routes/extract.js";
import { verifyRouter } from "./routes/verify.js";

const app = express();
const PORT = Number(process.env.PORT) || 4000;

const allowedOriginsRaw = process.env.ALLOWED_ORIGIN ?? "http://localhost:5173";
const allowedOrigins = allowedOriginsRaw
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow same-origin / curl / server-to-server with no Origin header
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        return cb(null, true);
      }
      cb(new Error(`CORS blocked for origin: ${origin}`));
    },
  }),
);

app.use(express.json({ limit: "2mb" }));

app.get("/", (_req, res) => {
  res.json({
    service: "factcheck-server",
    status: "ok",
    endpoints: ["GET /health", "POST /api/extract", "POST /api/verify"],
  });
});

app.get("/health", (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.use("/api/extract", extractRouter);
app.use("/api/verify", verifyRouter);

app.listen(PORT, () => {
  console.log(`✅ factcheck-server listening on :${PORT}`);
  console.log(`   Allowed origins: ${allowedOrigins.join(", ")}`);
});
