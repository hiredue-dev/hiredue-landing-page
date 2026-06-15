"use client";

import WaitlistProvider from "./providers/WaitlistProvider.jsx";
import { AuthProvider } from "@/features/auth/context/AuthContext.jsx";

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <WaitlistProvider>{children}</WaitlistProvider>
    </AuthProvider>
  );
}
