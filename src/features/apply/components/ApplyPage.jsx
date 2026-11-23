"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, CircleCheck, Globe, MonitorDown, SearchX } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/features/auth/context/AuthContext.jsx";
import { AccountDialog } from "@/features/jobs/components/AccountDialog.jsx";
import { DownloadDialog } from "@/features/jobs/components/DownloadDialog.jsx";
import { Badge, CompanyLogo, primaryButton, secondaryButton } from "@/features/jobs/components/ui.jsx";
import { buttonClass } from "@/components/site/ui/Button";
import { canInstall } from "@/features/jobs/funnel.js";
import { Spinner } from "@/components/site/ui/Spinner";
import { EVENTS, trackEvent } from "@/lib/analytics";
import { jobChips, websiteHost } from "../format.js";
import { getCompanyJob } from "../services/applyService.js";
import { captureUtm, clearApplyIntent, saveApplyIntent, takeApplyIntent } from "../utm.js";
import { ApplicationForm } from "./ApplicationForm.jsx";
import { Markdown } from "./Markdown.jsx";

const PANEL_ID = "apply";

/**
 * /apply/<id>: a job a company posted on HireDue, and its application.
 *
 * `initialJob` is the server's public copy (for the first paint and SEO); it is
 * fetched again here once the session is known, with the token when signed in,
 * so hasApplied and hasProfileResume are the visitor's own.
 */
export function ApplyPage({ id, initialJob = null }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const authKey = isAuthenticated ? "member" : "visitor";

  // status: loading | ready | not_found | error. `loadedFor` says whose view of the job we hold.
  const [state, setState] = useState(() =>
    initialJob ? { status: "ready", job: initialJob, loadedFor: "server" } : { status: "loading", job: null, loadedFor: null },
  );
  // What happened on this page: null (nothing yet), or submitted / already_applied / closed.
  const [outcome, setOutcome] = useState(null);
  const [utm, setUtm] = useState(null);
  const [accountRequest, setAccountRequest] = useState(null);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [install, setInstall] = useState(false);
  const [reload, setReload] = useState(0);
  // Scroll the form into view once it is there (back from sign-in, or the mobile Apply button).
  const [focusForm, setFocusForm] = useState(false);
  const panelRef = useRef(null);

  // The link's UTM, kept for this job across the sign-in round trip.
  useEffect(() => {
    setUtm(captureUtm(id, window.location.search));
    setInstall(canInstall(navigator.userAgent, navigator.maxTouchPoints));
  }, [id]);

  useEffect(() => {
    if (authLoading) return undefined;
    let cancelled = false;
    getCompanyJob(id)
      .then((response) => {
        if (cancelled) return;
        if (response.success && response.data) setState({ status: "ready", job: response.data, loadedFor: authKey });
        else if (response.status === 404) setState({ status: "not_found", job: null, loadedFor: authKey });
        // A failed refresh keeps the server's copy on screen rather than replacing it with an error.
        else setState((s) => (s.job ? { ...s, loadedFor: s.loadedFor === "server" ? "failed" : s.loadedFor } : { status: "error", job: null, loadedFor: authKey }));
      })
      .catch(() => {
        if (!cancelled) setState((s) => (s.job ? { ...s, loadedFor: "failed" } : { status: "error", job: null, loadedFor: authKey }));
      });
    return () => {
      cancelled = true;
    };
  }, [id, authLoading, authKey, reload]);

  const job = state.job;
  const analytics = useMemo(
    () =>
      job && {
        from: "apply_page",
        job_id: String(job.id ?? id),
        job_title: job.title,
        company: job.company?.name,
        utm_source: utm?.source,
        utm_medium: utm?.medium,
        utm_campaign: utm?.campaign,
        utm_content: utm?.content,
        signed_in: isAuthenticated,
      },
    [job, id, utm, isAuthenticated],
  );

  // One view per page load, once we know who is looking.
  const viewed = useRef(false);
  useEffect(() => {
    if (viewed.current || !analytics || authLoading || state.loadedFor === "server") return;
    viewed.current = true;
    trackEvent(EVENTS.companyJobViewed, { ...analytics, status: job.status, has_applied: !!job.hasApplied });
  }, [analytics, authLoading, state.loadedFor, job]);

  const started = useRef(false);
  const startApply = useCallback(() => {
    if (started.current || !analytics) return;
    started.current = true;
    trackEvent(EVENTS.companyJobApplyStarted, analytics);
  }, [analytics]);

  // Back from Google sign-in (the page reloads here signed in): open the form they asked for.
  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    if (takeApplyIntent(id)) setFocusForm(true);
  }, [authLoading, isAuthenticated, id]);

  const memberView = isAuthenticated && state.loadedFor === "member";
  const open = job?.status === "open";
  const view = outcome?.kind ?? (job?.hasApplied && memberView ? "already_applied" : !open ? "closed" : null);

  useEffect(() => {
    if (!focusForm || (!memberView && view == null)) return;
    setFocusForm(false);
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [focusForm, memberView, view]);

  const askToSignIn = (mode = "signup") => {
    startApply();
    // Google sign-in leaves the site; this brings the visitor back to the form.
    saveApplyIntent(id);
    setAccountRequest({
      mode,
      reason: "hiredueApply",
      job: { jobTitle: job?.title, hiringCompany: job?.company?.name },
      onSuccess: () => {
        clearApplyIntent();
        setFocusForm(true);
      },
    });
  };

  const onFormDone = useCallback(
    (result) => {
      if (result.kind === "signed_out") {
        askToSignIn("login");
        return;
      }
      if (result.kind === "not_found") {
        setState({ status: "not_found", job: null, loadedFor: authKey });
        return;
      }
      setOutcome(result);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    // askToSignIn reads the latest job through the closure; it is cheap to rebuild.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [authKey, job, id],
  );

  if (state.status === "loading") return <ApplyPageSkeleton />;
  if (state.status === "not_found") {
    return (
      <Notice
        icon={SearchX}
        title="This job isn't available"
        body="The link may be mistyped, or the company has taken the job down."
        action={
          <Link href="/jobs" className={clsx(primaryButton, "h-12 px-6")}>
            Browse open jobs <ArrowRight size={16} aria-hidden />
          </Link>
        }
      />
    );
  }
  if (state.status === "error") {
    return (
      <Notice
        icon={SearchX}
        title="We couldn't load this job"
        body="Check your connection and try again."
        action={
          <button type="button" onClick={() => setReload((n) => n + 1)} className={clsx(secondaryButton, "h-12 px-6")}>
            Try again
          </button>
        }
      />
    );
  }

  if (view === "submitted") {
    return (
      <Shell>
        <Submitted job={job} install={install} onDownload={() => setDownloadOpen(true)} />
        <DownloadDialog open={downloadOpen} onClose={() => setDownloadOpen(false)} />
      </Shell>
    );
  }

  const showMobileApply = view == null;

  return (
    <Shell>
      <JobHeader job={job}>
        {showMobileApply && (
          <button
            type="button"
            onClick={() => {
              if (!isAuthenticated) return askToSignIn();
              startApply();
              setFocusForm(true);
            }}
            className={clsx(primaryButton, "h-12 w-full text-[15px] sm:w-auto sm:px-8 lg:hidden")}
          >
            Apply now
          </button>
        )}
      </JobHeader>

      <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start lg:gap-8">
        <div className="flex min-w-0 flex-col gap-6 lg:col-start-1">
          <Card title="About the role">
            {job.description ? <Markdown source={job.description} /> : <p className="t-body">No description was provided for this role.</p>}
          </Card>
          {job.company?.about && (
            <Card title={`About ${job.company.name || "the company"}`}>
              <Markdown source={job.company.about} />
            </Card>
          )}
        </div>

        <aside
          id={PANEL_ID}
          ref={panelRef}
          className="scroll-mt-[96px] lg:col-start-2 lg:row-start-1"
        >
          <div className="flex flex-col gap-5 rounded-[20px] border border-line bg-white p-5 shadow-[0_0_0_4px_rgba(221,229,237,0.5)] sm:p-6">
            {view === "already_applied" ? (
              <PanelState
                icon={CircleCheck}
                tone="success"
                title="You've already applied"
                body={`Your application for ${job.title} is with ${job.company?.name || "the company"}.`}
              />
            ) : view === "closed" ? (
              <PanelState
                icon={BriefcaseBusiness}
                title="No longer accepting applications"
                body={`${job.company?.name || "The company"} has stopped taking applications for this role.`}
              />
            ) : authLoading ? (
              <div className="flex items-center gap-3 py-6 text-dim" role="status">
                <Spinner className="text-brand" /> One moment…
              </div>
            ) : !isAuthenticated ? (
              <SignedOutPanel job={job} onApply={() => askToSignIn("signup")} onLogin={() => askToSignIn("login")} />
            ) : memberView ? (
              <>
                <div className="flex flex-col gap-1">
                  <h2 className="t-h5">Apply for this role</h2>
                  <p className="text-[14px] leading-[1.5] text-dim">Takes about a minute.</p>
                </div>
                <ApplicationForm job={job} utm={utm} analytics={analytics} onStart={startApply} onDone={onFormDone} />
              </>
            ) : state.loadedFor === "failed" ? (
              <div className="flex flex-col gap-3">
                <p className="t-body">We couldn&apos;t load your application details.</p>
                <button type="button" onClick={() => setReload((n) => n + 1)} className={clsx(secondaryButton, "h-11")}>
                  Try again
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 py-6 text-dim" role="status">
                <Spinner className="text-brand" /> Getting the application ready…
              </div>
            )}
            {(view === "already_applied" || view === "closed") && (
              <Link href="/jobs" className={clsx(secondaryButton, "h-12 w-full")}>
                Browse more jobs <ArrowRight size={16} aria-hidden />
              </Link>
            )}
          </div>
        </aside>
      </div>

      <AccountDialog
        request={accountRequest}
        // Closed without signing in: forget the Apply they pressed, so a later log-in doesn't act on it.
        onClose={() => {
          clearApplyIntent();
          setAccountRequest(null);
        }}
        onSuccess={accountRequest?.onSuccess}
      />
    </Shell>
  );
}

function Shell({ children }) {
  return (
    <section className="relative pt-[96px] pb-[100px] min-[810px]:pt-[116px] min-[1200px]:pb-[140px]">
      <div className="mx-auto w-full max-w-[1160px] px-4 sm:px-[30px]">{children}</div>
    </section>
  );
}

function Card({ title, children }) {
  return (
    <section className="flex flex-col gap-4 rounded-[20px] border border-line bg-white p-5 sm:p-7">
      <h2 className="text-[18px] font-semibold text-ink">{title}</h2>
      {children}
    </section>
  );
}

function JobHeader({ job, children }) {
  const host = websiteHost(job.company?.website);
  const chips = jobChips(job);
  const skills = (job.skills ?? []).filter(Boolean);
  return (
    <header className="flex flex-col gap-5 rounded-[24px] bg-[linear-gradient(180deg,rgba(226,245,255,0.92)_0%,rgba(237,241,244,0.6)_100%)] p-5 sm:p-8">
      <div className="flex items-start gap-4">
        <CompanyLogo src={job.company?.logoUrl} name={job.company?.name || job.title} size={64} />
        <div className="flex min-w-0 flex-col gap-1.5">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px] font-semibold text-ink/80">
            {job.company?.name}
            {host && (
              <a
                href={job.company.website}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center gap-1 text-[13.5px] font-medium text-dim underline-offset-4 hover:text-brand hover:underline"
              >
                <Globe size={13} aria-hidden /> {host}
              </a>
            )}
          </p>
          <h1 className="font-display text-[26px] leading-[1.15] font-semibold tracking-[-0.5px] text-ink [overflow-wrap:anywhere] sm:text-[34px]">
            {job.title}
          </h1>
        </div>
      </div>
      {chips.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label="Job details">
          {chips.map((chip) => (
            <li key={chip.key} className="rounded-[10px] border border-line bg-white px-3 py-1.5 text-[13.5px] leading-none font-medium text-ink/80">
              {chip.label}
            </li>
          ))}
        </ul>
      )}
      {skills.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-[13px] leading-none font-semibold tracking-[0.03em] text-dim uppercase">Skills</p>
          <ul className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <li key={skill}>
                <Badge tone="brand">{skill}</Badge>
              </li>
            ))}
          </ul>
        </div>
      )}
      {children}
    </header>
  );
}

function SignedOutPanel({ job, onApply, onLogin }) {
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <h2 className="t-h5">Apply for this role</h2>
        <p className="text-[14.5px] leading-[1.5] text-dim">
          Create a free HireDue account (or log in) and send your application to {job.company?.name || "the company"} in about a minute.
        </p>
      </div>
      <button type="button" onClick={onApply} className={clsx(primaryButton, "h-12 w-full text-[15px]")}>
        Apply
      </button>
      <p className="text-center text-[14px] text-dim">
        Already have an account?{" "}
        <button type="button" onClick={onLogin} className="font-semibold text-brand hover:underline">
          Log in
        </button>
      </p>
    </>
  );
}

function PanelState({ icon: Icon, title, body, tone }) {
  return (
    <div className="flex flex-col gap-3">
      <span className={clsx("grid size-11 place-items-center rounded-full", tone === "success" ? "bg-success-10 text-success" : "bg-surface text-dim")}>
        <Icon size={20} aria-hidden />
      </span>
      <h2 className="t-h5">{title}</h2>
      <p className="text-[14.5px] leading-[1.5] text-dim">{body}</p>
    </div>
  );
}

function Submitted({ job, install, onDownload }) {
  const company = job.company?.name || "the company";
  return (
    <div className="mx-auto flex max-w-[560px] flex-col gap-6">
      <div className="flex flex-col items-center gap-4 rounded-[24px] border border-line bg-white p-6 text-center shadow-[0_0_0_5px_rgba(221,229,237,0.52)] sm:p-10" role="status">
        <span className="grid size-14 place-items-center rounded-full bg-success-10 text-success">
          <CircleCheck size={28} aria-hidden />
        </span>
        <h1 className="t-h4">Application sent</h1>
        <p className="t-body">
          Your application for <span className="font-semibold text-ink">{job.title}</span> is with {company}. If they want to take it
          further, they&apos;ll reach out using the contact details on your HireDue account.
        </p>
        <Link href="/jobs" className={clsx(secondaryButton, "h-12 w-full sm:w-auto sm:px-8")}>
          Browse more jobs <ArrowRight size={16} aria-hidden />
        </Link>
      </div>

      <div className="flex flex-col gap-3 rounded-[20px] bg-ink p-6 text-white">
        <span className="grid size-10 place-items-center rounded-full bg-white/10">
          <MonitorDown size={18} aria-hidden />
        </span>
        <p className="text-[17px] font-semibold">Applying to more roles like this?</p>
        <p className="text-[14px] leading-[1.5] text-white/70">
          The HireDue desktop app finds matching jobs across every major board and fills in the applications for you.
          {install ? "" : " It runs on Mac and Windows laptops."}
        </p>
        {install ? (
          <button type="button" onClick={onDownload} className={clsx(buttonClass({ variant: "white", size: "tool" }), "h-11 self-start px-5")}>
            Get the desktop app
          </button>
        ) : (
          <Link href="/download" className="inline-flex items-center gap-1.5 self-start text-[14px] font-semibold text-white underline-offset-4 hover:underline">
            See how it works <ArrowRight size={14} aria-hidden />
          </Link>
        )}
      </div>
    </div>
  );
}

function Notice({ icon: Icon, title, body, action }) {
  return (
    <Shell>
      <div className="mx-auto flex max-w-[520px] flex-col items-center gap-3 rounded-[20px] border border-dashed border-line bg-white px-6 py-16 text-center">
        <div className="grid size-12 place-items-center rounded-full bg-surface text-dim">
          <Icon size={20} aria-hidden />
        </div>
        <h1 className="t-h5">{title}</h1>
        <p className="t-body max-w-[420px]">{body}</p>
        {action}
      </div>
    </Shell>
  );
}

/** While the job loads; also the server's fallback when it has no copy of the job. */
export function ApplyPageSkeleton() {
  return (
    <Shell>
      <div aria-hidden className="flex animate-pulse flex-col gap-5 rounded-[24px] bg-surface/70 p-5 sm:p-8">
        <div className="flex items-center gap-4">
          <div className="size-16 rounded-[12px] bg-white" />
          <div className="flex flex-1 flex-col gap-2">
            <div className="h-4 w-32 rounded bg-white" />
            <div className="h-7 w-3/4 rounded bg-white" />
          </div>
        </div>
        <div className="flex gap-2">
          {[80, 70, 90].map((w) => (
            <div key={w} className="h-7 rounded-[10px] bg-white" style={{ width: w }} />
          ))}
        </div>
      </div>
      <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-8">
        <div className="flex flex-col gap-3 rounded-[20px] border border-line bg-white p-5 sm:p-7">
          {[100, 95, 88, 97, 60].map((w) => (
            <div key={w} className="h-3.5 animate-pulse rounded bg-surface" style={{ width: `${w}%` }} />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-[20px] border border-line bg-white" />
      </div>
      <span className="sr-only" role="status">
        Loading job…
      </span>
    </Shell>
  );
}
