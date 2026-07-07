import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LunarEclipsePage } from "./LunarEclipsePage";

vi.mock("next/navigation", () => ({
  usePathname: () => "/lunar-eclipse",
  useSearchParams: () => new URLSearchParams("lang=zh")
}));

vi.mock("@/lib/webgl", () => ({
  isWebGLAvailable: () => true
}));

vi.mock("./LunarEclipseCanvas", () => ({
  LunarEclipseCanvas: ({ state }: { state: { mainView: string; eclipseCase: string; time: number } }) => (
    <div>
      mock lunar eclipse canvas {state.mainView} {state.eclipseCase} {state.time.toFixed(2)}
    </div>
  )
}));

describe("LunarEclipsePage", () => {
  it("renders the lunar eclipse demo with space view and total eclipse selected", () => {
    render(<LunarEclipsePage locale="zh" />);

    expect(screen.getByRole("heading", { name: "月食" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "返回首页" })).toHaveAttribute("href", "/?lang=zh");
    expect(screen.getByRole("button", { name: "太空视角" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "地球视角" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "月全食" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "月偏食" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByText("mock lunar eclipse canvas space total 0.00")).toBeInTheDocument();
    expect(screen.getByText("P1")).toBeInTheDocument();
    expect(screen.getByText("U1")).toBeInTheDocument();
    expect(screen.getByText("U2")).toBeInTheDocument();
    expect(screen.getByText("食甚")).toBeInTheDocument();
    expect(screen.getByText("U3")).toBeInTheDocument();
    expect(screen.getByText("U4")).toBeInTheDocument();
    expect(screen.getByText("P4")).toBeInTheDocument();
    expect(screen.getByText("半影 penumbra")).toBeInTheDocument();
    expect(screen.getByText("本影 umbra")).toBeInTheDocument();
    expect(screen.getAllByText("P1 月球开始进入地球半影").length).toBeGreaterThan(0);
    expect(screen.getByRole("combobox", { name: "速度" })).toHaveValue("normal");
    expect(screen.getByRole("option", { name: "慢速" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "正常速度" })).toBeInTheDocument();
  });

  it("switches between total and partial cases in both views", () => {
    render(<LunarEclipsePage locale="zh" />);

    fireEvent.click(screen.getByRole("button", { name: "月偏食" }));
    expect(screen.getByText("mock lunar eclipse canvas space partial 0.00")).toBeInTheDocument();
    expect(screen.queryByText("U2")).not.toBeInTheDocument();
    expect(screen.queryByText("U3")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "地球视角" }));
    expect(screen.getByRole("button", { name: "地球视角" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("mock lunar eclipse canvas ground partial 0.00")).toBeInTheDocument();
    expect(screen.getByText("月偏食食甚：本影只覆盖月面一部分")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "月全食" }));
    expect(screen.getByText("mock lunar eclipse canvas ground total 0.00")).toBeInTheDocument();
  });

  it("contains unambiguous Chinese explanations for the physical cause", () => {
    render(<LunarEclipsePage locale="zh" />);

    expect(screen.getByText(/月食不是月球进入太阳的影子/)).toBeInTheDocument();
    expect(screen.getByText(/地球挡住太阳直射到月球的光/)).toBeInTheDocument();
    expect(screen.getByText(/约 5 度倾角/)).toBeInTheDocument();
    expect(screen.getByText(/红橙光被折射进地球本影/)).toBeInTheDocument();
  });
});
