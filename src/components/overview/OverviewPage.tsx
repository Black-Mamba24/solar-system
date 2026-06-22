"use client";

import React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LanguageSwitch } from "@/components/layout/LanguageSwitch";
import { SolarSystemCanvas } from "@/components/solar-system/SolarSystemCanvas";
import { bodies } from "@/data/bodies";
import { dictionaries } from "@/i18n/dictionaries";
import { parseUrlState, serializeUrlState } from "@/lib/url-state";
import type { CameraPreset, LayerKey, Locale } from "@/types/domain";
import { BodyInfoPanel } from "./BodyInfoPanel";
import { ControlBar } from "./ControlBar";
import { WebGLFallback } from "./WebGLFallback";

function getValidBodyId(bodyId: string | undefined): string {
  return bodies.some((body) => body.id === bodyId) ? bodyId! : "earth";
}

function serializeUiState(state: { selectedBodyId: string; camera: CameraPreset; layers: Record<LayerKey, boolean> }): string {
  return JSON.stringify(state);
}

export function isWebGLAvailable(): boolean {
  if (typeof document === "undefined") {
    return true;
  }

  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl") || canvas.getContext("webgl2"));
  } catch {
    return false;
  }
}

export function OverviewPage({ locale }: { locale: Locale }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamString = searchParams.toString();
  const lastSyncedSearchParams = useRef(searchParamString);
  const urlState = useMemo(() => parseUrlState(new URLSearchParams(searchParamString)), [searchParamString]);
  const activeLocale = searchParams.has("lang") ? urlState.locale : locale;
  const dictionary = dictionaries[activeLocale];
  const [webglSupported] = useState(isWebGLAvailable);
  const [selectedBodyId, setSelectedBodyId] = useState(() => getValidBodyId(urlState.selectedBodyId));
  const [elapsedDays, setElapsedDays] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(7);
  const [camera, setCamera] = useState<CameraPreset>(urlState.camera);
  const [layers, setLayers] = useState<Record<LayerKey, boolean>>(urlState.layers);
  const lastSyncedUiState = useRef(serializeUiState({ selectedBodyId, camera, layers }));

  const selectedBody = useMemo(() => bodies.find((body) => body.id === selectedBodyId) ?? bodies.find((body) => body.id === "earth") ?? bodies[0], [selectedBodyId]);
  const urlBodyId = getValidBodyId(urlState.selectedBodyId);
  const searchParamsChanged = lastSyncedSearchParams.current !== searchParamString;

  useEffect(() => {
    if (!playing || speed <= 0) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setElapsedDays((currentDays) => (currentDays + speed) % 3650);
    }, 500);

    return () => window.clearInterval(intervalId);
  }, [playing, speed]);

  useEffect(() => {
    if (!searchParamsChanged) {
      return;
    }

    lastSyncedSearchParams.current = searchParamString;
    setSelectedBodyId(urlBodyId);
    setCamera(urlState.camera);
    setLayers(urlState.layers);
    lastSyncedUiState.current = serializeUiState({ selectedBodyId: urlBodyId, camera: urlState.camera, layers: urlState.layers });
  }, [searchParamString, searchParamsChanged, urlBodyId, urlState.camera, urlState.layers]);

  useEffect(() => {
    if (searchParamsChanged) {
      return;
    }

    const currentUiState = serializeUiState({ selectedBodyId, camera, layers });

    if (currentUiState === lastSyncedUiState.current) {
      return;
    }

    lastSyncedUiState.current = currentUiState;

    const serializedState = serializeUrlState({
      locale: activeLocale,
      selectedBodyId,
      camera,
      layers
    });

    if (`?${searchParamString}` === serializedState) {
      return;
    }

    router.replace(`${pathname}${serializedState}`, { scroll: false });
  }, [activeLocale, camera, layers, pathname, router, searchParamString, searchParamsChanged, selectedBodyId]);

  return (
    <main className="min-h-screen bg-space px-4 py-5 text-white md:px-6">
      <header className="mx-auto flex max-w-7xl items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-orbit">{dictionary.brandName}</p>
          <h1 className="mt-1 text-2xl font-semibold md:text-4xl">{dictionary.overviewTitle}</h1>
        </div>
        <LanguageSwitch locale={activeLocale} />
      </header>

      <div className="mx-auto mt-5 grid max-w-7xl gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          {webglSupported ? (
            <SolarSystemCanvas
              locale={activeLocale}
              elapsedDays={elapsedDays}
              cameraPreset={camera}
              selectedBodyId={selectedBodyId}
              layers={layers}
              onSelectBody={setSelectedBodyId}
            />
          ) : (
            <WebGLFallback locale={activeLocale} />
          )}
          <ControlBar
            locale={activeLocale}
            playing={playing}
            elapsedDays={elapsedDays}
            speed={speed}
            layers={layers}
            onPlayingChange={setPlaying}
            onElapsedDaysChange={setElapsedDays}
            onSpeedChange={setSpeed}
            onLayerChange={(layer, enabled) => setLayers((currentLayers) => ({ ...currentLayers, [layer]: enabled }))}
          />
        </div>

        <BodyInfoPanel body={selectedBody} locale={activeLocale} />
      </div>
    </main>
  );
}
