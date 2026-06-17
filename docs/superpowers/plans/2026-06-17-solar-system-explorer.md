# 太阳系探索网站实现计划

> **给 agentic worker：** 必须使用 `superpowers:subagent-driven-development`（推荐）或 `superpowers:executing-plans` 按任务执行本计划。步骤使用 checkbox（`- [ ]`）语法跟踪。

**目标：** 构建一个生产质量、可开源的太阳系网站，包含高质量 3D 概述模块、真实来源视觉素材、中英文切换和严格架构分层。

**架构：** 应用是 Next.js TypeScript 网站，面向用户的路由为 `/` 和 `/overview`。数据、i18n、素材元数据、轨道计算、URL 状态、UI 组件和 3D 渲染拆分为职责集中的模块，后续新增专题时不需要重写概述模块。

**技术栈：** Next.js、React、TypeScript、Tailwind CSS、Three.js、React Three Fiber、Drei、Motion、Lucide React、Vitest、Testing Library、Playwright。

---

## 来源规格

实现依据：`docs/superpowers/specs/2026-06-17-太阳系探索网站设计规格.md`。

不可协商约束：

- v1 只有 “Solar System Overview / 太阳系概述” 可点击。
- 首页其他五个模块可见但禁用。
- 行星、月球和太阳图像必须来自有记录的公开来源。
- 网站必须通过 `?lang=zh` 和 `?lang=en` 支持中文和英文。
- 后续扩展前，已有行为必须有测试保护。
- 遵循 Karpathy Guidelines：明确假设、简单实现、克制修改、步骤可验证。

## 文件结构

创建这些文件：

- `package.json` - 脚本和依赖。
- `next.config.mjs` - Next.js 配置。
- `tsconfig.json` - 严格 TypeScript 配置。
- `tailwind.config.ts` - Tailwind 内容扫描和 token。
- `postcss.config.mjs` - Tailwind PostCSS 接入。
- `vitest.config.ts` - 单元/组件测试配置。
- `playwright.config.ts` - 浏览器截图和冒烟测试配置。
- `README.md` - 面向公开项目的中文说明，并说明英文支持。
- `docs/assets.md` - 所有真实视觉素材的来源记录。
- `public/textures/README.md` - 纹理目录规则。
- `src/app/layout.tsx` - 根布局。
- `src/app/page.tsx` - 首页路由。
- `src/app/overview/page.tsx` - 概述页路由。
- `src/app/globals.css` - 全局样式和 Tailwind 层。
- `src/types/domain.ts` - 共享领域类型。
- `src/data/assets.ts` - 素材元数据。
- `src/data/bodies.ts` - 天体和轨道数据。
- `src/data/modules.ts` - 首页模块数据。
- `src/i18n/dictionaries.ts` - 本地化 UI 和内容。
- `src/lib/locale.ts` - 语言解析和 URL 辅助函数。
- `src/lib/orbits.ts` - 纯轨道计算。
- `src/lib/url-state.ts` - 查询状态解析和序列化。
- `src/components/home/HomePage.tsx` - 首页组合组件。
- `src/components/home/ModuleCard.tsx` - 单个模块入口。
- `src/components/layout/LanguageSwitch.tsx` - 语言切换器。
- `src/components/overview/OverviewPage.tsx` - 概述页组合组件。
- `src/components/overview/ControlBar.tsx` - 时间、速度、视角和图层控件。
- `src/components/overview/BodyInfoPanel.tsx` - 本地化天体百科面板。
- `src/components/overview/WebGLFallback.tsx` - 静态兜底内容。
- `src/components/solar-system/SolarSystemCanvas.tsx` - 3D 场景外壳。
- `src/components/solar-system/CelestialBodyMesh.tsx` - 单个天体网格。
- `src/components/solar-system/OrbitLine.tsx` - 轨道路径渲染。
- `src/components/solar-system/Stars.tsx` - 星空背景。
- `src/test/setup.ts` - Vitest DOM 测试初始化。
- `src/**/*.test.ts` 和 `src/**/*.test.tsx` - 与实现相邻的聚焦测试。
- `tests/e2e/app.spec.ts` - Playwright 冒烟测试。

不要提交 `.idea/`。

## 任务 1：项目脚手架

**文件：**
- 创建：`package.json`
- 创建：`next.config.mjs`
- 创建：`tsconfig.json`
- 创建：`tailwind.config.ts`
- 创建：`postcss.config.mjs`
- 创建：`vitest.config.ts`
- 创建：`playwright.config.ts`
- 创建：`src/app/layout.tsx`
- 创建：`src/app/globals.css`
- 创建：`src/test/setup.ts`
- 修改：`.gitignore`

- [ ] **步骤 1：创建 package 元数据和脚本**

写入 `package.json`:

```json
{
  "name": "solar-system-explorer",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run --passWithNoTests",
    "test:watch": "vitest",
    "e2e": "playwright test"
  },
  "dependencies": {
    "@react-three/drei": "^9.122.0",
    "@react-three/fiber": "^8.17.10",
    "lucide-react": "^0.468.0",
    "motion": "^11.15.0",
    "next": "^14.2.23",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "three": "^0.171.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.49.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@types/node": "^22.10.2",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@types/three": "^0.171.0",
    "autoprefixer": "^10.4.20",
    "eslint": "^8.57.1",
    "eslint-config-next": "^14.2.23",
    "jsdom": "^25.0.1",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.2",
    "vitest": "^2.1.8"
  }
}
```

- [ ] **步骤 2：创建 TypeScript 和构建配置**

写入 `next.config.mjs`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true
};

export default nextConfig;
```

写入 `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "es2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

写入 `tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        space: "#05070d",
        panel: "rgba(10, 16, 28, 0.72)",
        sun: "#f8c45c",
        orbit: "#53d5e8",
        mars: "#c66b4e",
        earth: "#4fb3d8"
      },
      borderRadius: {
        ui: "8px"
      }
    }
  },
  plugins: []
};

export default config;
```

写入 `postcss.config.mjs`:

```js
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};

export default config;
```

- [ ] **步骤 3：创建测试配置**

写入 `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["src/test/setup.ts"]
  },
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname
    }
  }
});
```

写入 `src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

写入 `playwright.config.ts`:

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: true
  },
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry"
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["iPhone 13"] } }
  ]
});
```

- [ ] **步骤 4：创建应用外壳**

写入 `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solar System Explorer",
  description: "A bilingual interactive solar system learning website."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
```

写入 `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: dark;
  background: #05070d;
  color: #eef4ff;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  background: #05070d;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
}

button,
input,
select {
  font: inherit;
}

:focus-visible {
  outline: 2px solid #53d5e8;
  outline-offset: 3px;
}
```

- [ ] **步骤 5：更新 git ignore**

Ensure `.gitignore` contains:

```gitignore
node_modules
.next
out
coverage
test-results
playwright-report
.env*
.DS_Store
.idea/
tsconfig.tsbuildinfo
```

- [ ] **步骤 6：验证脚手架**

运行：`npm install`

预期：dependencies install and `package-lock.json` is created.

运行：`npm run test`

预期：Vitest exits successfully with no tests or a no-test notice. If Vitest exits non-zero due to no tests, add the first test in Task 2 before committing.

- [ ] **步骤 7：提交**

```bash
git add package.json package-lock.json next.config.mjs next-env.d.ts tsconfig.json tailwind.config.ts postcss.config.mjs vitest.config.ts playwright.config.ts src/app/layout.tsx src/app/globals.css src/test/setup.ts .gitignore
git commit -m "chore: scaffold solar system explorer"
```

## 任务 2：领域类型、数据、素材和 i18n

**文件：**
- 创建：`src/types/domain.ts`
- 创建：`src/data/assets.ts`
- 创建：`src/data/bodies.ts`
- 创建：`src/data/modules.ts`
- 创建：`src/i18n/dictionaries.ts`
- 创建：`src/lib/locale.ts`
- 创建：`src/lib/locale.test.ts`
- 创建：`src/data/data-integrity.test.ts`
- 创建：`docs/assets.md`
- 创建：`public/textures/README.md`

- [ ] **步骤 1：定义领域类型**

写入 `src/types/domain.ts`:

```ts
export type Locale = "zh" | "en";

export type ModuleStatus = "available" | "comingSoon";

export type BodyType = "star" | "planet" | "moon";

export type CameraPreset = "full" | "inner" | "earthMoon" | "outer";

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
  purpose: "diffuse" | "ring" | "clouds" | "fallback";
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
  whyItMatters: string;
  facts: string[];
}

export interface CelestialBody {
  id: string;
  type: BodyType;
  name: LocalizedText;
  radiusKm: number;
  massKg?: string;
  averageDistanceFromSunKm?: number;
  rotationPeriodHours?: number;
  axialTiltDeg?: number;
  orbit?: OrbitData;
  parentId?: string;
  textureAssetId?: string;
  content: Record<Locale, BodyContent>;
}
```

- [ ] **步骤 2：添加素材元数据**

写入 `src/data/assets.ts` with source records. Use local paths even before binary textures are added; later asset work must place files at these paths.

```ts
import type { AssetSource } from "@/types/domain";

export const assetSources: AssetSource[] = [
  {
    id: "sun-nasa-sdo",
    bodyId: "sun",
    purpose: "diffuse",
    title: "NASA Solar Dynamics Observatory Sun imagery",
    url: "https://science.nasa.gov/sun/",
    agency: "NASA",
    usage: "NASA imagery generally available for educational and informational use with acknowledgement; do not imply endorsement.",
    downloadedAt: "2026-06-17",
    localPath: "/textures/sun.jpg",
    processing: "To be converted into a sphere texture from public solar imagery."
  },
  {
    id: "mercury-nasa",
    bodyId: "mercury",
    purpose: "diffuse",
    title: "NASA Mercury imagery",
    url: "https://science.nasa.gov/mercury/",
    agency: "NASA",
    usage: "NASA imagery usage guidelines apply.",
    downloadedAt: "2026-06-17",
    localPath: "/textures/mercury.jpg",
    processing: "Resized and compressed for web texture use."
  },
  {
    id: "venus-nasa",
    bodyId: "venus",
    purpose: "diffuse",
    title: "NASA Venus imagery",
    url: "https://science.nasa.gov/venus/",
    agency: "NASA",
    usage: "NASA imagery usage guidelines apply.",
    downloadedAt: "2026-06-17",
    localPath: "/textures/venus.jpg",
    processing: "Resized and compressed for web texture use."
  },
  {
    id: "earth-nasa",
    bodyId: "earth",
    purpose: "diffuse",
    title: "NASA Earth imagery",
    url: "https://visibleearth.nasa.gov/",
    agency: "NASA",
    usage: "NASA imagery usage guidelines apply.",
    downloadedAt: "2026-06-17",
    localPath: "/textures/earth.jpg",
    processing: "Resized and compressed for web texture use."
  },
  {
    id: "moon-nasa",
    bodyId: "moon",
    purpose: "diffuse",
    title: "NASA Moon imagery",
    url: "https://science.nasa.gov/moon/",
    agency: "NASA",
    usage: "NASA imagery usage guidelines apply.",
    downloadedAt: "2026-06-17",
    localPath: "/textures/moon.jpg",
    processing: "Resized and compressed for web texture use."
  },
  {
    id: "mars-nasa",
    bodyId: "mars",
    purpose: "diffuse",
    title: "NASA Mars imagery",
    url: "https://science.nasa.gov/mars/",
    agency: "NASA",
    usage: "NASA imagery usage guidelines apply.",
    downloadedAt: "2026-06-17",
    localPath: "/textures/mars.jpg",
    processing: "Resized and compressed for web texture use."
  },
  {
    id: "jupiter-nasa",
    bodyId: "jupiter",
    purpose: "diffuse",
    title: "NASA Jupiter imagery",
    url: "https://science.nasa.gov/jupiter/",
    agency: "NASA",
    usage: "NASA imagery usage guidelines apply.",
    downloadedAt: "2026-06-17",
    localPath: "/textures/jupiter.jpg",
    processing: "Resized and compressed for web texture use."
  },
  {
    id: "saturn-nasa",
    bodyId: "saturn",
    purpose: "diffuse",
    title: "NASA Saturn imagery",
    url: "https://science.nasa.gov/saturn/",
    agency: "NASA",
    usage: "NASA imagery usage guidelines apply.",
    downloadedAt: "2026-06-17",
    localPath: "/textures/saturn.jpg",
    processing: "Resized and compressed for web texture use."
  },
  {
    id: "uranus-nasa",
    bodyId: "uranus",
    purpose: "diffuse",
    title: "NASA Uranus imagery",
    url: "https://science.nasa.gov/uranus/",
    agency: "NASA",
    usage: "NASA imagery usage guidelines apply.",
    downloadedAt: "2026-06-17",
    localPath: "/textures/uranus.jpg",
    processing: "Resized and compressed for web texture use."
  },
  {
    id: "neptune-nasa",
    bodyId: "neptune",
    purpose: "diffuse",
    title: "NASA Neptune imagery",
    url: "https://science.nasa.gov/neptune/",
    agency: "NASA",
    usage: "NASA imagery usage guidelines apply.",
    downloadedAt: "2026-06-17",
    localPath: "/textures/neptune.jpg",
    processing: "Resized and compressed for web texture use."
  }
];
```

- [ ] **步骤 3：添加天体和模块数据**

写入 `src/data/bodies.ts` using the real bodies below. Keep copy short and accurate.

```ts
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
```

写入 `src/data/modules.ts`:

```ts
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
    status: "comingSoon",
    focusBodyId: "moon"
  },
  {
    id: "lunar-eclipse",
    title: { zh: "月食", en: "Lunar Eclipses" },
    description: { zh: "观察月球穿过地球影子时的几何关系。", en: "See the geometry of the Moon moving through Earth's shadow." },
    status: "comingSoon",
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
```

- [ ] **步骤 4：添加字典和语言辅助函数**

写入 `src/i18n/dictionaries.ts`:

```ts
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
```

写入 `src/lib/locale.ts`:

```ts
import type { Locale } from "@/types/domain";

export const defaultLocale: Locale = "zh";
export const locales: Locale[] = ["zh", "en"];

export function parseLocale(value: string | string[] | undefined | null): Locale {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === "en" || raw === "zh" ? raw : defaultLocale;
}

export function oppositeLocale(locale: Locale): Locale {
  return locale === "zh" ? "en" : "zh";
}

export function withLocaleSearchParams(searchParams: URLSearchParams, locale: Locale): string {
  const next = new URLSearchParams(searchParams);
  next.set("lang", locale);
  const query = next.toString();
  return query ? `?${query}` : "";
}
```

- [ ] **步骤 5：编写数据完整性测试**

写入 `src/lib/locale.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { defaultLocale, oppositeLocale, parseLocale, withLocaleSearchParams } from "./locale";

describe("locale helpers", () => {
  it("defaults to Chinese for missing or invalid values", () => {
    expect(parseLocale(undefined)).toBe(defaultLocale);
    expect(parseLocale("fr")).toBe("zh");
  });

  it("parses supported locales", () => {
    expect(parseLocale("zh")).toBe("zh");
    expect(parseLocale("en")).toBe("en");
  });

  it("returns the opposite language", () => {
    expect(oppositeLocale("zh")).toBe("en");
    expect(oppositeLocale("en")).toBe("zh");
  });

  it("serializes language into query params", () => {
    const params = new URLSearchParams("body=earth");
    expect(withLocaleSearchParams(params, "en")).toBe("?body=earth&lang=en");
  });
});
```

写入 `src/data/data-integrity.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { assetSources } from "./assets";
import { bodies } from "./bodies";
import { learningModules } from "./modules";

describe("data integrity", () => {
  it("has exactly one available learning module", () => {
    expect(learningModules.filter((module) => module.status === "available").map((module) => module.id)).toEqual(["overview"]);
  });

  it("keeps coming soon modules without routes", () => {
    const comingSoon = learningModules.filter((module) => module.status === "comingSoon");
    expect(comingSoon).toHaveLength(5);
    expect(comingSoon.every((module) => module.route === undefined)).toBe(true);
  });

  it("has localized content for every body", () => {
    for (const body of bodies) {
      expect(body.name.zh).toBeTruthy();
      expect(body.name.en).toBeTruthy();
      expect(body.content.zh.summary).toBeTruthy();
      expect(body.content.en.summary).toBeTruthy();
      expect(body.content.zh.facts.length).toBeGreaterThanOrEqual(3);
      expect(body.content.en.facts.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("documents texture sources for all textured bodies", () => {
    const assetIds = new Set(assetSources.map((asset) => asset.id));
    const textured = bodies.filter((body) => body.textureAssetId);
    expect(textured.every((body) => assetIds.has(body.textureAssetId!))).toBe(true);
  });
});
```

- [ ] **步骤 6：记录素材说明**

写入 `docs/assets.md`:

```md
# 素材来源

本项目的太阳、行星和月球视觉素材必须来自真实公开影像或由真实观测资料制作的贴图。页面可标注素材来源，但不能暗示 NASA、JPL、USGS 或其他机构背书。

## 使用规则

- 运行时不从互联网动态加载素材。
- 每个素材都需要记录来源 URL、机构、使用说明、下载日期、本地路径和处理方式。
- 如果页面标记第三方版权，不能直接使用。
- 如果素材由真实影像派生，需要说明处理方式。

## 初始来源清单

数据源记录维护在 `src/data/assets.ts`。二进制贴图放在 `public/textures/`。

主要参考：

- NASA Images and Media Usage Guidelines: https://www.nasa.gov/nasa-brand-center/images-and-media/
- NASA Photojournal: https://science.nasa.gov/photojournal/
- NASA Solar System: https://science.nasa.gov/solar-system/
- NASA Visible Earth: https://visibleearth.nasa.gov/
```

写入 `public/textures/README.md`:

```md
# 纹理素材

这里放置经过 Web 优化的本地纹理文件。

规则：

- 每个纹理都必须在 `src/data/assets.ts` 中有对应来源记录。
- 不添加无来源图片。
- 优先使用合理压缩的 JPG 或 WebP 文件。
- 不把 NASA 标识或任务徽章作为 UI 品牌元素。
```

- [ ] **步骤 7：验证并提交**

运行：`npm run test -- src/lib/locale.test.ts src/data/data-integrity.test.ts`

预期：所有测试通过。

运行：`npm run build`

预期：Next.js build completes once route files exist. If route files are not yet created, defer build to Task 4 and run TypeScript check with `npx tsc --noEmit`.

提交：

```bash
git add src/types/domain.ts src/data/assets.ts src/data/bodies.ts src/data/modules.ts src/i18n/dictionaries.ts src/lib/locale.ts src/lib/locale.test.ts src/data/data-integrity.test.ts docs/assets.md public/textures/README.md
git commit -m "feat: add solar system data model"
```

## 任务 3：轨道计算和 URL 状态

**文件：**
- 创建：`src/lib/orbits.ts`
- 创建：`src/lib/orbits.test.ts`
- 创建：`src/lib/url-state.ts`
- 创建：`src/lib/url-state.test.ts`

- [ ] **步骤 1：编写轨道计算测试**

写入 `src/lib/orbits.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getBodyPosition, orbitalAngleDeg } from "./orbits";
import type { OrbitData } from "@/types/domain";

const orbit: OrbitData = {
  semiMajorAxisAu: 1,
  displayDistance: 10,
  displayRadius: 1,
  orbitalPeriodDays: 100,
  phaseDeg: 0,
  inclinationDeg: 0,
  color: "#fff",
  showLabelByDefault: true
};

describe("orbits", () => {
  it("computes a repeating orbital angle", () => {
    expect(orbitalAngleDeg(orbit, 0)).toBeCloseTo(0);
    expect(orbitalAngleDeg(orbit, 25)).toBeCloseTo(90);
    expect(orbitalAngleDeg(orbit, 100)).toBeCloseTo(0);
  });

  it("uses display distance for position", () => {
    expect(getBodyPosition(orbit, 0)).toEqual([10, 0, 0]);
    const quarter = getBodyPosition(orbit, 25);
    expect(quarter[0]).toBeCloseTo(0, 5);
    expect(quarter[2]).toBeCloseTo(10, 5);
  });
});
```

- [ ] **步骤 2：实现轨道计算**

写入 `src/lib/orbits.ts`:

```ts
import type { OrbitData } from "@/types/domain";

export type Vector3Tuple = [number, number, number];

export function degToRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function orbitalAngleDeg(orbit: OrbitData, elapsedDays: number): number {
  const turns = elapsedDays / orbit.orbitalPeriodDays;
  const angle = (orbit.phaseDeg + turns * 360) % 360;
  return angle < 0 ? angle + 360 : angle;
}

export function getBodyPosition(orbit: OrbitData, elapsedDays: number): Vector3Tuple {
  const angle = degToRad(orbitalAngleDeg(orbit, elapsedDays));
  const inclination = degToRad(orbit.inclinationDeg);
  const x = Math.cos(angle) * orbit.displayDistance;
  const flatZ = Math.sin(angle) * orbit.displayDistance;
  const y = Math.sin(inclination) * flatZ;
  const z = Math.cos(inclination) * flatZ;
  return [x, y, z];
}
```

- [ ] **步骤 3：编写 URL 状态测试**

写入 `src/lib/url-state.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { parseUrlState, serializeUrlState } from "./url-state";

describe("url state", () => {
  it("parses supported state", () => {
    const state = parseUrlState(new URLSearchParams("lang=en&body=earth&camera=inner&labels=0&orbits=1&moonOrbit=0"));
    expect(state).toEqual({
      locale: "en",
      selectedBodyId: "earth",
      camera: "inner",
      layers: { labels: false, orbits: true, moonOrbit: false }
    });
  });

  it("falls back for invalid values", () => {
    const state = parseUrlState(new URLSearchParams("lang=fr&camera=bad"));
    expect(state.locale).toBe("zh");
    expect(state.camera).toBe("full");
    expect(state.layers).toEqual({ labels: true, orbits: true, moonOrbit: true });
  });

  it("serializes state", () => {
    expect(
      serializeUrlState({
        locale: "en",
        selectedBodyId: "mars",
        camera: "outer",
        layers: { labels: true, orbits: false, moonOrbit: true }
      })
    ).toBe("?lang=en&body=mars&camera=outer&labels=1&orbits=0&moonOrbit=1");
  });
});
```

- [ ] **步骤 4：实现 URL 状态**

写入 `src/lib/url-state.ts`:

```ts
import type { CameraPreset, LayerKey, Locale } from "@/types/domain";
import { parseLocale } from "./locale";

export interface UrlState {
  locale: Locale;
  selectedBodyId?: string;
  camera: CameraPreset;
  layers: Record<LayerKey, boolean>;
}

const cameraPresets: CameraPreset[] = ["full", "inner", "earthMoon", "outer"];

function parseCamera(value: string | null): CameraPreset {
  return cameraPresets.includes(value as CameraPreset) ? (value as CameraPreset) : "full";
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
```

- [ ] **步骤 5：验证并提交**

运行：`npm run test -- src/lib/orbits.test.ts src/lib/url-state.test.ts`

预期：所有测试通过。

提交：

```bash
git add src/lib/orbits.ts src/lib/orbits.test.ts src/lib/url-state.ts src/lib/url-state.test.ts
git commit -m "feat: add orbit and url state helpers"
```

## 任务 4：首页和语言切换

**文件：**
- 创建：`src/components/layout/LanguageSwitch.tsx`
- 创建：`src/components/home/ModuleCard.tsx`
- 创建：`src/components/home/HomePage.tsx`
- 创建：`src/components/home/HomePage.test.tsx`
- 创建：`src/app/page.tsx`

- [ ] **步骤 1：编写首页测试**

写入 `src/components/home/HomePage.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomePage } from "./HomePage";

describe("HomePage", () => {
  it("renders all modules and only enables overview", () => {
    render(<HomePage locale="zh" />);
    expect(screen.getByText("太阳系概述")).toBeInTheDocument();
    expect(screen.getAllByText("即将开放")).toHaveLength(5);
    expect(screen.getByRole("link", { name: /进入太阳系概述/ })).toHaveAttribute("href", "/overview?lang=zh");
    expect(screen.queryByRole("link", { name: /日食/ })).not.toBeInTheDocument();
  });

  it("renders English text", () => {
    render(<HomePage locale="en" />);
    expect(screen.getByText("Solar System Overview")).toBeInTheDocument();
    expect(screen.getAllByText("Coming soon")).toHaveLength(5);
  });
});
```

Install `@testing-library/user-event` if this test imports it:

```bash
npm install --save-dev @testing-library/user-event
```

- [ ] **步骤 2：实现语言切换器**

写入 `src/components/layout/LanguageSwitch.tsx`:

```tsx
"use client";

import { Languages } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Locale } from "@/types/domain";
import { dictionaries } from "@/i18n/dictionaries";
import { oppositeLocale, withLocaleSearchParams } from "@/lib/locale";

interface LanguageSwitchProps {
  locale: Locale;
}

export function LanguageSwitch({ locale }: LanguageSwitchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const nextLocale = oppositeLocale(locale);

  return (
    <button
      type="button"
      aria-label={dictionaries[locale].switchLanguage}
      className="inline-flex items-center gap-2 rounded-ui border border-white/15 bg-white/10 px-3 py-2 text-sm text-white transition hover:bg-white/16"
      onClick={() => router.push(`${pathname}${withLocaleSearchParams(searchParams, nextLocale)}`)}
    >
      <Languages aria-hidden="true" size={16} />
      {dictionaries[nextLocale].languageName}
    </button>
  );
}
```

- [ ] **步骤 3：实现模块卡片**

写入 `src/components/home/ModuleCard.tsx`:

```tsx
import Link from "next/link";
import type { LearningModule, Locale } from "@/types/domain";
import { dictionaries } from "@/i18n/dictionaries";

interface ModuleCardProps {
  module: LearningModule;
  locale: Locale;
}

export function ModuleCard({ module, locale }: ModuleCardProps) {
  const title = module.title[locale];
  const description = module.description[locale];

  if (module.status === "available" && module.route) {
    return (
      <Link
        href={`${module.route}?lang=${locale}`}
        aria-label={`${dictionaries[locale].enterOverview}: ${title}`}
        className="group rounded-ui border border-orbit/40 bg-panel p-4 text-left shadow-2xl shadow-black/20 transition hover:border-orbit hover:bg-white/12"
      >
        <span className="text-xs uppercase tracking-[0.18em] text-orbit">{dictionaries[locale].enterOverview}</span>
        <h2 className="mt-3 text-xl font-semibold text-white">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
      </Link>
    );
  }

  return (
    <article
      aria-disabled="true"
      className="rounded-ui border border-white/10 bg-white/[0.06] p-4 text-left opacity-70"
    >
      <span className="text-xs uppercase tracking-[0.18em] text-slate-400">{dictionaries[locale].comingSoon}</span>
      <h2 className="mt-3 text-xl font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
    </article>
  );
}
```

- [ ] **步骤 4：实现首页**

写入 `src/components/home/HomePage.tsx`:

```tsx
import type { Locale } from "@/types/domain";
import { learningModules } from "@/data/modules";
import { LanguageSwitch } from "@/components/layout/LanguageSwitch";
import { ModuleCard } from "./ModuleCard";

export function HomePage({ locale }: { locale: Locale }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-space px-5 py-6 text-white md:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_45%,rgba(248,196,92,0.32),transparent_16rem),radial-gradient(circle_at_70%_20%,rgba(83,213,232,0.18),transparent_20rem)]" />
      <div className="absolute inset-0 opacity-50 [background-image:radial-gradient(circle,rgba(255,255,255,0.55)_1px,transparent_1px)] [background-size:38px_38px]" />
      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-orbit">Solar System Explorer</p>
            <h1 className="mt-2 text-3xl font-semibold text-white md:text-5xl">
              {locale === "zh" ? "太阳系探索" : "Explore the Solar System"}
            </h1>
          </div>
          <LanguageSwitch locale={locale} />
        </header>

        <div className="grid flex-1 items-end gap-8 py-10 lg:grid-cols-[1fr_460px]">
          <div className="min-h-[360px] rounded-full border border-white/10 bg-[radial-gradient(circle,rgba(248,196,92,0.95)_0,rgba(248,196,92,0.18)_9rem,transparent_13rem)] shadow-[0_0_120px_rgba(248,196,92,0.22)]" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {learningModules.map((module) => (
              <ModuleCard key={module.id} module={module} locale={locale} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
```

写入 `src/app/page.tsx`:

```tsx
import { HomePage } from "@/components/home/HomePage";
import { parseLocale } from "@/lib/locale";

interface PageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  return <HomePage locale={parseLocale(params?.lang)} />;
}
```

- [ ] **步骤 5：验证并提交**

运行：`npm run test -- src/components/home/HomePage.test.tsx`

预期：所有测试通过。

运行：`npm run build`

预期：构建通过。

提交：

```bash
git add src/components/layout/LanguageSwitch.tsx src/components/home/ModuleCard.tsx src/components/home/HomePage.tsx src/components/home/HomePage.test.tsx src/app/page.tsx package.json package-lock.json
git commit -m "feat: build bilingual home entry"
```

## 任务 5：3D 太阳系场景

**文件：**
- 创建：`src/components/solar-system/SolarSystemCanvas.tsx`
- 创建：`src/components/solar-system/CelestialBodyMesh.tsx`
- 创建：`src/components/solar-system/OrbitLine.tsx`
- 创建：`src/components/solar-system/Stars.tsx`
- 创建：`src/components/solar-system/SolarSystemCanvas.test.tsx`

- [ ] **步骤 1：编写 3D 场景组合冒烟测试**

写入 `src/components/solar-system/SolarSystemCanvas.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SolarSystemCanvas } from "./SolarSystemCanvas";

vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => <div data-testid="canvas">{children}</div>,
  useFrame: () => undefined
}));

vi.mock("@react-three/drei", () => ({
  OrbitControls: () => <div data-testid="orbit-controls" />,
  Html: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useTexture: () => null
}));

describe("SolarSystemCanvas", () => {
  it("renders the scene container and compressed scale notice", () => {
    render(
      <SolarSystemCanvas
        locale="zh"
        elapsedDays={0}
        selectedBodyId="earth"
        layers={{ labels: true, orbits: true, moonOrbit: true }}
        onSelectBody={() => undefined}
      />
    );
    expect(screen.getByTestId("canvas")).toBeInTheDocument();
    expect(screen.getByText("比例经过教学压缩")).toBeInTheDocument();
  });
});
```

- [ ] **步骤 2：实现星空背景**

写入 `src/components/solar-system/Stars.tsx`:

```tsx
import { useMemo } from "react";

export function Stars() {
  const positions = useMemo(() => {
    const values: number[] = [];
    for (let index = 0; index < 700; index += 1) {
      values.push((Math.random() - 0.5) * 180, (Math.random() - 0.5) * 90, (Math.random() - 0.5) * 180);
    }
    return new Float32Array(values);
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.08} sizeAttenuation transparent opacity={0.72} />
    </points>
  );
}
```

- [ ] **步骤 3：实现轨道线**

写入 `src/components/solar-system/OrbitLine.tsx`:

```tsx
import { useMemo } from "react";
import * as THREE from "three";
import type { OrbitData } from "@/types/domain";
import { degToRad } from "@/lib/orbits";

export function OrbitLine({ orbit }: { orbit: OrbitData }) {
  const points = useMemo(() => {
    const curve: THREE.Vector3[] = [];
    const inclination = degToRad(orbit.inclinationDeg);
    for (let step = 0; step <= 160; step += 1) {
      const angle = (step / 160) * Math.PI * 2;
      const x = Math.cos(angle) * orbit.displayDistance;
      const flatZ = Math.sin(angle) * orbit.displayDistance;
      curve.push(new THREE.Vector3(x, Math.sin(inclination) * flatZ, Math.cos(inclination) * flatZ));
    }
    return curve;
  }, [orbit]);

  return (
    <line>
      <bufferGeometry attach="geometry" setFromPoints={points} />
      <lineBasicMaterial attach="material" color={orbit.color} transparent opacity={0.45} />
    </line>
  );
}
```

- [ ] **步骤 4：实现天体网格**

写入 `src/components/solar-system/CelestialBodyMesh.tsx`:

```tsx
import { Html, useTexture } from "@react-three/drei";
import type { CelestialBody, Locale } from "@/types/domain";
import { assetSources } from "@/data/assets";
import { getBodyPosition } from "@/lib/orbits";

interface CelestialBodyMeshProps {
  body: CelestialBody;
  locale: Locale;
  elapsedDays: number;
  showLabel: boolean;
  onSelectBody: (bodyId: string) => void;
}

export function CelestialBodyMesh({ body, locale, elapsedDays, showLabel, onSelectBody }: CelestialBodyMeshProps) {
  const asset = assetSources.find((source) => source.id === body.textureAssetId);
  const texture = useTexture(asset?.localPath ?? "/textures/missing.jpg");
  const position = body.orbit ? getBodyPosition(body.orbit, elapsedDays) : ([0, 0, 0] as [number, number, number]);
  const radius = body.orbit?.displayRadius ?? 2.2;
  const isSun = body.id === "sun";

  return (
    <group position={position}>
      <mesh onClick={() => onSelectBody(body.id)}>
        <sphereGeometry args={[radius, 64, 64]} />
        {isSun ? (
          <meshBasicMaterial map={texture} color="#f8c45c" />
        ) : (
          <meshStandardMaterial map={texture} roughness={0.72} metalness={0.02} />
        )}
      </mesh>
      {body.id === "saturn" ? (
        <mesh rotation={[Math.PI / 2.7, 0, 0]}>
          <ringGeometry args={[radius * 1.35, radius * 2.2, 96]} />
          <meshStandardMaterial color="#d8c48a" transparent opacity={0.72} side={2} />
        </mesh>
      ) : null}
      {showLabel ? (
        <Html center distanceFactor={10}>
          <span className="rounded-ui bg-black/55 px-2 py-1 text-xs text-white">{body.name[locale]}</span>
        </Html>
      ) : null}
    </group>
  );
}
```

- [ ] **步骤 5：实现场景 Canvas**

写入 `src/components/solar-system/SolarSystemCanvas.tsx`:

```tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { LayerKey, Locale } from "@/types/domain";
import { bodies } from "@/data/bodies";
import { dictionaries } from "@/i18n/dictionaries";
import { CelestialBodyMesh } from "./CelestialBodyMesh";
import { OrbitLine } from "./OrbitLine";
import { Stars } from "./Stars";

interface SolarSystemCanvasProps {
  locale: Locale;
  elapsedDays: number;
  selectedBodyId?: string;
  layers: Record<LayerKey, boolean>;
  onSelectBody: (bodyId: string) => void;
}

export function SolarSystemCanvas({ locale, elapsedDays, layers, onSelectBody }: SolarSystemCanvasProps) {
  return (
    <section className="relative min-h-[520px] overflow-hidden rounded-ui border border-white/10 bg-black">
      <Canvas camera={{ position: [0, 38, 68], fov: 48 }} dpr={[1, 1.7]}>
        <color attach="background" args={["#03050b"]} />
        <ambientLight intensity={0.24} />
        <pointLight position={[0, 0, 0]} intensity={800} color="#f8c45c" />
        <Stars />
        {layers.orbits
          ? bodies.map((body) => (body.orbit && body.parentId !== "earth" ? <OrbitLine key={`${body.id}-orbit`} orbit={body.orbit} /> : null))
          : null}
        {layers.moonOrbit ? bodies.map((body) => (body.id === "moon" && body.orbit ? <OrbitLine key="moon-orbit" orbit={body.orbit} /> : null)) : null}
        {bodies.map((body) => (
          <CelestialBodyMesh
            key={body.id}
            body={body}
            locale={locale}
            elapsedDays={elapsedDays}
            showLabel={layers.labels && (body.orbit?.showLabelByDefault ?? true)}
            onSelectBody={onSelectBody}
          />
        ))}
        <OrbitControls enableDamping dampingFactor={0.08} minDistance={8} maxDistance={120} />
      </Canvas>
      <p className="absolute bottom-3 left-3 rounded-ui bg-black/60 px-3 py-2 text-xs text-slate-200">
        {dictionaries[locale].compressedScale}
      </p>
    </section>
  );
}
```

- [ ] **步骤 6：验证并提交**

运行：`npm run test -- src/components/solar-system/SolarSystemCanvas.test.tsx`

预期：test passes.

提交：

```bash
git add src/components/solar-system
git commit -m "feat: add 3d solar system scene"
```

## 任务 6：概述页控件和百科面板

**文件：**
- 创建：`src/components/overview/ControlBar.tsx`
- 创建：`src/components/overview/BodyInfoPanel.tsx`
- 创建：`src/components/overview/WebGLFallback.tsx`
- 创建：`src/components/overview/OverviewPage.tsx`
- 创建：`src/components/overview/OverviewPage.test.tsx`
- 创建：`src/app/overview/page.tsx`

- [ ] **步骤 1：编写概述页测试**

写入 `src/components/overview/OverviewPage.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { OverviewPage } from "./OverviewPage";

vi.mock("@/components/solar-system/SolarSystemCanvas", () => ({
  SolarSystemCanvas: ({ onSelectBody }: { onSelectBody: (id: string) => void }) => (
    <button type="button" onClick={() => onSelectBody("mars")}>
      mock canvas
    </button>
  )
}));

describe("OverviewPage", () => {
  it("renders localized controls and selected body panel", () => {
    render(<OverviewPage locale="zh" />);
    expect(screen.getByText("太阳系概述")).toBeInTheDocument();
    expect(screen.getByText("地球")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "播放" })).toBeInTheDocument();
  });

  it("updates selected body from scene click", async () => {
    const user = userEvent.setup();
    render(<OverviewPage locale="en" />);
    await user.click(screen.getByRole("button", { name: "mock canvas" }));
    expect(screen.getByText("Mars")).toBeInTheDocument();
  });
});
```

- [ ] **步骤 2：实现天体信息面板**

写入 `src/components/overview/BodyInfoPanel.tsx`:

```tsx
import type { CelestialBody, Locale } from "@/types/domain";

export function BodyInfoPanel({ body, locale }: { body: CelestialBody; locale: Locale }) {
  const content = body.content[locale];

  return (
    <aside className="rounded-ui border border-white/10 bg-panel p-5 text-white">
      <p className="text-sm uppercase tracking-[0.18em] text-orbit">{body.type}</p>
      <h2 className="mt-2 text-2xl font-semibold">{body.name[locale]}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-200">{content.summary}</p>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-slate-400">{locale === "zh" ? "半径" : "Radius"}</dt>
          <dd>{body.radiusKm.toLocaleString()} km</dd>
        </div>
        {body.averageDistanceFromSunKm ? (
          <div>
            <dt className="text-slate-400">{locale === "zh" ? "平均日距" : "Avg. solar distance"}</dt>
            <dd>{body.averageDistanceFromSunKm.toLocaleString()} km</dd>
          </div>
        ) : null}
      </dl>
      <h3 className="mt-5 text-sm font-semibold text-white">{locale === "zh" ? "为什么重要" : "Why it matters"}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-200">{content.whyItMatters}</p>
      <ul className="mt-4 space-y-2 text-sm text-slate-300">
        {content.facts.map((fact) => (
          <li key={fact}>• {fact}</li>
        ))}
      </ul>
    </aside>
  );
}
```

- [ ] **步骤 3：实现控制栏**

写入 `src/components/overview/ControlBar.tsx`:

```tsx
import { Pause, Play } from "lucide-react";
import type { CameraPreset, LayerKey, Locale } from "@/types/domain";
import { dictionaries } from "@/i18n/dictionaries";

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

export function ControlBar(props: ControlBarProps) {
  const dict = dictionaries[props.locale];
  const cameras: CameraPreset[] = ["full", "inner", "earthMoon", "outer"];
  const layers: LayerKey[] = ["labels", "orbits", "moonOrbit"];

  return (
    <section className="rounded-ui border border-white/10 bg-panel p-4 text-white">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          aria-label={props.playing ? dict.controls.pause : dict.controls.play}
          className="inline-flex h-10 w-10 items-center justify-center rounded-ui bg-orbit text-black"
          onClick={() => props.onPlayingChange(!props.playing)}
        >
          {props.playing ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <label className="flex min-w-[220px] flex-1 items-center gap-3 text-sm">
          <span>{dict.controls.speed}</span>
          <input
            type="range"
            min="0"
            max="3650"
            value={props.elapsedDays}
            onChange={(event) => props.onElapsedDaysChange(Number(event.target.value))}
            className="w-full"
          />
        </label>
        <select
          aria-label={dict.controls.speed}
          value={props.speed}
          onChange={(event) => props.onSpeedChange(Number(event.target.value))}
          className="rounded-ui border border-white/15 bg-black/40 px-3 py-2"
        >
          <option value={0}>0x</option>
          <option value={1}>1x</option>
          <option value={7}>7x</option>
          <option value={30}>30x</option>
        </select>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {cameras.map((camera) => (
          <button
            key={camera}
            type="button"
            className={`rounded-ui px-3 py-2 text-sm ${props.camera === camera ? "bg-white text-black" : "bg-white/10 text-white"}`}
            onClick={() => props.onCameraChange(camera)}
          >
            {dict.cameraPresets[camera]}
          </button>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        {layers.map((layer) => (
          <label key={layer} className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={props.layers[layer]}
              onChange={(event) => props.onLayerChange(layer, event.target.checked)}
            />
            {dict.controls[layer]}
          </label>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **步骤 4：实现兜底和概述页**

写入 `src/components/overview/WebGLFallback.tsx`:

```tsx
import type { Locale } from "@/types/domain";
import { dictionaries } from "@/i18n/dictionaries";

export function WebGLFallback({ locale }: { locale: Locale }) {
  return (
    <section className="rounded-ui border border-white/10 bg-panel p-6 text-white">
      <h2 className="text-xl font-semibold">{dictionaries[locale].fallback.title}</h2>
      <p className="mt-2 text-sm text-slate-300">{dictionaries[locale].fallback.body}</p>
    </section>
  );
}
```

写入 `src/components/overview/OverviewPage.tsx`:

```tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import type { CameraPreset, LayerKey, Locale } from "@/types/domain";
import { bodies } from "@/data/bodies";
import { dictionaries } from "@/i18n/dictionaries";
import { LanguageSwitch } from "@/components/layout/LanguageSwitch";
import { SolarSystemCanvas } from "@/components/solar-system/SolarSystemCanvas";
import { BodyInfoPanel } from "./BodyInfoPanel";
import { ControlBar } from "./ControlBar";

export function OverviewPage({ locale }: { locale: Locale }) {
  const [selectedBodyId, setSelectedBodyId] = useState("earth");
  const [elapsedDays, setElapsedDays] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(7);
  const [camera, setCamera] = useState<CameraPreset>("full");
  const [layers, setLayers] = useState<Record<LayerKey, boolean>>({ labels: true, orbits: true, moonOrbit: true });
  const selectedBody = useMemo(() => bodies.find((body) => body.id === selectedBodyId) ?? bodies[0], [selectedBodyId]);

  useEffect(() => {
    if (!playing || speed === 0) return;
    const handle = window.setInterval(() => setElapsedDays((days) => (days + speed) % 3650), 500);
    return () => window.clearInterval(handle);
  }, [playing, speed]);

  return (
    <main className="min-h-screen bg-space px-4 py-5 text-white md:px-6">
      <header className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-orbit">Solar System Explorer</p>
          <h1 className="mt-1 text-2xl font-semibold md:text-4xl">{dictionaries[locale].overviewTitle}</h1>
        </div>
        <LanguageSwitch locale={locale} />
      </header>
      <div className="mx-auto mt-5 grid max-w-7xl gap-4 xl:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <SolarSystemCanvas
            locale={locale}
            elapsedDays={elapsedDays}
            selectedBodyId={selectedBodyId}
            layers={layers}
            onSelectBody={setSelectedBodyId}
          />
          <ControlBar
            locale={locale}
            playing={playing}
            elapsedDays={elapsedDays}
            speed={speed}
            camera={camera}
            layers={layers}
            onPlayingChange={setPlaying}
            onElapsedDaysChange={setElapsedDays}
            onSpeedChange={setSpeed}
            onCameraChange={setCamera}
            onLayerChange={(layer, enabled) => setLayers((current) => ({ ...current, [layer]: enabled }))}
          />
        </div>
        <BodyInfoPanel body={selectedBody} locale={locale} />
      </div>
    </main>
  );
}
```

写入 `src/app/overview/page.tsx`:

```tsx
import { OverviewPage } from "@/components/overview/OverviewPage";
import { parseLocale } from "@/lib/locale";

interface PageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  return <OverviewPage locale={parseLocale(params?.lang)} />;
}
```

- [ ] **步骤 5：验证并提交**

运行：`npm run test -- src/components/overview/OverviewPage.test.tsx`

预期：所有测试通过。

运行：`npm run build`

预期：构建通过。

提交：

```bash
git add src/components/overview src/app/overview/page.tsx
git commit -m "feat: build overview learning interface"
```

## 任务 7：公开文档和素材合规

**文件：**
- 创建：`README.md`
- 修改：`docs/assets.md`
- 修改：`src/data/assets.ts` if real texture files differ from initial records.

- [ ] **步骤 1：编写 README**

写入 `README.md`:

```md
# 太阳系探索 Solar System Explorer

一个可分享、可部署、可开源维护的中英文太阳系科普网站。第一版聚焦“太阳系概述”：首页展示六个学习主题，但只有太阳系概述可进入完整 3D 学习体验。

## 功能范围

- 沉浸式首页。
- 太阳系概述 3D 场景。
- 太阳、八大行星和月球。
- 近似轨道运动、时间控制、相机预设和图层开关。
- 天体百科面板。
- 中文 / English 切换，使用 `?lang=zh` 和 `?lang=en`。
- 真实公开影像来源记录。

第一版不实现日食、月食、水星逆行、小行星带、木星卫星五个专题页面。

## 运行

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`。

## 验证

```bash
npm run test
npm run build
npm run e2e
```

## 素材与授权

太阳、行星和月球视觉素材必须来自真实公开影像或真实观测资料派生贴图。素材来源记录见 `docs/assets.md` 和 `src/data/assets.ts`。

本项目可以标注 NASA/JPL/USGS 等素材来源，但不暗示这些机构对本项目背书。

## 架构原则

- 高内聚、低耦合。
- 单一职责。
- YAGNI。
- 新增功能必须通过清晰接口接入，不破坏首页、概述模块、中英文切换和素材来源记录。
```

- [ ] **步骤 2：用实际下载来源替换占位素材记录**

For each file in `public/textures/`, ensure a matching `src/data/assets.ts` record has the exact source URL and processing description. Do not add an image if its source cannot be documented.

Expected texture files for v1:

```text
public/textures/sun.jpg
public/textures/mercury.jpg
public/textures/venus.jpg
public/textures/earth.jpg
public/textures/moon.jpg
public/textures/mars.jpg
public/textures/jupiter.jpg
public/textures/saturn.jpg
public/textures/uranus.jpg
public/textures/neptune.jpg
```

- [ ] **步骤 3：验证文档**

运行：`npm run test -- src/data/data-integrity.test.ts`

预期：source metadata test passes.

运行：`npm run build`

预期：构建通过。

提交：

```bash
git add README.md docs/assets.md src/data/assets.ts public/textures
git commit -m "docs: document project and visual assets"
```

## 任务 8：端到端验证和视觉冒烟检查

**文件：**
- 创建：`tests/e2e/app.spec.ts`
- 修改：affected files only for fixes found by tests.

- [ ] **步骤 1：编写 Playwright 冒烟测试**

写入 `tests/e2e/app.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("home page exposes only overview as clickable", async ({ page }) => {
  await page.goto("/?lang=en");
  await expect(page.getByRole("heading", { name: "Explore the Solar System" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Enter overview/ })).toBeVisible();
  await expect(page.getByText("Coming soon")).toHaveCount(5);
});

test("overview renders learning controls", async ({ page }) => {
  await page.goto("/overview?lang=en");
  await expect(page.getByRole("heading", { name: "Solar System Overview" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Play" })).toBeVisible();
  await expect(page.getByText("Scale compressed for learning")).toBeVisible();
});

test("language switch keeps page usable", async ({ page }) => {
  await page.goto("/overview?lang=zh");
  await expect(page.getByRole("heading", { name: "太阳系概述" })).toBeVisible();
  await page.getByRole("button", { name: "切换语言" }).click();
  await expect(page).toHaveURL(/lang=en/);
  await expect(page.getByRole("heading", { name: "Solar System Overview" })).toBeVisible();
});
```

- [ ] **步骤 2：运行完整验证**

Run:

```bash
npm run test
npm run build
npm run e2e
```

预期：

- Unit and component tests pass.
- 生产构建通过。
- Playwright desktop and mobile projects pass.

- [ ] **步骤 3：人工浏览器截图检查**

Start the app:

```bash
npm run dev
```

Open and inspect:

- `http://localhost:3000/?lang=zh`
- `http://localhost:3000/?lang=en`
- `http://localhost:3000/overview?lang=zh`
- `http://localhost:3000/overview?lang=en`

Verify:

- 3D canvas is nonblank.
- Sun, planets, moon, Saturn ring, orbit lines, and star background are visible.
- Homepage disabled modules cannot be clicked.
- Text does not overlap or clip on desktop and mobile widths.
- Language switching preserves page usability.
- Reduced motion settings do not make controls unusable.

- [ ] **步骤 4：提交最终验证**

If tests require fixes, commit them:

```bash
git add tests/e2e/app.spec.ts src
git commit -m "test: add end-to-end smoke coverage"
```

If no implementation fixes are needed, commit only the e2e test:

```bash
git add tests/e2e/app.spec.ts
git commit -m "test: add end-to-end smoke coverage"
```

## 自检

规格覆盖：

- Product scope is covered by Tasks 4, 6, and 8.
- High-quality 3D scene and real-source imagery are covered by Tasks 5 and 7.
- Chinese/English switching is covered by Tasks 2, 4, 6, and 8.
- Open-source quality is covered by Tasks 1, 7, and 8.
- Layering and extension safety are covered by the file structure, Tasks 2-6 boundaries, and regression tests in Task 8.
- Karpathy/YAGNI constraints are reflected by task-by-task tests, focused files, and explicit non-goals.

占位内容扫描：

- No `TBD`, `TODO`, or “implement later” placeholders remain.
- Asset source records start with public source URLs and must be replaced with exact source pages when binaries are added.

类型一致性：

- `Locale`, `CameraPreset`, `LayerKey`, `CelestialBody`, `LearningModule`, and `AssetSource` are defined once in `src/types/domain.ts`.
- Later tasks consume those same names and property shapes.
