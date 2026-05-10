export type ClaimType =
  | "stat"
  | "date"
  | "financial"
  | "technical"
  | "superlative"
  | "entity"
  | "market";

export type Verdict = "Verified" | "Inaccurate" | "False" | "Pending" | "Error";

export type Claim = {
  claim: string;
  type: ClaimType;
  original_quote: string;
  page: number;
};

export type VerificationResult = {
  verdict: Verdict;
  confidence: number;
  correct_value: string | null;
  evidence_url: string | null;
  explanation: string;
};

export type Result = Claim & VerificationResult;
