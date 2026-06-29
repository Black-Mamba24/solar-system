import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { isWebGLAvailable } from "@/lib/webgl";
import { OverviewPage } from "./OverviewPage";

const navigationMocks = vi.hoisted(() => ({
  replace: vi.fn(),
  searchParams: new URLSearchParams()
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/overview",
  useRouter: () => ({ replace: navigationMocks.replace }),
  useSearchParams: () => navigationMocks.searchParams
}));

vi.mock("@/components/solar-system/SolarSystemCanvas", () => ({
  SolarSystemCanvas: ({ cameraPreset, onSelectBody }: { cameraPreset: string; onSelectBody: (id: string) => void }) => (
    <div>
      <span>mock camera {cameraPreset}</span>
      <button type="button" onClick={() => onSelectBody("mars")}>
        mock canvas
      </button>
    </div>
  )
}));

describe("OverviewPage", () => {
  beforeEach(() => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation((contextId) => (contextId === "webgl" ? ({} as RenderingContext) : null));
  });

  afterEach(() => {
    navigationMocks.replace.mockClear();
    navigationMocks.searchParams = new URLSearchParams();
    vi.restoreAllMocks();
  });

  it("renders localized controls and the default Earth body panel", () => {
    navigationMocks.searchParams = new URLSearchParams("lang=zh");

    render(<OverviewPage locale="zh" />);

    expect(screen.getByText("太阳系概述")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "返回首页" })).toHaveAttribute("href", "/?lang=zh");
    expect(screen.getByRole("navigation", { name: "页面操作" })).toContainElement(screen.getByRole("link", { name: "返回首页" }));
    expect(screen.getByRole("navigation", { name: "页面操作" })).toContainElement(screen.getByRole("button", { name: "切换语言" }));
    expect(screen.getByRole("button", { name: "播放" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "速度" })).toBeInTheDocument();
    expect(screen.getByLabelText("标签")).toBeChecked();
    expect(screen.getByLabelText("轨道线")).toBeChecked();
    expect(screen.getByLabelText("月球轨道")).toBeChecked();
    expect(screen.getByRole("heading", { name: "地球" })).toBeInTheDocument();
    expect(screen.getByText("半径")).toBeInTheDocument();
    expect(screen.getByText("平均日距")).toBeInTheDocument();
    expect(screen.getByText("重力加速度")).toBeInTheDocument();
    expect(screen.getByText("卫星")).toBeInTheDocument();
    expect(screen.getByText("温度范围")).toBeInTheDocument();
    expect(screen.queryByText("为什么重要")).not.toBeInTheDocument();
    expect(screen.queryByText("要点")).not.toBeInTheDocument();
  });

  it("initializes overview state from the URL", () => {
    navigationMocks.searchParams = new URLSearchParams("lang=en&body=mars&camera=outer&labels=0&orbits=1&moonOrbit=0");

    render(<OverviewPage locale="en" />);

    expect(screen.getByRole("link", { name: "Back to home" })).toHaveAttribute("href", "/?lang=en");
    expect(screen.getByRole("heading", { name: "Mars" })).toBeInTheDocument();
    expect(screen.getByText("mock camera full")).toBeInTheDocument();
    expect(screen.getByLabelText("Labels")).not.toBeChecked();
    expect(screen.getByLabelText("Orbits")).toBeChecked();
    expect(screen.getByLabelText("Moon orbit")).not.toBeChecked();
  });

  it("updates the selected body panel and URL from the scene selection", () => {
    navigationMocks.searchParams = new URLSearchParams("lang=en");

    render(<OverviewPage locale="en" />);
    fireEvent.click(screen.getByRole("button", { name: "mock canvas" }));

    expect(screen.getByRole("heading", { name: "Mars" })).toBeInTheDocument();
    expect(screen.getByText(/Mars is a cold, dry rocky planet/)).toBeInTheDocument();
    expect(screen.getByText("Avg. solar distance")).toBeInTheDocument();
    expect(navigationMocks.replace).toHaveBeenLastCalledWith("/overview?lang=en&body=mars&camera=full&labels=1&orbits=1&moonOrbit=1", {
      scroll: false
    });
  });

  it("keeps only the full camera view", () => {
    navigationMocks.searchParams = new URLSearchParams("lang=en");

    render(<OverviewPage locale="en" />);

    expect(screen.getByText("mock camera full")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Outer planets" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Inner planets" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Earth and Moon" })).not.toBeInTheDocument();
  });

  it("updates layer state and URL from layer checkboxes", () => {
    navigationMocks.searchParams = new URLSearchParams("lang=en");

    render(<OverviewPage locale="en" />);
    fireEvent.click(screen.getByLabelText("Labels"));

    expect(screen.getByLabelText("Labels")).not.toBeChecked();
    expect(navigationMocks.replace).toHaveBeenLastCalledWith("/overview?lang=en&body=earth&camera=full&labels=0&orbits=1&moonOrbit=1", {
      scroll: false
    });
  });

  it("resyncs local state when same-route URL search params change", async () => {
    navigationMocks.searchParams = new URLSearchParams("lang=en&body=earth&camera=full&labels=1&orbits=1&moonOrbit=1");

    const { rerender } = render(<OverviewPage locale="en" />);
    expect(screen.getByRole("heading", { name: "Earth" })).toBeInTheDocument();

    navigationMocks.searchParams = new URLSearchParams("lang=en&body=mars&camera=outer&labels=0&orbits=1&moonOrbit=0");
    rerender(<OverviewPage locale="en" />);

    await waitFor(() => expect(screen.getByRole("heading", { name: "Mars" })).toBeInTheDocument());
    expect(screen.getByText("mock camera full")).toBeInTheDocument();
    expect(screen.getByLabelText("Labels")).not.toBeChecked();
    expect(screen.getByLabelText("Moon orbit")).not.toBeChecked();
  });

  it("renders the fallback when WebGL is unavailable", () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);

    expect(isWebGLAvailable()).toBe(false);
    render(<OverviewPage locale="en" />);

    expect(screen.getByText("3D scene unavailable")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "mock canvas" })).not.toBeInTheDocument();
  });
});
