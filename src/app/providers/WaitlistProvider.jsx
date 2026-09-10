"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import WaitlistContext from "./waitlist-context.js";

// Validation and modal code are only needed after someone opens the form.
const WaitlistModal = dynamic(
  () => import("@/features/waitlist/components/WaitlistModal.jsx"),
  { ssr: false },
);

const WaitlistProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prefillEmail, setPrefillEmail] = useState("");

  const value = useMemo(
    () => ({
      isOpen,
      prefillEmail,
      openWaitlist: (payload = {}) => {
        setPrefillEmail(payload.prefillEmail || "");
        setIsOpen(true);
      },
      closeWaitlist: () => {
        setIsOpen(false);
        setPrefillEmail("");
      },
    }),
    [isOpen, prefillEmail],
  );

  return (
    <WaitlistContext.Provider value={value}>
      {children}
      {isOpen ? <WaitlistModal /> : null}
    </WaitlistContext.Provider>
  );
};

export default WaitlistProvider;
