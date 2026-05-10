# GEO Product Strategy Deck — Source Influence Engine

> **How to use this file:** Paste this entire markdown into [Gamma.app](https://gamma.app) → "Import / paste in text" — Gamma auto-generates a designed deck in ~60 seconds. Each `---` is a slide break. Speaker notes follow each slide under `> Speaker notes:`.
>
> Alternative: run `python build_pptx.py` to generate a basic `.pptx` file.

---

# Source Influence Engine
### Closing the loop between content and LLM citations

A new feature for GEO — the analytics platform that measures and grows brand visibility on ChatGPT, Perplexity, Gemini, Claude, and beyond.

**Eeshu Yadav · May 2026**

> Speaker notes: Open with the one-liner. Today's GEO tools tell brands *whether* they're cited. Source Influence Engine tells them *how to get cited more* — and proves the content they ship actually moved the needle.

---

## The new front door of the internet is no longer Google

- **800M+** weekly ChatGPT users (OpenAI, Q1 2026)
- **~25%** of Google searches now show an AI Overview before any blue link
- **~60%** of all searches are now "zero-click" — the answer is the result
- Perplexity, Claude, Gemini, Copilot each carving share of the answer layer
- For brands: every query you used to win on SEO is now an answer-slot battle

> Speaker notes: Anchor the audience in *why* GEO is a category at all. The shift isn't theoretical anymore — Gartner and SimilarWeb both confirm zero-click is now the majority. *Verify exact numbers from primary sources before presenting.*

---

## The problem brands actually have

> "We don't know if we're being cited, why we're being cited, or what to do about it."
> — *Head of Brand, B2B SaaS company, $200M ARR*

Three pains, in order:

1. **Visibility gap** — "Are LLMs even mentioning us?"
2. **Causation gap** — "When we ship content, does anything change?"
3. **Action gap** — "Even if we know we're losing, what do we do tomorrow?"

Today's GEO tools solve #1. **#2 and #3 are wide open.**

> Speaker notes: This is the wedge. Don't compete on visibility tracking — that's commoditizing fast. Compete on attribution + action.

---

## Today's GEO market — quick map

| Tool | Strength | Gap |
|---|---|---|
| **Profound** | Enterprise-grade, deep LLM coverage | Reporting, not action |
| **Peec AI** | EU-friendly, prompt-level monitoring | Limited integrations |
| **Otterly.AI** | Simple, affordable mention tracking | Shallow source analysis |
| **AthenaHQ** | Agentic monitoring, fast iteration | Early; small data set |
| **BrandRank.AI** | Sentiment + share-of-voice | No content attribution |
| **Scrunch AI** | Agent traffic + visibility analytics | New entrant; evolving |
| **Semrush / Ahrefs (AI add-ons)** | Distribution to existing SEO base | Bolted on, not native |

**Common gap:** all six measure outputs. None close the loop between **what brands publish** and **what LLMs cite**.

> Speaker notes: Don't trash competitors — credit them. The story is *category complement*, not displacement. *Verify each row on each company's website before pitching.*

---

## Where the real money goes — and why citations matter

LLMs answer from a **finite, biased set of sources**:

- **~40%** of citations come from Wikipedia, Reddit, and a handful of authoritative news/analyst sites *(directional — varies by category)*
- **Long-tail blogs** are cited less than 5% of the time
- **First-party brand sites** are cited heavily for navigational queries, almost never for comparative ones
- **Reviews / G2 / Trustpilot** dominate B2B SaaS comparisons

**The implication:** if you're not in the *source* the LLM reads, you're invisible — no matter how much SEO content you ship.

> Speaker notes: This is the conceptual setup for the feature. Brands have been solving the wrong problem — optimizing their *own* domain — when the leverage is on the *sources* LLMs actually consume.

---

## Introducing: Source Influence Engine (SIE)

A new module inside GEO that answers three questions:

1. **Where do LLMs get their answers about us and our category?**
2. **Where are we present, and where are competitors winning instead?**
3. **What is the highest-leverage action we can take this week?**

> Speaker notes: The naming of the feature can change in user testing. Concept first, name second.

---

## How it works — under the hood

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Prompt corpus   │────▶│   LLM polling    │────▶│ Citation parser  │
│  (auto + custom) │     │ ChatGPT/Perp/Gem │     │  (URLs + spans)  │
└──────────────────┘     └──────────────────┘     └──────────────────┘
                                                            │
                                                            ▼
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Action engine   │◀────│   Influence      │◀────│  Source graph    │
│ (recommendations)│     │   scoring        │     │ (sources × LLMs) │
└──────────────────┘     └──────────────────┘     └──────────────────┘
        │
        ▼
┌──────────────────────────────────────────────┐
│ "Pitch this G2 review · Update Wikipedia X · │
│  Earn citation in TechCrunch piece on Y"     │
└──────────────────────────────────────────────┘
```

**Influence score** = `cite_frequency × LLM_coverage_breadth × recency_weight × topical_relevance`

> Speaker notes: Influence scoring is the moat. It needs ground-truth labeling and tuning — talk about the data flywheel here.

---

## What the user sees

**1. Source Influence Map** — interactive graph of the top 100 sources LLMs cite in your category, sized by influence, colored by your presence (green = you, red = competitor, gray = neither).

**2. Gap Report** — ranked list of high-influence sources where competitors are present but you are not, with confidence-weighted projected lift.

**3. Action Queue** — concrete weekly tasks ranked by ROI:
   - "Pitch a quote to *The Verge*'s next AI roundup (cited 47× by Perplexity in last 90 days)"
   - "Refresh your Wikipedia page — outdated funding number is being repeated by ChatGPT"
   - "Earn one G2 review with the keyword 'compliance' — 12 competitor citations trace to this query"

**4. Attribution Timeline** — when you ship a piece of content, SIE tracks citation pickup across LLMs over time.

> Speaker notes: Walk through wireframes here. The Action Queue is the killer view — it's what marketing leaders will actually open every Monday.

---

## Why this is defensible

1. **Data moat** — 90 days of multi-LLM citation history per category is hard to recreate; we ship now, the graph compounds
2. **Workflow lock-in** — once Action Queue is integrated into the marketing standup, switching costs are high
3. **Attribution wedge** — only tool that closes the loop from publish → citation → revenue
4. **Distribution** — sell into the same buyer (CMO / Head of Brand) who is already paying for GEO basics

> Speaker notes: The defensibility question always comes up. Lead with the data flywheel.

---

## 3-month plan — ship the wedge

| Month | Milestone | Success metric |
|---|---|---|
| **M1** (Jun '26) | MVP: ChatGPT-only Source Influence Map for 3 design-partner categories | 3 paying design partners @ $1k/mo |
| **M2** (Jul '26) | Add Perplexity + Gemini · Daily refresh · Gap Report v1 | 10 paying customers · NPS ≥ 40 |
| **M3** (Aug '26) | Action Queue v1 · Attribution timeline (beta) · Self-serve onboarding | $25k MRR · 2 published case studies |

**Bet:** if 3 design partners renew at month 3, the feature works.

> Speaker notes: Tight, founder-led GTM. Design partners pay something — never give it free, or you can't measure value.

---

## 12-month plan — own the action layer

| Quarter | Theme | Outcome |
|---|---|---|
| **Q3 '26** | Wedge ship | $25k MRR · feature parity with prompt-tracking competitors |
| **Q4 '26** | Attribution closes loop | Content → citation tracking GA · HubSpot + WordPress integrations · $100k MRR |
| **Q1 '27** | Workflow integration | Slack + Salesforce alerts · API · self-serve teams plan · $250k MRR |
| **Q2 '27** | Enterprise | SSO · white-label · dedicated CSM · 5 enterprise logos · **$500k MRR / $6M ARR run rate** |

> Speaker notes: Aggressive but realistic for a focused GEO play in 2026. Tie milestones to hiring plan and capital plan.

---

## Monetization

**Tiered SaaS, prompt-volume + seats:**

| Tier | Price | Brands | Prompts/day | Sources tracked | Action Queue | Attribution | Integrations |
|---|---|---|---|---|---|---|---|
| **Starter** | $99 / mo | 1 | 50 | 25 | – | – | – |
| **Growth** | $499 / mo | 5 | 500 | 250 | ✓ | ✓ | HubSpot, WordPress |
| **Scale** | $1,999 / mo | 25 | 2,500 | unlimited | ✓ | ✓ | + Slack, Salesforce, API |
| **Enterprise** | from $5,000 / mo | custom | custom | custom | ✓ | ✓ | + SSO, white-label, CSM |

**Add-ons:**
- API access (Starter / Growth) — $199 / mo
- Competitor pack (deep dossier on up to 10 rivals) — $299 / mo
- White-label reporting — $999 / mo

**Modeled outcome (12 months):** ~50 Starter, ~30 Growth, ~10 Scale, ~5 Enterprise → ~$520k MRR · ~$6.2M ARR run rate.

> Speaker notes: Pricing should be tested. Land at Growth, expand to Scale on attribution + integrations.

---

## North-star metric & guardrails

**North star:** *Verified citations earned per customer per month* (VCEPM)

This is the single number that captures whether the product is doing its job — measurable, defensible, ties directly to renewal.

**Guardrails:**
- **Time-to-first-action** ≤ 10 minutes from signup
- **Action acceptance rate** ≥ 30% (% of recommended actions a customer attempts)
- **Customer-reported lift** ≥ 2× citation count after 90 days

> Speaker notes: Don't pick "sessions" or "MRR" as a north star — those are lagging. VCEPM is the leading indicator that *predicts* renewal.

---

## Risks & mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| LLM providers block scraping / change citation formats | High | Multi-source ingestion · partnerships where possible · graceful degradation |
| Incumbent SEO tools (Semrush, Ahrefs) ship competing native features | High | Speed of execution · attribution + action are hard for them to bolt on |
| Action recommendations feel generic | Medium | Tight category coverage at launch (3 verticals) · human-in-the-loop tuning |
| Citation data is noisy / hallucinated by LLMs | Medium | Confidence scores · cross-LLM corroboration · UI surfaces uncertainty |
| Pricing too high for SMB | Low | Starter tier protects entry; upsell on attribution value |

> Speaker notes: Address the obvious objection (incumbents) head-on — credibility points.

---

## The ask

**Greenlight 3 months, 1 PM, 2 engineers, 1 data scientist.**

By **August 2026** we'll have:

- 10 paying customers
- $25k MRR
- 2 published case studies showing 2× citation lift
- A defensible data moat in 3 verticals

If those gates clear, we double the team and own the action layer of GEO.

> Speaker notes: End on a clear, conditional ask. Specific gate, specific budget, specific outcome.

---

## Thank you

**Eeshu Yadav** · eeshu.yadav@primathon.in

Questions, debate, demo: happy to go deeper on the influence-scoring model or the design-partner pipeline.
