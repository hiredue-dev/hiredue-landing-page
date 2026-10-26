"use client";

import { MotionConfig } from "framer-motion";
import WaitlistProvider from "./providers/WaitlistProvider.jsx";
import { AuthProvider } from "@/features/auth/context/AuthContext.jsx";
import { AuthModalProvider } from "@/features/auth/components/FloatingAuthModal.jsx";
import AttributionCapture from "@/features/attribution/AttributionCapture.jsx";

export default function Providers({ children }) {
  /* reducedMotion="user": every framer-motion animation on the site honours
     the OS "reduce motion" setting (transforms drop, opacity still fades) */
  return (
    <MotionConfig reducedMotion="user">
      <AuthProvider>
        <AttributionCapture />
        <AuthModalProvider>
          <WaitlistProvider>{children}</WaitlistProvider>
        </AuthModalProvider>
      </AuthProvider>
    </MotionConfig>
  );
}
