import React, { Suspense } from "react";
import { HomePageClient } from "@/components/home/HomePageClient";

export default function Page() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-space text-white" />}>
      <HomePageClient />
    </Suspense>
  );
}
