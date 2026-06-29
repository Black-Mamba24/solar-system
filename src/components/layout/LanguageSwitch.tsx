"use client";

import React from "react";
import { useEffect } from "react";
import { Languages } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { dictionaries } from "@/i18n/dictionaries";
import { oppositeLocale, withLocaleSearchParams } from "@/lib/locale";
import type { Locale } from "@/types/domain";

interface LanguageSwitchProps {
  locale: Locale;
}

export function LanguageSwitch({ locale }: LanguageSwitchProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const nextLocale = oppositeLocale(locale);
  const nextHtmlLang = nextLocale === "en" ? "en" : "zh-CN";
  const nextSearchParams = new URLSearchParams(searchParams.toString());
  const nextHref = `${pathname}${withLocaleSearchParams(nextSearchParams, nextLocale)}`;

  useEffect(() => {
    document.documentElement.setAttribute("lang", locale === "en" ? "en" : "zh-CN");
  }, [locale]);

  function switchLanguage() {
    document.documentElement.setAttribute("lang", nextHtmlLang);
    window.setTimeout(() => document.documentElement.setAttribute("lang", nextHtmlLang), 0);
  }

  return (
    <Link
      href={nextHref}
      role="button"
      aria-label={dictionaries[locale].switchLanguage}
      className="inline-flex items-center gap-2 rounded-ui border border-white/15 bg-white/10 px-3 py-2 text-sm text-white transition hover:bg-white/15"
      onClick={switchLanguage}
    >
      <Languages aria-hidden="true" size={16} />
      <span>{dictionaries[nextLocale].languageName}</span>
    </Link>
  );
}
