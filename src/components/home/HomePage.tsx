import React from "react";
import { LanguageSwitch } from "@/components/layout/LanguageSwitch";
import { learningModules } from "@/data/modules";
import { dictionaries } from "@/i18n/dictionaries";
import type { Locale } from "@/types/domain";
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

        <div className="grid flex-1 items-end gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_460px]">
          <div className="relative min-h-[320px] overflow-hidden rounded-ui border border-white/10 bg-black/20 md:min-h-[520px]">
            <div className="absolute left-[-7rem] top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-sun shadow-[0_0_120px_rgba(248,196,92,0.38)] md:h-96 md:w-96" />
            <div className="absolute left-[-2rem] top-1/2 h-[22rem] w-[22rem] -translate-y-1/2 rounded-full border border-white/10 md:h-[34rem] md:w-[34rem]" />
            <div className="absolute left-[-6rem] top-1/2 h-[32rem] w-[32rem] -translate-y-1/2 rounded-full border border-orbit/25 md:h-[48rem] md:w-[48rem]" />
            <div className="absolute left-[-11rem] top-1/2 h-[42rem] w-[42rem] -translate-y-1/2 rounded-full border border-white/10 md:h-[62rem] md:w-[62rem]" />
          </div>

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
