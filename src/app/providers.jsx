"use client";

import WaitlistProvider from "./providers/WaitlistProvider.jsx";

export default function Providers({ children }) {
  return <WaitlistProvider>{children}</WaitlistProvider>;
}
