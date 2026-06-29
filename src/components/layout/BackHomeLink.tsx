import React from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { dictionaries } from "@/i18n/dictionaries";
import type { Locale } from "@/types/domain";

interface BackHomeLinkProps {
  locale: Locale;
}

export function BackHomeLink({ locale }: BackHomeLinkProps) {
  const label = dictionaries[locale].backHome;

  return (
    <Link
      href={`/?lang=${locale}`}
      aria-label={label}
      title={label}
      className="inline-flex items-center gap-2 rounded-ui border border-white/15 bg-white/10 px-3 py-2 text-sm text-white transition hover:bg-white/15"
    >
      <ArrowLeft aria-hidden="true" size={16} />
      <span>{label}</span>
    </Link>
  );
}
