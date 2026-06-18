import React from "react";
import { dictionaries } from "@/i18n/dictionaries";
import type { Locale } from "@/types/domain";

export function WebGLFallback({ locale }: { locale: Locale }) {
  const dictionary = dictionaries[locale];

  return (
    <section className="rounded-ui border border-white/10 bg-panel p-6 text-white">
      <h2 className="text-xl font-semibold">{dictionary.fallback.title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-300">{dictionary.fallback.body}</p>
    </section>
  );
}
