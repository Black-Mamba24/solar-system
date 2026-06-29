"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { parseLocale } from "@/lib/locale";
import { OverviewPage } from "./OverviewPage";

export function OverviewPageClient() {
  const searchParams = useSearchParams();
  return <OverviewPage locale={parseLocale(searchParams.get("lang"))} />;
}
