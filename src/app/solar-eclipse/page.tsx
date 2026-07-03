import React, { Suspense } from "react";
import { SolarEclipsePageClient } from "@/components/solar-eclipse/SolarEclipsePageClient";

export default function Page() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-space text-white" />}>
      <SolarEclipsePageClient />
    </Suspense>
  );
}
