# Analytics

`<Analytics />` from `@vercel/analytics/next` is mounted in `app/layout.jsx` and counts page views on every route. Google Analytics still loads when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set, and Microsoft Clarity (session recordings and heatmaps) loads when `NEXT_PUBLIC_CLARITY_PROJECT_ID` is set.

Named events go through `trackEvent()` in `src/lib/analytics.js`. Each event goes to Vercel Analytics, and also to GA and Clarity when their tags are on the page. Clarity gets only the event name, so recordings can be filtered by it. Properties are flat values and never personal data: no emails, names or resume text. Custom events show up in Vercel only on a Pro or Enterprise plan; page views work on every plan.

| Event | Fired when | Properties |
|---|---|---|
| `jobs_page_viewed` | `/jobs` loads | `path`, `referrer` (hostname or `direct`) |
| `ats_page_viewed` | `/ats-checker` loads | `path`, `referrer` |
| `job_viewed` | a job's details open | `from` (`jobs` / `ats_checker`), `job_id`, `job_title`, `company`, `platform` |
| `job_apply_clicked` | Apply is clicked | the same, plus `signed_in` |
| `ats_resume_uploaded` | a resume is read and scored | `file_type`, `score` |
| `ats_resume_upload_failed` | a resume can't be read | `file_type`, `code` |
| `ats_action_requested` | Optimize or Tailor is clicked | `action`, `signed_in` |
| `ats_action_completed` | Optimize or Tailor finishes | `action`, `score_before`, `score_after`, `match_before`, `match_after` (tailor), `changes`, `partial` |
| `ats_action_failed` | Optimize or Tailor fails | `action`, `code` |
| `ats_pdf_downloaded` | Download PDF is clicked | `action` |
| `auth_modal_opened` | the site's sign-up / log-in modal opens | `view`, `path` |
| `signed_up` | an email sign-up is accepted (before the code is confirmed) | `method` |
| `logged_in` | an email or Google sign-in completes | `method` (`email` / `google`) |

To add an event, add its name to `EVENTS` and call `trackEvent(EVENTS.x, {...})`. For a page view by name, put `<TrackPageView event={EVENTS.x} />` in the page.

Clarity masks form inputs by default. The resume preview and the diff of resume changes on `/ats-checker` carry `data-clarity-mask="True"` so resume text never reaches a recording; mask any new element that shows personal data the same way.
