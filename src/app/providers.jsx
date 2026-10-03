"use client";

import WaitlistProvider from "./providers/WaitlistProvider.jsx";
import { AuthProvider } from "@/features/auth/context/AuthContext.jsx";
import { AuthModalProvider } from "@/features/auth/components/FloatingAuthModal.jsx";

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <AuthModalProvider>
        <WaitlistProvider>{children}</WaitlistProvider>
      </AuthModalProvider>
    </AuthProvider>
  );
}
