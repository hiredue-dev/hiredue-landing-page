"use client";

import { Suspense, useEffect, useId, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FileText, RefreshCw } from "lucide-react";
import clsx from "clsx";
import { Eyebrow, Reveal } from "@/components/site/ui/Primitives";
import { atsChecker } from "@/lib/content";
import { useAtsChecker } from "../hooks/useAtsChecker.js";
import { isReturnFromAuth } from "../pendingAction.js";
import { OptimizePanel, TailorPanel } from "./ActionPanels.jsx";
import { JobsPanel } from "./JobsPanel.jsx";
import { ResumeDropzone } from "./ResumeDropzone.jsx";
import { CategoryBars, IssueList, ScoreRing } from "./Score.jsx";

const TABS = ["optimize", "tailor", "jobs"];

/** The /ats-checker page. */
export function AtsChecker() {
  const ats = useAtsChecker();
  // After "Replace", focus lands back on the file button rather than the page top.
  const [focusUpload, setFocusUpload] = useState(false);

  return (
    <section className="relative pt-[140px] pb-[120px] min-[810px]:pt-[170px] md:pb-[200px] min-[1200px]:pt-[194px]">
      <div className="container-page">
        <div className="flex flex-col gap-[50px]">
          <Reveal className="mx-auto flex max-w-[760px] flex-col items-center gap-2.5">
            <Eyebrow>{atsChecker.eyebrow}</Eyebrow>
            <h1 className="t-h2 text-center">{atsChecker.title}</h1>
            <p className="t-body-lg max-w-[600px] text-center">{atsChecker.description}</p>
          </Reveal>

          <Reveal delay={0.1} className="rounded-[30px] bg-surface p-2.5 sm:p-5">
            <p className="sr-only" aria-live="polite">
              {ats.resume ? `Your ATS score is ${ats.resume.score.overall} out of 100.` : ""}
            </p>
            {ats.resume ? (
              <Workspace
                ats={ats}
                onReplace={() => {
                  setFocusUpload(true);
                  ats.reset();
                }}
              />
            ) : (
              <ResumeDropzone
                parsing={ats.parse.status === "parsing"}
                error={ats.parse.status === "error" ? ats.parse.error : null}
                onFile={ats.upload}
                privacyNote={atsChecker.privacy}
                autoFocus={focusUpload}
              />
            )}
          </Reveal>
        </div>
      </div>

      {/* useSearchParams opts out of static rendering up to the nearest
          Suspense; this keeps that to the watcher, not the section. */}
      <Suspense fallback={null}>
        <AuthReturnWatcher onReturn={ats.handleReturn} />
      </Suspense>
    </section>
  );
}

/**
 * The sign-in modal and /cognito-callback both send the visitor to
 * RETURN_PATH (?ats=resume). Email sign-in is a client-side push, so the
 * section is already mounted: watching the URL catches it as well as a full
 * page load back from Google.
 */
export function AuthReturnWatcher({ onReturn }) {
  const searchParams = useSearchParams();
  const returning = isReturnFromAuth(searchParams.toString());
  useEffect(() => {
    if (returning) onReturn();
  }, [returning, onReturn]);
  return null;
}

function Workspace({ ats, onReplace }) {
  const { resume } = ats;

  return (
    <div className="grid gap-2.5 sm:gap-5 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
      <div className="flex flex-col gap-6 rounded-[20px] bg-white p-5 sm:p-7">
        <div className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-ice text-brand">
            <FileText size={18} aria-hidden />
          </span>
          <p className="min-w-0 flex-1 truncate text-[15px] font-semibold text-ink" title={resume.fileName}>
            {resume.fileName || "Your resume"}
          </p>
          <button
            type="button"
            onClick={onReplace}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[13.5px] font-semibold text-brand transition-colors hover:bg-ice"
          >
            <RefreshCw size={14} aria-hidden /> Replace
          </button>
        </div>

        <div className="flex items-center gap-5">
          <ScoreRing score={resume.score.overall} />
          <div className="flex flex-col gap-1">
            <p className="t-h5">ATS score</p>
            <p className="t-body-sm">
              Based on {resume.score.stats.words.toLocaleString()} words and {resume.score.stats.bullets} bullets we could read.
            </p>
          </div>
        </div>

        <CategoryBars categories={resume.score.categories} />

        <div className="flex flex-col gap-3">
          <h3 className="text-[16px] font-semibold text-ink">Top issues</h3>
          <IssueList issues={resume.score.issues} />
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-6 rounded-[20px] bg-white p-5 sm:p-7">
        <Tabs current={ats.tab} onChange={ats.setTab} />
        <div role="tabpanel" id={`ats-panel-${ats.tab}`} aria-labelledby={`ats-tab-${ats.tab}`} tabIndex={0} className="outline-none">
          {ats.tab === "optimize" && (
            <OptimizePanel state={ats.optimize} signedIn={ats.isAuthenticated} fileName={resume.fileName} onRun={ats.request} />
          )}
          {ats.tab === "tailor" && (
            <TailorPanel
              state={ats.tailor}
              signedIn={ats.isAuthenticated}
              fileName={resume.fileName}
              job={ats.job}
              onJobChange={ats.setJob}
              onRun={ats.request}
              onEdit={() => ats.clearRun("tailor")}
            />
          )}
          {ats.tab === "jobs" && <JobsPanel text={resume.text} />}
        </div>
      </div>
    </div>
  );
}

/** Same pill tabs as the job board's listings/posts switch; arrow keys move between them. */
function Tabs({ current, onChange }) {
  const id = useId();
  const refs = useRef({});
  const move = (event, index) => {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = TABS[(index + step + TABS.length) % TABS.length];
    onChange(next);
    refs.current[next]?.focus();
  };
  return (
    <div role="tablist" aria-label="What to do with your resume" id={id} className="flex w-full gap-1 rounded-full border border-line bg-surface p-1 sm:w-auto sm:self-start">
      {TABS.map((tab, index) => {
        const active = tab === current;
        return (
          <button
            key={tab}
            ref={(el) => {
              refs.current[tab] = el;
            }}
            id={`ats-tab-${tab}`}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls={`ats-panel-${tab}`}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(tab)}
            onKeyDown={(event) => move(event, index)}
            className={clsx(
              "inline-flex h-9 flex-1 items-center justify-center rounded-full px-2.5 text-[13.5px] font-semibold whitespace-nowrap transition-colors duration-200 sm:flex-none sm:px-4 sm:text-[14px]",
              active ? "bg-white text-ink shadow-[0_2px_8px_rgba(29,29,29,0.08)]" : "text-dim hover:text-ink",
            )}
          >
            {atsChecker.tabs[tab].label}
          </button>
        );
      })}
    </div>
  );
}
