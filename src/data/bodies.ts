import type { CelestialBody, LocalizedText, MoonSet } from "@/types/domain";

const namedMoon = (zh: string, en: string): LocalizedText => ({ zh, en });

const noMoons: MoonSet = { count: 0, names: [] };

export const bodies: CelestialBody[] = [
  {
    id: "sun",
    type: "star",
    name: { zh: "太阳", en: "Sun" },
    radiusKm: 696340,
    massKg: "1.989 × 10^30",
    rotationPeriodHours: 648,
    surfaceGravityMs2: 274,
    temperatureRangeC: { minC: 5500, maxC: 15000000 },
    moons: noMoons,
    textureAssetId: "sun-nasa-sdo",
    content: {
      zh: {
        summary:
          "太阳是太阳系的中心恒星，也是这里几乎全部光、热和引力结构的来源。它不是一个有固体表面的火球，而是一颗由高温等离子体组成的黄矮星，主要成分是氢和氦。太阳核心通过核聚变把氢转化为氦，释放出的能量要经过漫长传播才到达可见表面，再以光和太阳风影响行星空间。太阳的质量占太阳系总质量的绝大部分，因此八大行星、小行星带、彗星和尘埃都在它的引力主导下运动。它的光约八分钟到达地球，支撑气候系统和光合作用；它的磁活动又会带来耀斑、日冕物质抛射和地磁扰动。太阳表面的黑子数量会随活动周期变化，日冕在日食时尤其醒目，太阳风则不断向外吹出，形成包裹行星的日球层。日震学、太阳望远镜和近距离探测器让科学家能追踪内部振荡、磁场重联和高温日冕加热问题。它也是研究其他恒星的近距离样本。观察太阳，可以理解昼夜、季节、空间天气和极光，也能理解恒星如何决定行星系统的宜居边界。对太阳的长期监测还关系到卫星通信、电网安全和深空探测任务规划。"
      },
      en: {
        summary:
          "The Sun is the central star of the Solar System and the source of almost all its light, heat, and gravitational order. It is not a solid burning ball, but a sphere of hot plasma made mostly of hydrogen and helium. Nuclear fusion in its core turns hydrogen into helium and releases energy that eventually reaches the visible surface, then streams outward as sunlight and solar wind. Because the Sun holds nearly all the mass in the Solar System, planets, asteroids, comets, and dust move within its gravitational architecture. Studying it explains daylight, seasons, climate energy, space weather, auroras, and the habitability limits around stars."
      }
    }
  },
  {
    id: "mercury",
    type: "planet",
    name: { zh: "水星", en: "Mercury" },
    radiusKm: 2439.7,
    massKg: "3.301 × 10^23",
    averageDistanceFromSunKm: 57900000,
    rotationPeriodHours: 1407.6,
    surfaceGravityMs2: 3.7,
    temperatureRangeC: { minC: -173, maxC: 427 },
    moons: noMoons,
    axialTiltDeg: 0.034,
    orbit: { semiMajorAxisAu: 0.39, displayDistance: 8, displayRadius: 0.38, orbitalPeriodDays: 88, phaseDeg: 15, inclinationDeg: 7, color: "#9ca3af", showLabelByDefault: true },
    textureAssetId: "mercury-nasa",
    content: {
      zh: {
        summary:
          "水星是距离太阳最近、体积最小的行星，表面布满陨石坑、断崖和古老熔岩平原，外观常让人联想到月球。它几乎没有能稳定保温的大气，只有极稀薄的外逸层，因此白天受到强烈太阳辐射时会变得灼热，夜晚又迅速降到极寒。水星公转很快，一年只有约八十八个地球日，但自转缓慢，一个恒星日接近五十九个地球日，形成独特的昼夜节奏。它拥有比例很大的金属核心和微弱磁场，说明小型岩石行星也可能保留复杂内部结构。水星轨道偏心率较高，近日点和远日点接收的太阳能差异明显，极区永久阴影坑中还可能保存水冰。由于靠近太阳，从地球观测水星总是贴近晨昏天空，探测器进入水星轨道也需要复杂的引力辅助和减速过程。它的巨大断崖显示行星冷却收缩曾改变全球地壳，表面挥发性元素又挑战了近太阳高温会完全蒸发轻元素的直觉。信使号等任务的测量让科学家重新评估它的形成位置、撞击剥离假说和内部冷却历史。研究水星可以帮助理解岩石行星早期分化、太阳潮汐作用、撞击历史和近太阳空间环境。"
      },
      en: {
        summary:
          "Mercury is the closest planet to the Sun and the smallest planet in the Solar System. Its cratered plains, scarps, and ancient volcanic surfaces often resemble the Moon, but its environment is more extreme. With almost no atmosphere to store heat, the surface swings from intense daytime heat to deep nighttime cold. Mercury races around the Sun in about 88 Earth days, yet rotates slowly, giving it an unusual day-night rhythm. Its oversized metallic core and weak magnetic field make it an important example for understanding early rocky planet differentiation, solar tides, and near-Sun space conditions."
      }
    }
  },
  {
    id: "venus",
    type: "planet",
    name: { zh: "金星", en: "Venus" },
    radiusKm: 6051.8,
    massKg: "4.867 × 10^24",
    averageDistanceFromSunKm: 108200000,
    rotationPeriodHours: -5832.5,
    surfaceGravityMs2: 8.87,
    temperatureRangeC: { minC: 462, maxC: 462 },
    moons: noMoons,
    axialTiltDeg: 177.36,
    orbit: { semiMajorAxisAu: 0.72, displayDistance: 11, displayRadius: 0.7, orbitalPeriodDays: 224.7, phaseDeg: 75, inclinationDeg: 3.4, color: "#d6b36a", showLabelByDefault: true },
    textureAssetId: "venus-nasa",
    content: {
      zh: {
        summary:
          "金星的大小和质量接近地球，常被称为地球的姊妹行星，但它的环境却完全不同。厚重二氧化碳大气和硫酸云层造成失控温室效应，使地表温度长期高到足以熔化铅，气压也远高于地球海平面。金星自转方向与多数行星相反，而且自转极慢，一天比一年还长。云层遮住了可见光下的表面，雷达探测才揭示出广阔火山平原、山脉和撞击坑。它没有像地球那样的海洋和板块循环来长期调节碳循环，火山释放的大气可能让温室过程不断增强。金星高层大气有强烈环流，云顶风速远快于地表自转，说明行星气候并不只由距离太阳决定。金星表面的年轻地貌提示火山活动可能在地质时间尺度上重塑行星，闪电、云化学和大气逃逸仍是重要研究问题。未来任务会用雷达、光谱和大气探针寻找火山活动、岩石成分和早期海洋线索。这些问题也影响系外类地行星判读。金星提醒我们，位于宜居带内侧边缘的岩石行星即使大小相近，也可能因为大气演化、内部活动和太阳距离差异而走向截然不同的气候结局和命运。"
      },
      en: {
        summary:
          "Venus is close to Earth in size and mass, yet its environment followed a radically different path. A dense carbon dioxide atmosphere and sulfuric acid clouds create an intense greenhouse effect, keeping the surface hot enough to melt lead and under crushing pressure. Venus rotates backward compared with most planets and so slowly that its day is longer than its year. Its clouds hide the surface in visible light, but radar has revealed volcanic plains, mountains, and impact craters. Venus is a powerful comparison case for how rocky planets of similar size can diverge through atmosphere, interior activity, and solar distance."
      }
    }
  },
  {
    id: "earth",
    type: "planet",
    name: { zh: "地球", en: "Earth" },
    radiusKm: 6371,
    massKg: "5.972 × 10^24",
    averageDistanceFromSunKm: 149600000,
    rotationPeriodHours: 23.93,
    surfaceGravityMs2: 9.81,
    temperatureRangeC: { minC: -89, maxC: 58 },
    moons: { count: 1, names: [namedMoon("月球", "Moon")] },
    axialTiltDeg: 23.44,
    orbit: { semiMajorAxisAu: 1, displayDistance: 15, displayRadius: 0.75, orbitalPeriodDays: 365.25, phaseDeg: 160, inclinationDeg: 0, color: "#4fb3d8", showLabelByDefault: true },
    textureAssetId: "earth-nasa",
    content: {
      zh: {
        summary:
          "地球是目前已知唯一拥有生命的行星，也是比较其他天体环境的基准。它位于太阳宜居带内，表面约七成被液态水覆盖，拥有富含氮和氧的大气、活跃的水循环、板块构造和保护生命免受大量太阳风直接冲击的磁场。地球自转接近二十四小时，公转约三百六十五天，轴倾角带来季节变化。月球稳定地球自转轴并驱动潮汐，使海洋和沿岸生态系统形成周期节律。地球内部热量推动火山、地震和大陆漂移，碳循环又把岩石圈、海洋、大气和生命活动联系起来。大气中的温室气体让平均温度适合液态水存在，臭氧层削弱部分紫外线，磁层则把带电粒子引向极区形成极光。地球系统的特殊之处在于海洋、大陆、冰盖、生命和大气互相反馈，既能缓冲变化，也可能被快速扰动放大。卫星遥感持续记录云、冰、植被、海温和人类活动影响，让地球也成为被长期观测的行星。理解地球并不是只研究家园本身，也是在建立一把标尺，用来衡量火星的干冷、金星的温室效应、冰巨行星的极端环境以及外行星卫星可能存在的宜居条件。"
      },
      en: {
        summary:
          "Earth is the only world currently known to host life and the reference point for comparing other planetary environments. It sits in the Sun's habitable zone, has liquid water across much of its surface, and maintains a nitrogen-oxygen atmosphere, water cycle, plate tectonics, and magnetic field. Earth rotates in nearly 24 hours and orbits the Sun in about 365 days; its axial tilt produces seasons. The Moon stabilizes Earth's axis and drives tides. Studying Earth provides the baseline for judging Mars' cold dryness, Venus' greenhouse climate, and the potential habitability of icy moons."
      }
    }
  },
  {
    id: "moon",
    type: "moon",
    parentId: "earth",
    name: { zh: "月球", en: "Moon" },
    radiusKm: 1737.4,
    massKg: "7.342 × 10^22",
    averageDistanceFromSunKm: 149984400,
    rotationPeriodHours: 655.7,
    surfaceGravityMs2: 1.62,
    temperatureRangeC: { minC: -173, maxC: 127 },
    moons: noMoons,
    axialTiltDeg: 6.68,
    orbit: { semiMajorAxisAu: 0.00257, displayDistance: 2.1, displayRadius: 0.22, orbitalPeriodDays: 27.3, phaseDeg: 40, inclinationDeg: 5.1, color: "#cbd5e1", showLabelByDefault: false },
    textureAssetId: "moon-nasa",
    content: {
      zh: {
        summary: "月球是地球唯一的天然卫星，表面布满撞击坑、月海和高地。它与地球潮汐锁定，始终大致以同一面朝向地球。月球没有浓厚大气，昼夜温差极大，并保存了太阳系早期撞击历史。它影响地球潮汐，也为理解月相、日食、月食和深空探测提供最近的天然实验场。"
      },
      en: {
        summary:
          "The Moon is Earth's only natural satellite, with impact craters, maria, and highlands across its surface. It is tidally locked to Earth, so nearly the same face is always turned toward us. With no thick atmosphere, it experiences extreme temperature swings and preserves early Solar System impact history. It shapes tides and provides a nearby laboratory for understanding phases, eclipses, and deep-space exploration."
      }
    }
  },
  {
    id: "mars",
    type: "planet",
    name: { zh: "火星", en: "Mars" },
    radiusKm: 3389.5,
    massKg: "6.417 × 10^23",
    averageDistanceFromSunKm: 227900000,
    rotationPeriodHours: 24.6,
    surfaceGravityMs2: 3.71,
    temperatureRangeC: { minC: -153, maxC: 20 },
    moons: { count: 2, names: [namedMoon("火卫一", "Phobos"), namedMoon("火卫二", "Deimos")] },
    axialTiltDeg: 25.19,
    orbit: { semiMajorAxisAu: 1.52, displayDistance: 20, displayRadius: 0.52, orbitalPeriodDays: 687, phaseDeg: 250, inclinationDeg: 1.85, color: "#c66b4e", showLabelByDefault: true },
    textureAssetId: "mars-nasa",
    content: {
      zh: {
        summary:
          "火星是一颗寒冷、干燥的岩石行星，红色来自表面含铁矿物被氧化后的颜色。它的自转周期与地球非常接近，轴倾角也相似，因此也有季节，但稀薄大气难以留住热量和液态水。轨道器、着陆器和巡视器发现了古河道、三角洲、湖床沉积和含水矿物，说明火星早期可能拥有更湿润的环境。今天的火星有全球尘暴、极冠、巨型火山奥林匹斯山和峡谷系统水手峡谷。它的两颗小卫星像被捕获的小天体，轨道和形状都记录着火星周围的动力学历史。火星土壤、地下冰和古环境沉积物让科学家追问过去是否曾适合微生物生存。由于重力只有地球约三分之一，薄大气又缺乏全球磁场，火星表面长期暴露于辐射和风化作用。火星车钻探和采样能把局部岩层故事转化为行星演化证据，轨道器则持续监测水冰、甲烷线索和沙尘活动。火星还是测试进入、下降、着陆、原位资源利用和长期生命保障的关键目标。它也是公众最熟悉的深空目的地之一。研究火星既关乎生命可能性，也关乎未来机器人、采样返回和载人探测的工程边界。"
      },
      en: {
        summary:
          "Mars is a cold, dry rocky planet whose red color comes from oxidized iron minerals on its surface. Its rotation period and axial tilt are close to Earth's, so it has seasons, but its thin atmosphere cannot hold much heat or stable surface water. Orbiters, landers, and rovers have found ancient channels, deltas, lakebed deposits, and water-related minerals, showing that early Mars may have been wetter. Today it has global dust storms, polar caps, Olympus Mons, and Valles Marineris. Its two small moons resemble captured minor bodies, and the planet remains central to astrobiology and future exploration."
      }
    }
  },
  {
    id: "jupiter",
    type: "planet",
    name: { zh: "木星", en: "Jupiter" },
    radiusKm: 69911,
    massKg: "1.898 × 10^27",
    averageDistanceFromSunKm: 778500000,
    rotationPeriodHours: 9.93,
    surfaceGravityMs2: 24.79,
    temperatureRangeC: { minC: -145, maxC: -108 },
    moons: {
      count: 101,
      names: [namedMoon("木卫一", "Io"), namedMoon("木卫二", "Europa"), namedMoon("木卫三", "Ganymede"), namedMoon("木卫四", "Callisto")],
      note: { zh: "列出伽利略四大卫星；其余为已确认小卫星。", en: "Lists the four Galilean moons; the rest are confirmed smaller moons." }
    },
    axialTiltDeg: 3.13,
    orbit: { semiMajorAxisAu: 5.2, displayDistance: 30, displayRadius: 1.55, orbitalPeriodDays: 4332.6, phaseDeg: 15, inclinationDeg: 1.3, color: "#d1a16e", showLabelByDefault: true },
    textureAssetId: "jupiter-nasa",
    content: {
      zh: {
        summary:
          "木星是太阳系最大的行星，质量超过其他行星总和的两倍，是理解巨行星和太阳系结构的关键。它没有固体表面，可见外观由氢、氦大气中的云带、急流和风暴组成。大红斑是一场持续数百年的巨大反气旋风暴，尺度足以容纳地球。木星自转极快，不到十小时完成一圈，强磁场和辐射带塑造了庞大的磁层。它的引力影响小行星、彗星和外太阳系小天体轨道，也保护和扰动内太阳系。木星可能在早期太阳系迁移过，改变了小行星带和岩石行星形成材料的分布。它的云带颜色来自不同高度的化学物质、温度和动力过程，探测器还发现其极区有复杂气旋群。木星内部可能没有清晰固体边界，而是从气态逐渐过渡到高压流体和金属氢区域。朱诺任务通过重力场、磁场和微波辐射观测揭示了深层大气和模糊核心。理解木星也有助于解释系外巨行星的形成和迁移过程及其长期的轨道演化。木卫一火山活跃，木卫二、木卫三等卫星拥有冰壳或地下海洋，使木星系统成为寻找宜居环境和研究潮汐加热的重要目标。"
      },
      en: {
        summary:
          "Jupiter is the largest planet in the Solar System and more massive than all the other planets combined. It has no solid surface; what we see are cloud bands, jets, and storms in a hydrogen-helium atmosphere. The Great Red Spot is a centuries-old anticyclonic storm large enough to contain Earth. Jupiter rotates in less than ten hours, generating a strong magnetic field and vast radiation belts. Its gravity shapes asteroid and comet paths and affects the architecture of the outer Solar System. Moons such as Europa and Ganymede, with ice shells or possible subsurface oceans, are major targets in the search for habitable environments."
      }
    }
  },
  {
    id: "saturn",
    type: "planet",
    name: { zh: "土星", en: "Saturn" },
    radiusKm: 58232,
    massKg: "5.683 × 10^26",
    averageDistanceFromSunKm: 1433500000,
    rotationPeriodHours: 10.7,
    surfaceGravityMs2: 10.44,
    temperatureRangeC: { minC: -185, maxC: -122 },
    moons: {
      count: 274,
      names: [namedMoon("土卫六", "Titan"), namedMoon("土卫二", "Enceladus"), namedMoon("土卫一", "Mimas"), namedMoon("土卫五", "Rhea"), namedMoon("土卫八", "Iapetus")],
      note: { zh: "列出代表性卫星；土星还有大量已确认小卫星。", en: "Lists representative moons; Saturn also has many confirmed smaller moons." }
    },
    axialTiltDeg: 26.73,
    orbit: { semiMajorAxisAu: 9.58, displayDistance: 40, displayRadius: 1.32, orbitalPeriodDays: 10759, phaseDeg: 80, inclinationDeg: 2.49, color: "#e0c180", showLabelByDefault: true },
    textureAssetId: "saturn-nasa",
    content: {
      zh: {
        summary:
          "土星是第二大行星，以明亮、宽阔而精细分层的环系统闻名。它和木星一样主要由氢和氦组成，平均密度低于水，但内部压力极高，并不意味着可以漂浮在真实海洋上。土星环主要由水冰、尘埃和岩石颗粒组成，从远处看像连续圆盘，近看则是无数粒子在轨道上运行。土星自转很快，赤道略鼓，云层中有喷流、风暴和六边形极区结构。环缝、牧羊卫星和微小颗粒相互作用，让土星环像一个可观察的行星形成实验。卡西尼任务揭示了环与磁层、卫星和尘埃之间持续交换物质的过程，也让人看到巨行星系统并非静止模型。土星的低密度、快速自转和环面投影会随季节改变观测效果，因此同一颗行星在不同年份看起来差异很大。环的年龄、寿命和补给机制仍有争议，关系到我们如何理解行星周围盘状结构的演化。它的卫星数量也显示巨行星周围捕获和碰撞过程很活跃。土卫六有浓厚大气和液态烃湖，土卫二喷出含水羽流，使土星系统成为研究环、卫星、地下海洋、复杂有机化学和行星磁层相互作用的天然实验室。"
      },
      en: {
        summary:
          "Saturn is the second-largest planet and is famous for its bright, broad, finely structured ring system. Like Jupiter, it is made mostly of hydrogen and helium; its average density is lower than water, though its interior pressure is enormous. The rings are composed mainly of water ice, dust, and rocky particles that appear continuous from afar but are actually countless orbiting pieces. Saturn rotates rapidly, bulges at the equator, and hosts jets, storms, and a hexagonal polar pattern. Titan has a thick atmosphere and liquid hydrocarbon lakes, while Enceladus sprays water-rich plumes, making the Saturn system a laboratory for rings, moons, oceans, and magnetospheres."
      }
    }
  },
  {
    id: "uranus",
    type: "planet",
    name: { zh: "天王星", en: "Uranus" },
    radiusKm: 25362,
    massKg: "8.681 × 10^25",
    averageDistanceFromSunKm: 2872500000,
    rotationPeriodHours: -17.2,
    surfaceGravityMs2: 8.69,
    temperatureRangeC: { minC: -224, maxC: -197 },
    moons: {
      count: 28,
      names: [namedMoon("米兰达", "Miranda"), namedMoon("艾瑞尔", "Ariel"), namedMoon("乌姆柏里厄尔", "Umbriel"), namedMoon("泰坦尼亚", "Titania"), namedMoon("奥伯龙", "Oberon")]
    },
    axialTiltDeg: 97.77,
    orbit: { semiMajorAxisAu: 19.2, displayDistance: 50, displayRadius: 1.0, orbitalPeriodDays: 30687, phaseDeg: 180, inclinationDeg: 0.77, color: "#85d7df", showLabelByDefault: true },
    textureAssetId: "uranus-nasa",
    content: {
      zh: {
        summary:
          "天王星是冰巨行星，成分中含有水、氨、甲烷等挥发物形成的高压冰态物质，而不是普通意义上的冰球。它最醒目的特征是自转轴几乎横躺在轨道面上，像侧身滚动着绕太阳运行，因此两极会经历极长的白昼和黑夜。甲烷吸收红光，使天王星呈现淡蓝绿色。它有暗弱的环和以文学人物命名的卫星系统。天王星的磁场轴既倾斜又偏离行星中心，暗示内部结构和发电机制与地球、木星都不同。它的大气看似平静，但红外和高分辨率观测能发现云、风暴和季节性变化；这些变化在漫长公转周期中展开，需要长期跟踪。天王星卫星表面的峡谷、断裂和撞击坑也可能保存早期碰撞或潮汐演化线索。它的极端倾角可能来自远古巨大撞击，也可能来自多体引力作用。未来轨道器能同时研究大气、环、卫星和磁层结构细节数据完整。由于只有旅行者二号近距离飞掠过它，天王星仍然保留许多未解问题，包括内部热量为何异常微弱、极端轴倾角如何影响大气循环和季节，以及冰巨行星在其他恒星系统中为何如此常见。"
      },
      en: {
        summary:
          "Uranus is an ice giant, meaning its interior contains high-pressure forms of volatile materials such as water, ammonia, and methane rather than being a simple ball of ice. Its most striking feature is an axis tilted almost sideways, so the planet appears to roll around the Sun and its poles experience very long periods of daylight and darkness. Methane absorbs red light, giving Uranus a pale blue-green color. It has faint rings and moons named after literary characters. Because Voyager 2 is the only spacecraft to fly past it closely, Uranus still raises questions about its weak internal heat, offset magnetic field, and extreme seasons."
      }
    }
  },
  {
    id: "neptune",
    type: "planet",
    name: { zh: "海王星", en: "Neptune" },
    radiusKm: 24622,
    massKg: "1.024 × 10^26",
    averageDistanceFromSunKm: 4495100000,
    rotationPeriodHours: 16.1,
    surfaceGravityMs2: 11.15,
    temperatureRangeC: { minC: -218, maxC: -200 },
    moons: {
      count: 16,
      names: [namedMoon("海卫一", "Triton"), namedMoon("普罗透斯", "Proteus"), namedMoon("涅瑞伊得", "Nereid"), namedMoon("拉里萨", "Larissa"), namedMoon("海马", "Hippocamp")]
    },
    axialTiltDeg: 28.32,
    orbit: { semiMajorAxisAu: 30.05, displayDistance: 60, displayRadius: 0.98, orbitalPeriodDays: 60190, phaseDeg: 310, inclinationDeg: 1.77, color: "#4778d8", showLabelByDefault: true },
    textureAssetId: "neptune-nasa",
    content: {
      zh: {
        summary:
          "海王星是八大行星中距离太阳最远的一颗，也是另一颗冰巨行星。它接收的阳光很少，却拥有活跃大气、快速风暴和高速风，说明内部热量仍在驱动天气系统。甲烷让它呈蓝色，但深蓝外观还与云雾和未知吸收物有关。海王星一年约等于一百六十五个地球年，自转却只需十六小时左右。它的最大卫星海卫一沿逆行轨道运行，可能是被捕获的柯伊伯带天体，并有氮冰、稀薄大气和可能的喷泉活动。海王星还拥有暗弱环和弧状结构，提示微小卫星与尘埃之间存在复杂引力关系。旅行者二号曾看到大暗斑一类风暴，后续望远镜观测又发现这些风暴会出现、漂移和消散。海王星的发现本身来自对天王星轨道扰动的计算，是理论预言与观测相互验证的经典案例。它与柯伊伯带天体的轨道共振也记录着外行星迁移的痕迹。海王星系统连接行星区和更外侧小天体库边界区域结构和动态过程演变。研究海王星有助于理解远太阳区域的冰巨行星、行星迁移历史、太阳系边缘环境以及类似天体在系外行星中的普遍性。"
      },
      en: {
        summary:
          "Neptune is the most distant of the eight planets and another ice giant. It receives very little sunlight, yet its atmosphere remains active with storms and extremely fast winds, indicating that internal heat still drives weather. Methane contributes to its blue color, while haze and other absorbers shape its deeper appearance. Neptune takes about 165 Earth years to orbit the Sun but rotates in only about 16 hours. Its largest moon, Triton, follows a retrograde orbit and may be a captured Kuiper Belt object, with nitrogen ice, a thin atmosphere, and possible geyser activity. Neptune helps explain ice giants, planetary migration, and the outer Solar System."
      }
    }
  }
];
