"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Pause, Play, RotateCcw, RotateCw } from "lucide-react";
import { BackHomeLink } from "@/components/layout/BackHomeLink";
import { LanguageSwitch } from "@/components/layout/LanguageSwitch";
import { WebGLFallback } from "@/components/overview/WebGLFallback";
import { dictionaries } from "@/i18n/dictionaries";
import { isWebGLAvailable } from "@/lib/webgl";
import {
  createInitialEclipseState,
  getGroundEclipseAppearance,
  selectEclipseModel,
  selectGroundMode,
  selectMainView,
  selectViewFromShadowPoint,
  stepEclipseTime,
  type EclipseModel,
  type GroundMode,
  type MainView,
  type ShadowPoint
} from "@/lib/solar-eclipse";
import type { Locale } from "@/types/domain";
import { SolarEclipseCanvas } from "./SolarEclipseCanvas";

const mainViewOrder: MainView[] = ["space", "ground"];
const spaceModelOrder: EclipseModel[] = ["total", "annular"];
const groundModeOrder: GroundMode[] = ["total", "partial", "annular"];
const timeStep = 0.04;
const playbackSpeedSteps = {
  slow: 0.006,
  normal: 0.014
} as const;

type PlaybackSpeed = keyof typeof playbackSpeedSteps;

function getPartialDirectionLabel(locale: Locale, point: ShadowPoint): string {
  const labels = dictionaries[locale].solarEclipse.partialDirections;
  const vertical = point.y > 0.25 ? "upper" : point.y < -0.25 ? "lower" : "";

  if (vertical === "upper" && point.x >= 0) {
    return labels.upperRight;
  }

  if (vertical === "upper") {
    return labels.upperLeft;
  }

  if (vertical === "lower" && point.x >= 0) {
    return labels.lowerRight;
  }

  if (vertical === "lower") {
    return labels.lowerLeft;
  }

  return point.x >= 0 ? labels.right : labels.left;
}

export function SolarEclipsePage({ locale }: { locale: Locale }) {
  const dictionary = dictionaries[locale];
  const eclipseCopy = dictionary.solarEclipse;
  const [state, setState] = useState(() => createInitialEclipseState());
  const [webglSupported] = useState(isWebGLAvailable);
  const [playing, setPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<PlaybackSpeed>("normal");
  const appearance = useMemo(() => getGroundEclipseAppearance(state), [state]);
  const partialDirection = getPartialDirectionLabel(locale, state.partialOffset);

  useEffect(() => {
    if (!playing) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setState((currentState) => {
        const nextState = stepEclipseTime(currentState, playbackSpeedSteps[playbackSpeed]);
        return nextState.time >= 1 ? { ...nextState, time: 0 } : nextState;
      });
    }, 80);

    return () => window.clearInterval(intervalId);
  }, [playbackSpeed, playing]);

  return (
    <main className="min-h-screen bg-space px-4 py-5 text-white md:px-6">
      <header className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm uppercase tracking-[0.22em] text-orbit">{dictionary.brandName}</p>
          <nav aria-label={locale === "zh" ? "页面操作" : "Page actions"} className="flex shrink-0 items-center gap-2">
            <BackHomeLink locale={locale} />
            <LanguageSwitch locale={locale} />
          </nav>
        </div>
        <h1 className="mt-2 text-2xl font-semibold md:text-4xl">{eclipseCopy.title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">{eclipseCopy.subtitle}</p>
      </header>

      <section className="mx-auto mt-5 max-w-7xl">
        <div className="flex flex-wrap gap-2 rounded-ui border border-white/10 bg-panel p-3">
          {mainViewOrder.map((view) => (
            <button
              key={view}
              type="button"
              aria-pressed={state.mainView === view}
              aria-label={eclipseCopy.mainViews[view]}
              onClick={() => setState((currentState) => selectMainView(currentState, view))}
              className="rounded-ui border border-white/15 px-3 py-2 text-sm text-white transition hover:bg-white/15 aria-pressed:border-orbit aria-pressed:bg-orbit aria-pressed:text-black"
            >
              {eclipseCopy.mainViews[view]}
            </button>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-2 rounded-ui border border-white/10 bg-panel p-3">
          {state.mainView === "space"
            ? spaceModelOrder.map((model) => (
                <button
                  key={model}
                  type="button"
                  aria-pressed={state.eclipseModel === model}
                  aria-label={eclipseCopy.spaceModels[model]}
                  onClick={() => setState((currentState) => selectEclipseModel(currentState, model))}
                  className="rounded-ui border border-white/15 px-3 py-2 text-sm text-white transition hover:bg-white/15 aria-pressed:border-orbit aria-pressed:bg-orbit aria-pressed:text-black"
                >
                  {eclipseCopy.spaceModels[model]}
                </button>
              ))
            : groundModeOrder.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  aria-pressed={state.groundMode === mode}
                  aria-label={eclipseCopy.groundModes[mode]}
                  onClick={() => setState((currentState) => selectGroundMode(currentState, mode))}
                  className="rounded-ui border border-white/15 px-3 py-2 text-sm text-white transition hover:bg-white/15 aria-pressed:border-orbit aria-pressed:bg-orbit aria-pressed:text-black"
                >
                  {eclipseCopy.groundModes[mode]}
                </button>
              ))}
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="overflow-hidden rounded-ui border border-white/10 bg-[#03050b]">
            {webglSupported ? (
              <SolarEclipseCanvas
                locale={locale}
                state={state}
                view={state.mainView}
                onShadowPointSelect={(point, groundMode) => setState((currentState) => selectViewFromShadowPoint(currentState, point, groundMode))}
              />
            ) : (
              <WebGLFallback locale={locale} />
            )}
          </div>

          <aside className="rounded-ui border border-white/10 bg-panel p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-orbit">{locale === "zh" ? "当前视角" : "Current view"}</p>
            <h2 className="mt-2 text-xl font-semibold">{state.mainView === "space" ? eclipseCopy.viewTitles.space : eclipseCopy.viewTitles[state.groundMode]}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">{state.mainView === "space" ? eclipseCopy.descriptions.space : eclipseCopy.descriptions[state.groundMode]}</p>
            {state.mainView === "ground" && state.groundMode === "partial" ? <p className="mt-3 text-sm text-cyan-100">{eclipseCopy.partialHint.replace("{direction}", partialDirection)}</p> : null}
            {state.mainView === "ground" ? (
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-ui border border-white/10 bg-black/25 p-3">
                  <dt className="text-slate-400">{locale === "zh" ? "遮挡比例" : "Coverage"}</dt>
                  <dd className="mt-1 font-semibold text-white">{Math.round(appearance.coverage * 100)}%</dd>
                </div>
                <div className="rounded-ui border border-white/10 bg-black/25 p-3">
                  <dt className="text-slate-400">{locale === "zh" ? "月球视直径" : "Moon apparent size"}</dt>
                  <dd className="mt-1 font-semibold text-white">{appearance.moonScale >= 1 ? (locale === "zh" ? "较大" : "larger") : locale === "zh" ? "较小" : "smaller"}</dd>
                </div>
              </dl>
            ) : null}
          </aside>
        </div>

        <div className="mt-4 rounded-ui border border-white/10 bg-panel p-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              aria-label={eclipseCopy.controls.rewind}
              title={eclipseCopy.controls.rewind}
              onClick={() => setState((currentState) => stepEclipseTime(currentState, -timeStep))}
              className="inline-flex h-10 w-10 items-center justify-center rounded-ui bg-white/10 text-white transition hover:bg-white/15"
            >
              <RotateCcw aria-hidden="true" size={18} />
            </button>
            <button
              type="button"
              aria-label={playing ? eclipseCopy.controls.pause : eclipseCopy.controls.play}
              onClick={() => setPlaying((currentPlaying) => !currentPlaying)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-ui bg-orbit text-black transition hover:bg-cyan-200"
            >
              {playing ? <Pause aria-hidden="true" size={18} /> : <Play aria-hidden="true" size={18} />}
            </button>
            <button
              type="button"
              aria-label={eclipseCopy.controls.forward}
              title={eclipseCopy.controls.forward}
              onClick={() => setState((currentState) => stepEclipseTime(currentState, timeStep))}
              className="inline-flex h-10 w-10 items-center justify-center rounded-ui bg-white/10 text-white transition hover:bg-white/15"
            >
              <RotateCw aria-hidden="true" size={18} />
            </button>
            <select
              aria-label={eclipseCopy.controls.speed}
              value={playbackSpeed}
              onChange={(event) => setPlaybackSpeed(event.target.value as PlaybackSpeed)}
              className="rounded-ui border border-white/15 bg-black/50 px-3 py-2 text-sm text-white"
            >
              <option value="slow">{eclipseCopy.controls.slow}</option>
              <option value="normal">{eclipseCopy.controls.normal}</option>
            </select>
            <div className="min-w-[260px] flex-1">
              <label className="flex items-center gap-3 text-sm text-slate-200">
                <span className="whitespace-nowrap">{eclipseCopy.controls.timeline}</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={state.time}
                  aria-label={eclipseCopy.controls.timeline}
                  onChange={(event) => setState((currentState) => ({ ...currentState, time: Number(event.target.value) }))}
                  className="w-full accent-orbit"
                />
              </label>
              <div className="ml-[6.8rem] mt-2 grid grid-cols-3 text-xs text-slate-400">
                <span className="text-left">{eclipseCopy.timelineLabels.start}</span>
                <span className="text-center">{eclipseCopy.timelineLabels.middle}</span>
                <span className="text-right">{eclipseCopy.timelineLabels.end}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
