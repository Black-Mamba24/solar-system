import React from "react";
import { dictionaries } from "@/i18n/dictionaries";
import type { CelestialBody, Locale } from "@/types/domain";

interface BodyInfoPanelProps {
  body: CelestialBody;
  locale: Locale;
}

interface MetricCard {
  label: string;
  value: string;
}

const earthRadiusKm = 6371;
const earthAverageDistanceKm = 149600000;
const earthGravityMs2 = 9.81;
const earthRotationHours = 23.93;
const earthOrbitalDays = 365.25;

function formatNumber(value: number, locale: Locale, maximumFractionDigits = 2): string {
  return value.toLocaleString(locale === "zh" ? "zh-CN" : "en-US", { maximumFractionDigits });
}

function formatRatio(value: number, locale: Locale): string {
  return formatNumber(value, locale, value >= 10 ? 1 : 2);
}

function formatComparedValue(value: string, ratio: number | undefined, locale: Locale): string {
  const dictionary = dictionaries[locale];

  if (ratio === undefined) {
    return value;
  }

  if (Math.abs(ratio - 1) < 0.005) {
    return `${value} · ${dictionary.bodyInfo.earthBaseline}`;
  }

  return locale === "zh" ? `${value} · ${dictionary.bodyInfo.earthComparison} ${formatRatio(ratio, locale)} 倍` : `${value} · ${dictionary.bodyInfo.earthComparison}${formatRatio(ratio, locale)}`;
}

function formatDurationFromHours(hours: number, locale: Locale): string {
  const absHours = Math.abs(hours);
  const suffix = hours < 0 ? (locale === "zh" ? "（逆行）" : " retrograde") : "";

  if (absHours >= 48) {
    return `${formatNumber(absHours / 24, locale)} ${locale === "zh" ? "天" : "days"}${suffix}`;
  }

  return `${formatNumber(absHours, locale)} ${locale === "zh" ? "小时" : "hours"}${suffix}`;
}

function formatDurationFromDays(days: number, locale: Locale): string {
  if (days >= 730) {
    return `${formatNumber(days / 365.25, locale, 1)} ${locale === "zh" ? "地球年" : "Earth years"}`;
  }

  return `${formatNumber(days, locale, 1)} ${locale === "zh" ? "天" : "days"}`;
}

export function BodyInfoPanel({ body, locale }: BodyInfoPanelProps) {
  const content = body.content[locale];
  const dictionary = dictionaries[locale];
  const numberLocale = locale === "zh" ? "zh-CN" : "en-US";
  const moonNames = body.moons?.names.map((moon) => moon[locale]).join(locale === "zh" ? "、" : ", ");

  const metricCardCandidates: Array<MetricCard | undefined> = [
    {
      label: dictionary.bodyInfo.radius,
      value: formatComparedValue(`${body.radiusKm.toLocaleString(numberLocale)} km`, body.radiusKm / earthRadiusKm, locale)
    },
    body.averageDistanceFromSunKm
      ? {
          label: dictionary.bodyInfo.averageDistanceFromSun,
          value: formatComparedValue(`${body.averageDistanceFromSunKm.toLocaleString(numberLocale)} km`, body.averageDistanceFromSunKm / earthAverageDistanceKm, locale)
        }
      : {
          label: dictionary.bodyInfo.averageDistanceFromSun,
          value: dictionary.bodyInfo.notApplicable
        },
    body.surfaceGravityMs2 !== undefined
      ? {
          label: dictionary.bodyInfo.surfaceGravity,
          value: formatComparedValue(`${formatNumber(body.surfaceGravityMs2, locale)} m/s²`, body.surfaceGravityMs2 / earthGravityMs2, locale)
        }
      : undefined,
    body.temperatureRangeC
      ? {
          label: dictionary.bodyInfo.temperatureRange,
          value:
            body.temperatureRangeC.minC === body.temperatureRangeC.maxC
              ? `${formatNumber(body.temperatureRangeC.minC, locale)} °C`
              : `${formatNumber(body.temperatureRangeC.minC, locale)} – ${formatNumber(body.temperatureRangeC.maxC, locale)} °C`
        }
      : undefined,
    body.rotationPeriodHours !== undefined
      ? {
          label: dictionary.bodyInfo.rotationPeriod,
          value: formatComparedValue(formatDurationFromHours(body.rotationPeriodHours, locale), Math.abs(body.rotationPeriodHours) / earthRotationHours, locale)
        }
      : undefined,
    body.orbit
      ? {
          label: dictionary.bodyInfo.orbitalPeriod,
          value: formatComparedValue(formatDurationFromDays(body.orbit.orbitalPeriodDays, locale), body.orbit.orbitalPeriodDays / earthOrbitalDays, locale)
        }
      : undefined,
    body.moons
      ? {
          label: dictionary.bodyInfo.moons,
          value:
            body.moons.count === 0
              ? dictionary.bodyInfo.noMoons
              : `${body.moons.count.toLocaleString(numberLocale)} · ${moonNames}${body.moons.note ? ` · ${body.moons.note[locale]}` : ""}`
        }
      : undefined
  ];
  const metricCards = metricCardCandidates.filter((card): card is MetricCard => Boolean(card));

  return (
    <aside className="rounded-ui border border-white/10 bg-panel p-5 text-white xl:max-h-[calc(100vh-7rem)] xl:overflow-y-auto">
      <p className="text-sm uppercase tracking-[0.18em] text-orbit">{dictionary.bodyTypes[body.type]}</p>
      <h2 className="mt-2 text-2xl font-semibold">{body.name[locale]}</h2>
      <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-200">{content.summary}</p>

      <dl className="mt-5 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 xl:grid-cols-1">
        {metricCards.map((card) => (
          <div key={card.label} className="rounded-ui border border-white/10 bg-black/20 p-3">
            <dt className="text-slate-400">{card.label}</dt>
            <dd className="mt-1 leading-6 text-white">{card.value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
