import React, { Suspense } from "react";
import { LunarEclipsePageClient } from "@/components/lunar-eclipse/LunarEclipsePageClient";

export default function Page() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-space text-white" />}>
      <LunarEclipsePageClient />
    </Suspense>
  );
}
