# HireDue ATS Score Checker — Final Implementation Plan

**Status:** Ready for engineering
**Branch:** `feature/ats-score-checker`
**Base commit:** `f020f30` (Feature/new landing page #52)
**Applies to:** Current Next.js 15 landing page (`src/`) + external HireDue backend/AWS

> This plan is written against the updated landing page (post-pull `f020f30`) and references
> three companion deliverables already in `docs/`:
> - `ats-score-checker-requirements.md` — product/UX/functional spec (gate-on-auth funnel, dual score, history)
> - `ats-scoring-technical-analysis.md` — exhaustive deterministic rule set; §3.16 recommended MVP rule set
> - `ats-score-checker-poc-summary.md` — validated deterministic scoring engine + determinism guarantees
>
> Nothing in this plan changes existing code. It is the blueprint for a new, additive feature.

---

## Table of Contents
1. [Goal & Guiding Constraints](#1-goal--guiding-constraints)
2. [Where It Lives on the Current Site](#2-where-it-lives-on-the-current-site)
3. [Tech Stack Confirmed](#3-tech-stack-confirmed)
4. [Front-End Build](#4-front-end-build)
   - 4.1 Route & Page
   - 4.2 Feature Folder & Components
   - 4.3 Homepage Integration
   - 4.4 Services & Auth Reuse
5. [Backend Build](#5-backend-build)
   - 5.1 Endpoints
   - 5.2 Scoring Pipeline
   - 5.3 Storage, Quotas & Guardrails
6. [Scoring Rule Set (MVP)](#6-scoring-rule-set-mvp)
7. [Determinism & Testing](#7-determinism--testing)
8. [UI/UX Rules](#8-uiux-rules)
9. [Phasing & Timeline](#9-phasing--timeline)
10. [Open Decisions](#10-open-decisions)
11. [Risks & Mitigations](#11-risks--mitigations)

---

## 1. Goal & Guiding Constraints

**Goal:** Give candidates a **deterministic, explainable ATS score (0–100)** on the HireDue landing
page that (a) converts anonymous traffic into signed-up users and (b) reuses the existing stack,
auth, and subscription system.

**Non-negotiable constraints (POC §10, technical-analysis §9):**
1. The numerical score is **rule-driven and reproducible** — no LLM/AI/randomness/timestamps in the number.
2. **Gate-on-authentication:** an anonymous visitor may upload a resume (stored temporarily) but sees
   **no score, preview, verdict, or analysis** until they sign up / log in (requirements C4 / Auth-1).
3. Same normalized resume + same `scoringVersion` ⇒ same score.
4. Paid subscription gating stays in place (requirements C3 + C2).
5. **JD matching is out of scope** for the generic score (POC §6); generic = ATS-compatibility only.

---

## 2. Where It Lives on the Current Site

Per requirements O1/O2, use a **standalone page + home entry points**, not a modal:

| Surface | Placement | Purpose |
|---|---|---|
| **New route** `src/app/ats/page.jsx` | App Router, alongside `feature/`, `download/`, etc. | SEO/growth landing for "Scan My Resume" |
| **Navbar** link | Add `{ label: "ATS Score", href: "/ats" }` to `nav.links` in `src/lib/navigation-content.js` | Discoverability |
| **Footer** "Pages" column | Add "ATS Score" → `/ats` in `footer.columns` (same file) | Discoverability |
| **New homepage section** `AtsChecker` | Insert between `<Features />` and `<Overview />` in `src/app/page.jsx` | Inline upload + CTA on the homepage funnel |
| **Hero (optional)** | Secondary CTA "Check your ATS Score" → `/ats` (add to `hero` in `src/lib/content.js`) | High-visibility activation |

All copy lives in `src/lib/content.js` (add an `atsChecker` object) so no strings are hard-coded
into components — matching the existing pattern where section text is centralized.

---

## 3. Tech Stack Confirmed

**Frontend (this repo):**
- Next.js 15.3.1 (App Router, React 18, `.jsx`, Turbopack dev).
- Tailwind CSS v4 (config-less) + design-system tokens + `t-h*`/`container-page` utilities.
- framer-motion + `spring()` helper; `lucide-react` icons; custom assets via `@/lib/assets`.
- Aliased imports (`@/lib/...`, `@/components/...`, `@/features/...`, `@/utils/...`) — see `jsconfig.json`.
- Auth: existing AWS Cognito `AuthProvider` / `useAuth()` (`src/features/auth/context/AuthContext.jsx`),
  lazy-loaded SDK.
- API: existing `apiClient` (`src/features/auth/services/apiClient.js`) — Bearer + 401→refresh→retry,
  base `NEXT_PUBLIC_BACKEND_API_URL`.
- Subscription gate: `useAuth().hasActiveSubscription`.

**Backend (external HireDue service + AWS):**
- REST at `NEXT_PUBLIC_BACKEND_API_URL` (same used for auth/subscription).
- AWS Cognito (identity), AWS S3 (temp + permanent storage), DB for persistence.
- Deterministic scoring engine — to be built per POC + technical-analysis.

---

## 4. Front-End Build

### 4.1 Route & Page
```
src/app/ats/page.jsx            # server component: SEO metadata + renders <AtsCheckerLanding/>
```
- `export const metadata = createPageMetadata({ title, description, path: "/ats" })` (same as `feature/page.jsx`).
- Page renders each ATS section in order (Hero → Upload/Auth-gate → Score → Breakdown → Keyword → Suggestions → FAQ).

### 4.2 Feature Folder & Components
Follow the existing `src/features/<domain>/` convention (`features/auth`, `features/waitlist`, ...):

```
src/features/ats/
  hooks/useAtsScan.js           # state machine: idle → uploading → awaitingAuth → scanning → result / error
  services/atsService.js        # apiClient calls + raw FormData upload helper (JSON apiClient can't file-upload)
  components/AtsLandingHero.jsx       # what is an ATS score + why it matters (UX-1)
  components/AtsUploadCard.jsx        # drag-and-drop + file picker, PDF/DOCX/TXT validation (C7, UX-8)
  components/AtsInputMode.jsx         # dual path: "Scan my resume" (generic) / "Match to a job" (optional JD) (UX-5, C5)
  components/AtsAuthGate.jsx          # "Sign up / log in to see your ATS score"; no score pre-auth (C4/Auth-1)
  components/AtsScoreMeter.jsx        # animated 0–100 ring; color: <50 red, 50–74 amber, ≥75 green (UX-4, P14)
  components/AtsBreakdown.jsx         # per-section sub-scores + "why" lines (ATS-8, P14)
  components/AtsKeywordReport.jsx     # matched/missing keyword two-pane (UX-3)
  components/AtsSuggestions.jsx       # rule-based + optional LLM rewrites (C9/E9 fallback)
  components/AtsHowCalc.jsx           # disclosed weights + "how is this calculated" (ATS-2, UX-3)
  components/AtsHistoryBar.jsx        # saved scans list + re-scan delta (+N) (P6/P7, subscription-gated)
  components/AtsLoadingState.jsx      # skeleton/progress, "≈ < 10 seconds" (UX-7)
```
- Client components use `"use client"` (matching all interactive components).
- Reuse primitives: `Eyebrow`, `Reveal`, `RevealGroup`, `RevealItem` (`ui/Primitives.jsx`), `ArrowButton`/`SlideButton` (`ui/Button.jsx`). Reuse a `ResumeSheet`-style/animated card visual via `feature-cards.jsx` pattern.

### 4.3 Homepage Integration
1. `src/app/page.jsx` — import and render `<AtsChecker />` between `<Features />` and `<Overview />`.
2. Create `src/components/site/sections/AtsChecker.jsx` — lightweight surface: heading + explainer + inline
   upload card OR a single CTA ("Check your ATS score") that routes to `/ats`; copy from `content.js.atsChecker`.
3. `src/lib/navigation-content.js` — add nav link + footer "Pages" entry → `/ats`.
4. `src/lib/content.js` — add `atsChecker` object (headline, body, upload label, CTA copy, breakdown labels).
5. (Optional) `src/lib/assets.js` — add an `ats` icon/meter graphic following existing `icons`/`marks` shape.

### 4.4 Services & Auth Reuse
- `atsService.js` wraps `apiClient` for JSON endpoints and adds `uploadFile(tokenSource)` using a raw `fetch`
  to `${BACKEND_API_URL}/ats/upload` with `FormData` + `Authorization: Bearer` (mirror `apiClient.js` helpers,
  including importable `BACKEND_API_URL`).
- Auth-gate CTA preserves context: `/signup?returnTo=/ats` and `/login?returnTo=/ats` so users return to the
  scan flow (Auth-4/6). `SignupForm` already reads `useSearchParams`, so only the link target needs setting.
- Reuse `useAuth().hasActiveSubscription` to gate unlimited scans / advanced features (C3).

---

## 5. Backend Build

### 5.1 Endpoints
All under `NEXT_PUBLIC_BACKEND_API_URL` (frontend `apiClient` base). Follow existing response shape
`{ success, data, error, message }` (see `apiClient.js`).

| Method + Path | Purpose | Auth |
|---|---|---|
| `POST /ats/upload` | Accept PDF/DOCX/TXT → store to **private temp S3** keyed by unguessable `upload_token`; return token. Never score pre-auth (C4/Auth-1) | No (IP rate-limited, P11) |
| `POST /ats/claim` | Bind pending S3 upload to account via `upload_token` (Auth-5/O8) | Yes |
| `POST /ats/scan` | Parse → normalize → deterministic score engine → persist report to account | Yes |
| `GET /ats/report/:id` | Full section breakdown + keyword report + suggestions | Yes |
| `GET /ats/history` | Versioned stored scans (C10/ATS-9) | Yes (+ quota gate) |
| `POST /ats/rewrite` *(optional)* | Single LLM wording call; rule fallback on failure (C9/E9) | Yes (+ quota) |

### 5.2 Scoring Pipeline
```
Resume → Parse (PDF/DOCX/TXT text extraction) → Normalize (deterministic cleanup)
→ Deterministic rules (per §6) → Category scores 0–100 → fixed weighted 0–100
→ Explainable breakdown + verdict → (optional single LLM wording call) → persist report
```
- Dual-path: **generic** (structure/completeness/format/impact weighted heavily) and **JD-match**
  (keyword 40% + relevance 20% + structure 15% + completeness 10% + impact 15% — proposed, P1).
  Both converge on one report shape (`requirements §3.9`).
- Parser: **reuse/audit** the existing backend parser HireDue already uses for auto-apply (O6) before building new.

### 5.3 Storage, Quotas & Guardrails
- **Temp S3:** private, keyed by `upload_token`, purged 24–72h if unclaimed (O4); never scored. Optional LLM wording call caps budget.
- **Permanent storage:** after claim, resume + JD + score + parsed data + matched/missing keywords + edits stored
  under the user's account; fully deletable by user (C8).
- **Dedupe:** by normalized-resume hash (impl-plan §5).
- **Quotas:** per-IP / anonymous-token for uploads; authenticated scan quota (paid unlocks more) (P11/Auth-7, C3).

---

## 6. Scoring Rule Set (MVP)

From the recommended MVP universe (`technical-analysis §3.16`), mapped to the current landing page build.
Only `CORE + deterministic` rules drive the number; heuristic/NLP rules stay advisory (POC §7, technical-analysis §3).

| # | Category | Core rules (MVP) | Weight impact |
|---|---|---|---|
| 1 | Parsing & format | format ok, text extracted, empty/near-empty, image-only (all Crit), parse-failure | Critical — gate |
| 2 | Structure | contact/skills/experience/education present; heading machine-readable; missing-major | High |
| 3 | Contact | name, email + format, phone + pattern | High |
| 4 | Experience (structure) | section, company, title, dates present, start/end consistent, missing/invalid dates, current-role | High |
| 5 | Impact & numbers | numbers/metrics, quantified achievements; keyword-stuffing, repetition | High |
| 6 | Skills (generic) | skills section, extraction, duplicate/stuffing; **generic breadth only, small weight** (POC §6) | Small |
| 7 | Education | section, degree, institution, grad-date, missing fields | Med |
| 8 | Formatting/layout | multi-column, tables, text-boxes, image-only, page-count | Med/High |
| 9 | Completeness | contact, experience, education, dates, titles, companies, descriptions | High |
| 10 | Risk flags | ATS-risk indicators surfaced as **information only**, never auto-penalties | Info |

**Category → 0–100 → weighted → final rounded integer (0–100) → verdict.** Every result tagged with `scoringVersion`.

**Explicitly deferred (validate before auto-scoring):** action-verb/outcome heuristics, projects & certifications
grading, deep consistency checks, and **all NLP rules** (technical-analysis §3.16).

---

## 7. Determinism & Testing

**Guarantees (POC §8/§9, technical-analysis §9):**
- No timestamps, randomness, network, or LLM in the number.
- Category score = aggregate of its rules; final = fixed weights; normalized input required.
- Fixed rounding; every change requires a `scoringVersion` bump (POC §10.9).

**CI test suite:**
- **Golden/regression fixtures:** strong, weak/minimal, and near-identical resume variants (POC §9).
- **Determinism test:** same resume ≥ 10× ⇒ identical final score, category scores, rules.
- **Versioning test:** a `scoringVersion` change alters results only via the versioned change (POC §9).
- **Boundary tests:** min/max score, normalization, image-only/empty/parse-fail (Crit path).
- **Storage lifecycle test:** temp upload purge (24–72h), claim reconciliation, delete-ability (C8).
- **Resilience test:** LLM wording call fails ⇒ rule-based suggestions still returned (C9/E9).

---

## 8. UI/UX Rules

Grounded in `requirements §3.7` UX items:
- **Gate-on-auth (non-negotiable):** no score/preview/verdict before login (UX-2). Auth-gate explains value + signup/login.
- **Explainable:** titled reasons + matched/missing lists; disclosed weights via "How is this calculated" (UX-3, ATS-2).
- **Color semantics:** red < 50, amber 50–74, green ≥ 75 with large animated number (UX-4).
- **Two input paths:** "Scan my resume" + "Match to a job" (JD optional), both from one page (UX-5, C5).
- **Loading state:** skeleton/progress, "≈ < 10 seconds" expectation (UX-7).
- **Mobile-first:** drag-drop falls back to file picker; two-pane collapses to stacked cards (UX-8).
- **Reset/restart:** clear way to start over with a new resume / clear JD input (UX-10).
- **Accessibility:** charts also conveyed as text/tables; keyboard navigable (UX-13).
- **Subscription gating:** advanced/history/unlimited scans gated by `hasActiveSubscription` (C3).

---

## 9. Phasing & Timeline

**Phase 0 — Skeleton & content (no backend dependency):**
- Add `content.js.atsChecker`, `assets.js` icon, nav/footer links.
- Scaffold `/ats` page + all component shells (empty/placeholder) using existing primitives.
- Add homepage `AtsChecker` section + homepage entry in `page.jsx`.
- *No behavior; pure UI shell matching the new landing page design.*
- **Effort:** ~2–3 days.

**Phase 1 — Upload + auth-gate (backend P0):**
- Backend: `POST /ats/upload` (temp S3 + `upload_token`, IP rate-limit), `POST /ats/claim`, parser reuse/audit.
- Frontend: `AtsUploadCard`, validation, `AtsAuthGate`, `/signup|/login?returnTo=/ats` handoff.
- **Hard gate verified:** no score/surface pre-auth.
- **Effort:** ~3–5 days.

**Phase 2 — Scoring + display (backend P1):**
- Backend: deterministic score engine (MVP rule set §6) + `POST /ats/scan` + `GET /ats/report/:id` + persistence.
- Frontend: `AtsScoreMeter`, `AtsBreakdown`, `AtsKeywordReport`, `AtsSuggestions`, `AtsHowCalc`.
- Determinism tests in CI (golden fixtures). Product sign-off on weights (P1) + verdict thresholds (P2).
- **Effort:** ~5–8 days.

**Phase 3 — Persistence + monetization + polish (backend P2):**
- Backend: `GET /ats/history` (versioned), quotas, temp-purge 24–72h, optional `POST /ats/rewrite` (LLM wording).
- Frontend: save-to-history, re-scan delta (+N), subscription gating via `hasActiveSubscription`,
  graceful degradation when LLM fails.
- **Effort:** ~4–6 days.

**Total: ~2.5–4 weeks** depending on parser reuse and product sign-off timing.

---

## 10. Open Decisions

| ID | Question | Recommendation | Owner |
|---|---|---|---|
| O3 | Scoring engine: self-hosted rule-based vs third-party vs LLM-assisted? | **Hybrid** — deterministic core + optional LLM wording only (bounds latency/cost) | Engineering + Product |
| O1 | Standalone page vs modal? | **Standalone `/ats` page** + home entry points | Product |
| O4 | Pending-upload retention window? | Purge unclaimed after 24–72h; IP/token limiting | Engineering |
| O6 | Reuse existing auto-apply parser? | **Audit reuse before building a new parser** — highest-leverage spike | Engineering |
| O8 | How to reconcile pending S3 upload after sign-up? | Keep server-side S3 ref across session (survives login), reconcile on claim | Engineering |
| P1 | Final weights (Generic & JD-match)? | Use proposed weights (§5.2), validate with real distribution | Product |
| P2 | Verdict thresholds? | 0–49 / 50–74 / 75–89 / 90–100 | Product |
| P3 | Free/paid scan quotas? | TBD counts; no pre-auth scoring exists | Product |

---

## 11. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| LLM drift in score if it touches the number | Trust + determinism break | **LLM worded-only, rules drive the 0–100** (POC §7); golden tests enforce |
| Upload abuse / S3 cost | Cost + abuse | IP/anonymous-token limits, temp-purge 24–72h, dedupe by hash (P11, O4) |
| Parser misreads complex layouts (tables/columns/scanned) | Wrong section extraction → wrong category scores | Parseability is **critical-gated**; explicit two-column/table/scanned test corpus (technical-analysis spike P) |
| Rule/weight change silently alters old reports | Confusing history | `scoringVersion` per change; reports tagged with version (POC §10.9) |
| Feature scope creep (JD-match, AI rewrites, history) | Schedule slip | Phase 3 items only after Phases 1–2 ship; JD-match is its own capability (POC §6) |
| Parser/engine reuse unclear | Rebuild effort | Spikes (P parser, W weights, L LLM) de-risk before Phase 2 (requirements appendix B.5) |
| Subscription-gating conflicts with funnel | Conversion drop | Keep gate after score for advanced tools only; basic score stays free per existing plan model (C3) |

---

**Reference docs (unchanged):**
`docs/ats-score-checker-requirements.md` · `docs/ats-scoring-technical-analysis.md` · `docs/ats-score-checker-poc-summary.md`
---