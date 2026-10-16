# ATS Resume Checker

A page at `/ats-checker` (in the navbar, the footer and the sitemap) where a visitor uploads a resume and gets an ATS score right away. From there they can optimize it, tailor it to a job, or find matching jobs.

| Feature | Auth | How it works |
|---|---|---|
| Upload (PDF/DOCX, max 5 MB, max 10 pages) | No | Text is extracted in the browser: `pdfjs-dist` for PDF, `mammoth` for DOCX. Both are imported on first use, so neither weighs on the landing page. |
| ATS score + breakdown + top issues | No | A deterministic checklist runs in the browser (`features/ats/scoring.js`). Categories: Contact 10, Sections 20, Impact 30, Skills & keywords 15, Formatting 25. The file never leaves the visitor's machine. |
| Optimize + rescore | Yes | One LLM call through `POST llm/generate`. The model's edits are checked locally (`patch.js`), then the result is rescored. The UI shows the score before and after, the new resume as a PDF in an in-page viewer with Download PDF (Copy text as a secondary action), and a diff of the original resume against the new one (see below). |
| Tailor to a job + rescore | Yes | A gap analysis (one LLM call plus at most one "missed keywords" follow-up), then skills and bullet rewrites in parallel. Shows the job-keyword match (%) and the ATS score, each before and after, and the same diff. |
| Find jobs | No (same as /jobs) | The board's role facets that the resume mentions, plus its skills, become keyword chips. Results come from the existing `useJobBoard` / `JobCard` / `JobDetailDialog`. Apply follows the board's rules, and "See all" opens `/jobs?q=…`. |

There is no ATS score anywhere else in the system to reuse. The desktop app only counts job-keyword coverage, and the backend has no scoring endpoint. The score is deterministic on purpose: the same text always gets the same score, so before/after reflects the edit rather than model noise.

## The PDF

`pdf/renderResumePdf.js` builds the PDF in the browser with `pdf-lib`, loaded on demand:
- **Format:** US Letter like the desktop template, single column, standard Helvetica, real text.
- **Structure:** `pdf/layout.js` reads the resume text into name, contact lines, headings, role lines, dates and bullets. It re-joins bullets and summary sentences that the source PDF wrapped.
- **Characters:** ones the standard font can't draw are replaced (`₹` becomes "INR") or stripped of accents (non-Latin scripts drop out).
- **Check:** a test reads the generated PDF back with pdf.js and confirms the ATS score is unchanged.

`components/PdfViewer.jsx` draws each page to a canvas with pdf.js (already used for reading uploads), with zoom. It avoids an `<iframe>` because phone browsers don't show PDFs inside one.

## The diff

`components/ResumeDiff.jsx` compares the original resume text with the new one. It shows only the lines that changed, grouped by section: the old line in red above the new one in green, with only the changed words highlighted, and the model's "Why" under each change. The first 4 changes are shown, and "Show N more changes" reveals the rest. Added skills are also listed as chips above it.

The logic is `resumeDiff()` in `diff.js`, a line-level LCS. Inside each run of changes, the removed and added lines are compared word by word (with the same tokens as `wordDiff`). A bullet that the source PDF wrapped over two lines and the rewrite joined into one shows as two red lines and one green line, with only the new words highlighted.

## SEO

- **Title, description and H1:** these target "free ATS resume checker" and "ATS score". The title tag is `Free ATS Resume Checker – Instant ATS Score & Fixes`, and the description fits within Google's ~155-character snippet.
- **Guide:** `components/AtsGuide.jsx` sits below the tool and is server-rendered. It explains how the score is calculated (the real category weights from `scoring.js`), gives three steps, and answers 8 FAQs. The FAQs use native `<details>`, so the answers stay in the HTML while closed. Its copy is in `content.js` under `atsChecker.guide`; keep it true to `scoring.js`.
- **JSON-LD:** `getAtsCheckerJsonLd()` in `lib/seo.js` emits WebApplication (free, `price: 0`), WebPage, BreadcrumbList and FAQPage. The FAQPage is built from the same items as the visible FAQ. There is no `aggregateRating`, because there are no real reviews to back one.
- **Social image:** a page-specific OG image at `app/ats-checker/opengraph-image.jsx`.
- **Internal links:** the navbar, the footer and the `/jobs` hero ("Check your resume's ATS score free").
- **`/llms.txt`:** a plain-text site map for AI assistants (`app/llms.txt/route.js`), with the checker listed first.

## What was reused rather than rebuilt

- **API client:** `features/auth/services/apiClient.js`. It handles the Bearer token, refresh on 401, and the `{success, data, error}` envelope.
- **Job search:** `useJobBoard`, `listJobs`/`getJobFilters`, `JobCard`, `JobCardSkeleton`, `JobDetailDialog`, and `filters.js` (`filtersToQuery`, `joinKeywords`).
- **Auth UI:** the site-wide `FloatingAuthModal` (`useAuthModal().showModal`), its redirect handling, and `AuthContext`.
- **UI primitives:** `Eyebrow`/`Reveal`, `primaryButton`/`secondaryButton`, `Field`/`FormError`, `Dialog`, and the type and colour tokens from `globals.css`. The repo has no toast or upload component, so errors are shown inline the way the job board does it.
- **Desktop app logic, ported:** `coverage.js` and `diff.js` are ports of `electron/resumeOptimization/domain/{coverage,diff}.cjs`. `prompts.js` adapts `adapters/optimizer.adapter.cjs` to plain text, keeping the same rules: keep every fact, never change or add a number, quote lines exactly.

## Auth gating and state restoration

Gating uses the site's own sign-up / log-in modal: `FloatingAuthModal`, opened with `useAuthModal().showModal()`, the same one the navbar and hero open.

1. A signed-out click on Optimize or Tailor calls `savePending()`, which writes `{action, fileName, extracted text, job form}` to `sessionStorage["hd_ats_pending"]` (30-minute TTL, this tab only). It then calls `showModal({ view: "signup", redirectTo: "/ats-checker?ats=resume" })`.
2. Every way out of the modal ends at that redirect. Email log-in and sign-up `router.push` to it; Google comes back to it through `/cognito-callback`.
3. `AuthReturnWatcher` (in `AtsChecker.jsx`, wrapped in `Suspense` so the page stays static) watches `?ats=resume` with `useSearchParams`. That catches both a client-side push and a full page load. It calls `handleReturn`, which restores the resume, score and job form, removes the flag from the URL, then runs the action once `AuthContext` has finished hydrating, and clears the saved state.
4. Coming back without signing in restores the resume and runs nothing. A normal visit within the TTL also restores the resume without running anything.
5. Signed-in users skip all of this.

The file itself is never stored; the score is recomputed from the text.

Applying to a job from the "Find jobs" tab works the same way: signed out, it opens the same modal with `redirectTo: /jobs?q=…&apply=<id>`, and the board opens the apply link on arrival.

## Changes to existing code

- `jobs/components/AccountFlow.jsx`: **bug fix.** `onClick={startGoogleSignIn}` was passing the click event as the post-login redirect, so "Continue with Google" in the job board's sign-up dialog landed on `/[object Object]`. It now returns to the current page.
- `app/cognito-callback/page.jsx`: the Google redirect now goes through `safeRedirect`, as the rest of the auth code does.
- `jobs/components/ui.jsx` `Dialog`: focus moves into the dialog on open, Tab is trapped inside it, and focus returns to the opener on close. The ATS section uses this dialog for job details; the change applies to every job-board dialog.
- `lib/navigation-content.js`: "ATS Checker" added to the navbar, and "ATS Resume Checker" to the footer's Pages column. `app/sitemap.js` lists `/ats-checker`.
- `components/site/Navbar.jsx`: the bar is now `max-w-[1040px]`, up from 940. Measured in the browser, 940 leaves 533px for the links and six links need about 603px; at 940 the first link ran into the logo.

## Testing

`npm test` adds 56 tests to the existing 25:

- `scoring.test.js`: sections and bullets, determinism, category bounds, issue order
- `patch.test.js`: coverage and diff ports, quote matching across PDF line wraps, refusal rules
- `services/atsService.test.js`: `llm/generate` payload; mapping of 401/413/429/502/503/timeout/network errors; optimize and tailor flows, including a partial failure
- `pdf/renderResumePdf.test.js`: layout blocks, character substitution, wrapping, pagination, and a round-trip in which the generated PDF parses back to the same ATS score
- `pendingAction.test.js`: save/load, TTL, tampered entries
- `hooks/useAtsChecker.test.js`: the full restore flow; a signed-out click opens the site modal with the return path; the action runs once on return (email push or Google reload) after auth settles, and the flag is stripped; returning without auth runs nothing
- `components/AuthReturnWatcher.test.js`: the watcher fires when `?ats=resume` appears after a client-side push

Manual checks:

1. Upload a PDF, a DOCX, a `.doc` (rejected with a hint), a file over 5 MB, and a scanned PDF (rejected: "no text").
2. Signed out, click Optimize: the site's sign-up modal opens. Sign up or log in with email, and you should land back on `/ats-checker` with Optimize running. Repeat with "Continue with Google" and expect the same.
3. Tailor: fill in the form while signed out, then sign in with Google. The form should still be filled in when you're back, and Tailor should run.
4. Find jobs: the chips come from your resume, removing a chip re-runs the search, Apply while signed out opens sign-up, and "See all" opens `/jobs` with the same query.

## Backend follow-up (recommended, not required for this release)

Optimize and Tailor build prompts in the browser and send them to `POST /api/llm/generate`, the same fallback the desktop app uses. That works today, but it means any signed-in user can send any prompt. Proposed replacement, with prompts that live on the server:

```
POST /api/resume/optimize      authMiddleware, llmRateLimitMiddleware
  body: { resumeText: string (<= 30000 chars) }
  200:  { success, data: { ops: Op[] } }

POST /api/resume/tailor        authMiddleware, llmRateLimitMiddleware
  body: { resumeText: string (<= 30000), job: { title: string (<= 200), company?: string (<= 200), description: string (<= 15000) } }
  200:  { success, data: { keywords: {term, importance, evidence}[], ops: Op[] } }

Op = { op: "rewrite_line", before, after, reason } | { op: "add_skill", skill, reason }
Errors: 400 invalid body · 401 · 413 too long · 429 Retry-After · 502/503 provider
```

- Move the prompt builders in `features/ats/prompts.js` into the controller and call `generateLlmResponse({ provider, prompt, responseFormat: "json" })`.
- Give these routes a JSON body limit of about 100 kB instead of the global 50 MB.
- The client's `applyOps` validation stays as it is.
- Once these exist, `atsService.js` only needs to change endpoint and payload.

Other findings from the investigation, outside this repo:

- The desktop app has a hardcoded NVIDIA API key in `electron/config/nvidia.config.cjs`. It ships inside the app and should be rotated.
- The desktop app calls `llm/jobs`, which is not in the `hiredue-backend` repo.
- `resume_ai` is marked `freeAccess: false` in `dodo-subscription.service.ts`, but nothing enforces it. This feature gates on sign-in only, as agreed.
