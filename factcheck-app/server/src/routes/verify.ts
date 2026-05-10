import { Router, type Request, type Response } from "express";
import { generateJSON } from "../lib/gemini.js";
import { VERIFICATION_PROMPT } from "../lib/prompts.js";
import { formatEvidence, tavilySearch } from "../lib/tavily.js";
import type { Claim, VerificationResult } from "../lib/types.js";

export const verifyRouter = Router();

verifyRouter.post("/", async (req: Request, res: Response) => {
  try {
    const claim = req.body as Claim;
    if (!claim?.claim) {
      return res.status(400).json({ error: "Missing claim field" });
    }

    let evidence = "";
    try {
      const results = await tavilySearch(claim.claim, 5);
      evidence = formatEvidence(results);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      evidence = `Search error: ${msg}`;
    }

    const today = new Date().toISOString().slice(0, 10);
    const verdict = await generateJSON<VerificationResult>(
      VERIFICATION_PROMPT(
        claim.claim,
        claim.original_quote ?? "",
        claim.type ?? "",
        today,
        evidence,
      ),
      600,
    );

    res.json(verdict);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({
      verdict: "Error",
      confidence: 0,
      correct_value: null,
      evidence_url: null,
      explanation: `Verification error: ${msg}`,
    });
  }
});
