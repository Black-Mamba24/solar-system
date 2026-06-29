import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { bodies } from "@/data/bodies";
import { BodyInfoPanel } from "./BodyInfoPanel";

function bodyById(bodyId: string) {
  const body = bodies.find((item) => item.id === bodyId);
  if (!body) throw new Error(`Missing body ${bodyId}`);
  return body;
}

describe("BodyInfoPanel", () => {
  const speechSynthesisMock = {
    speak: vi.fn(),
    cancel: vi.fn(),
    getVoices: vi.fn(),
    resume: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn()
  };

  class MockSpeechSynthesisUtterance {
    lang = "";
    pitch = 1;
    rate = 1;
    volume = 1;
    voice: SpeechSynthesisVoice | null = null;
    onend: (() => void) | null = null;
    onerror: (() => void) | null = null;

    constructor(public text: string) {}
  }

  beforeEach(() => {
    speechSynthesisMock.speak.mockClear();
    speechSynthesisMock.cancel.mockClear();
    speechSynthesisMock.resume.mockClear();
    speechSynthesisMock.getVoices.mockReturnValue([
      { name: "中文男声", lang: "zh-CN", voiceURI: "zh-male" },
      { name: "中文女声", lang: "zh-CN", voiceURI: "zh-female" }
    ]);
    speechSynthesisMock.addEventListener.mockClear();
    speechSynthesisMock.removeEventListener.mockClear();
    Object.defineProperty(window, "speechSynthesis", { configurable: true, value: speechSynthesisMock });
    Object.defineProperty(window, "SpeechSynthesisUtterance", { configurable: true, value: MockSpeechSynthesisUtterance });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("shows the selected body's sourced image", () => {
    render(<BodyInfoPanel body={bodyById("earth")} locale="en" />);

    expect(screen.getByRole("img", { name: "Earth" }).getAttribute("src")).toContain("%2Ftextures%2Fearth.jpg");
  });

  it("places the speech button beside the body name and reads the introduction with a male voice", () => {
    render(<BodyInfoPanel body={bodyById("earth")} locale="zh" />);

    const speechButton = screen.getByRole("button", { name: "播报介绍" });
    const image = screen.getByRole("img", { name: "地球" });

    expect(speechButton.compareDocumentPosition(image) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    fireEvent.click(speechButton);

    expect(speechSynthesisMock.cancel).toHaveBeenCalled();
    expect(speechSynthesisMock.speak).toHaveBeenCalledTimes(1);
    const utterance = speechSynthesisMock.speak.mock.calls[0][0] as SpeechSynthesisUtterance & { text: string };
    expect(utterance.text).toContain("地球。");
    expect(utterance.text).toContain(bodyById("earth").content.zh.summary);
    expect(utterance.lang).toBe("zh-CN");
    expect(utterance.pitch).toBeLessThan(1);
    expect(utterance.voice?.name).toBe("中文男声");
  });

  it("does not mistake female voice identifiers for male voices", () => {
    speechSynthesisMock.getVoices.mockReturnValue([
      { name: "Chinese Female", lang: "zh-CN", voiceURI: "zh-female" },
      { name: "Microsoft Yunxi", lang: "zh-CN", voiceURI: "zh-yunxi" }
    ]);

    render(<BodyInfoPanel body={bodyById("earth")} locale="zh" />);
    fireEvent.click(screen.getByRole("button", { name: "播报介绍" }));

    const utterance = speechSynthesisMock.speak.mock.calls[0][0] as SpeechSynthesisUtterance;
    expect(utterance.voice?.name).toBe("Microsoft Yunxi");
  });

  it("does not assign a male voice from another locale because mismatched voices can stay silent", () => {
    speechSynthesisMock.getVoices.mockReturnValue([
      { name: "Tingting", lang: "zh-CN", voiceURI: "com.apple.voice.compact.zh-CN.Tingting" },
      { name: "Meijia", lang: "zh-TW", voiceURI: "com.apple.voice.compact.zh-TW.Meijia" },
      { name: "Daniel", lang: "en-GB", voiceURI: "com.apple.voice.compact.en-GB.Daniel" }
    ]);

    render(<BodyInfoPanel body={bodyById("earth")} locale="zh" />);
    fireEvent.click(screen.getByRole("button", { name: "播报介绍" }));

    const utterance = speechSynthesisMock.speak.mock.calls[0][0] as SpeechSynthesisUtterance;
    expect(utterance.lang).toBe("zh-CN");
    expect(utterance.voice).toBeNull();
    expect(utterance.pitch).toBeLessThan(0.8);
  });

  it("resumes the speech queue before speaking", () => {
    render(<BodyInfoPanel body={bodyById("earth")} locale="zh" />);
    fireEvent.click(screen.getByRole("button", { name: "播报介绍" }));

    expect(speechSynthesisMock.resume).toHaveBeenCalledTimes(1);
    expect(speechSynthesisMock.resume.mock.invocationCallOrder[0]).toBeLessThan(speechSynthesisMock.speak.mock.invocationCallOrder[0]);
  });

  it("keeps speech playback available when speechSynthesis lacks event listener helpers", () => {
    const speechSynthesisWithoutEvents = {
      speak: vi.fn(),
      cancel: vi.fn(),
      getVoices: vi.fn().mockReturnValue([{ name: "中文男声", lang: "zh-CN", voiceURI: "zh-male" }])
    };
    Object.defineProperty(window, "speechSynthesis", { configurable: true, value: speechSynthesisWithoutEvents });

    render(<BodyInfoPanel body={bodyById("earth")} locale="zh" />);
    fireEvent.click(screen.getByRole("button", { name: "播报介绍" }));

    expect(speechSynthesisWithoutEvents.speak).toHaveBeenCalledTimes(1);
  });

  it("does not compare Moon rotation and orbit periods against Earth", () => {
    render(<BodyInfoPanel body={bodyById("moon")} locale="zh" />);

    const rotationCard = screen.getByText("自转周期").closest("div");
    const orbitCard = screen.getByText("公转周期").closest("div");

    expect(rotationCard).not.toHaveTextContent("约为地球的");
    expect(orbitCard).not.toHaveTextContent("约为地球的");
  });

  it("shows an atmosphere introduction for planets", () => {
    render(<BodyInfoPanel body={bodyById("earth")} locale="zh" />);

    const atmosphereCard = screen.getByText("大气").closest("div");

    expect(atmosphereCard).toHaveTextContent("氮气");
    expect(atmosphereCard).toHaveTextContent("氧气");
  });

  it("renders multiple moons by category with numbered moon names", () => {
    render(<BodyInfoPanel body={bodyById("saturn")} locale="zh" />);

    const moonsCard = screen.getByText("卫星").closest("div");
    expect(moonsCard).toHaveTextContent("共有 292 颗已确认卫星");
    expect(moonsCard).toHaveTextContent("规则卫星");
    expect(moonsCard).toHaveTextContent("不规则卫星");
    expect(moonsCard).not.toHaveTextContent("列出代表性卫星");

    const moonList = within(moonsCard!).getByRole("list");
    const items = within(moonList).getAllByRole("listitem");

    expect(items.length).toBeGreaterThanOrEqual(2);
    expect(items[0]).toHaveTextContent("土卫六（泰坦）");
    expect(items[0].textContent?.startsWith("规则卫星")).toBe(false);
    expect(items[0]).toHaveTextContent("规则卫星中最大的一颗");
    expect(items[0]).toHaveTextContent("浓厚大气");
    expect(items[1]).toHaveTextContent("土卫二（恩克拉多斯）");
    expect(items[1]).toHaveTextContent("含水羽流");
  });

  it("classifies Uranus and Jupiter moon systems without irrelevant notes", () => {
    const { rerender } = render(<BodyInfoPanel body={bodyById("uranus")} locale="zh" />);

    let moonsCard = screen.getByText("卫星").closest("div");
    expect(moonsCard).toHaveTextContent("共有 29 颗已确认卫星");
    expect(moonsCard).toHaveTextContent("主群卫星");
    expect(moonsCard).toHaveTextContent("内卫星");
    expect(moonsCard).toHaveTextContent("不规则卫星");
    expect(moonsCard).toHaveTextContent("天卫一（艾瑞尔）");
    expect(within(moonsCard!).getByText(/天卫一（艾瑞尔）/).textContent?.startsWith("主群卫星")).toBe(false);

    rerender(<BodyInfoPanel body={bodyById("jupiter")} locale="zh" />);
    moonsCard = screen.getByText("卫星").closest("div");
    expect(moonsCard).toHaveTextContent("共有 115 颗已确认卫星");
    expect(moonsCard).toHaveTextContent("规则卫星");
    expect(moonsCard).toHaveTextContent("顺行不规则卫星");
    expect(moonsCard).toHaveTextContent("逆行不规则卫星");
    expect(moonsCard).not.toHaveTextContent("列出伽利略四大卫星");
  });
});
