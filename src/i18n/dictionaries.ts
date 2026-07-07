import type { Locale } from "@/types/domain";

export interface AppDictionary {
  brandName: string;
  languageName: string;
  switchLanguage: string;
  homeTitle: string;
  homeEntryNote: string;
  comingSoon: string;
  enterOverview: string;
  enterModule: string;
  backHome: string;
  compressedScale: string;
  overviewTitle: string;
  solarEclipse: {
    title: string;
    subtitle: string;
    mainViews: {
      space: string;
      ground: string;
    };
    spaceModels: {
      total: string;
      annular: string;
    };
    groundModes: {
      total: string;
      partial: string;
      annular: string;
    };
    viewTitles: {
      space: string;
      ground: string;
      total: string;
      partial: string;
      annular: string;
    };
    descriptions: {
      space: string;
      total: string;
      partial: string;
      annular: string;
    };
    controls: {
      rewind: string;
      forward: string;
      play: string;
      pause: string;
      speed: string;
      slow: string;
      normal: string;
      timeline: string;
    };
    timelineLabels: {
      start: string;
      middle: string;
      end: string;
    };
    partialDirections: {
      upperRight: string;
      upperLeft: string;
      lowerRight: string;
      lowerLeft: string;
      right: string;
      left: string;
    };
    partialHint: string;
  };
  lunarEclipse: {
    title: string;
    subtitle: string;
    mainViews: {
      space: string;
      ground: string;
    };
    cases: {
      total: string;
      partial: string;
    };
    viewTitles: {
      space: string;
      ground: string;
    };
    descriptions: {
      space: string;
      ground: string;
      total: string;
      partial: string;
      redMoon: string;
      cause: string;
      fullMoon: string;
      shadowZones: string;
    };
    controls: {
      rewind: string;
      forward: string;
      play: string;
      pause: string;
      speed: string;
      slow: string;
      normal: string;
      timeline: string;
    };
    stages: {
      P1: string;
      U1: string;
      U2: string;
      MAX: string;
      U3: string;
      U4: string;
      P4: string;
    };
    stageDetails: {
      P1: string;
      U1: string;
      U2: string;
      MAX: string;
      U3: string;
      U4: string;
      P4: string;
      partialMax: string;
    };
    legend: {
      penumbra: string;
      umbra: string;
      redLight: string;
    };
  };
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
    speakIntro: string;
    stopSpeaking: string;
    speechUnavailable: string;
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
    enterModule: "进入模块",
    backHome: "返回首页",
    compressedScale: "比例经过教学压缩",
    overviewTitle: "太阳系概述",
    solarEclipse: {
      title: "日食",
      subtitle: "从太空机制和地面观测两个层次理解日全食、日偏食与日环食。",
      mainViews: {
        space: "太空视角",
        ground: "地球视角"
      },
      spaceModels: {
        total: "日全食模型",
        annular: "日环食模型"
      },
      groundModes: {
        total: "日全食",
        partial: "日偏食",
        annular: "日环食"
      },
      viewTitles: {
        space: "太空视角",
        ground: "地球视角",
        total: "日全食地面视角",
        partial: "日偏食地面视角",
        annular: "日环食地面视角"
      },
      descriptions: {
        space: "太阳光沿月球切线形成本影、半影和伪本影，并在地球白昼面扫出全食带和偏食带。点击影带可进入对应地面观测点。",
        total: "观测点位于月球本影内，月球视直径足以完全遮住太阳圆面。",
        partial: "观测点位于半影内。点击半影的不同位置，会改变月球从太阳圆面的哪一侧切入。",
        annular: "月球视直径小于太阳，伪本影落到地面时会留下明亮的太阳边环。"
      },
      controls: {
        rewind: "后退",
        forward: "前进",
        play: "播放",
        pause: "暂停",
        speed: "速度",
        slow: "慢速",
        normal: "正常速度",
        timeline: "月球轨迹时间"
      },
      timelineLabels: {
        start: "初亏",
        middle: "食甚",
        end: "复圆"
      },
      partialDirections: {
        upperRight: "右上",
        upperLeft: "左上",
        lowerRight: "右下",
        lowerLeft: "左下",
        right: "右侧",
        left: "左侧"
      },
      partialHint: "当前偏食来自半影点击位置：月球从太阳的 {direction} 切入。"
    },
    lunarEclipse: {
      title: "月食",
      subtitle: "用太空视角和地球视角观察月球穿过地球半影与本影的过程。",
      mainViews: {
        space: "太空视角",
        ground: "地球视角"
      },
      cases: {
        total: "月全食",
        partial: "月偏食"
      },
      viewTitles: {
        space: "太阳、地球、月球几何",
        ground: "从地球看到的月面变化"
      },
      descriptions: {
        space: "太阳、地球、月球按太阳 -> 地球 -> 月球排列。地球影锥固定沿反太阳方向延伸，月球只能靠自身轨道运动进入或离开半影与本影。",
        ground: "地球视角展示地球影子投射到月面后的圆弧边界。半影只轻微变暗，本影明显变暗。",
        total: "月全食发生在满月附近，当整个月球圆面完全进入地球本影时，月球表面不再接收太阳直射光。",
        partial: "月偏食发生在满月附近，当月球只有一部分进入地球本影，而整个月球从未完全进入本影时。",
        redMoon: "月全食阶段月球不应完全消失。暗红、铜红或橙红色来自太阳光穿过地球大气层后的折射和散射：短波蓝光被散射掉，较长波长的红橙光被折射进地球本影并照亮月面，不是月球自发光或地球发光。",
        cause: "月食不是月球进入太阳的影子，也不是地球挡住观察者视线，而是地球挡住太阳直射到月球的光。",
        fullMoon: "月食只可能发生在满月附近，因为此时月球位于地球背向太阳的一侧。但不是每次满月都有月食，因为月球轨道平面相对地球绕太阳公转平面有约 5 度倾角，通常满月时月球会从地球影锥的上方或下方掠过。",
        shadowZones: "半影是太阳圆面只有一部分被地球遮挡的区域，月面变暗较轻；本影是太阳圆面被地球完全遮挡的区域，月面明显变暗。月全食时整个月球进入本影，月偏食时只有部分月球进入本影。"
      },
      controls: {
        rewind: "后退",
        forward: "前进",
        play: "播放",
        pause: "暂停",
        speed: "速度",
        slow: "慢速",
        normal: "正常速度",
        timeline: "月球穿越地影时间"
      },
      stages: {
        P1: "P1",
        U1: "U1",
        U2: "U2",
        MAX: "食甚",
        U3: "U3",
        U4: "U4",
        P4: "P4"
      },
      stageDetails: {
        P1: "P1 月球开始进入地球半影",
        U1: "U1 月球开始进入地球本影",
        U2: "U2 整个月球进入本影，月全食开始",
        MAX: "食甚：月球最接近地球本影中心",
        U3: "U3 月球开始离开本影，月全食结束",
        U4: "U4 月球完全离开本影",
        P4: "P4 月球完全离开半影",
        partialMax: "月偏食食甚：本影只覆盖月面一部分"
      },
      legend: {
        penumbra: "半影 penumbra",
        umbra: "本影 umbra",
        redLight: "大气折射红橙光"
      }
    },
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
      notApplicable: "不适用",
      speakIntro: "播报介绍",
      stopSpeaking: "停止播报",
      speechUnavailable: "当前浏览器不支持语音播报"
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
    enterModule: "Enter module",
    backHome: "Back to home",
    compressedScale: "Scale compressed for learning",
    overviewTitle: "Solar System Overview",
    solarEclipse: {
      title: "Solar Eclipses",
      subtitle: "Understand total, partial, and annular eclipses from space geometry and ground observation.",
      mainViews: {
        space: "Space view",
        ground: "Earth view"
      },
      spaceModels: {
        total: "Total eclipse model",
        annular: "Annular eclipse model"
      },
      groundModes: {
        total: "Total eclipse",
        partial: "Partial eclipse",
        annular: "Annular eclipse"
      },
      viewTitles: {
        space: "Space view",
        ground: "Earth view",
        total: "Total eclipse ground view",
        partial: "Partial eclipse ground view",
        annular: "Annular eclipse ground view"
      },
      descriptions: {
        space: "Sunlight tangent to the Moon forms the umbra, penumbra, and antumbra, then sweeps totality and partial bands across Earth's daylight side.",
        total: "The observer stands inside the Moon's umbra, where the Moon can cover the solar disc.",
        partial: "The observer stands inside the penumbra. Different penumbra click positions change which side of the Sun is covered.",
        annular: "The Moon appears smaller than the Sun, so the antumbra leaves a bright solar ring around it."
      },
      controls: {
        rewind: "Back",
        forward: "Forward",
        play: "Play",
        pause: "Pause",
        speed: "Speed",
        slow: "Slow",
        normal: "Normal",
        timeline: "Moon track time"
      },
      timelineLabels: {
        start: "First contact",
        middle: "Maximum eclipse",
        end: "Last contact"
      },
      partialDirections: {
        upperRight: "upper right",
        upperLeft: "upper left",
        lowerRight: "lower right",
        lowerLeft: "lower left",
        right: "right",
        left: "left"
      },
      partialHint: "Current partial eclipse comes from a penumbra click: the Moon cuts in from the Sun's {direction}."
    },
    lunarEclipse: {
      title: "Lunar Eclipses",
      subtitle: "Watch the Moon move through Earth's penumbra and umbra from space and Earth views.",
      mainViews: {
        space: "Space view",
        ground: "Earth view"
      },
      cases: {
        total: "Total lunar eclipse",
        partial: "Partial lunar eclipse"
      },
      viewTitles: {
        space: "Sun, Earth, Moon geometry",
        ground: "Moon disc as seen from Earth"
      },
      descriptions: {
        space: "The bodies are ordered Sun -> Earth -> Moon. Earth's shadow cone stays fixed along the anti-solar direction while the Moon enters and leaves it by orbital motion.",
        ground: "Earth view shows the circular shadow boundary projected onto the lunar disc. Penumbra dims lightly; umbra dims strongly.",
        total: "A total lunar eclipse occurs near full Moon when the whole lunar disc enters Earth's umbra and no longer receives direct sunlight.",
        partial: "A partial lunar eclipse occurs near full Moon when only part of the lunar disc enters Earth's umbra, so the whole Moon is never inside the umbra.",
        redMoon: "During totality the Moon remains visible in dark red, copper, or orange-red light. That color comes from sunlight refracted and scattered by Earth's atmosphere: short blue wavelengths are scattered away while longer red-orange wavelengths bend into the umbra and illuminate the Moon. It is not self-emission.",
        cause: "A lunar eclipse is not the Moon entering the Sun's shadow and not Earth blocking the observer's line of sight; Earth blocks direct sunlight from reaching the Moon.",
        fullMoon: "Lunar eclipses can only occur near full Moon, when the Moon is on Earth's anti-solar side. They do not happen every full Moon because the lunar orbit is tilted by about 5 degrees to Earth's orbital plane, so the Moon usually passes above or below Earth's shadow.",
        shadowZones: "The penumbra is where only part of the solar disc is blocked by Earth, causing mild dimming. The umbra is where the solar disc is fully blocked, causing strong dimming. A total lunar eclipse puts the whole Moon inside the umbra; a partial lunar eclipse puts only part of it inside."
      },
      controls: {
        rewind: "Back",
        forward: "Forward",
        play: "Play",
        pause: "Pause",
        speed: "Speed",
        slow: "Slow",
        normal: "Normal",
        timeline: "Moon through Earth's shadow"
      },
      stages: {
        P1: "P1",
        U1: "U1",
        U2: "U2",
        MAX: "Maximum",
        U3: "U3",
        U4: "U4",
        P4: "P4"
      },
      stageDetails: {
        P1: "P1 Moon begins entering Earth's penumbra",
        U1: "U1 Moon begins entering Earth's umbra",
        U2: "U2 Entire Moon enters the umbra; totality begins",
        MAX: "Maximum eclipse: the Moon is closest to the umbra center",
        U3: "U3 Moon begins leaving the umbra; totality ends",
        U4: "U4 Moon completely leaves the umbra",
        P4: "P4 Moon completely leaves the penumbra",
        partialMax: "Partial maximum: the umbra covers only part of the lunar disc"
      },
      legend: {
        penumbra: "Penumbra",
        umbra: "Umbra",
        redLight: "Atmospheric red-orange light"
      }
    },
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
      notApplicable: "N/A",
      speakIntro: "Read introduction",
      stopSpeaking: "Stop reading",
      speechUnavailable: "Speech playback is not supported in this browser"
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
