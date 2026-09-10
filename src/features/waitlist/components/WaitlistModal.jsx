"use client";

import { useEffect } from "react";
import Modal from "@/components/ui/Modal/Modal.jsx";
import { useWaitlist } from "@/app/providers/waitlist-context.js";
import useWaitlistForm from "../hooks/useWaitlistForm.js";
import WaitlistForm from "./WaitlistForm.jsx";

const WaitlistModal = () => {
  const { isOpen, prefillEmail, closeWaitlist } = useWaitlist();
  const form = useWaitlistForm({ source: "waitlist_modal" });
  const { prefill } = form;

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    prefill(prefillEmail || "");
  }, [isOpen, prefill, prefillEmail]);

  const handleClose = () => {
    closeWaitlist();
    form.reset();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Get early access to HireDue"
    >
      <WaitlistForm form={form} />
    </Modal>
  );
};

export default WaitlistModal;
