import { describe, expect, it } from "vitest";
import { parseUrlState, serializeUrlState } from "./url-state";

describe("url state", () => {
  it("parses supported state", () => {
    const state = parseUrlState(new URLSearchParams("lang=en&body=earth&camera=inner&labels=0&orbits=1&moonOrbit=0"));
    expect(state).toEqual({
      locale: "en",
      selectedBodyId: "earth",
      camera: "full",
      layers: { labels: false, orbits: true, moonOrbit: false }
    });
  });

  it("normalizes every camera value to the full overview", () => {
    expect(parseUrlState(new URLSearchParams("camera=earthMoon")).camera).toBe("full");
    expect(parseUrlState(new URLSearchParams("camera=outer")).camera).toBe("full");
    expect(parseUrlState(new URLSearchParams("camera=full")).camera).toBe("full");
  });

  it("falls back for invalid values", () => {
    const state = parseUrlState(new URLSearchParams("lang=fr&camera=bad"));
    expect(state.locale).toBe("zh");
    expect(state.camera).toBe("full");
    expect(state.layers).toEqual({ labels: true, orbits: true, moonOrbit: true });
  });

  it("falls back for invalid layer flags", () => {
    const state = parseUrlState(new URLSearchParams("labels=false-ish&orbits=true&moonOrbit=no"));
    expect(state.layers).toEqual({ labels: true, orbits: true, moonOrbit: true });
  });

  it("serializes state", () => {
    expect(
      serializeUrlState({
        locale: "en",
        selectedBodyId: "mars",
        camera: "full",
        layers: { labels: true, orbits: false, moonOrbit: true }
      })
    ).toBe("?lang=en&body=mars&camera=full&labels=1&orbits=0&moonOrbit=1");
  });
});
