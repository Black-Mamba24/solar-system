export type Locale = "zh" | "en";

export type ModuleStatus = "available" | "comingSoon";

export type BodyType = "star" | "planet" | "moon";

export type CameraPreset = "full";

export type LayerKey = "labels" | "orbits" | "moonOrbit";

export interface LocalizedText {
  zh: string;
  en: string;
}

export interface LearningModule {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  status: ModuleStatus;
  route?: string;
  focusBodyId?: string;
}

export interface AssetSource {
  id: string;
  bodyId: string;
  purpose: "diffuse" | "surface" | "ring" | "clouds" | "fallback";
  title: string;
  url: string;
  agency: string;
  usage: string;
  downloadedAt: string;
  localPath: string;
  processing: string;
}

export interface OrbitData {
  semiMajorAxisAu: number;
  displayDistance: number;
  displayRadius: number;
  orbitalPeriodDays: number;
  phaseDeg: number;
  inclinationDeg: number;
  color: string;
  showLabelByDefault: boolean;
}

export interface BodyContent {
  summary: string;
}

export interface TemperatureRange {
  minC: number;
  maxC: number;
}

export interface MoonSet {
  count: number;
  names: Array<{
    name: LocalizedText;
    description: LocalizedText;
    category?: LocalizedText;
  }>;
}

export interface CelestialBody {
  id: string;
  type: BodyType;
  name: LocalizedText;
  radiusKm: number;
  massKg?: string;
  averageDistanceFromSunKm?: number;
  rotationPeriodHours?: number;
  surfaceGravityMs2?: number;
  temperatureRangeC?: TemperatureRange;
  atmosphere?: LocalizedText;
  moons?: MoonSet;
  axialTiltDeg?: number;
  orbit?: OrbitData;
  parentId?: string;
  textureAssetId?: string;
  content: Record<Locale, BodyContent>;
}
