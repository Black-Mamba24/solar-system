"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { parseLocale } from "@/lib/locale";
import { HomePage } from "./HomePage";

export function HomePageClient() {
  const searchParams = useSearchParams();
  return <HomePage locale={parseLocale(searchParams.get("lang"))} />;
}
