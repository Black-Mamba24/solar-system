"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { parseLocale } from "@/lib/locale";

export function DocumentLanguage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    document.documentElement.lang = parseLocale(searchParams.get("lang")) === "en" ? "en" : "zh-CN";
  }, [searchParams]);

  return null;
}
