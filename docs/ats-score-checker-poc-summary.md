# ATS Score Checker — Technical POC

**Status:** In review · **Focus:** deterministic ATS scoring engine only

> **The single question this POC answers:** *Given the same resume and the same scoring-rule version, does HireDue consistently produce the same ATS score?*

---
## 1. Objective

Validate the deterministic scoring engine end-to-end: the numerical score must be **rule-driven, reproducible, and explainable** — never controlled by AI/LLM or non-deterministic infrastructure.

Pipeline under test: `Resume → Parser → Normalization → Deterministic rules → Category scores → fixed weighted 0–100 → Explainable breakdown → Determinism validation`. Core decisions summarized in §10.

---
## 2. Scope

### In scope
Resume fixtures · text extraction + deterministic normalization · deterministic rule set (CORE + advisory) · category scores, fixed-weight 0–100, breakdown, scoring version · determinism tests (repeat ≥ 10×, near-identical, boundaries, versioning) · simple Node.js implementation (conceptual; implementation is a separate step).

### Out of scope (explicitly removed — do not build for the POC)
Auth/signup · APIs/backend · S3/storage · database · rate limiting · frontend · production deployment · full product workflow · **JD/role-based optimization** · **AI/LLM-controlled numeric scoring**.

---
## 3. Processing Flow

```
Resume → Parse (extract text) → Normalize (deterministic cleanup) → Evaluate rules (CORE core-score; Heur/NLP advisory) → Aggregate categories → Fixed weights → deterministic 0–100 → Breakdown → Determinism validation
```
Steps 1–6 are pure functions; no timestamps, randomness, network, or AI anywhere in the score.

---
## 4. Parseability (measurable)

**Definition.** *Parseability* = whether the parser can reliably interpret the file. *Resume quality* = whether the content is strong. These are **independent**; a parseable-but-weak resume and a strong-but-poorly-parseable one are both possible. The generic score must not conflate them.

Parseability is a **fixed set of deterministic, measurable checks**. Each has a defined input and deterministic result — no subjective "looks ATS-friendly" language:

| Check | Measures |
|---|---|
| File open / read, text extraction | file readable; plain text produced |
| Non-empty text | meaningful-content threshold (calibration param) |
| Text-coverage ratio | extracted text vs. expected document coverage |
| Reading order | sequence usable for section detection |
| Fragmentation | excessively broken words / tokens |
| Encoding / mojibake | special-char corruption below a defined threshold (calibration param) |
| Heading detection | sections recoverable by heading pattern |
| Field extraction | contact / experience / education / skills recoverable when present |
| Image-only / scanned | no meaningful text extracted → OCR-gated |
| Layout artifacts | columns / tables / text-boxes / headers-footers / unusual layouts |
| Parser artifacts | repeated chars, broken words, excessive whitespace, scrambled text |

**Severe failures** (parse-failure, empty/near-empty, image-only) are `Crit` (see rule set below). An image-only resume means nothing below parseability can be scored. Parseability rules reduce only their own category; they never inject randomness. Thresholds not already defined in the technical analysis are **POC calibration parameters** — the measurement method is fixed; only the cutoff is tuned. Full detail: technical-analysis §3.1 / §3.10.

---
## 5. Scoring Rule Set (core + advisory)

Source of truth: technical-analysis §3. Tagged by impact (`Crit/High/Med/Low/Info`) and class. **Unmarked rules are CORE + deterministic and drive the 0–100**; `Heur`/`NLP`/`OPT`/`OCR`/`EXCL` are advisory and excluded from the core.

| Cat | Category — rules checked | Core? |
|---|---|---|
| A | Parsing/parseability — format, text-extraction ok, empty/near-empty, image-only, parse-failure (Crit); text-in-images (OCR); tables, text-boxes, headers/footers, encoding/mojibake, multi-column; broken-text, reading-order | Yes (Crit path); layout Heur |
| B | Structure — name/header, contact, skills, experience, education, summary, projects, certifications present; heading machine-readable; missing-major; duplicates | Yes (section presence); Heur/OPT others |
| C | Contact — email + format, phone + pattern, name; location/LinkedIn/portfolio-GitHub; duplicate/conflicting | Yes (reachability); OPT links |
| D | Experience structure — section, company, title, dates, start/end consistent, current-role, missing/invalid dates, reverse-chronological, empty entries, bullets present/count, over/under-length | Yes (structure); Heur chronology/length |
| E | Experience content/impact — numbers/metrics, quantified achievements, keyword-stuffing, repetition; action-verbs, vague phrases, bullet length, substantive, tense, outcome-vs-duty | Yes (metrics/stuffing); Heur/NLP prose |
| F | Experience dates/chronology — date presence/format, reverse order, coverage of recent roles, gaps | Yes (objective parts) |
| G | Experience bullet quality — bullet presence/count, length, consistency | Yes (count/fmt); Heur substance |
| H | Quantified achievements — numeric/metrics presence in bullets | Yes |
| I | Action/impact language — action-verbs, outcome vs duty (only where deterministically measurable) | Heur |
| J | Skills-section quality — section, extraction, structure, count, normalized names, duplicates, aliases/synonyms, generic-vs-tech, grouping, unknown terms, stuffing, cross-section repeats, breadth | Yes (structure/extraction); OPT/Heur rest |
| K | Education — section, degree, institution, grad-date, missing fields, degree/date consistency | Yes |
| L | Certifications — name, issuer, date/year, expiration, credential/ID, duplicates | OPT / Heur |
| M | Projects — section, name, description, tech/skills, links, dates; absence not penalized | Yes (presence); OPT/Heur |
| N | Formatting/layout — multi-column, tables, text-boxes, images/icons, font variance/size, page count, dense text, whitespace, hyperlinks | Yes (technical only); OPT/Heur |
| O | Section consistency — date/title/company/heading/bullet format, tense, duplicate info | OPT / Heur |
| P | Content completeness — contact, dates, work history, education, sections all present | Yes |
| Q | Keyword/content hygiene — stuffing, repetition, irrelevant filler, cross-section repeats | Yes (stuffing/repeats); Heur |
| R | ATS-risk indicators — tables, text-boxes, images, multi-column, headers/footers, special-chars, dense text, hyperlinks | Yes (technical); Heur |

Every core rule is a **pure function** of the normalized resume (deterministic pass/fail or bounded score). Heuristic/NLP rules are validated separately, never auto-scored into the number until proven deterministic and stable. Full per-rule definitions: technical-analysis §3.

---
## 6. Skills & the Universal Dictionary (resolved)

**Conclusion: a universal skill dictionary is NOT required for the generic ATS score.**

Different roles demand different skills; without a JD/target role HireDue cannot reliably judge relevance. Rewarding or penalizing a resume for containing "the right" skills without that context is unreliable and misleading. The generic score therefore evaluates only **deterministic skill properties**:

- Skills section exists · skills extractable · skills structured/readable
- Duplicates · excessive repetition · formatting-variant normalization (where safely deterministic)
- Skill grouping/readability · keyword stuffing/repetition
- Cross-section consistency where deterministically measurable

**Explicit conclusion:**
> Job-specific skill relevance is OUT OF SCOPE for the generic ATS score and requires a JD/role context. It belongs to a separate JD-matching/optimization capability. This is closed, not an open question; any skills "breadth" signal is generic and small-weight and never labeled role-fit.

---
## 7. CORE vs Heuristic / NLP

| | CORE | Heuristic / NLP |
|---|---|---|
| Define | deterministic, measurable, repeatable, stable | may inform analysis |
| Score effect | **allowed** to change the 0–100 | **must not** control the core unless independently validated as deterministic and stable |
| POC rule | drives the number | uncertain semantic/LLM judgments stay **advisory** |

**AI/LLM never determines the final numerical score.**

---
## 8. Scoring Model (implementation-ready)

```
Individual deterministic rules → category scores → fixed category weights → final normalized 0–100
```

- Each rule = deterministic **pass/fail or bounded score**.
- Category score = aggregate of its rules.
- Final score = fixed category weights.
- **Same normalized resume + same scoring version = same result.**
- No timestamps, randomness, network calls, or model-generated scoring.
- Every score change is explainable via rule/category results.
- Fixed rounding rule; every result tagged with its scoring version. Weights = proposed for validation (clearly marked).

Output per resume (JSON): `version`, `finalScore` (0–100), `categoryScores` (`earned/points/pct`), `ruleBreakdown` (id, category, earned/points, detail), `advisory` (Heur/NLP signals, marked excluded from core), `inputFingerprint` (hash of normalized text).

---
## 9. Test Strategy (determinism)

Fixtures: strong, weak/minimal, and near-identical variants. Same resume ≥ 10× → identical final score, category scores, and rule outcomes.
- Multiple resume formats/structures.
- Near-identical resume, one controlled content/layout change → score delta explainable by the changed rule(s).
- No AI/LLM call required for the core score (verified).
- Boundary tests: minimum score, maximum score, normalization.
- Scoring-version behavior: version change alters results in a controlled, versioned way.

---
## 10. POC Decisions / Conclusions

1. The core ATS score is **deterministic and rule-based**.
2. Parseability is evaluated through **measurable extraction-quality checks**, not subjective judgment.
3. A universal skill dictionary is **NOT required** for the generic ATS score.
4. Generic skill scoring evaluates section quality, extraction, structure, duplication/repetition and related **deterministic** properties — not job relevance.
5. **Job-specific skill relevance requires a JD/role** and is out of scope for this POC.
6. Heuristic/NLP/LLM analysis does **not** control the core numerical score.
7. The final score is always **normalized to 0–100** using fixed scoring rules and weights.
8. Same resume + same scoring version must always return the **same score**.
9. Any future rule/weight change requires a **scoring-version change**.
10. The POC validates the **scoring engine**, not reproduction of proprietary ATS algorithms.

---
## 11. References

- `docs/ats-scoring-technical-analysis.md` — exhaustive per-rule ATS rule set (§3), scoring math, deterministic-scoring approach, and the role of AI in scoring.
