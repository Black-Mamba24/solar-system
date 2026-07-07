"use client";

import { Pause, Play, Rewind, StepForward } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { BackHomeLink } from "@/components/layout/BackHomeLink";
import { LanguageSwitch } from "@/components/layout/LanguageSwitch";
import { WebGLFallback } from "@/components/overview/WebGLFallback";
import { dictionaries } from "@/i18n/dictionaries";
import {
  createInitialLunarEclipseState,
  getLunarEclipseStage,
  getLunarEclipseStageSequence,
  selectLunarEclipseCase,
  selectLunarEclipseView,
  stepLunarEclipseTime,
  type LunarEclipseCase,
  type LunarEclipseView
} from "@/lib/lunar-eclipse";
import { isWebGLAvailable } from "@/lib/webgl";
import type { Locale } from "@/types/domain";
import { LunarEclipseCanvas } from "./LunarEclipseCanvas";

const viewOrder: LunarEclipseView[] = ["space", "ground"];
const caseOrder: LunarEclipseCase[] = ["total", "partial"];
const playbackSpeedSteps = {
  slow: 0.004,
  normal: 0.012
} as const;

type PlaybackSpeed = keyof typeof playbackSpeedSteps;

function getStageDetailKey(eclipseCase: LunarEclipseCase, stageCode: ReturnType<typeof getLunarEclipseStageSequence>[number]): ReturnType<typeof getLunarEclipseStageSequence>[number] | "partialMax" {
  return eclipseCase === "partial" && stageCode === "MAX" ? "partialMax" : stageCode;
}

export function LunarEclipsePage({ locale }: { locale: Locale }) {
  const dictionary = dictionaries[locale];
  const copy = dictionary.lunarEclipse;
  const [state, setState] = useState(() => createInitialLunarEclipseState());
  const [webglSupported] = useState(isWebGLAvailable);
  const [playbackSpeed, setPlaybackSpeed] = useState<PlaybackSpeed>("normal");
  const stage = useMemo(() => getLunarEclipseStage(state), [state]);
  const visibleStages = useMemo(() => getLunarEclipseStageSequence(state.eclipseCase), [state.eclipseCase]);

  useEffect(() => {
    if (!state.playing) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setState((currentState) => {
        const nextState = stepLunarEclipseTime(currentState, playbackSpeedSteps[playbackSpeed]);
        return nextState.time >= 1 ? { ...nextState, time: 0 } : nextState;
      });
    }, 80);

    return () => window.clearInterval(intervalId);
  }, [playbackSpeed, state.playing]);

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
        <h1 className="mt-2 text-2xl font-semibold md:text-4xl">{copy.title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">{copy.subtitle}</p>
      </header>

      <section className="mx-auto mt-6 grid max-w-7xl gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-ui border border-white/10 bg-panel p-3 shadow-2xl shadow-black/25">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {viewOrder.map((view) => (
              <button
                key={view}
                type="button"
                aria-pressed={state.mainView === view}
                aria-label={copy.mainViews[view]}
                className="rounded-ui border border-white/10 px-3 py-2 text-sm text-slate-200 transition hover:border-orbit aria-pressed:border-orbit aria-pressed:bg-orbit/20 aria-pressed:text-white"
                onClick={() => setState((currentState) => selectLunarEclipseView(currentState, view))}
              >
                {copy.mainViews[view]}
              </button>
            ))}
            <span className="mx-1 h-6 w-px bg-white/10" />
            {caseOrder.map((eclipseCase) => (
              <button
                key={eclipseCase}
                type="button"
                aria-pressed={state.eclipseCase === eclipseCase}
                aria-label={copy.cases[eclipseCase]}
                className="rounded-ui border border-white/10 px-3 py-2 text-sm text-slate-200 transition hover:border-orbit aria-pressed:border-orbit aria-pressed:bg-orbit/20 aria-pressed:text-white"
                onClick={() => setState((currentState) => selectLunarEclipseCase(currentState, eclipseCase))}
              >
                {copy.cases[eclipseCase]}
              </button>
            ))}
          </div>

          <div className="h-[480px] overflow-hidden rounded-ui border border-white/10 bg-black/30">
            {webglSupported ? <LunarEclipseCanvas state={state} /> : <WebGLFallback locale={locale} />}
          </div>

          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-300">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-400/70" />
              {copy.legend.penumbra}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-950" />
              {copy.legend.umbra}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-700" />
              {copy.legend.redLight}
            </span>
          </div>

          <div className="mt-3 grid gap-3 rounded-ui border border-white/10 bg-white/[0.04] p-3 md:grid-cols-[auto_1fr] md:items-center">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                aria-label={copy.controls.rewind}
                title={copy.controls.rewind}
                className="rounded-ui border border-white/10 p-2 text-slate-200 hover:border-orbit"
                onClick={() => setState((currentState) => stepLunarEclipseTime(currentState, -0.08))}
              >
                <Rewind className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label={state.playing ? copy.controls.pause : copy.controls.play}
                title={state.playing ? copy.controls.pause : copy.controls.play}
                className="rounded-ui border border-orbit bg-orbit/20 p-2 text-white hover:bg-orbit/30"
                onClick={() => setState((currentState) => ({ ...currentState, playing: !currentState.playing }))}
              >
                {state.playing ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
              </button>
              <button
                type="button"
                aria-label={copy.controls.forward}
                title={copy.controls.forward}
                className="rounded-ui border border-white/10 p-2 text-slate-200 hover:border-orbit"
                onClick={() => setState((currentState) => stepLunarEclipseTime(currentState, 0.08))}
              >
                <StepForward className="h-4 w-4" aria-hidden="true" />
              </button>
              <select
                aria-label={copy.controls.speed}
                value={playbackSpeed}
                className="rounded-ui border border-white/10 bg-space px-3 py-2 text-sm text-white"
                onChange={(event) => setPlaybackSpeed(event.target.value as PlaybackSpeed)}
              >
                <option value="slow">{copy.controls.slow}</option>
                <option value="normal">{copy.controls.normal}</option>
              </select>
            </div>
            <label className="grid gap-2 text-xs text-slate-300">
              <span>{copy.controls.timeline}</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={state.time}
                aria-label={copy.controls.timeline}
                onChange={(event) => setState((currentState) => ({ ...currentState, time: Number(event.target.value), playing: false }))}
              />
            </label>
          </div>

          <div className="mt-3 grid gap-1 text-center text-xs text-slate-300" style={{ gridTemplateColumns: `repeat(${visibleStages.length}, minmax(0, 1fr))` }}>
            {visibleStages.map((stageCode) => (
              <span key={stageCode} className={stage.code === stageCode ? "rounded-full bg-orbit/20 px-2 py-1 text-white" : "px-2 py-1"}>
                {copy.stages[stageCode]}
              </span>
            ))}
          </div>
          <p className="mt-3 rounded-ui border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-200">{copy.stageDetails[getStageDetailKey(state.eclipseCase, stage.code)]}</p>
        </div>

        <aside className="rounded-ui border border-white/10 bg-panel p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-orbit">{copy.viewTitles[state.mainView]}</p>
          <h2 className="mt-2 text-xl font-semibold">{copy.cases[state.eclipseCase]}</h2>
          <div className="mt-4 space-y-4 text-sm leading-6 text-slate-300">
            <p>{copy.descriptions[state.mainView]}</p>
            <p>{copy.descriptions[state.eclipseCase]}</p>
            <p>{copy.descriptions.cause}</p>
            <p>{copy.descriptions.fullMoon}</p>
            <p>{copy.descriptions.shadowZones}</p>
            <p>{copy.descriptions.redMoon}</p>
          </div>
          <div className="mt-5 border-t border-white/10 pt-4">
            <p className="text-xs uppercase tracking-[0.18em] text-orbit">{copy.controls.timeline}</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
              {visibleStages.map((stageCode) => (
                <li key={stageCode}>{copy.stageDetails[getStageDetailKey(state.eclipseCase, stageCode)]}</li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}
