import type { LearningModule } from "@/types/domain";

export const learningModules: LearningModule[] = [
  {
    id: "overview",
    title: { zh: "太阳系概述", en: "Solar System Overview" },
    description: { zh: "浏览太阳、八大行星和月球的近似轨道。", en: "Explore the Sun, eight planets, and the Moon in approximate orbits." },
    status: "available",
    route: "/overview",
    focusBodyId: "sun"
  },
  {
    id: "solar-eclipse",
    title: { zh: "日食", en: "Solar Eclipses" },
    description: { zh: "理解太阳、月球和地球对齐时发生的现象。", en: "Understand what happens when the Sun, Moon, and Earth align." },
    status: "available",
    route: "/solar-eclipse",
    focusBodyId: "moon"
  },
  {
    id: "lunar-eclipse",
    title: { zh: "月食", en: "Lunar Eclipses" },
    description: { zh: "观察月球穿过地球影子时的几何关系。", en: "See the geometry of the Moon moving through Earth's shadow." },
    status: "available",
    route: "/lunar-eclipse",
    focusBodyId: "earth"
  },
  {
    id: "mercury-retrograde",
    title: { zh: "水星逆行", en: "Mercury Retrograde" },
    description: { zh: "从地球视角理解行星视运动。", en: "Understand apparent planetary motion from Earth." },
    status: "comingSoon",
    focusBodyId: "mercury"
  },
  {
    id: "asteroid-belt",
    title: { zh: "小行星带", en: "Asteroid Belt" },
    description: { zh: "探索火星和木星之间的小天体区域。", en: "Explore the region of small bodies between Mars and Jupiter." },
    status: "comingSoon",
    focusBodyId: "mars"
  },
  {
    id: "jupiter-moons",
    title: { zh: "木星和它的卫星", en: "Jupiter and Its Moons" },
    description: { zh: "了解巨行星和卫星系统。", en: "Learn about a giant planet and its moon system." },
    status: "comingSoon",
    focusBodyId: "jupiter"
  }
];
