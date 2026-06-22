"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { parseLocale } from "@/lib/locale";

export function DocumentLanguage() {
  const searchParams = useSearchParams();
  const searchParamString = searchParams.toString();

  useEffect(() => {
    document.documentElement.setAttribute("lang", parseLocale(new URLSearchParams(searchParamString).get("lang")) === "en" ? "en" : "zh-CN");
  }, [searchParamString]);

  return null;
}
