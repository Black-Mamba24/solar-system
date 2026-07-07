"use client";

import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { parseLocale } from "@/lib/locale";
import { LunarEclipsePage } from "./LunarEclipsePage";

export function LunarEclipsePageClient() {
  const searchParams = useSearchParams();
  const locale = useMemo(() => parseLocale(searchParams.get("lang")), [searchParams]);

  return <LunarEclipsePage locale={locale} />;
}
