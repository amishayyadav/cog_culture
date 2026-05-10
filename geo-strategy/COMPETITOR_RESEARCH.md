# GEO Competitor Research — May 2026

> **Important:** Pricing, feature lists, and customer counts below are based on each company's public site as of early 2026. **Verify on the live site before quoting in your deck.** Where I've estimated, it's marked `[verify]`.

---

## Quick comparison matrix

| Tool | HQ | Founded | Tracked LLMs | Update cadence | Starting price | Best for |
|---|---|---|---|---|---|---|
| **Profound** | US | 2023 | ChatGPT, Perplexity, Gemini, Copilot, Claude | Daily | Enterprise, contact sales `[verify]` | Enterprise brand teams |
| **Peec AI** | EU (DE) | 2024 | ChatGPT, Perplexity, Gemini | Daily | ~€89/mo `[verify]` | EU compliance-friendly buyers |
| **Otterly.AI** | EU (AT) | 2023 | ChatGPT, Perplexity, Gemini, Bing AI | Weekly→daily | ~$29/mo `[verify]` | SMB / agencies |
| **AthenaHQ** | US | 2024 | ChatGPT, Perplexity, Gemini, Claude | Daily | ~$99/mo `[verify]` | Early-stage growth teams |
| **BrandRank.AI** | US | 2024 | ChatGPT, Perplexity, Gemini | Daily | Custom | PR / brand sentiment buyers |
| **Scrunch AI** | US | 2024 | Multi-LLM + agent traffic | Daily | Custom | Agent-traffic analytics |
| **Daydream** | US | 2024 | ChatGPT, Perplexity, Gemini | Daily | Custom | Mid-market SaaS |
| **Goodie** | US | 2024 | ChatGPT, Perplexity, Gemini | Daily | ~$99/mo `[verify]` | DTC / e-commerce |
| **Semrush AI Toolkit** | US | 2008 (toolkit 2025) | ChatGPT, Perplexity, Gemini AI Overviews | Daily | Add-on to Semrush | Existing Semrush customers |
| **Ahrefs Brand Radar** | SG | 2010 (radar 2025) | ChatGPT, Perplexity, AI Overviews | Daily | Add-on to Ahrefs | Existing Ahrefs customers |
| **Writesonic GEO Score** | US | 2021 | ChatGPT, Perplexity, Gemini | On-demand | $19/mo (incl. in writing tool) | Content marketers |

---

## Feature deep-dive

### What every player has (commodity)
- Track which prompts mention the brand
- Share-of-voice vs. competitors
- Sentiment polarity (positive / neutral / negative)
- Citation source listing (basic, often as a flat list)
- Weekly / daily prompt re-runs
- Email / Slack alerts on changes

### What only some have (differentiating today)
- **Multi-LLM coverage including Claude + Copilot**: Profound, AthenaHQ
- **Custom prompt corpora at scale (1k+ prompts)**: Profound, Peec
- **Agent traffic analytics** (which AI bots crawl your site): Scrunch, Cloudflare AI Audit
- **Topic clustering of prompts**: Profound, Daydream
- **Geographic + language splits**: Peec (strongest in EU), AthenaHQ
- **Native API / data export**: Profound, AthenaHQ

### What ~nobody has yet (the gap)
- **Source Influence scoring** — ranking the *sources* (not just prompts) by their citation power across LLMs
- **Action recommendations** — tying gaps to concrete weekly tasks
- **Content-to-citation attribution** — closing the loop from publish to LLM pickup
- **Workflow integrations** beyond Slack — HubSpot, Salesforce, Contentful, WordPress
- **Influence-weighted competitor benchmarking** — not "they have more mentions" but "they have more *high-value* mentions"

> This gap is the wedge for **Source Influence Engine**.

---

## Pricing benchmarks (build a chart from this)

| Segment | Typical price range | Notes |
|---|---|---|
| SMB / agency | $29 – $99 / mo | Otterly, Goodie, Writesonic — usually 1 brand, weekly refresh |
| Growth / mid-market | $199 – $999 / mo | AthenaHQ, Peec — multi-LLM, daily refresh, larger prompt sets |
| Enterprise | $2,000 – $10,000+ / mo | Profound, Daydream, BrandRank — custom prompts, integrations, CSM |
| Add-on (existing SEO tool) | bundled | Semrush, Ahrefs, Writesonic — limited depth, but great distribution |

**Implication for SIE pricing:** anchor Growth tier at **$499** (between AthenaHQ and Profound), Scale at **$1,999** (under Profound floor), Enterprise from **$5,000**. Starter at **$99** to compete with Otterly / Goodie for SMB land-and-expand.

---

## Who buys these tools

| Buyer | What they care about | Price ceiling |
|---|---|---|
| **CMO at $50M+ ARR SaaS** | Defensibility, exec reporting, attribution to pipeline | $5k+/mo if it ties to revenue |
| **Head of Brand at consumer / DTC** | Sentiment, share-of-voice vs. rivals | $500-2k/mo |
| **PR / comms lead** | Sentiment shifts, crisis detection | $300-1k/mo |
| **SEO / content lead** | Optimization recommendations | $100-500/mo |
| **Agency** | White-label reports for clients | $200-1k/mo per client |

The wedge buyer for SIE is the **Head of Brand at growth-stage SaaS** — they have budget, accountability for share-of-voice, and the political will to ship content based on the Action Queue.

---

## Sources to cite in the deck

Use these to back the "current state of AI search" narrative. **Verify each before pasting into the deck:**

- Gartner — "The Future of Marketing 2026" (zero-click trends)
- SimilarWeb — quarterly traffic reports for ChatGPT, Perplexity
- OpenAI blog — usage milestones
- Search Engine Land / Search Engine Journal — AI Overviews coverage data
- Bain — "Generative AI in Marketing" survey
- McKinsey — "The Generative AI Opportunity" report

---

## Questions to anticipate from your audience

1. **"What stops Semrush / Ahrefs from copying this in 6 months?"**
   → Speed + attribution moat. They've bolted on basic GEO already; deep attribution requires net-new architecture they won't prioritize.

2. **"How accurate is the citation data?"**
   → Multi-LLM corroboration + confidence scores. We surface uncertainty, not false certainty.

3. **"Who are the design partners?"**
   → 3 to be signed in M1; pre-commit pipeline already includes [list 3 candidate companies you can credibly approach].

4. **"What's the unit economic story?"**
   → Growth tier @ $499, target gross margin 80%+, CAC payback < 6 months on inbound, < 12 on outbound.

5. **"Why now?"**
   → Zero-click crossed 50% in 2025. Marketing budgets are reallocating from SEO to GEO. Whoever owns the action layer first wins the next 3 years.
