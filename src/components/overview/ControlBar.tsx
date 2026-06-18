import React from "react";
import { Pause, Play } from "lucide-react";
import { dictionaries } from "@/i18n/dictionaries";
import type { CameraPreset, LayerKey, Locale } from "@/types/domain";

interface ControlBarProps {
  locale: Locale;
  playing: boolean;
  elapsedDays: number;
  speed: number;
  camera: CameraPreset;
  layers: Record<LayerKey, boolean>;
  onPlayingChange: (playing: boolean) => void;
  onElapsedDaysChange: (days: number) => void;
  onSpeedChange: (speed: number) => void;
  onCameraChange: (camera: CameraPreset) => void;
  onLayerChange: (layer: LayerKey, enabled: boolean) => void;
}

const cameraPresets: CameraPreset[] = ["full", "inner", "earthMoon", "outer"];
const layerKeys: LayerKey[] = ["labels", "orbits", "moonOrbit"];
const speedOptions = [0, 1, 7, 30];

export function ControlBar({
  locale,
  playing,
  elapsedDays,
  speed,
  camera,
  layers,
  onPlayingChange,
  onElapsedDaysChange,
  onSpeedChange,
  onCameraChange,
  onLayerChange
}: ControlBarProps) {
  const dictionary = dictionaries[locale];

  return (
    <section className="rounded-ui border border-white/10 bg-panel p-4 text-white">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          aria-label={playing ? dictionary.controls.pause : dictionary.controls.play}
          className="inline-flex h-10 w-10 items-center justify-center rounded-ui bg-orbit text-black transition hover:bg-cyan-200"
          onClick={() => onPlayingChange(!playing)}
        >
          {playing ? <Pause aria-hidden="true" size={18} /> : <Play aria-hidden="true" size={18} />}
        </button>

        <label className="flex min-w-[220px] flex-1 items-center gap-3 text-sm text-slate-200">
          <span className="whitespace-nowrap">{dictionary.controls.elapsedDays}</span>
          <input
            type="range"
            min="0"
            max="3650"
            value={elapsedDays}
            aria-label={dictionary.controls.elapsedDays}
            onChange={(event) => onElapsedDaysChange(Number(event.target.value))}
            className="w-full accent-orbit"
          />
        </label>

        <select
          aria-label={dictionary.controls.speed}
          value={speed}
          onChange={(event) => onSpeedChange(Number(event.target.value))}
          className="rounded-ui border border-white/15 bg-black/50 px-3 py-2 text-sm text-white"
        >
          {speedOptions.map((option) => (
            <option key={option} value={option}>
              {option}x
            </option>
          ))}
        </select>
      </div>

      <fieldset className="mt-4">
        <legend className="text-xs uppercase tracking-[0.18em] text-slate-400">{dictionary.controls.camera}</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {cameraPresets.map((preset) => (
            <button
              key={preset}
              type="button"
              className={`rounded-ui px-3 py-2 text-sm transition ${
                camera === preset ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/15"
              }`}
              onClick={() => onCameraChange(preset)}
            >
              {dictionary.cameraPresets[preset]}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-4">
        <legend className="text-xs uppercase tracking-[0.18em] text-slate-400">{dictionary.controls.layers}</legend>
        <div className="mt-2 flex flex-wrap gap-3">
          {layerKeys.map((layer) => (
            <label key={layer} className="inline-flex items-center gap-2 text-sm text-slate-200">
              <input
                type="checkbox"
                checked={layers[layer]}
                onChange={(event) => onLayerChange(layer, event.target.checked)}
                className="h-4 w-4 accent-orbit"
              />
              {dictionary.controls[layer]}
            </label>
          ))}
        </div>
      </fieldset>
    </section>
  );
}
