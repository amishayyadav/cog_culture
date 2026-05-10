import { useMemo, useRef, useState } from "react";
import type { Claim, Result, Verdict } from "./types";

type Phase = "idle" | "extracting" | "verifying" | "done" | "error";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

const VERDICT_STYLE: Record<
  Verdict,
  { dot: string; bg: string; ring: string; label: string }
> = {
  Verified: {
    dot: "bg-emerald-500",
    bg: "bg-emerald-50",
    ring: "ring-emerald-200",
    label: "text-emerald-700",
  },
  Inaccurate: {
    dot: "bg-amber-500",
    bg: "bg-amber-50",
    ring: "ring-amber-200",
    label: "text-amber-700",
  },
  False: {
    dot: "bg-rose-500",
    bg: "bg-rose-50",
    ring: "ring-rose-200",
    label: "text-rose-700",
  },
  Pending: {
    dot: "bg-slate-300",
    bg: "bg-white",
    ring: "ring-slate-200",
    label: "text-slate-500",
  },
  Error: {
    dot: "bg-slate-400",
    bg: "bg-slate-100",
    ring: "ring-slate-200",
    label: "text-slate-600",
  },
};

const VERDICT_ORDER: Record<Verdict, number> = {
  False: 0,
  Inaccurate: 1,
  Verified: 2,
  Pending: 3,
  Error: 4,
};

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [maxClaims, setMaxClaims] = useState(20);
  const [phase, setPhase] = useState<Phase>("idle");
  const [statusMsg, setStatusMsg] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const summary = useMemo(() => {
    const total = results.length;
    const verified = results.filter((r) => r.verdict === "Verified").length;
    const inaccurate = results.filter((r) => r.verdict === "Inaccurate").length;
    const falseClaims = results.filter((r) => r.verdict === "False").length;
    return { total, verified, inaccurate, false: falseClaims };
  }, [results]);

  const sortedResults = useMemo(() => {
    return [...results].sort(
      (a, b) =>
        (VERDICT_ORDER[a.verdict] ?? 99) - (VERDICT_ORDER[b.verdict] ?? 99),
    );
  }, [results]);

  function reset() {
    setFile(null);
    setResults([]);
    setError(null);
    setStatusMsg("");
    setProgress(0);
    setPhase("idle");
    if (inputRef.current) inputRef.current.value = "";
  }

  async function run() {
    if (!file) return;
    setError(null);
    setResults([]);
    setProgress(0);
    setPhase("extracting");
    setStatusMsg("Extracting text and identifying claims…");

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("maxClaims", String(maxClaims));

      const extractRes = await fetch(`${API_URL}/api/extract`, {
        method: "POST",
        body: fd,
      });
      if (!extractRes.ok) {
        const j = await extractRes.json().catch(() => ({}));
        throw new Error(j.error ?? `Extraction failed (${extractRes.status})`);
      }
      const { claims } = (await extractRes.json()) as { claims: Claim[] };

      if (!claims.length) {
        throw new Error("No verifiable claims found in this PDF.");
      }

      const initial: Result[] = claims.map((c) => ({
        ...c,
        verdict: "Pending",
        confidence: 0,
        correct_value: null,
        evidence_url: null,
        explanation: "",
      }));
      setResults(initial);
      setPhase("verifying");
      setStatusMsg(`Verifying ${claims.length} claims against the live web…`);

      const concurrency = 3;
      let cursor = 0;
      let completed = 0;

      async function worker() {
        while (cursor < claims.length) {
          const idx = cursor++;
          const claim = claims[idx];
          try {
            const r = await fetch(`${API_URL}/api/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(claim),
            });
            const json = await r.json();
            setResults((prev) => {
              const next = [...prev];
              next[idx] = { ...claim, ...json } as Result;
              return next;
            });
          } catch (e) {
            const msg = e instanceof Error ? e.message : String(e);
            setResults((prev) => {
              const next = [...prev];
              next[idx] = {
                ...claim,
                verdict: "Error",
                confidence: 0,
                correct_value: null,
                evidence_url: null,
                explanation: msg,
              };
              return next;
            });
          } finally {
            completed += 1;
            setProgress(completed / claims.length);
          }
        }
      }

      await Promise.all(
        Array.from({ length: Math.min(concurrency, claims.length) }, worker),
      );
      setPhase("done");
      setStatusMsg(`Done. ${claims.length} claims verified.`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      setPhase("error");
    }
  }

  function downloadJSON() {
    const blob = new Blob([JSON.stringify(sortedResults, null, 2)], {
      type: "application/json",
    });
    triggerDownload(blob, "factcheck_report.json");
  }

  function downloadCSV() {
    const headers = [
      "claim",
      "type",
      "original_quote",
      "page",
      "verdict",
      "confidence",
      "correct_value",
      "evidence_url",
      "explanation",
    ];
    const rows = sortedResults.map((r) =>
      headers
        .map((h) => csvEscape(String((r as Record<string, unknown>)[h] ?? "")))
        .join(","),
    );
    const csv = [headers.join(","), ...rows].join("\n");
    triggerDownload(new Blob([csv], { type: "text/csv" }), "factcheck_report.csv");
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-10">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🔍</span>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Fact-Check Agent
          </h1>
        </div>
        <p className="mt-2 text-slate-600">
          Upload a PDF — we extract every verifiable claim, cross-reference
          against the live web, and flag inaccuracies with evidence URLs.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <label
          htmlFor="pdf"
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-blue-400 hover:bg-blue-50/30"
        >
          <span className="text-4xl">📄</span>
          <span className="mt-3 text-base font-medium text-slate-700">
            {file ? file.name : "Drop a PDF here or click to browse"}
          </span>
          <span className="mt-1 text-xs text-slate-500">
            Marketing collateral · reports · decks · max 25 MB
          </span>
          <input
            ref={inputRef}
            id="pdf"
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>

        <div className="mt-5 flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            Max claims
            <input
              type="number"
              min={5}
              max={40}
              value={maxClaims}
              onChange={(e) =>
                setMaxClaims(
                  Math.max(5, Math.min(40, Number(e.target.value) || 20)),
                )
              }
              className="w-16 rounded-md border border-slate-300 px-2 py-1 text-center"
              disabled={
                phase !== "idle" && phase !== "done" && phase !== "error"
              }
            />
          </label>

          <div className="flex-1" />

          {(phase === "done" || phase === "error") && (
            <button
              onClick={reset}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Reset
            </button>
          )}

          <button
            onClick={run}
            disabled={
              !file || phase === "extracting" || phase === "verifying"
            }
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {phase === "extracting" || phase === "verifying"
              ? "Working…"
              : "🚀 Run fact-check"}
          </button>
        </div>

        {(phase === "extracting" || phase === "verifying") && (
          <div className="mt-5">
            <div className="mb-2 flex justify-between text-xs text-slate-500">
              <span>{statusMsg}</span>
              <span>{Math.round(progress * 100)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${Math.max(progress * 100, 8)}%` }}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            <strong>Error:</strong> {error}
          </div>
        )}
      </section>

      {results.length > 0 && (
        <>
          <section className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            <Stat label="Total claims" value={summary.total} />
            <Stat
              label="✅ Verified"
              value={summary.verified}
              tone="emerald"
            />
            <Stat
              label="⚠️ Inaccurate"
              value={summary.inaccurate}
              tone="amber"
            />
            <Stat label="❌ False" value={summary.false} tone="rose" />
          </section>

          <section className="mt-8 space-y-3">
            {sortedResults.map((r, i) => (
              <ResultCard key={`${r.claim}-${i}`} r={r} />
            ))}
          </section>

          {phase === "done" && (
            <section className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={downloadJSON}
                className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                📥 Download JSON
              </button>
              <button
                onClick={downloadCSV}
                className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                📥 Download CSV
              </button>
            </section>
          )}
        </>
      )}

      {phase === "idle" && results.length === 0 && (
        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            How it works
          </h2>
          <ol className="mt-3 space-y-2 text-sm text-slate-700">
            <li>
              <strong>1. Extract</strong> — pull text from every page of your
              PDF (server-side).
            </li>
            <li>
              <strong>2. Identify claims</strong> — Gemini isolates stats,
              dates, financial / technical figures, named entities, and
              superlatives.
            </li>
            <li>
              <strong>3. Search</strong> — Tavily queries the live web for
              every claim.
            </li>
            <li>
              <strong>4. Verify</strong> — Gemini compares each claim against
              the evidence and assigns a verdict.
            </li>
            <li>
              <strong>5. Report</strong> — color-coded cards, evidence URLs,
              downloadable JSON / CSV.
            </li>
          </ol>
        </section>
      )}

      <footer className="mt-16 text-center text-xs text-slate-400">
        React · Vite · Express · Gemini · Tavily
      </footer>
    </main>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "emerald" | "amber" | "rose";
}) {
  const ring =
    tone === "emerald"
      ? "ring-emerald-200 bg-emerald-50"
      : tone === "amber"
        ? "ring-amber-200 bg-amber-50"
        : tone === "rose"
          ? "ring-rose-200 bg-rose-50"
          : "ring-slate-200 bg-white";
  return (
    <div
      className={`rounded-xl border border-transparent p-4 ring-1 ${ring}`}
    >
      <div className="text-xs uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-3xl font-bold">{value}</div>
    </div>
  );
}

function ResultCard({ r }: { r: Result }) {
  const style = VERDICT_STYLE[r.verdict];
  const isPending = r.verdict === "Pending";
  return (
    <details
      className={`group rounded-xl border border-slate-200 ${style.bg} p-4 ring-1 ${style.ring} transition hover:shadow-sm`}
      open={r.verdict === "False" || r.verdict === "Inaccurate"}
    >
      <summary className="flex cursor-pointer list-none items-start gap-3">
        <span
          className={`mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full ${style.dot} ${
            isPending ? "animate-pulse-soft" : ""
          }`}
        />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-xs font-semibold uppercase ${style.label}`}
            >
              {r.verdict}
            </span>
            {!isPending && (
              <span className="text-xs text-slate-400">
                {Math.round((r.confidence ?? 0) * 100)}% confidence
              </span>
            )}
            <span className="text-xs text-slate-400">· {r.type}</span>
            {r.page && (
              <span className="text-xs text-slate-400">· page {r.page}</span>
            )}
          </div>
          <div className="mt-1 text-sm font-medium text-slate-900">
            {r.claim}
          </div>
        </div>
      </summary>

      <div className="mt-4 space-y-3 border-t border-slate-200 pt-4 text-sm">
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-500">
            Original quote
          </div>
          <blockquote className="mt-1 border-l-2 border-slate-300 pl-3 italic text-slate-700">
            {r.original_quote}
          </blockquote>
        </div>

        {r.correct_value && (
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-500">
              ✅ Correct value
            </div>
            <div className="mt-1 font-medium text-slate-900">
              {r.correct_value}
            </div>
          </div>
        )}

        {r.evidence_url && (
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-500">
              🔗 Evidence
            </div>
            <a
              href={r.evidence_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block break-all text-blue-600 hover:underline"
            >
              {r.evidence_url}
            </a>
          </div>
        )}

        {r.explanation && (
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Reasoning
            </div>
            <div className="mt-1 text-slate-700">{r.explanation}</div>
          </div>
        )}
      </div>
    </details>
  );
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function csvEscape(s: string): string {
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}
