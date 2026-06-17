import type { CelestialBody } from "@/types/domain";

export const bodies: CelestialBody[] = [
  {
    id: "sun",
    type: "star",
    name: { zh: "太阳", en: "Sun" },
    radiusKm: 696340,
    massKg: "1.989 × 10^30",
    textureAssetId: "sun-nasa-sdo",
    content: {
      zh: {
        summary: "太阳是太阳系的中心恒星，提供几乎全部光和热。",
        whyItMatters: "理解太阳有助于理解行星轨道、季节、气候和生命所需能量。",
        facts: ["太阳占太阳系总质量的 99% 以上。", "太阳主要由氢和氦组成。", "太阳光到达地球约需 8 分钟。"]
      },
      en: {
        summary: "The Sun is the central star of the Solar System and supplies nearly all of its light and heat.",
        whyItMatters: "Understanding the Sun helps explain planetary orbits, seasons, climate, and the energy life depends on.",
        facts: ["The Sun contains more than 99% of the Solar System's mass.", "It is made mostly of hydrogen and helium.", "Sunlight takes about 8 minutes to reach Earth."]
      }
    }
  },
  {
    id: "mercury",
    type: "planet",
    name: { zh: "水星", en: "Mercury" },
    radiusKm: 2439.7,
    averageDistanceFromSunKm: 57900000,
    rotationPeriodHours: 1407.6,
    orbit: { semiMajorAxisAu: 0.39, displayDistance: 8, displayRadius: 0.38, orbitalPeriodDays: 88, phaseDeg: 15, inclinationDeg: 7, color: "#9ca3af", showLabelByDefault: true },
    textureAssetId: "mercury-nasa",
    content: {
      zh: { summary: "水星是最靠近太阳的行星。", whyItMatters: "水星展示了靠近太阳的岩石行星会经历怎样的极端温差。", facts: ["它是太阳系最小的行星。", "水星几乎没有大气。", "水星一年只有 88 个地球日。"] },
      en: { summary: "Mercury is the closest planet to the Sun.", whyItMatters: "Mercury shows the extreme temperature swings a rocky planet can experience near the Sun.", facts: ["It is the smallest planet.", "Mercury has almost no atmosphere.", "A Mercury year lasts 88 Earth days."] }
    }
  },
  {
    id: "venus",
    type: "planet",
    name: { zh: "金星", en: "Venus" },
    radiusKm: 6051.8,
    averageDistanceFromSunKm: 108200000,
    rotationPeriodHours: -5832.5,
    orbit: { semiMajorAxisAu: 0.72, displayDistance: 11, displayRadius: 0.7, orbitalPeriodDays: 224.7, phaseDeg: 75, inclinationDeg: 3.4, color: "#d6b36a", showLabelByDefault: true },
    textureAssetId: "venus-nasa",
    content: {
      zh: { summary: "金星大小接近地球，但拥有浓厚而炽热的大气。", whyItMatters: "金星是理解温室效应和行星气候演化的重要例子。", facts: ["金星表面温度高于水星。", "它的自转方向与多数行星相反。", "浓厚云层遮住了表面。"] },
      en: { summary: "Venus is close to Earth's size but has a dense, hot atmosphere.", whyItMatters: "Venus is a key example for understanding greenhouse warming and planetary climate evolution.", facts: ["Venus is hotter at the surface than Mercury.", "It rotates opposite most planets.", "Thick clouds hide its surface."] }
    }
  },
  {
    id: "earth",
    type: "planet",
    name: { zh: "地球", en: "Earth" },
    radiusKm: 6371,
    averageDistanceFromSunKm: 149600000,
    rotationPeriodHours: 23.93,
    axialTiltDeg: 23.44,
    orbit: { semiMajorAxisAu: 1, displayDistance: 15, displayRadius: 0.75, orbitalPeriodDays: 365.25, phaseDeg: 160, inclinationDeg: 0, color: "#4fb3d8", showLabelByDefault: true },
    textureAssetId: "earth-nasa",
    content: {
      zh: { summary: "地球是目前已知唯一拥有生命的行星。", whyItMatters: "地球是比较其他行星环境和宜居性的基准。", facts: ["地球表面约 71% 被水覆盖。", "地球有一个大型天然卫星：月球。", "地球轴倾角造成季节变化。"] },
      en: { summary: "Earth is the only planet currently known to host life.", whyItMatters: "Earth is the reference point for comparing planetary environments and habitability.", facts: ["About 71% of Earth's surface is covered by water.", "Earth has one large natural satellite: the Moon.", "Earth's axial tilt produces seasons."] }
    }
  },
  {
    id: "moon",
    type: "moon",
    parentId: "earth",
    name: { zh: "月球", en: "Moon" },
    radiusKm: 1737.4,
    averageDistanceFromSunKm: 149984400,
    orbit: { semiMajorAxisAu: 0.00257, displayDistance: 2.1, displayRadius: 0.22, orbitalPeriodDays: 27.3, phaseDeg: 40, inclinationDeg: 5.1, color: "#cbd5e1", showLabelByDefault: false },
    textureAssetId: "moon-nasa",
    content: {
      zh: { summary: "月球是地球唯一的天然卫星。", whyItMatters: "月球影响潮汐，也帮助解释月相、日食和月食。", facts: ["月球始终以同一面大致朝向地球。", "月球表面布满撞击坑。", "月球距离地球约 38.4 万千米。"] },
      en: { summary: "The Moon is Earth's only natural satellite.", whyItMatters: "The Moon affects tides and helps explain phases, solar eclipses, and lunar eclipses.", facts: ["The Moon keeps roughly the same face toward Earth.", "Its surface is covered with impact craters.", "It is about 384,000 km from Earth."] }
    }
  },
  {
    id: "mars",
    type: "planet",
    name: { zh: "火星", en: "Mars" },
    radiusKm: 3389.5,
    averageDistanceFromSunKm: 227900000,
    rotationPeriodHours: 24.6,
    orbit: { semiMajorAxisAu: 1.52, displayDistance: 20, displayRadius: 0.52, orbitalPeriodDays: 687, phaseDeg: 250, inclinationDeg: 1.85, color: "#c66b4e", showLabelByDefault: true },
    textureAssetId: "mars-nasa",
    content: {
      zh: { summary: "火星是寒冷干燥的岩石行星，因铁氧化物呈红色。", whyItMatters: "火星是研究过去水环境和未来探测任务的重要目标。", facts: ["火星有太阳系最高的火山之一。", "火星有两颗小卫星。", "火星日长度接近地球日。"] },
      en: { summary: "Mars is a cold, dry rocky planet with a reddish color from iron oxides.", whyItMatters: "Mars is a major target for studying past water environments and future exploration.", facts: ["Mars has one of the tallest volcanoes in the Solar System.", "It has two small moons.", "A Martian day is close to an Earth day."] }
    }
  },
  {
    id: "jupiter",
    type: "planet",
    name: { zh: "木星", en: "Jupiter" },
    radiusKm: 69911,
    averageDistanceFromSunKm: 778500000,
    rotationPeriodHours: 9.93,
    orbit: { semiMajorAxisAu: 5.2, displayDistance: 30, displayRadius: 1.55, orbitalPeriodDays: 4332.6, phaseDeg: 15, inclinationDeg: 1.3, color: "#d1a16e", showLabelByDefault: true },
    textureAssetId: "jupiter-nasa",
    content: {
      zh: { summary: "木星是太阳系最大的行星。", whyItMatters: "木星的巨大质量塑造了太阳系许多小天体的轨道环境。", facts: ["木星是气态巨行星。", "大红斑是持续很久的巨大风暴。", "木星拥有许多卫星。"] },
      en: { summary: "Jupiter is the largest planet in the Solar System.", whyItMatters: "Jupiter's mass shapes the orbital environment of many smaller Solar System bodies.", facts: ["Jupiter is a gas giant.", "The Great Red Spot is a long-lived giant storm.", "Jupiter has many moons."] }
    }
  },
  {
    id: "saturn",
    type: "planet",
    name: { zh: "土星", en: "Saturn" },
    radiusKm: 58232,
    averageDistanceFromSunKm: 1433500000,
    rotationPeriodHours: 10.7,
    orbit: { semiMajorAxisAu: 9.58, displayDistance: 40, displayRadius: 1.32, orbitalPeriodDays: 10759, phaseDeg: 80, inclinationDeg: 2.49, color: "#e0c180", showLabelByDefault: true },
    textureAssetId: "saturn-nasa",
    content: {
      zh: { summary: "土星以明亮宽阔的行星环闻名。", whyItMatters: "土星展示了巨行星、环系统和卫星系统的复杂关系。", facts: ["土星环主要由冰和岩石颗粒组成。", "土星密度低于水。", "土卫六拥有浓厚大气。"] },
      en: { summary: "Saturn is famous for its bright, broad ring system.", whyItMatters: "Saturn illustrates the complex relationships among giant planets, rings, and moons.", facts: ["Saturn's rings are mostly ice and rocky particles.", "Saturn is less dense than water.", "Titan has a thick atmosphere."] }
    }
  },
  {
    id: "uranus",
    type: "planet",
    name: { zh: "天王星", en: "Uranus" },
    radiusKm: 25362,
    averageDistanceFromSunKm: 2872500000,
    rotationPeriodHours: -17.2,
    orbit: { semiMajorAxisAu: 19.2, displayDistance: 50, displayRadius: 1.0, orbitalPeriodDays: 30687, phaseDeg: 180, inclinationDeg: 0.77, color: "#85d7df", showLabelByDefault: true },
    textureAssetId: "uranus-nasa",
    content: {
      zh: { summary: "天王星是冰巨行星，自转轴几乎横躺在轨道面上。", whyItMatters: "天王星帮助我们理解冰巨行星和极端轴倾角的季节变化。", facts: ["天王星呈淡蓝绿色。", "它拥有暗弱的环。", "它的轴倾角约 98 度。"] },
      en: { summary: "Uranus is an ice giant with a rotation axis tilted almost sideways.", whyItMatters: "Uranus helps explain ice giants and seasons under an extreme axial tilt.", facts: ["Uranus appears pale blue-green.", "It has faint rings.", "Its axial tilt is about 98 degrees."] }
    }
  },
  {
    id: "neptune",
    type: "planet",
    name: { zh: "海王星", en: "Neptune" },
    radiusKm: 24622,
    averageDistanceFromSunKm: 4495100000,
    rotationPeriodHours: 16.1,
    orbit: { semiMajorAxisAu: 30.05, displayDistance: 60, displayRadius: 0.98, orbitalPeriodDays: 60190, phaseDeg: 310, inclinationDeg: 1.77, color: "#4778d8", showLabelByDefault: true },
    textureAssetId: "neptune-nasa",
    content: {
      zh: { summary: "海王星是已知八大行星中距离太阳最远的一颗。", whyItMatters: "海王星展示了远太阳区域冰巨行星的大气和风暴活动。", facts: ["海王星风速极高。", "它的蓝色来自大气成分和云雾结构。", "海王星一年约等于 165 个地球年。"] },
      en: { summary: "Neptune is the farthest known of the eight planets from the Sun.", whyItMatters: "Neptune shows atmospheric and storm activity in a distant ice giant.", facts: ["Neptune has extremely fast winds.", "Its blue color comes from atmospheric composition and haze structure.", "A Neptune year is about 165 Earth years."] }
    }
  }
];
