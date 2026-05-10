import { Router, type Request, type Response } from "express";
import multer from "multer";
import { generateJSON } from "../lib/gemini.js";
import { CLAIM_EXTRACTION_PROMPT } from "../lib/prompts.js";
import type { Claim } from "../lib/types.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB
});

export const extractRouter = Router();

const MAX_DOC_CHARS = 60_000;
const DEFAULT_MAX_CLAIMS = 20;

extractRouter.post("/", upload.single("file"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const maxClaims = Math.min(
      Math.max(parseInt(String(req.body?.maxClaims ?? "")) || DEFAULT_MAX_CLAIMS, 1),
      40,
    );

    // pdf-parse self-tests on load — use deeper import to avoid that path
    const pdfParse = (await import("pdf-parse/lib/pdf-parse.js")).default;
    const parsed = await pdfParse(req.file.buffer);
    const text = (parsed.text ?? "").trim();

    if (!text) {
      return res.status(422).json({
        error:
          "No extractable text found. The PDF may be a scanned image (OCR not supported).",
      });
    }

    const truncated = text.slice(0, MAX_DOC_CHARS);
    let claims = await generateJSON<Claim[]>(CLAIM_EXTRACTION_PROMPT(truncated));
    if (!Array.isArray(claims)) claims = [];

    // De-duplicate by claim text
    const seen = new Set<string>();
    const unique: Claim[] = [];
    for (const c of claims) {
      const key = (c.claim ?? "").trim().toLowerCase();
      if (key && !seen.has(key)) {
        seen.add(key);
        unique.push(c);
      }
    }

    res.json({
      claims: unique.slice(0, maxClaims),
      docCharCount: text.length,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
});
