import { useEffect } from "react";
import Modal from "@/components/ui/Modal/Modal.jsx";
import { useWaitlist } from "@/app/providers/waitlist-context.js";
import useWaitlistForm from "../hooks/useWaitlistForm.js";
import WaitlistForm from "./WaitlistForm.jsx";

const WaitlistModal = () => {
  const { isOpen, prefillEmail, closeWaitlist } = useWaitlist();
  const form = useWaitlistForm({ source: "waitlist_modal" });

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    form.prefill(prefillEmail || "");
  }, [isOpen, prefillEmail]);

  const handleClose = () => {
    closeWaitlist();
    form.reset();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Get early access to HireDue">
      <WaitlistForm form={form} />
    </Modal>
  );
};

export default WaitlistModal;
