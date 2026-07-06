import { describe, expect, it } from "vitest";
import {
  createInitialEclipseState,
  getEclipseTangentGeometry,
  getGroundEclipseAppearance,
  getShadowTrackGeometry,
  getSpaceShadowProjectionGeometry,
  getSpaceMoonPosition,
  selectEclipseModel,
  selectGroundMode,
  selectMainView,
  selectViewFromShadowPoint,
  spaceEarth,
  spaceSun,
  stepEclipseTime
} from "./solar-eclipse";

describe("solar eclipse state", () => {
  it("starts in the space view at the beginning of the shadow sweep", () => {
    const state = createInitialEclipseState();

    expect(state.mainView).toBe("space");
    expect(state.eclipseModel).toBe("total");
    expect(state.groundMode).toBe("total");
    expect(state.time).toBe(0);
  });

  it("steps the shared Moon timeline and clamps it to the shadow sweep range", () => {
    const state = createInitialEclipseState({ time: 0.96 });

    expect(stepEclipseTime(state, 0.1).time).toBe(1);
    expect(stepEclipseTime(state, -1.2).time).toBe(0);
  });

  it("switches top-level views without changing the selected model or ground mode", () => {
    const state = createInitialEclipseState({ eclipseModel: "annular", groundMode: "partial", time: 0.42 });

    expect(selectMainView(state, "ground")).toMatchObject({
      mainView: "ground",
      eclipseModel: "annular",
      groundMode: "partial",
      time: 0.42
    });
    expect(selectMainView(state, "space")).toMatchObject({
      mainView: "space",
      eclipseModel: "annular",
      groundMode: "partial",
      time: 0.42
    });
  });

  it("switches the space model between mutually exclusive total and annular mechanisms", () => {
    const state = createInitialEclipseState({ groundMode: "annular", time: 0.42 });

    expect(selectEclipseModel(state, "annular")).toMatchObject({
      mainView: "space",
      eclipseModel: "annular",
      groundMode: "annular",
      time: 0.42
    });
    expect(selectEclipseModel(state, "total")).toMatchObject({
      mainView: "space",
      eclipseModel: "total",
      groundMode: "annular",
      time: 0.42
    });
  });

  it("lets the ground view freely switch among total, partial, and annular results", () => {
    const state = createInitialEclipseState({ eclipseModel: "total", time: 0.38 });

    expect(selectGroundMode(state, "total")).toMatchObject({ mainView: "ground", groundMode: "total", eclipseModel: "total" });
    expect(selectGroundMode(state, "partial")).toMatchObject({ mainView: "ground", groundMode: "partial", eclipseModel: "total" });
    expect(selectGroundMode(state, "annular")).toMatchObject({ mainView: "ground", groundMode: "annular", eclipseModel: "total" });
  });

  it("maps space shadow clicks to corresponding ground results", () => {
    const state = createInitialEclipseState({ eclipseModel: "annular", time: 0.33 });

    expect(selectViewFromShadowPoint(state, { x: 0.04, y: -0.02 }, "total")).toMatchObject({
      mainView: "ground",
      groundMode: "total",
      eclipseModel: "annular",
      time: 0.33
    });
    expect(selectViewFromShadowPoint(state, { x: 0.72, y: 0.42 }, "partial")).toMatchObject({
      mainView: "ground",
      groundMode: "partial",
      partialOffset: expect.objectContaining({ x: expect.any(Number), y: expect.any(Number) })
    });
    expect(selectViewFromShadowPoint(state, { x: 0.06, y: 0.03 }, "annular")).toMatchObject({
      mainView: "ground",
      groundMode: "annular"
    });
    expect(selectViewFromShadowPoint(state, { x: 0.9, y: 0.4 }, "annular")).toMatchObject({
      mainView: "ground",
      groundMode: "annular"
    });
  });

  it("computes distinct ground appearances for total, partial, and annular modes", () => {
    const total = getGroundEclipseAppearance(selectGroundMode(createInitialEclipseState({ time: 0.5 }), "total"));
    const partial = getGroundEclipseAppearance(selectGroundMode(createInitialEclipseState({ time: 0.5 }), "partial"));
    const annular = getGroundEclipseAppearance(selectGroundMode(createInitialEclipseState({ time: 0.5 }), "annular"));

    expect(total.coverage).toBeGreaterThan(0.96);
    expect(partial.coverage).toBeGreaterThan(0.73);
    expect(partial.coverage).toBeLessThan(0.77);
    expect(annular.coverage).toBeGreaterThan(0.7);
    expect(annular.coverage).toBeLessThan(1);
    expect(partial.moonOffset.x).toBe(0);
    expect(partial.moonOffset.y).toBeLessThan(0);
    expect(partial.moonScale).toBe(1);
    expect(partial.coronaOpacity).toBe(0);
    expect(partial.ringOpacity).toBe(0);
    expect(total.moonScale).toBeGreaterThan(1);
    expect(total.coronaOpacity).toBeGreaterThan(0);
    expect(total.ringOpacity).toBe(0);
    expect(annular.moonScale).toBeLessThan(1);
    expect(annular.ringVisible).toBe(true);
    expect(annular.ringOpacity).toBeGreaterThan(0);
    expect(annular.coronaOpacity).toBe(0);
  });

  it("animates ground eclipse discs through ingress, maximum eclipse, and egress", () => {
    const totalStart = getGroundEclipseAppearance(selectGroundMode(createInitialEclipseState({ time: 0, mainView: "space" }), "total"));
    const totalMiddle = getGroundEclipseAppearance(selectGroundMode(createInitialEclipseState({ time: 0.5, mainView: "space" }), "total"));
    const totalEnd = getGroundEclipseAppearance(selectGroundMode(createInitialEclipseState({ time: 1, mainView: "space" }), "total"));
    const partialStart = getGroundEclipseAppearance(selectViewFromShadowPoint(createInitialEclipseState({ time: 0 }), { x: 0.65, y: -0.15 }, "partial"));
    const partialMiddle = getGroundEclipseAppearance(selectViewFromShadowPoint(createInitialEclipseState({ time: 0.5 }), { x: 0.65, y: -0.15 }, "partial"));
    const partialEnd = getGroundEclipseAppearance(selectViewFromShadowPoint(createInitialEclipseState({ time: 1 }), { x: 0.65, y: -0.15 }, "partial"));
    const annularStart = getGroundEclipseAppearance(selectGroundMode(createInitialEclipseState({ time: 0 }), "annular"));
    const annularMiddle = getGroundEclipseAppearance(selectGroundMode(createInitialEclipseState({ time: 0.5 }), "annular"));
    const annularEnd = getGroundEclipseAppearance(selectGroundMode(createInitialEclipseState({ time: 1 }), "annular"));

    expect(totalStart.coverage).toBe(0);
    expect(totalMiddle.coverage).toBe(1);
    expect(totalEnd.coverage).toBe(0);
    expect(Math.hypot(totalStart.moonOffset.x, totalStart.moonOffset.y)).toBeCloseTo(totalStart.sunRadius + totalStart.moonRadius, 1);
    expect(Math.hypot(totalMiddle.moonOffset.x, totalMiddle.moonOffset.y)).toBe(0);
    expect(Math.hypot(totalEnd.moonOffset.x, totalEnd.moonOffset.y)).toBeCloseTo(totalEnd.sunRadius + totalEnd.moonRadius, 1);
    expect(partialStart.coverage).toBe(0);
    expect(partialMiddle.coverage).toBeGreaterThan(0.18);
    expect(partialMiddle.coverage).toBeLessThan(0.82);
    expect(partialEnd.coverage).toBe(0);
    expect(Math.hypot(partialStart.moonOffset.x, partialStart.moonOffset.y)).toBeCloseTo(partialStart.sunRadius + partialStart.moonRadius, 1);
    expect(Math.hypot(partialEnd.moonOffset.x, partialEnd.moonOffset.y)).toBeCloseTo(partialEnd.sunRadius + partialEnd.moonRadius, 1);
    expect(annularStart.coverage).toBe(0);
    expect(annularMiddle.coverage).toBeGreaterThan(0);
    expect(annularMiddle.coverage).toBeLessThan(1);
    expect(annularMiddle.ringOpacity).toBeGreaterThan(0);
    expect(annularEnd.coverage).toBe(0);
    expect(Math.hypot(annularStart.moonOffset.x, annularStart.moonOffset.y)).toBeCloseTo(annularStart.sunRadius + annularStart.moonRadius, 1);
    expect(Math.hypot(annularEnd.moonOffset.x, annularEnd.moonOffset.y)).toBeCloseTo(annularEnd.sunRadius + annularEnd.moonRadius, 1);
  });

  it("uses one ground-view disc model with mode-specific apparent Moon size and light effects", () => {
    const total = getGroundEclipseAppearance(selectGroundMode(createInitialEclipseState({ time: 0.5 }), "total"));
    const partial = getGroundEclipseAppearance(selectViewFromShadowPoint(createInitialEclipseState({ time: 0.5 }), { x: 0.65, y: -0.15 }, "partial"));
    const annular = getGroundEclipseAppearance(selectGroundMode(createInitialEclipseState({ time: 0.5 }), "annular"));

    expect(total.sunRadius).toBe(partial.sunRadius);
    expect(annular.sunRadius).toBe(partial.sunRadius);
    expect(total.moonRadius).toBeGreaterThan(total.sunRadius);
    expect(partial.moonRadius).toBe(partial.sunRadius);
    expect(annular.moonRadius).toBeLessThan(annular.sunRadius);
    expect(Math.hypot(total.moonOffset.x, total.moonOffset.y)).toBe(0);
    expect(Math.hypot(annular.moonOffset.x, annular.moonOffset.y)).toBe(0);
    expect(Math.hypot(partial.moonOffset.x, partial.moonOffset.y)).toBeGreaterThan(0);
    expect(total.coronaOpacity).toBeGreaterThan(0);
    expect(partial.coronaOpacity).toBe(0);
    expect(annular.ringOpacity).toBeGreaterThan(0);
  });

  it("keeps the partial eclipse track horizontal while preserving a vertical miss distance", () => {
    const start = getGroundEclipseAppearance(selectGroundMode(createInitialEclipseState({ time: 0 }), "partial"));
    const middle = getGroundEclipseAppearance(selectGroundMode(createInitialEclipseState({ time: 0.5 }), "partial"));
    const end = getGroundEclipseAppearance(selectGroundMode(createInitialEclipseState({ time: 1 }), "partial"));

    expect(start.moonOffset.x).toBeGreaterThan(0);
    expect(middle.moonOffset.x).toBe(0);
    expect(end.moonOffset.x).toBeLessThan(0);
    expect(start.moonOffset.y).toBe(middle.moonOffset.y);
    expect(end.moonOffset.y).toBe(middle.moonOffset.y);
    expect(Math.abs(middle.moonOffset.y)).toBeGreaterThan(0);
    expect(middle.coverage).toBeGreaterThan(0.73);
    expect(middle.coverage).toBeLessThan(0.77);
  });

  it("preserves first-principles ground eclipse geometry invariants", () => {
    const total = getGroundEclipseAppearance(selectGroundMode(createInitialEclipseState({ time: 0.5 }), "total"));
    const partial = getGroundEclipseAppearance(selectGroundMode(createInitialEclipseState({ time: 0.5 }), "partial"));
    const annular = getGroundEclipseAppearance(selectGroundMode(createInitialEclipseState({ time: 0.5 }), "annular"));
    const partialDistance = Math.hypot(partial.moonOffset.x, partial.moonOffset.y);

    expect(total.moonRadius).toBeGreaterThan(total.sunRadius);
    expect(total.moonOffset).toEqual({ x: 0, y: 0 });
    expect(total.coverage).toBe(1);
    expect(total.coronaOpacity).toBeGreaterThan(0);
    expect(total.ringVisible).toBe(false);
    expect(total.ringOpacity).toBe(0);

    expect(partialDistance).toBeGreaterThan(Math.abs(partial.sunRadius - partial.moonRadius));
    expect(partialDistance).toBeLessThan(partial.sunRadius + partial.moonRadius);
    expect(partial.coverage).toBeGreaterThan(0);
    expect(partial.coverage).toBeLessThan(1);
    expect(partial.coronaOpacity).toBe(0);
    expect(partial.ringVisible).toBe(false);
    expect(partial.ringOpacity).toBe(0);

    expect(annular.moonRadius).toBeLessThan(annular.sunRadius);
    expect(annular.moonOffset).toEqual({ x: 0, y: 0 });
    expect(annular.coverage).toBeGreaterThan(0);
    expect(annular.coverage).toBeLessThan(1);
    expect(annular.coronaOpacity).toBe(0);
    expect(annular.ringVisible).toBe(true);
    expect(annular.ringOpacity).toBeGreaterThan(0);
    expect(annular.ringVisible).toBe(annular.ringOpacity > 0);
  });

  it("moves the Moon along a mostly horizontal Earth-centered orbit in both space models", () => {
    const before = getSpaceMoonPosition(0.15, "total");
    const maximum = getSpaceMoonPosition(0.5, "total");
    const after = getSpaceMoonPosition(0.85, "total");
    const annular = getSpaceMoonPosition(0.5, "annular");

    const beforeDistance = Math.hypot(before.x - spaceEarth.x, before.y - spaceEarth.y, before.z - 0);
    const maximumDistance = Math.hypot(maximum.x - spaceEarth.x, maximum.y - spaceEarth.y, maximum.z - 0);
    const afterDistance = Math.hypot(after.x - spaceEarth.x, after.y - spaceEarth.y, after.z - 0);
    const annularDistance = Math.hypot(annular.x - spaceEarth.x, annular.y - spaceEarth.y, annular.z - 0);
    const verticalTravel = Math.abs(before.y - after.y);
    const depthTravel = Math.abs(before.z - after.z);

    expect(before.x).toBeGreaterThan(maximum.x);
    expect(after.x).toBeGreaterThan(maximum.x);
    expect(before.y).toBeGreaterThan(0);
    expect(after.y).toBeLessThan(0);
    expect(verticalTravel).toBeLessThan(depthTravel * 0.25);
    expect(before.orbitAngleRad).toBeLessThan(maximum.orbitAngleRad);
    expect(after.orbitAngleRad).toBeGreaterThan(maximum.orbitAngleRad);
    expect(beforeDistance).toBeCloseTo(maximumDistance, 2);
    expect(afterDistance).toBeCloseTo(maximumDistance, 2);
    expect(maximumDistance).toBeGreaterThan(1.5);
    expect(annularDistance).toBeGreaterThan(maximumDistance);
  });

  it("derives total-model shadow width at Earth from Sun and Moon tangent lines", () => {
    const geometry = getEclipseTangentGeometry(0.5, "total");

    expect(geometry.penumbra.upperEarthY).toBeLessThan(geometry.penumbra.lowerEarthY);
    expect(geometry.umbra.upperEarthY).toBeGreaterThan(geometry.umbra.lowerEarthY);
    expect(geometry.antumbra).toBeNull();
    expect(geometry.penumbra.lowerEarthY - geometry.penumbra.upperEarthY).toBeGreaterThan(geometry.umbra.upperEarthY - geometry.umbra.lowerEarthY);
  });

  it("keeps space Moon bodies visually close in size while distance drives total versus annular geometry", () => {
    const total = getEclipseTangentGeometry(0.5, "total");
    const annular = getEclipseTangentGeometry(0.5, "annular");
    const totalDistance = Math.hypot(total.moon.x - spaceEarth.x, total.moon.y - spaceEarth.y, total.moon.z);
    const annularDistance = Math.hypot(annular.moon.x - spaceEarth.x, annular.moon.y - spaceEarth.y, annular.moon.z);
    const sunApparentRadius = spaceSun.radius / (spaceEarth.x - spaceSun.x);
    const totalApparentRadius = total.moonRadius / totalDistance;
    const annularApparentRadius = annular.moonRadius / annularDistance;

    expect(total.moonRadius).toBe(annular.moonRadius);
    expect(annularDistance).toBeGreaterThan(totalDistance);
    expect(totalApparentRadius).toBeGreaterThan(sunApparentRadius);
    expect(annularApparentRadius).toBeLessThan(sunApparentRadius);
  });

  it("keeps penumbra and umbra as four separate tangent boundaries in one section", () => {
    const geometry = getEclipseTangentGeometry(0.5, "total");

    expect(geometry.penumbra.upperEarthY).toBeLessThan(geometry.umbra.lowerEarthY);
    expect(geometry.penumbra.lowerEarthY).toBeGreaterThan(geometry.umbra.upperEarthY);
    expect(geometry.umbra.upperEarthY).not.toBeCloseTo(geometry.penumbra.lowerEarthY, 6);
    expect(geometry.umbra.lowerEarthY).not.toBeCloseTo(geometry.penumbra.upperEarthY, 6);
  });

  it("keeps the space shadow volume center on the Sun-Moon center line", () => {
    const geometry = getEclipseTangentGeometry(0.15, "total");
    const projection = getSpaceShadowProjectionGeometry(geometry);
    const moon = geometry.moon;
    const progressToEarth = (spaceEarth.x - spaceSun.x) / (moon.x - spaceSun.x);

    expect(projection.centerAtEarth.x).toBe(spaceEarth.x);
    expect(projection.centerAtEarth.y).toBeCloseTo(moon.y * progressToEarth, 6);
    expect(projection.centerAtEarth.z).toBeCloseTo(moon.z * progressToEarth, 6);
    expect(projection.centerAtEarth.z).not.toBeCloseTo(moon.z * 0.22, 2);
    expect(projection.penumbraRadiusAtEarth).toBeGreaterThan(projection.centralRadiusAtEarth);
  });

  it("derives annular-model antumbra at Earth while the umbra ends before Earth", () => {
    const geometry = getEclipseTangentGeometry(0.5, "annular");
    const projection = getSpaceShadowProjectionGeometry(geometry);
    const moon = geometry.moon;
    const progressToTip = (geometry.umbraTipX - spaceSun.x) / (moon.x - spaceSun.x);
    const tipDistanceFromEarthCenter = Math.hypot(projection.umbraTip.x - spaceEarth.x, projection.umbraTip.y - spaceEarth.y, projection.umbraTip.z);

    expect(geometry.antumbra).not.toBeNull();
    expect(geometry.umbraTipX).toBeLessThan(spaceEarth.x);
    expect(tipDistanceFromEarthCenter).toBeGreaterThan(spaceEarth.radius);
    expect(geometry.antumbra!.upperEarthY).toBeGreaterThan(geometry.antumbra!.lowerEarthY);
    expect(projection.umbraTip.x).toBe(geometry.umbraTipX);
    expect(projection.umbraTip.y).toBeCloseTo(moon.y * progressToTip, 6);
    expect(projection.umbraTip.z).toBeCloseTo(moon.z * progressToTip, 6);
  });

  it("moves Earth surface shadow tracks as orbital time changes", () => {
    const early = getShadowTrackGeometry(getEclipseTangentGeometry(0.15, "total"));
    const late = getShadowTrackGeometry(getEclipseTangentGeometry(0.85, "total"));

    expect(early.bandY).toBeGreaterThan(0);
    expect(late.bandY).toBeLessThan(0);
    expect(early.partialBandScaleY).toBeGreaterThan(early.centralBandScaleY);
  });

  it("keeps total and annular central track widths derived from their shadow geometry", () => {
    const totalTrack = getShadowTrackGeometry(getEclipseTangentGeometry(0.5, "total"));
    const annularTrack = getShadowTrackGeometry(getEclipseTangentGeometry(0.5, "annular"));

    expect(totalTrack.centralBandScaleY).toBeGreaterThan(0.012);
    expect(annularTrack.centralBandScaleY).toBeGreaterThan(0.012);
    expect(totalTrack.centralBandScaleY).not.toBe(annularTrack.centralBandScaleY);
  });
});
