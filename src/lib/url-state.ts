import type { CameraPreset, LayerKey, Locale } from "@/types/domain";
import { parseLocale } from "./locale";

export interface UrlState {
  locale: Locale;
  selectedBodyId?: string;
  camera: CameraPreset;
  layers: Record<LayerKey, boolean>;
}

function parseCamera(value: string | null): CameraPreset {
  return "full";
}

function parseFlag(value: string | null, fallback: boolean): boolean {
  if (value === "0") return false;
  if (value === "1") return true;
  return fallback;
}

export function parseUrlState(params: URLSearchParams): UrlState {
  return {
    locale: parseLocale(params.get("lang")),
    selectedBodyId: params.get("body") ?? undefined,
    camera: parseCamera(params.get("camera")),
    layers: {
      labels: parseFlag(params.get("labels"), true),
      orbits: parseFlag(params.get("orbits"), true),
      moonOrbit: parseFlag(params.get("moonOrbit"), true)
    }
  };
}

export function serializeUrlState(state: UrlState): string {
  const params = new URLSearchParams();
  params.set("lang", state.locale);
  if (state.selectedBodyId) params.set("body", state.selectedBodyId);
  params.set("camera", state.camera);
  params.set("labels", state.layers.labels ? "1" : "0");
  params.set("orbits", state.layers.orbits ? "1" : "0");
  params.set("moonOrbit", state.layers.moonOrbit ? "1" : "0");
  return `?${params.toString()}`;
}
