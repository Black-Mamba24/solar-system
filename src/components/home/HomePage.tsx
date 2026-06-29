import React from "react";
import { LanguageSwitch } from "@/components/layout/LanguageSwitch";
import { learningModules } from "@/data/modules";
import { dictionaries } from "@/i18n/dictionaries";
import type { Locale } from "@/types/domain";
import { HomeSunHeroStage } from "./HomeSunHeroStage";
import { ModuleCard } from "./ModuleCard";

export function HomePage({ locale }: { locale: Locale }) {
  const dictionary = dictionaries[locale];

  return (
    <main className="relative min-h-screen overflow-hidden bg-space px-5 py-6 text-white md:px-8">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(5,7,13,0.95)_0%,rgba(8,15,29,0.92)_48%,rgba(5,7,13,1)_100%)]" />
      <div className="absolute inset-0 opacity-45 [background-image:radial-gradient(circle,rgba(255,255,255,0.58)_1px,transparent_1px)] [background-size:42px_42px]" />
      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-orbit">{dictionary.brandName}</p>
            <h1 className="mt-2 text-3xl font-semibold text-white md:text-5xl">{dictionary.homeTitle}</h1>
          </div>
          <LanguageSwitch locale={locale} />
        </header>

        <div className="grid flex-1 items-stretch gap-8 py-6 lg:grid-cols-[minmax(0,1fr)_460px] lg:py-8">
          <HomeSunHeroStage locale={locale} />

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {learningModules.map((module) => (
              <ModuleCard key={module.id} locale={locale} module={module} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
