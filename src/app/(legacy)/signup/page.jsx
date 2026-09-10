"use client";

import { Suspense } from "react";
import SignupForm from "@/features/auth/components/SignupForm.jsx";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SignupForm />
    </Suspense>
  );
}
