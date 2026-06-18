import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { OverviewPage } from "./OverviewPage";

vi.mock("next/navigation", () => ({
  usePathname: () => "/overview",
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams("lang=en")
}));

vi.mock("@/components/solar-system/SolarSystemCanvas", () => ({
  SolarSystemCanvas: ({ onSelectBody }: { onSelectBody: (id: string) => void }) => (
    <button type="button" onClick={() => onSelectBody("mars")}>
      mock canvas
    </button>
  )
}));

describe("OverviewPage", () => {
  it("renders localized controls and the default Earth body panel", () => {
    render(<OverviewPage locale="zh" />);

    expect(screen.getByText("太阳系概述")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "播放" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "速度" })).toBeInTheDocument();
    expect(screen.getByLabelText("标签")).toBeChecked();
    expect(screen.getByLabelText("轨道线")).toBeChecked();
    expect(screen.getByLabelText("月球轨道")).toBeChecked();
    expect(screen.getByRole("heading", { name: "地球" })).toBeInTheDocument();
    expect(screen.getByText("半径")).toBeInTheDocument();
    expect(screen.getByText("平均日距")).toBeInTheDocument();
    expect(screen.getByText("为什么重要")).toBeInTheDocument();
  });

  it("updates the selected body panel from the scene selection", () => {
    render(<OverviewPage locale="en" />);

    fireEvent.click(screen.getByRole("button", { name: "mock canvas" }));

    expect(screen.getByRole("heading", { name: "Mars" })).toBeInTheDocument();
    expect(screen.getByText("Mars is a cold, dry rocky planet with a reddish color from iron oxides.")).toBeInTheDocument();
    expect(screen.getByText("Avg. solar distance")).toBeInTheDocument();
  });
});
