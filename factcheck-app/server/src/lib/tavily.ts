import type { TavilyResult } from "./types.js";

export async function tavilySearch(
  query: string,
  maxResults = 5,
): Promise<TavilyResult[]> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    throw new Error("TAVILY_API_KEY is not set");
  }

  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      max_results: maxResults,
      search_depth: "advanced",
      include_answer: false,
    }),
  });

  if (!res.ok) {
    throw new Error(
      `Tavily search failed: ${res.status} ${await res.text()}`,
    );
  }

  const json = (await res.json()) as { results?: TavilyResult[] };
  return json.results ?? [];
}

export function formatEvidence(results: TavilyResult[]): string {
  if (!results.length) return "No web results found.";
  return results
    .map((r, i) => {
      const snippet = (r.content ?? "").slice(0, 600);
      return `[${i + 1}] URL: ${r.url}\nTitle: ${r.title ?? ""}\nSnippet: ${snippet}`;
    })
    .join("\n\n");
}
