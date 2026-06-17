import type { Locale } from "@/types/domain";

export const defaultLocale: Locale = "zh";
export const locales: Locale[] = ["zh", "en"];

export function parseLocale(value: string | string[] | undefined | null): Locale {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === "en" || raw === "zh" ? raw : defaultLocale;
}

export function oppositeLocale(locale: Locale): Locale {
  return locale === "zh" ? "en" : "zh";
}

export function withLocaleSearchParams(searchParams: URLSearchParams, locale: Locale): string {
  const next = new URLSearchParams(searchParams);
  next.set("lang", locale);
  const query = next.toString();
  return query ? `?${query}` : "";
}
