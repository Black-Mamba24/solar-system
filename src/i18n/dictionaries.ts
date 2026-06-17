import type { Locale } from "@/types/domain";

export const dictionaries = {
  zh: {
    languageName: "中文",
    switchLanguage: "切换语言",
    comingSoon: "即将开放",
    enterOverview: "进入太阳系概述",
    compressedScale: "比例经过教学压缩",
    overviewTitle: "太阳系概述",
    controls: {
      play: "播放",
      pause: "暂停",
      speed: "速度",
      camera: "视角",
      layers: "图层",
      labels: "标签",
      orbits: "轨道线",
      moonOrbit: "月球轨道"
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
    languageName: "English",
    switchLanguage: "Switch language",
    comingSoon: "Coming soon",
    enterOverview: "Enter overview",
    compressedScale: "Scale compressed for learning",
    overviewTitle: "Solar System Overview",
    controls: {
      play: "Play",
      pause: "Pause",
      speed: "Speed",
      camera: "Camera",
      layers: "Layers",
      labels: "Labels",
      orbits: "Orbits",
      moonOrbit: "Moon orbit"
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
} as const satisfies Record<Locale, object>;

export type Dictionary = typeof dictionaries.zh;
