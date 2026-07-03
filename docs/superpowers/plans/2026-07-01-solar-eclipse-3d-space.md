# Solar Eclipse 3D Space View Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework the solar eclipse module so space view is a 3D teaching scene with total/annular model switching, dynamic shadow cones, and ground-track shadow bands.

**Architecture:** Split eclipse state into `mainView`, `eclipseModel`, and `groundMode`. Keep physical geometry in `src/lib/solar-eclipse.ts`, rendering in `SolarEclipseCanvas.tsx`, and navigation/state orchestration in `SolarEclipsePage.tsx`.

**Tech Stack:** Next.js, React, TypeScript, Three.js, React Three Fiber, Tailwind, Vitest.

---

### Task 1: State Model And Tests

**Files:**
- Modify: `src/lib/solar-eclipse.ts`
- Modify: `src/lib/solar-eclipse.test.ts`

- [ ] Add failing tests for `mainView`, `eclipseModel`, `groundMode`, model switching, ground mode switching, and shadow-click routing.
- [ ] Run `npx vitest run src/lib/solar-eclipse.test.ts` and confirm failures.
- [ ] Implement the split state model and selection helpers.
- [ ] Run `npx vitest run src/lib/solar-eclipse.test.ts` and confirm pass.

### Task 2: 3D Geometry Model

**Files:**
- Modify: `src/lib/solar-eclipse.ts`
- Modify: `src/lib/solar-eclipse.test.ts`

- [ ] Add failing tests for total vs annular model geometry: moon visual size/distance, umbra/antumbra presence, and moving ground-track center.
- [ ] Run `npx vitest run src/lib/solar-eclipse.test.ts` and confirm failures.
- [ ] Implement model-aware moon configuration, tangent geometry, shadow cone metadata, and track-band geometry.
- [ ] Run `npx vitest run src/lib/solar-eclipse.test.ts` and confirm pass.

### Task 3: UI Navigation And Copy

**Files:**
- Modify: `src/components/solar-eclipse/SolarEclipsePage.tsx`
- Modify: `src/components/solar-eclipse/SolarEclipsePage.test.tsx`
- Modify: `src/i18n/dictionaries.ts`

- [ ] Add failing tests for top-level `太空视角 / 地球视角`, space model buttons, and ground three-mode buttons.
- [ ] Run `npx vitest run src/components/solar-eclipse/SolarEclipsePage.test.tsx` and confirm failures.
- [ ] Implement navigation and copy updates in both languages.
- [ ] Run `npx vitest run src/components/solar-eclipse/SolarEclipsePage.test.tsx` and confirm pass.

### Task 4: 3D Rendering

**Files:**
- Modify: `src/components/solar-eclipse/SolarEclipseCanvas.tsx`
- Modify: `src/components/solar-eclipse/SolarEclipseCanvas.test.tsx`

- [ ] Add failing tests for total-model bands, annular-model antumbra/ring bands, model-aware click targets, and non-rotatable ground camera.
- [ ] Run `npx vitest run src/components/solar-eclipse/SolarEclipseCanvas.test.tsx` and confirm failures.
- [ ] Implement model-aware shadow cones, antumbra rendering, Earth track bands, and click routing.
- [ ] Run `npx vitest run src/components/solar-eclipse/SolarEclipseCanvas.test.tsx` and confirm pass.

### Task 5: Full Verification And Browser Review

**Files:**
- No production code unless verification exposes defects.

- [ ] Run `npx tsc --noEmit`.
- [ ] Run `npm test`.
- [ ] Run `npm run lint`.
- [ ] Verify in browser at `http://localhost:3000/solar-eclipse/?lang=zh`.
- [ ] Capture screenshots for space total model, space annular model, and ground view.
- [ ] Perform adversarial review against the spec and fix any blocking issues.
