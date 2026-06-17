"use client";

import React from "react";
import { Languages } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { dictionaries } from "@/i18n/dictionaries";
import { oppositeLocale, withLocaleSearchParams } from "@/lib/locale";
import type { Locale } from "@/types/domain";

interface LanguageSwitchProps {
  locale: Locale;
}

export function LanguageSwitch({ locale }: LanguageSwitchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const nextLocale = oppositeLocale(locale);
  const nextSearchParams = new URLSearchParams(searchParams.toString());

  return (
    <button
      type="button"
      aria-label={dictionaries[locale].switchLanguage}
      className="inline-flex items-center gap-2 rounded-ui border border-white/15 bg-white/10 px-3 py-2 text-sm text-white transition hover:bg-white/15"
      onClick={() => router.push(`${pathname}${withLocaleSearchParams(nextSearchParams, nextLocale)}`)}
    >
      <Languages aria-hidden="true" size={16} />
      <span>{dictionaries[nextLocale].languageName}</span>
    </button>
  );
}
