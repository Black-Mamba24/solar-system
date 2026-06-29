import type { AssetSource, CelestialBody } from "@/types/domain";

export interface ProceduralBodyModelProps {
  body: CelestialBody;
  radius: number;
  selected: boolean;
  fallbackColor: string;
  asset?: AssetSource;
  onSelectBody: (bodyId: string) => void;
}

export interface CraterSpec {
  lat: number;
  lon: number;
  radius: number;
  depth: number;
  rim: number;
}

export interface PatchSpec {
  name: string;
  lat: number;
  lon: number;
  latRadius: number;
  lonRadius: number;
  color: string;
  opacity?: number;
}

export interface CraterPatchSpec extends PatchSpec {
  rimColor: string;
  rimOpacity?: number;
}

export interface SphericalPolygonSpec {
  name: string;
  points: Array<{ lat: number; lon: number }>;
  color: string;
  opacity?: number;
}

export interface SphericalPolylineSpec {
  name: string;
  points: Array<{ lat: number; lon: number }>;
  color: string;
  opacity?: number;
}

export interface BandSpec {
  name: string;
  lat: number;
  width: number;
  color: string;
  opacity?: number;
}

export interface RockyProfile {
  seed: number;
  baseColor: string;
  lightColor: string;
  darkColor: string;
  roughness: number;
  displacement: number;
  craters: CraterSpec[];
  ridges?: PatchSpec[];
}

export interface AtmosphereProfile {
  color: string;
  opacity: number;
  scale: number;
}
