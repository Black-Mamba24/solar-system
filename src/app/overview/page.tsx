import React, { Suspense } from "react";
import { OverviewPageClient } from "@/components/overview/OverviewPageClient";

export default function Page() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-space text-white" />}>
      <OverviewPageClient />
    </Suspense>
  );
}
