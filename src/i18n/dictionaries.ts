import type { Locale } from "@/types/domain";

export interface AppDictionary {
  brandName: string;
  languageName: string;
  switchLanguage: string;
  homeTitle: string;
  homeEntryNote: string;
  comingSoon: string;
  enterOverview: string;
  compressedScale: string;
  overviewTitle: string;
  controls: {
    play: string;
    pause: string;
    elapsedDays: string;
    speed: string;
    camera: string;
    layers: string;
    labels: string;
    orbits: string;
    moonOrbit: string;
  };
  bodyInfo: {
    radius: string;
    averageDistanceFromSun: string;
    surfaceGravity: string;
    atmosphere: string;
    moons: string;
    temperatureRange: string;
    rotationPeriod: string;
    orbitalPeriod: string;
    earthComparison: string;
    earthBaseline: string;
    noMoons: string;
    notApplicable: string;
  };
  bodyTypes: {
    star: string;
    planet: string;
    moon: string;
  };
  cameraPresets: {
    full: string;
    inner: string;
    earthMoon: string;
    outer: string;
  };
  fallback: {
    title: string;
    body: string;
  };
}

export const dictionaries = {
  zh: {
    brandName: "Solar System Explorer",
    languageName: "中文",
    switchLanguage: "切换语言",
    homeTitle: "太阳系探索",
    homeEntryNote: "从概述模块进入可交互的太阳系轨道视图。",
    comingSoon: "即将开放",
    enterOverview: "进入太阳系概述",
    compressedScale: "比例经过教学压缩",
    overviewTitle: "太阳系概述",
    controls: {
      play: "播放",
      pause: "暂停",
      elapsedDays: "经过天数",
      speed: "速度",
      camera: "视角",
      layers: "图层",
      labels: "标签",
      orbits: "轨道线",
      moonOrbit: "月球轨道"
    },
    bodyInfo: {
      radius: "半径",
      averageDistanceFromSun: "平均日距",
      surfaceGravity: "重力加速度",
      atmosphere: "大气",
      moons: "卫星",
      temperatureRange: "温度范围",
      rotationPeriod: "自转周期",
      orbitalPeriod: "公转周期",
      earthComparison: "约为地球的",
      earthBaseline: "地球基准",
      noMoons: "无天然卫星",
      notApplicable: "不适用"
    },
    bodyTypes: {
      star: "恒星",
      planet: "行星",
      moon: "卫星"
    },
    cameraPresets: {
      full: "全景",
      inner: "内行星",
      earthMoon: "地月",
      outer: "外行星"
    },
    fallback: {
      title: "无法加载 3D 场景",
      body: "你仍然可以浏览天体信息和素材来源。"
    }
  },
  en: {
    brandName: "Solar System Explorer",
    languageName: "English",
    switchLanguage: "Switch language",
    homeTitle: "Explore the Solar System",
    homeEntryNote: "Start with the interactive orbital overview module.",
    comingSoon: "Coming soon",
    enterOverview: "Enter overview",
    compressedScale: "Scale compressed for learning",
    overviewTitle: "Solar System Overview",
    controls: {
      play: "Play",
      pause: "Pause",
      elapsedDays: "Elapsed days",
      speed: "Speed",
      camera: "Camera",
      layers: "Layers",
      labels: "Labels",
      orbits: "Orbits",
      moonOrbit: "Moon orbit"
    },
    bodyInfo: {
      radius: "Radius",
      averageDistanceFromSun: "Avg. solar distance",
      surfaceGravity: "Surface gravity",
      atmosphere: "Atmosphere",
      moons: "Moons",
      temperatureRange: "Temperature range",
      rotationPeriod: "Rotation period",
      orbitalPeriod: "Orbital period",
      earthComparison: "about Earth x",
      earthBaseline: "Earth baseline",
      noMoons: "No natural moons",
      notApplicable: "N/A"
    },
    bodyTypes: {
      star: "Star",
      planet: "Planet",
      moon: "Moon"
    },
    cameraPresets: {
      full: "Full",
      inner: "Inner planets",
      earthMoon: "Earth and Moon",
      outer: "Outer planets"
    },
    fallback: {
      title: "3D scene unavailable",
      body: "You can still browse body information and asset sources."
    }
  }
} as const satisfies Record<Locale, AppDictionary>;

export type Dictionary = AppDictionary;
