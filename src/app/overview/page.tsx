import React from "react";
import { OverviewPage } from "@/components/overview/OverviewPage";
import { parseLocale } from "@/lib/locale";

interface PageProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

export default function Page({ searchParams }: PageProps) {
  return <OverviewPage locale={parseLocale(searchParams?.lang)} />;
}
