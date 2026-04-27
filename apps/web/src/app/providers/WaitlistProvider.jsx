import { useMemo, useState } from "react";
import WaitlistModal from "@/features/waitlist/components/WaitlistModal.jsx";
import WaitlistContext from "./waitlist-context.js";

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
      <WaitlistModal />
    </WaitlistContext.Provider>
  );
};

export default WaitlistProvider;
