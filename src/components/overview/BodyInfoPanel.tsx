import React from "react";
import { dictionaries } from "@/i18n/dictionaries";
import type { CelestialBody, Locale } from "@/types/domain";

interface BodyInfoPanelProps {
  body: CelestialBody;
  locale: Locale;
}

export function BodyInfoPanel({ body, locale }: BodyInfoPanelProps) {
  const content = body.content[locale];
  const dictionary = dictionaries[locale];
  const numberLocale = locale === "zh" ? "zh-CN" : "en-US";

  return (
    <aside className="rounded-ui border border-white/10 bg-panel p-5 text-white">
      <p className="text-sm uppercase tracking-[0.18em] text-orbit">{dictionary.bodyTypes[body.type]}</p>
      <h2 className="mt-2 text-2xl font-semibold">{body.name[locale]}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-200">{content.summary}</p>

      <dl className="mt-5 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 xl:grid-cols-1">
        <div className="rounded-ui border border-white/10 bg-black/20 p-3">
          <dt className="text-slate-400">{dictionary.bodyInfo.radius}</dt>
          <dd className="mt-1 font-medium text-white">{body.radiusKm.toLocaleString(numberLocale)} km</dd>
        </div>
        {body.averageDistanceFromSunKm ? (
          <div className="rounded-ui border border-white/10 bg-black/20 p-3">
            <dt className="text-slate-400">{dictionary.bodyInfo.averageDistanceFromSun}</dt>
            <dd className="mt-1 font-medium text-white">{body.averageDistanceFromSunKm.toLocaleString(numberLocale)} km</dd>
          </div>
        ) : null}
      </dl>

      <h3 className="mt-5 text-sm font-semibold text-white">{dictionary.bodyInfo.whyItMatters}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-200">{content.whyItMatters}</p>

      <h3 className="mt-5 text-sm font-semibold text-white">{dictionary.bodyInfo.facts}</h3>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
        {content.facts.map((fact) => (
          <li key={fact} className="rounded-ui border border-white/10 bg-white/5 px-3 py-2">
            {fact}
          </li>
        ))}
      </ul>
    </aside>
  );
}
