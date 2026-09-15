# 🙋 Easier Version: How to Build the ATS Score Checker

**Who is this for?** Garima and Simran — this file tells you what to build and who does what.
**Reading time:** ~10 minutes.
**Big picture:** We are adding a new feature called the **ATS Score Checker** to the HireDue
landing page. A user uploads their resume, signs up or logs in, and gets a score out of 100
that says how "ATS-friendly" their resume is. This file breaks the whole job into small,
easy steps.

> This is the simple-to-read version of the bigger plan file:
> `docs/ats-score-checker-implementation-plan.md`
> Keep both. The big plan has all the details; this one tells you the order to work in.

---

## 1. What We Are Building (in one paragraph)

On the HireDue website we will:

1. Let a visitor drop in their resume (PDF, DOCX, or TXT) on a new page called `/ats`.
2. Save that resume to a temp folder on AWS S3 (no scoring yet).
3. Ask them to **Sign up or Log in** — because we never show a score before login.
4. After login, run a **scoring engine** that checks the resume with simple, fixed rules.
5. Show a score from 0–100 plus a breakdown (e.g., "Structure 8/10, Contact 9/10").
6. Save each scan to the user's account so they can see history later.

**Golden rule (never break this):** The score must be the **same every time** for the same
resume. No AI decides the number. AI is only allowed to write friendly "suggestion" words.

---

## 2. Who Does What

| Person | Side | What they own |
|---|---|---|
| **Simran** | **Frontend** (this repo, the website) | New `/ats` page, all the UI boxes (upload, score circle, breakdown), links in the menu/footer, a new section on the homepage, and wiring the upload + login flow. |
| **Garima** | **Backend** (external service + AWS) | The resume upload to S3, the login "claim" step, the **scoring engine** (rules → 0–100), the report that returns the breakdown, history, quotas, and tests. |

Both of you talk to each other at the "handshake" points marked 🔗 below — those are the API
calls that connect the two sides.

---

## 3. The Order to Build Things (both sides at once)

Work in 4 phases. Phase 0 first, then 1, 2, 3. Don't skip ahead.

| Phase | Simran (frontend) | Garima (backend) |
|---|---|---|
| **0. Skeleton** | Make the page and all empty boxes (visuals only) | (nothing yet — read the rule list) |
| **1. Upload + Login** 🔗 | Upload card + "sign up to see score" box | `POST /ats/upload` + `POST /ats/claim` |
| **2. Score + Show** 🔗 | Score circle, breakdown, suggestions | `POST /ats/scan` + `GET /ats/report` |
| **3. Extra + Money** 🔗 | History list, re-scan delta, paywall gate | `GET /ats/history` + `POST /ats/rewrite` |

🔗 = these are the API calls that connect both sides. Simran calls Garima's URLs.

## 4. PHASE 0 — Simran: Make the Empty Pages (2–3 days)

**Goal:** get the website pages and boxes looking right, with no real logic yet.

### Step 4.1 — Add the "ATS Score" link to the menu
File: `src/lib/navigation-content.js`
- Find `nav.links` and add: `{ label: "ATS Score", href: "/ats" }`
- In the `footer.columns` "Pages" list, add: `{ label: "ATS Score", href: "/ats" }`

### Step 4.2 — Add the text we will show
File: `src/lib/content.js`
- Add a new object called `atsChecker` with:
  - a headline (e.g., "How ATS-friendly is your resume?"),
  - a short description,
  - button labels ("Scan my resume", "Sign up to see your score"),
  - the breakdown label ("How is this calculated?").

### Step 4.3 — Make the new page
Create folder + file: `src/app/ats/page.jsx`
- Add SEO `metadata` exactly like `src/app/feature/page.jsx` does.
- Make it render these empty boxes in order:
  1. Hero (title + short "what is an ATS score" text)
  2. Upload card (drag-and-drop area; not wired yet)
  3. "Two input modes" option (generic scan OR "match to a job")
  4. Auth-gate box ("Sign up / Log in to see your ATS score")
  5. Score circle (0–100 ring, not wired yet)
  6. Breakdown list (per-section scores)
  7. Suggestions box

### Step 4.4 — Put a section on the homepage
File: `src/app/page.jsx`
- Import a new component `AtsChecker`.
- Place it between `<Features />` and `<Overview />`.
- Create the component file: `src/components/site/sections/AtsChecker.jsx`
  - A heading + one button that links to `/ats` (label: "Check your ATS score").
  - Use the same styles as other sections: `container-page`, `Eyebrow`, `Reveal`, `ArrowButton`
    (all imported from `src/components/site/ui/`).

> ✅ Phase 0 done when: the `/ats` page exists, boxes are visible, menu link works.

---

## 5. PHASE 1 — Both: Upload + Login Gate (3–5 days)

**Rule:** We never show a score before the user logs in. This is the whole point.

### Simran (frontend) — 5.1
Make a feature folder: `src/features/ats/`
- `services/atsService.js`
  - Calls Garima's `POST /ats/upload` using `fetch` with `FormData` (the file), plus the
    `Authorization: Bearer <token>` header. Reuse the base URL from `apiClient.js`
    (`NEXT_PUBLIC_BACKEND_API_URL`).
- `components/AtsUploadCard.jsx`
  - Drag-and-drop + a "browse" button. Accept only PDF/DOCX/TXT.
  - Show a progress state ("Uploading…") then switch to the "Sign up / Log in" box.
- `components/AtsAuthGate.jsx`
  - When the file is uploaded (but NOT scored), show: "Sign up / Log in to see your ATS score."
  - Two buttons → link to `/signup?returnTo=/ats` and `/login?returnTo=/ats`.
    (This sends them back to the score page after logging in — the signup form already reads
    query params, so it just works.)

### Garima (backend) — 5.2
- `POST /ats/upload` (no login needed)
  - Accept the file, save it to a **private** temp S3 bucket, return a secret `upload_token`.
  - NEVER score here. Add a rate limit per IP so people can't flood your S3.
- `POST /ats/claim` (login needed)
  - After the user logs in, take the `upload_token` and attach that S3 file to their account.

### 🔗 Connect: Simran saves the `upload_token` and sends it to `/claim` after login.

> ✅ Phase 1 done when: a visitor can upload a resume, gets the login box, and after login the
> file is now linked to their account. No score shown yet.

---

## 6. PHASE 2 — Both: The Score (5–8 days)

**This is the heart.** The score engine lives on Garima's side. Simran just shows what comes back.

### Garima (backend) — the scoring engine
- `POST /ats/scan` (login needed)
  1. **Parse** the resume → turn the file into plain text (extract PDF/DOCX/TXT text).
  2. **Normalize** → clean it up: lowercase, fix line breaks/spacing so "AWS" = "aws".
  3. **Run deterministic rules** → check these things (from the big plan, section 6):
     - Parsing OK? (file actually opens and has text)
     - Structure? (has sections: contact, skills, experience, education)
     - Contact? (email + phone present and look real)
     - Experience? (company, title, dates present, not out of order)
     - Impact? (has numbers/percentages; no keyword stuffing)
     - Skills? (has a skills section; no repeats)
     - Education? (degree + school + grad year)
     - Formatting? (no weird tables/columns/images-only)
     - Completeness? (all the big sections filled)
     - Risk flags? (show as warnings, do NOT auto-penalize)
  4. **Score each category 0–100**, then combine with fixed weights → final round number 0–100.
  5. **Tag the result with a `scoringVersion`** (so if rules change later, old scores still make sense).
  6. **Save** the resume + score + breakdown to the user's account.
- `GET /ats/report/:id` (login needed)
  - Returns: overall score, per-section scores, matched/missing keywords, suggestions.

**Remember:** No AI, no randomness, no time-based changes in the number. Same resume +
same version = same score. (Write this as a test — see Phase 2 testing below.)

### Simran (frontend) — show the result
Make these components in `src/features/ats/components/`:
- `AtsScoreMeter.jsx` — big animated ring with the 0–100 number.
  - Color: red if under 50, amber 50–74, green 75+.
- `AtsBreakdown.jsx` — list each section with its sub-score and a one-line "why".
- `AtsKeywordReport.jsx` — two lists: "matched keywords" and "missing keywords".
- `AtsSuggestions.jsx` — show the "how to improve" text Garima sent back.
- `AtsHowCalc.jsx` — a small "How is this calculated?" box that lists the weights (builds trust).

### 🔗 Connect: Simran calls `POST /ats/scan` after login, then `GET /ats/report/:id` to show the result.

### Garima — tests (write these!)
- Same resume 10 times → same score (determinism).
- A "golden" good resume, a weak resume, and two almost-identical ones.
- Reserve: image-only / empty file / unreadable file → should fail gracefully.
- Changing the `scoringVersion` changes old results only in a controlled way.

> ✅ Phase 2 done when: a logged-in user uploads a resume and sees a score + breakdown + suggestions.

---

## 7. PHASE 3 — Both: History, Delta, Paywall (4–6 days)

### Garima (backend)
- `GET /ats/history` (login needed) — return all past scans for the account (versions saved).
- `POST /ats/rewrite` (login + quota) — the ONE place AI is allowed: rewrite bullet wording only.
  If the AI call fails, still return the normal rule-based suggestions (never break the core score).
- Add a quota counter: free users get X scans, paid users get unlimited (final number = product call).

### Simran (frontend)
- `AtsHistoryBar.jsx` — show "Past scans" list; let the user open an old one.
- Re-scan delta: when they rescan after editing, show "+7" vs the old score.
- Paywall gate: check `useAuth().hasActiveSubscription` from
  `src/features/auth/context/AuthContext.jsx`.
  - Free user → basic score, upsell to upgrade.
  - Paid user → history + unlimited + AI rewrites + delta.

> ✅ Phase 3 done when: users can see their past scans, the delta, and paid features are gated
> behind the subscription.

---

## 8. 🔗 The API "Handshake" Between the Two of You

These 6 calls are where you connect. Keep them exactly this shape:

| # | Simran calls (frontend) | Garima provides (backend) | Login? |
|---|---|---|---|
| 1 | `POST /ats/upload` (file → token) | Save to temp S3, return `upload_token` | No |
| 2 | `POST /ats/claim` (token) | Attach the file to the user's account | Yes |
| 3 | `POST /ats/scan` | Parse + score → return report id | Yes |
| 4 | `GET /ats/report/:id` | Return full breakdown + keywords + suggestions | Yes |
| 5 | `GET /ats/history` | Return past scans | Yes |
| 6 | `POST /ats/rewrite` | AI wording (optional, with fallback) | Yes + quota |

**Response format (use this everywhere):** `{ success, data, error, message }`.
That's the same shape the current `apiClient.js` already expects — Simran just reads `data`.

---

## 9. 🧪 "Does It Work?" Checklist (run this before you call it done)

For every phase, tick these:
- [ ] `/ats` page loads and looks right on mobile + desktop.
- [ ] Upload accepts PDF/DOCX/TXT and rejects other files.
- [ ] **No score is ever shown before login** (test this with an incognito window).
- [ ] After login, user goes back to `/ats` (not stranded on a blank page).
- [ ] Same resume scored twice gives the same number (Simran can spot-check, Garima's test enforces).
- [ ] Score circle color matches the rules (red/amber/green).
- [ ] Breakdown + "how it's calculated" visible.
- [ ] Paid user sees history + delta; free user sees the upgrade message.
- [ ] If the AI rewrite fails, the page still shows normal suggestions (no crash).
- [ ] Old scans still open after a rule/weight change (versioning works).
---

## 10. ⚠️ Things to NOT Do (common mistakes)

- ❌ Don't let AI decide the number. Rules decide. AI only writes suggestion words.
- ❌ Don't show the score before login. Store the resume, ask login, score after.
- ❌ Don't use the existing `apiClient.post` for file uploads — it's JSON-only. Use plain `fetch` + `FormData`.
- ❌ Don't leave shared copy hard-coded in components — put all text in `content.js`.
- ❌ Don't store resumes forever. Temp uploads get deleted after 24–72h if nobody claims them.
- ❌ Don't practice "keyword stuffing" scoring that rewards copying the JD — that's out of scope for now.

---

## 11. Questions If You Get Stuck

| You're stuck on… | Ask / do |
|---|---|
| Where do buttons live? | Look at `src/components/site/ui/Button.jsx` → `ArrowButton` / `SlideButton`. |
| How do I add a page? | Copy `src/app/feature/page.jsx` as a template. |
| How do I call the backend? | Look at `src/features/auth/services/apiClient.js` and `subscriptionService.js`. |
| How do I know if a user is logged in / paid? | `useAuth()` from `src/features/auth/context/AuthContext.jsx` → `isAuthenticated`, `hasActiveSubscription`. |
| Which rules to score? | `docs/ats-score-checker-implementation-plan.md` → section 6 (MVP rule list). |
| How do I test determinism? | `docs/ats-score-checker-poc-summary.md` → section 9. |

---

## 12. Files You Will Create or Change (quick map)

**Simran (frontend):**
- ✏️ Edit `src/lib/navigation-content.js` (menu + footer links)
- ✏️ Edit `src/lib/content.js` (add `atsChecker` copy)
- ✏️ Edit `src/app/page.jsx` (add homepage section)
- 🆕 Create `src/app/ats/page.jsx`
- 🆕 Create `src/components/site/sections/AtsChecker.jsx`
- 🆕 Create `src/features/ats/` folder + all components listed above

**Garima (backend):**
- 🆕 `POST /ats/upload`, `POST /ats/claim`, `POST /ats/scan`, `GET /ats/report/:id`, `GET /ats/history`, `POST /ats/rewrite`
- 🆕 Parser (reuse existing if possible), normalize step, deterministic rule engine, weights
- 🆕 Storage: temp S3 + permanent account storage + 24–72h purge + quotas
- 🆕 Tests: golden fixtures, determinism, versioning, lifecycle, resilience

**Use this doc:** `docs/ats-score-checker-implementation-plan.md`
**Companion docs (read for depth):** `requirements` · `technical-analysis` · `poc-summary`

---

## 13. The "TL;DR" One-Paragaph Summary


Simran builds the website side (new `/ats` page, upload box, login box, score circle, breakdown,
homepage section, menu links) using the existing React/Tailwind style. Garima builds the backend
(upload to S3, login-claim, a **deterministic rule-based scoring engine** that turns any resume
into a 0–100 number with a breakdown, plus history and quotas). They connect through 6 API calls,
and the #1 rule is: **never show a score before login, and the number must be reproducible** —
AI only writes suggestion words, rules make the score. Finish in 4 phases, test each one, and use
this file + the big plan to stay on track.

---