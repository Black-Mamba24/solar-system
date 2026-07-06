import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SolarEclipsePage } from "./SolarEclipsePage";

vi.mock("next/navigation", () => ({
  usePathname: () => "/solar-eclipse",
  useSearchParams: () => new URLSearchParams("lang=zh")
}));

vi.mock("@/lib/webgl", () => ({
  isWebGLAvailable: () => true
}));

vi.mock("./SolarEclipseCanvas", () => ({
  SolarEclipseCanvas: ({
    state,
    onShadowPointSelect
  }: {
    state: { mainView: string; eclipseModel: string; groundMode: string };
    onShadowPointSelect: (point: { x: number; y: number }, groundMode: "total" | "partial" | "annular") => void;
  }) => (
    <div>
      <span>
        mock eclipse canvas {state.mainView} {state.eclipseModel} {state.groundMode}
      </span>
      <button type="button" onClick={() => onShadowPointSelect({ x: 0.72, y: 0.42 }, "partial")}>
        mock penumbra click
      </button>
      <button type="button" onClick={() => onShadowPointSelect({ x: 0.04, y: 0.02 }, "total")}>
        mock umbra click
      </button>
      <button type="button" onClick={() => onShadowPointSelect({ x: 0.04, y: 0.02 }, "annular")}>
        mock antumbra click
      </button>
    </div>
  )
}));

describe("SolarEclipsePage", () => {
  it("renders space as the primary view with total and annular model controls", () => {
    render(<SolarEclipsePage locale="zh" />);

    expect(screen.getByRole("heading", { name: "日食" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "返回首页" })).toHaveAttribute("href", "/?lang=zh");
    expect(screen.getByRole("button", { name: "太空视角" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "地球视角" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "日全食模型" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "日环食模型" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByText("mock eclipse canvas space total total")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "后退" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "前进" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "播放" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "速度" })).toHaveValue("normal");
    expect(screen.getByRole("slider", { name: "月球轨迹时间" })).toHaveValue("0");
    expect(screen.getByText("初亏")).toBeInTheDocument();
    expect(screen.getByText("食甚")).toBeInTheDocument();
    expect(screen.getByText("复圆")).toBeInTheDocument();
    expect(screen.queryByText("影带进入")).not.toBeInTheDocument();
    expect(screen.queryByText("影带居中")).not.toBeInTheDocument();
    expect(screen.queryByText("影带离开")).not.toBeInTheDocument();
  });

  it("switches between total and annular space models without entering ground view", () => {
    render(<SolarEclipsePage locale="zh" />);

    fireEvent.click(screen.getByRole("button", { name: "日环食模型" }));

    expect(screen.getByRole("button", { name: "太空视角" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "日环食模型" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("mock eclipse canvas space annular total")).toBeInTheDocument();
  });

  it("shows all three ground modes after switching to Earth view", () => {
    render(<SolarEclipsePage locale="zh" />);

    fireEvent.click(screen.getByRole("button", { name: "地球视角" }));

    expect(screen.getByRole("button", { name: "日全食" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "日偏食" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "日环食" })).toBeInTheDocument();
    expect(screen.getByText("mock eclipse canvas ground total total")).toBeInTheDocument();
  });

  it("lets Earth view switch freely among total, partial, and annular ground modes", () => {
    render(<SolarEclipsePage locale="zh" />);

    fireEvent.click(screen.getByRole("button", { name: "地球视角" }));
    fireEvent.click(screen.getByRole("button", { name: "日偏食" }));
    expect(screen.getByText("mock eclipse canvas ground total partial")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "日环食" }));
    expect(screen.getByText("mock eclipse canvas ground total annular")).toBeInTheDocument();
  });

  it("uses clicked shadow regions to enter the corresponding Earth view", () => {
    render(<SolarEclipsePage locale="zh" />);

    fireEvent.click(screen.getByRole("button", { name: "mock penumbra click" }));
    expect(screen.getByText("mock eclipse canvas ground total partial")).toBeInTheDocument();
    expect(screen.getByText(/右上/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "太空视角" }));
    fireEvent.click(screen.getByRole("button", { name: "mock umbra click" }));
    expect(screen.getByText("mock eclipse canvas ground total total")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "太空视角" }));
    fireEvent.click(screen.getByRole("button", { name: "mock antumbra click" }));
    expect(screen.getByText("mock eclipse canvas ground total annular")).toBeInTheDocument();
  });
});
