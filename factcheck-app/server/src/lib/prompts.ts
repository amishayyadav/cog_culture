export const CLAIM_EXTRACTION_PROMPT = (document: string) => `You are a meticulous fact-checking assistant. Extract every verifiable factual claim from the document below.

A "claim" is any statement that can be objectively verified against external public data:
- Statistics (e.g., "70% of users prefer X")
- Dates (e.g., "founded in 2015", "launched in Q1 2024")
- Financial figures (e.g., "$5B revenue in 2023", "valued at $10B")
- Technical specs (e.g., "processes 1M requests/sec", "trained on 13T tokens")
- Superlatives ("largest", "first", "fastest", "most popular")
- Named-entity claims ("X is the CEO of Y", "X acquired Y")
- Market size / growth claims ("$200B market by 2027")

IGNORE: opinions, marketing fluff, future predictions about the brand itself, tautologies, self-referential statements, "we believe…", and obviously hypothetical examples.

Prioritize claims that are PRECISE (specific numbers, dates, named entities) over vague claims.

Return ONLY a JSON array. Each object MUST have:
- "claim": a clear, standalone factual statement (rewrite for searchability)
- "type": one of [stat, date, financial, technical, superlative, entity, market]
- "original_quote": exact text from the document
- "page": page number (integer; use 1 if unknown)

Document:
---
${document}
---

Return ONLY the JSON array, no prose, no markdown fences.`;

export const VERIFICATION_PROMPT = (
  claim: string,
  originalQuote: string,
  claimType: string,
  today: string,
  evidence: string,
) => `You are a strict, evidence-driven fact-checker. Compare the CLAIM against the WEB EVIDENCE.

CLAIM: ${claim}
ORIGINAL QUOTE: "${originalQuote}"
CLAIM TYPE: ${claimType}
TODAY'S DATE: ${today}

WEB EVIDENCE (search results):
---
${evidence}
---

Verdict rules (apply strictly):
1. "Verified" — at least 2 independent sources confirm the claim within 5% numeric tolerance AND data is current (within ~2 years for stats, exact for dates/entities).
2. "Inaccurate" — claim is partially correct but stat/date/figure is wrong, outdated, off by >5%, or contradicted by more recent data. Provide the correct value.
3. "False" — no credible evidence supports it OR evidence directly contradicts it.
4. If web evidence is empty or irrelevant, default to "False" (not "Verified").
5. NEVER fabricate an evidence_url. It must come verbatim from the WEB EVIDENCE block above.
6. For superlatives/entities, "Verified" requires explicit confirmation, not inference.

Return ONLY this JSON object (no markdown fences):
{
  "verdict": "Verified" | "Inaccurate" | "False",
  "confidence": <float 0.0-1.0>,
  "correct_value": "<the actual fact, or null if Verified>",
  "evidence_url": "<URL from evidence, or null>",
  "explanation": "<1-2 sentence reasoning citing the evidence>"
}`;
