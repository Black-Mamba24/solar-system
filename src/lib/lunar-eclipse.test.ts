import { describe, expect, it } from "vitest";
import {
  createInitialLunarEclipseState,
  getLunarEclipseGeometry,
  getLunarEclipseMoonAppearance,
  getLunarEclipseStage,
  getLunarEclipseStageSequence,
  lunarEclipseEarth,
  lunarEclipseMoon,
  lunarEclipseSun,
  selectLunarEclipseCase,
  stepLunarEclipseTime
} from "./lunar-eclipse";

describe("lunar eclipse geometry", () => {
  it("keeps the Sun, Earth, Moon order and extends Earth's shadow away from the Sun", () => {
    const state = createInitialLunarEclipseState({ time: 0.5 });
    const geometry = getLunarEclipseGeometry(state);

    expect(lunarEclipseSun.x).toBeLessThan(lunarEclipseEarth.x);
    expect(lunarEclipseEarth.x).toBeLessThan(geometry.moon.x);
    expect(geometry.shadowAxis.start.x).toBe(lunarEclipseEarth.x);
    expect(geometry.shadowAxis.direction.x).toBeGreaterThan(0);
    expect(geometry.shadowAxis.end.x).toBeGreaterThan(lunarEclipseEarth.x);
    expect(geometry.umbraRadiusAtEarth).toBeGreaterThan(geometry.umbraRadiusAtMoon);
  });

  it("moves the Moon through fixed Earth shadow instead of moving the shadow axis", () => {
    const entering = getLunarEclipseGeometry(createInitialLunarEclipseState({ time: 0.25 }));
    const leaving = getLunarEclipseGeometry(createInitialLunarEclipseState({ time: 0.75 }));

    expect(entering.shadowAxis.start).toEqual(leaving.shadowAxis.start);
    expect(entering.shadowAxis.end).toEqual(leaving.shadowAxis.end);
    expect(entering.moon.y).toBeLessThan(0);
    expect(leaving.moon.y).toBeGreaterThan(0);
  });

  it("orders total lunar eclipse contacts from P1 through P4", () => {
    const samples = [0, 0.18, 0.42, 0.5, 0.6, 0.7, 1].map((time) => getLunarEclipseStage(createInitialLunarEclipseState({ eclipseCase: "total", time })).code);

    expect(samples).toEqual(["P1", "U1", "U2", "MAX", "U3", "U4", "P4"]);
    expect(getLunarEclipseStageSequence("total")).toEqual(["P1", "U1", "U2", "MAX", "U3", "U4", "P4"]);
  });

  it("keeps partial lunar eclipse stages from implying totality", () => {
    const samples = [0, 0.3, 0.5, 0.7, 1].map((time) => getLunarEclipseStage(createInitialLunarEclipseState({ eclipseCase: "partial", time })).code);

    expect(samples).toEqual(["P1", "U1", "MAX", "U4", "P4"]);
    expect(getLunarEclipseStageSequence("partial")).toEqual(["P1", "U1", "MAX", "U4", "P4"]);
    expect(getLunarEclipseStageSequence("partial")).not.toContain("U2");
    expect(getLunarEclipseStageSequence("partial")).not.toContain("U3");
  });

  it("puts the whole Moon inside the umbra only during totality", () => {
    const totality = getLunarEclipseGeometry(createInitialLunarEclipseState({ eclipseCase: "total", time: 0.5 }));
    const beforeTotality = getLunarEclipseGeometry(createInitialLunarEclipseState({ eclipseCase: "total", time: 0.35 }));

    expect(totality.umbraCoversWholeMoon).toBe(true);
    expect(totality.umbraCoverage).toBe(1);
    expect(beforeTotality.umbraCoversWholeMoon).toBe(false);
    expect(beforeTotality.umbraCoverage).toBeGreaterThan(0);
    expect(beforeTotality.umbraCoverage).toBeLessThan(1);
  });

  it("keeps partial lunar eclipses out of whole-Moon umbra coverage", () => {
    const maximum = getLunarEclipseGeometry(createInitialLunarEclipseState({ eclipseCase: "partial", time: 0.5 }));

    expect(maximum.umbraCoversWholeMoon).toBe(false);
    expect(maximum.umbraCoverage).toBeGreaterThan(0);
    expect(maximum.umbraCoverage).toBeLessThan(1);
    expect(Math.hypot(maximum.groundShadowCenter.x, maximum.groundShadowCenter.y)).toBeGreaterThan(lunarEclipseMoon.radius);
  });

  it("makes penumbral dimming weaker than umbral dimming and preserves totality red illumination", () => {
    const penumbral = getLunarEclipseMoonAppearance(createInitialLunarEclipseState({ eclipseCase: "total", time: 0.08 }));
    const umbral = getLunarEclipseMoonAppearance(createInitialLunarEclipseState({ eclipseCase: "total", time: 0.3 }));
    const totality = getLunarEclipseMoonAppearance(createInitialLunarEclipseState({ eclipseCase: "total", time: 0.5 }));

    expect(penumbral.brightness).toBeGreaterThan(umbral.brightness);
    expect(umbral.brightness).toBeGreaterThanOrEqual(totality.brightness);
    expect(totality.redAtmosphericLight).toBeGreaterThan(0);
    expect(totality.selfIlluminated).toBe(false);
  });

  it("selects cases and clamps timeline stepping", () => {
    const partial = selectLunarEclipseCase(createInitialLunarEclipseState(), "partial");

    expect(partial.eclipseCase).toBe("partial");
    expect(stepLunarEclipseTime(partial, 2).time).toBe(1);
    expect(stepLunarEclipseTime(partial, -2).time).toBe(0);
    expect(lunarEclipseMoon.radius).toBeGreaterThan(0);
  });
});
