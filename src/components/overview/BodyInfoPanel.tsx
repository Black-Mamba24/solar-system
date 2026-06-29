"use client";

import Image from "next/image";
import { Volume2, VolumeX } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { assetSources } from "@/data/assets";
import { dictionaries } from "@/i18n/dictionaries";
import { withBasePath } from "@/lib/base-path";
import type { CelestialBody, Locale } from "@/types/domain";

interface BodyInfoPanelProps {
  body: CelestialBody;
  locale: Locale;
}

interface MetricCard {
  label: string;
  value: React.ReactNode;
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

function formatMoonCount(count: number, locale: Locale, numberLocale: string): string {
  return locale === "zh" ? `共有 ${count.toLocaleString(numberLocale)} 颗已确认卫星` : `${count.toLocaleString(numberLocale)} confirmed moons`;
}

function formatMoonDescription(moon: NonNullable<CelestialBody["moons"]>["names"][number], locale: Locale): string {
  const description = moon.description[locale];
  if (!moon.category) return description;
  return locale === "zh" ? `属于${moon.category.zh}。${description}` : `Part of the ${moon.category.en.toLowerCase()}. ${description}`;
}

function getSpeechLanguage(locale: Locale): string {
  return locale === "zh" ? "zh-CN" : "en-US";
}

function getPreferredMaleVoice(voices: SpeechSynthesisVoice[], locale: Locale): SpeechSynthesisVoice | undefined {
  const languagePrefix = locale === "zh" ? "zh" : "en";
  const localizedVoices = voices.filter((voice) => voice.lang.toLowerCase().startsWith(languagePrefix));
  const femaleVoicePattern = /\bfemale\b|\bwoman\b|女|xiaoxiao|xiaoyi|xiaobei|xiaomo|xiaoqiu|xiaorui|xiaoshuang|xiaoxuan|tingting|meijia|sinji|huihui|hanhan|yaoyao|susan|samantha|victoria|karen|zira|hazel|aria|jenny/i;
  const strongMaleVoicePattern = /\bmale\b|\bman\b|男|yunjian|yunxi|yunyang|kangkang|liang|zhiyu|zhiwei|david|daniel|alex|tom|mark|george|guy|ryan|liam|brian|fred|ralph|aaron|eddy|reed|rocko/i;
  const weakMaleVoicePattern = /microsoft.*(kang|yun|david|guy)|google.*male/i;
  const findMaleVoice = (candidateVoices: SpeechSynthesisVoice[]) => candidateVoices.find((voice) => {
    const signature = `${voice.name} ${voice.voiceURI}`;
    return !femaleVoicePattern.test(signature) && (strongMaleVoicePattern.test(signature) || weakMaleVoicePattern.test(signature));
  });
  const findNonFemaleVoice = (candidateVoices: SpeechSynthesisVoice[]) => candidateVoices.find((voice) => !femaleVoicePattern.test(`${voice.name} ${voice.voiceURI}`));

  return findMaleVoice(localizedVoices) ?? findNonFemaleVoice(localizedVoices);
}

export function BodyInfoPanel({ body, locale }: BodyInfoPanelProps) {
  const content = body.content[locale];
  const dictionary = dictionaries[locale];
  const numberLocale = locale === "zh" ? "zh-CN" : "en-US";
  const asset = assetSources.find((source) => source.id === body.textureAssetId);
  const comparePeriodsToEarth = body.type !== "moon";
  const [speaking, setSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [speechVoices, setSpeechVoices] = useState<SpeechSynthesisVoice[]>([]);
  const speechText = useMemo(() => `${body.name[locale]}。${content.summary}`, [body.name, content.summary, locale]);

  useEffect(() => {
    const supported = typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
    setSpeechSupported(supported);
    if (!supported) {
      return;
    }

    const updateVoices = () => setSpeechVoices(window.speechSynthesis.getVoices());
    updateVoices();
    if (typeof window.speechSynthesis.addEventListener === "function") {
      window.speechSynthesis.addEventListener("voiceschanged", updateVoices);
      return () => window.speechSynthesis.removeEventListener("voiceschanged", updateVoices);
    }

    window.speechSynthesis.onvoiceschanged = updateVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [body.id, locale]);

  const handleSpeechToggle = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
      setSpeechSupported(false);
      return;
    }

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.resume?.();
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = getSpeechLanguage(locale);
    utterance.pitch = 0.55;
    utterance.rate = locale === "zh" ? 0.88 : 0.86;
    utterance.volume = 1;
    utterance.voice = getPreferredMaleVoice(speechVoices.length > 0 ? speechVoices : window.speechSynthesis.getVoices(), locale) ?? null;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }, [locale, speaking, speechText, speechVoices]);

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
    body.atmosphere
      ? {
          label: dictionary.bodyInfo.atmosphere,
          value: body.atmosphere[locale]
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
          value: formatComparedValue(formatDurationFromHours(body.rotationPeriodHours, locale), comparePeriodsToEarth ? Math.abs(body.rotationPeriodHours) / earthRotationHours : undefined, locale)
        }
      : undefined,
    body.orbit
      ? {
          label: dictionary.bodyInfo.orbitalPeriod,
          value: formatComparedValue(formatDurationFromDays(body.orbit.orbitalPeriodDays, locale), comparePeriodsToEarth ? body.orbit.orbitalPeriodDays / earthOrbitalDays : undefined, locale)
        }
      : undefined,
    body.moons
      ? {
          label: dictionary.bodyInfo.moons,
          value:
            body.moons.count === 0
              ? dictionary.bodyInfo.noMoons
              : body.moons.names.length > 1
                ? (
                    <div className="space-y-2">
                      <p>{formatMoonCount(body.moons.count, locale, numberLocale)}</p>
                      <ol className="list-decimal space-y-2 pl-5">
                        {body.moons.names.map((moon) => (
                          <li key={moon.name.en}>
                            <span className="font-medium">{moon.name[locale]}</span>
                            <span className="text-slate-300">：{formatMoonDescription(moon, locale)}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )
                : `${body.moons.count.toLocaleString(numberLocale)} · ${body.moons.names[0]?.name[locale] ?? ""}`
        }
      : undefined
  ];
  const metricCards = metricCardCandidates.filter((card): card is MetricCard => Boolean(card));

  return (
    <aside className="rounded-ui border border-white/10 bg-panel p-5 text-white xl:max-h-[calc(100vh-7rem)] xl:overflow-y-auto">
      <p className="text-sm uppercase tracking-[0.18em] text-orbit">{dictionary.bodyTypes[body.type]}</p>
      <div className="mt-2 flex items-center gap-2">
        <h2 className="text-2xl font-semibold">{body.name[locale]}</h2>
        <button
          type="button"
          onClick={handleSpeechToggle}
          disabled={!speechSupported}
          aria-label={speechSupported ? (speaking ? dictionary.bodyInfo.stopSpeaking : dictionary.bodyInfo.speakIntro) : dictionary.bodyInfo.speechUnavailable}
          title={speechSupported ? (speaking ? dictionary.bodyInfo.stopSpeaking : dictionary.bodyInfo.speakIntro) : dictionary.bodyInfo.speechUnavailable}
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-ui border border-white/10 bg-white/[0.08] text-cyan-100 transition hover:border-cyan-300/50 hover:bg-cyan-300/[0.12] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {speaking ? <VolumeX aria-hidden="true" size={18} /> : <Volume2 aria-hidden="true" size={18} />}
        </button>
      </div>
      {asset ? (
        <Image src={withBasePath(asset.localPath)} alt={body.name[locale]} width={960} height={540} className="mt-4 aspect-[16/9] w-full rounded-ui border border-white/10 object-cover" />
      ) : null}
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
