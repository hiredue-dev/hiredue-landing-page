"use client";

import { motion } from "framer-motion";
import { Mark } from "@/components/site/ui/Mark";
import { marks } from "@/lib/assets";
import { whatsappHref } from "@/lib/whatsapp";

const MESSAGE = "Hi, I want to know more about HireDue.";

/** Fixed WhatsApp chat launcher, pinned bottom-right on every page. */
export function WhatsAppFloatingButton() {
  return (
    <a
      href={whatsappHref(undefined, MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with HireDue on WhatsApp"
      className="group fixed right-5 bottom-5 z-[60] sm:right-8 sm:bottom-8"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-60 [animation-duration:2.4s]" />
      <motion.span
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", bounce: 0.4, duration: 0.4 }}
        className="relative grid size-14 place-items-center rounded-full bg-[#25D366] shadow-[0_10px_30px_rgba(37,211,102,0.45)]"
      >
        <Mark src={marks.whatsapp} color="#ffffff" className="size-7" />
      </motion.span>
    </a>
  );
}
