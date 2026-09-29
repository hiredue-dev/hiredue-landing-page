"use client";

import { useEffect, useState } from "react";
import { Linkedin, Lock } from "lucide-react";
import clsx from "clsx";
import {
  DoneStep,
  LoginForm,
  SIGNUP_STEPS,
  SignupDetailsStep,
  Steps,
  VerifyStep,
  useSignupFlow,
} from "./AccountFlow.jsx";
import { Dialog, primaryButton } from "./ui.jsx";

/*
 * What the visitor was doing when we asked them to sign up. It sets the pitch
 * at the top and the button that finishes the flow.
 */
const REASONS = {
  apply: {
    icon: Lock,
    title: "Create a free account to apply",
    body: (job) =>
      job ? `Get the application link for ${job.jobTitle}${job.hiringCompany ? ` at ${job.hiringCompany}` : ""}.` : "Get the application link in one step.",
    finish: "Show the application link",
  },
  posts: {
    icon: Linkedin,
    title: "Unlock LinkedIn hiring posts",
    body: () => "See who's hiring on LinkedIn: the company, role, experience and how to apply.",
    finish: "Show hiring posts",
  },
  default: {
    icon: Lock,
    title: "Create your free HireDue account",
    body: () => "Browse and apply to jobs from every major job board in one place.",
    finish: "Continue",
  },
};

/**
 * Sign-up (details → verify → done) or log-in, without leaving the job board.
 * `onSuccess` runs once the visitor is signed in (e.g. open the apply link).
 * Deliberately doesn't offer to switch into the download flow from here —
 * applying to a job on the web and installing the app to automate everything
 * are two different things a visitor came here to do, so they stay two
 * separate dialogs rather than one bleeding into the other.
 */
export function AccountDialog({ request, onClose, onSuccess }) {
  const open = !!request;
  const reason = REASONS[request?.reason] ?? REASONS.default;
  const [mode, setMode] = useState("signup");
  const flow = useSignupFlow();

  // Fresh start each time the dialog opens.
  useEffect(() => {
    if (!request) return;
    setMode(request.mode === "login" ? "login" : "signup");
    flow.setStep(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request]);

  const switchTo = (next, email) => {
    if (email) flow.setForm((f) => ({ ...f, email }));
    flow.setStep(0);
    setMode(next);
  };

  const finish = () => {
    onSuccess?.();
    onClose();
  };

  const Icon = reason.icon;
  const done = mode === "signup" && flow.step === 2;

  return (
    <Dialog open={open} onClose={onClose} labelledBy="account-dialog-title">
      <div className="flex flex-col gap-5 overflow-y-auto p-6 pt-7">
        {!done && (
          <div className="flex flex-col gap-3 pr-8">
            <span className="grid size-11 place-items-center rounded-full bg-ice text-brand">
              <Icon size={19} aria-hidden />
            </span>
            <div className="flex flex-col gap-1">
              <h2 id="account-dialog-title" className="t-h5">
                {mode === "login" ? "Welcome back" : reason.title}
              </h2>
              <p className="t-body">
                {mode === "login" ? "Log in to continue where you left off." : reason.body(request?.job)}
              </p>
            </div>
          </div>
        )}

        {mode === "signup" && !done && <Steps steps={SIGNUP_STEPS} current={flow.step} />}

        {mode === "login" ? (
          <LoginForm initialEmail={flow.form.email} onSuccess={finish} onSwitchToSignup={(email) => switchTo("signup", email)} />
        ) : flow.step === 0 ? (
          <SignupDetailsStep flow={flow} onSwitchToLogin={(email) => switchTo("login", email)} />
        ) : flow.step === 1 ? (
          <VerifyStep flow={flow} onBack={() => flow.setStep(0)} />
        ) : (
          <>
            <span id="account-dialog-title" className="sr-only">
              Account created
            </span>
            <DoneStep name={flow.form.name} body="Your HireDue account is ready.">
              <button type="button" onClick={finish} className={clsx(primaryButton, "h-12 text-[15px]")}>
                {reason.finish}
              </button>
            </DoneStep>
          </>
        )}
      </div>
    </Dialog>
  );
}
