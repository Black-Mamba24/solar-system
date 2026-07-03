"use client";

import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { parseLocale } from "@/lib/locale";
import { SolarEclipsePage } from "./SolarEclipsePage";

export function SolarEclipsePageClient() {
  const searchParams = useSearchParams();
  const locale = useMemo(() => parseLocale(searchParams.get("lang")), [searchParams]);

  return <SolarEclipsePage locale={locale} />;
}
