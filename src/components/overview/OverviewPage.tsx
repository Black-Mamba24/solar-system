"use client";

import React from "react";
import { useEffect, useMemo, useState } from "react";
import { LanguageSwitch } from "@/components/layout/LanguageSwitch";
import { SolarSystemCanvas } from "@/components/solar-system/SolarSystemCanvas";
import { bodies } from "@/data/bodies";
import { dictionaries } from "@/i18n/dictionaries";
import type { CameraPreset, LayerKey, Locale } from "@/types/domain";
import { BodyInfoPanel } from "./BodyInfoPanel";
import { ControlBar } from "./ControlBar";

const defaultLayers: Record<LayerKey, boolean> = {
  labels: true,
  orbits: true,
  moonOrbit: true
};

export function OverviewPage({ locale }: { locale: Locale }) {
  const dictionary = dictionaries[locale];
  const [selectedBodyId, setSelectedBodyId] = useState("earth");
  const [elapsedDays, setElapsedDays] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(7);
  const [camera, setCamera] = useState<CameraPreset>("full");
  const [layers, setLayers] = useState<Record<LayerKey, boolean>>(defaultLayers);

  const selectedBody = useMemo(() => bodies.find((body) => body.id === selectedBodyId) ?? bodies[0], [selectedBodyId]);

  useEffect(() => {
    if (!playing || speed <= 0) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setElapsedDays((currentDays) => (currentDays + speed) % 3650);
    }, 500);

    return () => window.clearInterval(intervalId);
  }, [playing, speed]);

  return (
    <main className="min-h-screen bg-space px-4 py-5 text-white md:px-6">
      <header className="mx-auto flex max-w-7xl items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-orbit">{dictionary.brandName}</p>
          <h1 className="mt-1 text-2xl font-semibold md:text-4xl">{dictionary.overviewTitle}</h1>
        </div>
        <LanguageSwitch locale={locale} />
      </header>

      <div className="mx-auto mt-5 grid max-w-7xl gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <SolarSystemCanvas
            locale={locale}
            elapsedDays={elapsedDays}
            selectedBodyId={selectedBodyId}
            layers={layers}
            onSelectBody={setSelectedBodyId}
          />
          <ControlBar
            locale={locale}
            playing={playing}
            elapsedDays={elapsedDays}
            speed={speed}
            camera={camera}
            layers={layers}
            onPlayingChange={setPlaying}
            onElapsedDaysChange={setElapsedDays}
            onSpeedChange={setSpeed}
            onCameraChange={setCamera}
            onLayerChange={(layer, enabled) => setLayers((currentLayers) => ({ ...currentLayers, [layer]: enabled }))}
          />
        </div>

        <BodyInfoPanel body={selectedBody} locale={locale} />
      </div>
    </main>
  );
}
