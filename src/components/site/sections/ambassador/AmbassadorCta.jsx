"use client";

import { Button } from "@/components/site/ui/Button";
import { EndCta } from "@/components/site/sections/EndCta";
import { useAuthModal } from "@/features/auth/components/FloatingAuthModal.jsx";
import { ambassadorPage } from "@/lib/content";

const { cta, applyLabel } = ambassadorPage;

export function AmbassadorCta() {
  const { showModal } = useAuthModal();
  return (
    <EndCta
      id="apply"
      title={cta.title}
      description={cta.description}
      action={
        <Button variant="dark" onClick={() => showModal({ view: "signup" })}>
          {applyLabel}
        </Button>
      }
    />
  );
}
