"use client";

import clsx from "clsx";
import { Button } from "@/components/site/ui/Button";
import { Reveal } from "@/components/site/ui/Primitives";
import { useAuthModal } from "@/features/auth/components/FloatingAuthModal.jsx";
import { useAuth } from "@/features/auth/context/AuthContext.jsx";
import { endCta } from "@/lib/content";

/**
 * The blue band that closes a content page (blog post, about, ambassadors)
 * with one next step. By default that's sign-up, or the download for someone
 * already signed in; `action` replaces it.
 */
export function EndCta({ title = endCta.title, description = endCta.description, action, id, className }) {
  const { showModal } = useAuthModal();
  const { isAuthenticated } = useAuth();

  return (
    <section id={id} className={clsx("relative pb-[100px] min-[810px]:pb-[160px]", className)}>
      <div className="container-page">
        <Reveal
          y={30}
          className="relative overflow-hidden rounded-[30px] bg-[linear-gradient(133deg,#406ae4_0%,#3b82f6_100%)] p-[30px] min-[810px]:p-[60px]"
        >
          {/* two soft lights so the slab is not a flat rectangle of blue */}
          <span
            aria-hidden
            className="pointer-events-none absolute -top-[120px] -right-[60px] size-[320px] rounded-full bg-white/15 blur-[60px]"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-[140px] -left-[40px] size-[280px] rounded-full bg-[#8fc0ff]/25 blur-[70px]"
          />

          <div className="relative z-1 flex flex-col items-start gap-6 min-[810px]:items-center min-[810px]:text-center">
            <div className="flex max-w-[620px] flex-col gap-2.5">
              <h2 className="t-h2 text-white">{title}</h2>
              <p className="text-[18px] leading-[1.3] font-medium text-white/80">{description}</p>
            </div>
            {/* dark, not the usual blue: it sits on a blue slab */}
            {action ??
              (isAuthenticated ? (
                <Button variant="dark" href={endCta.signedIn.href}>
                  {endCta.signedIn.label}
                </Button>
              ) : (
                <Button variant="dark" onClick={() => showModal({ view: "signup" })}>
                  {endCta.label}
                </Button>
              ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
