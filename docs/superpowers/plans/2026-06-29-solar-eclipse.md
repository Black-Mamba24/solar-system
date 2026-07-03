# Solar Eclipse Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建可交互的日食学习模块，覆盖太空机制视角、三类地面食相、共享时间控制和阴影点击跳转。

**Architecture:** 先实现纯 TypeScript 的日食状态模型，提供可测试的视角、时间、阴影点击到地面食相映射。再新增 `/solar-eclipse` 页面、控制面板和 Three.js 场景，复用已有真实太阳、地球、月球贴图模型。

**Tech Stack:** Next.js App Router、React、TypeScript、Tailwind、@react-three/fiber、@react-three/drei、three、vitest。

---

### Task 1: 日食状态模型

**Files:**
- Create: `src/lib/solar-eclipse.ts`
- Test: `src/lib/solar-eclipse.test.ts`

- [ ] 写失败测试：验证初始太空状态、按钮切换、半影点击方向/遮挡深度、本影点击全食、环食状态。
- [ ] 运行 `npx vitest run src/lib/solar-eclipse.test.ts`，确认因模块缺失失败。
- [ ] 实现 `createInitialEclipseState`、`stepEclipseTime`、`selectEclipseView`、`selectViewFromShadowPoint`、`getGroundEclipseAppearance`。
- [ ] 再次运行同一测试，确认通过。

### Task 2: 页面、入口和 i18n

**Files:**
- Create: `src/app/solar-eclipse/page.tsx`
- Create: `src/components/solar-eclipse/SolarEclipsePage.tsx`
- Modify: `src/data/modules.ts`
- Modify: `src/i18n/dictionaries.ts`
- Test: `src/components/solar-eclipse/SolarEclipsePage.test.tsx`

- [ ] 写失败测试：验证页面渲染太空机制、四个视角按钮、时间控制和说明面板。
- [ ] 运行组件测试，确认因组件缺失失败。
- [ ] 新增页面组件，接入返回首页、语言切换和模块入口。
- [ ] 再次运行组件测试，确认通过。

### Task 3: 3D 场景和阴影交互

**Files:**
- Create: `src/components/solar-eclipse/SolarEclipseCanvas.tsx`
- Modify: `src/components/solar-eclipse/SolarEclipsePage.tsx`
- Test: `src/components/solar-eclipse/SolarEclipseCanvas.test.tsx`

- [ ] 写失败测试：验证场景使用太阳、地球、月球 surface 资源语义，存在本影、半影、伪本影命名对象和点击回调。
- [ ] 运行相关测试，确认因 Canvas 组件缺失失败。
- [ ] 实现场景：太空视角展示三体、影锥和地球阴影热区；地面视角展示太阳圆面和月球遮挡盘。
- [ ] 再次运行相关测试，确认通过。

### Task 4: 集成验证与对抗审查

**Files:**
- Review all modified files.

- [ ] 运行 `npx tsc --noEmit`。
- [ ] 运行相关 `vitest`。
- [ ] 运行 `npm run lint`。
- [ ] 启动或复用 dev server，用浏览器验证 `/solar-eclipse`。
- [ ] 开启多 Agent 对抗式审查，重点检查真实机制、边界条件、回归风险和视觉/行为副作用。
- [ ] 根据审查结果修正或明确取舍。
