"use client";

import { Suspense } from "react";
import SigninForm from "@/features/auth/components/SigninForm.jsx";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SigninForm />
    </Suspense>
  );
}
