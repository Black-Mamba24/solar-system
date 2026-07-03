import React from "react";
import Link from "next/link";
import { dictionaries } from "@/i18n/dictionaries";
import type { LearningModule, Locale } from "@/types/domain";

interface ModuleCardProps {
  locale: Locale;
  module: LearningModule;
}

export function ModuleCard({ locale, module }: ModuleCardProps) {
  const title = module.title[locale];
  const description = module.description[locale];
  const entryLabel = module.id === "overview" ? dictionaries[locale].enterOverview : dictionaries[locale].enterModule;

  if (module.status === "available" && module.route) {
    return (
      <Link
        href={`${module.route}?lang=${locale}`}
        aria-label={`${entryLabel}: ${title}`}
        className="group rounded-ui border border-orbit/45 bg-panel p-4 text-left shadow-2xl shadow-black/25 transition hover:border-orbit hover:bg-white/10 focus-visible:outline-orbit"
      >
        <span className="text-xs uppercase tracking-[0.18em] text-orbit">{entryLabel}</span>
        <h2 className="mt-3 text-xl font-semibold text-white">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
      </Link>
    );
  }

  return (
    <article data-disabled="true" className="rounded-ui border border-white/10 bg-white/[0.06] p-4 text-left opacity-70">
      <span className="text-xs uppercase tracking-[0.18em] text-slate-400">{dictionaries[locale].comingSoon}</span>
      <h2 className="mt-3 text-xl font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
    </article>
  );
}
