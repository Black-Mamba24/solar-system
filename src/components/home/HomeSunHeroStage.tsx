"use client";

import React, { useEffect, useState } from "react";
import { withBasePath } from "@/lib/base-path";
import { isWebGLAvailable } from "@/lib/webgl";
import type { Locale } from "@/types/domain";
import { HomeSunHeroCanvas } from "./HomeSunHeroCanvas";

const heroLabels: Record<Locale, string> = {
  zh: "动态 3D 太阳模型，包含炽热日冕、太阳黑子和太阳风暴效果",
  en: "Dynamic 3D Sun model with a hot corona, sunspots, and solar storm effects"
};

function HomeSunHeroFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute left-[-28%] top-1/2 size-[34rem] -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_36%_32%,rgba(255,246,181,0.95)_0%,rgba(255,175,54,0.88)_24%,rgba(255,79,20,0.74)_52%,rgba(38,10,2,0.9)_100%)] shadow-[0_0_90px_rgba(248,196,92,0.78),0_0_190px_rgba(255,74,22,0.42)] md:size-[48rem] lg:left-[-20%] lg:size-[58rem]">
        <div className="absolute inset-0 rounded-full bg-cover bg-center opacity-70 mix-blend-screen" style={{ backgroundImage: `url(${withBasePath("/textures/sun-surface.jpg")})` }} />
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_62%_44%,transparent_0%,rgba(38,10,2,0.22)_42%,rgba(0,0,0,0.55)_100%)]" />
        <div className="absolute left-[56%] top-[26%] h-10 w-24 -rotate-12 rounded-full bg-[radial-gradient(ellipse,rgba(38,10,2,0.58),transparent_72%)] blur-sm" />
        <div className="absolute left-[45%] top-[62%] h-8 w-20 rotate-12 rounded-full bg-[radial-gradient(ellipse,rgba(38,10,2,0.5),transparent_72%)] blur-sm" />
      </div>
      <div className="absolute left-[-35%] top-1/2 size-[44rem] -translate-y-1/2 rounded-full border border-sun/20 shadow-[0_0_130px_rgba(248,196,92,0.32)] md:size-[66rem]" />
      <div className="absolute left-[-22%] top-1/2 size-[30rem] -translate-y-1/2 rounded-full border border-[#ff4a16]/20 md:size-[48rem]" />
    </div>
  );
}

export function HomeSunHeroStage({ locale }: { locale: Locale }) {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setWebglSupported(isWebGLAvailable());

    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateReducedMotion = () => setReducedMotion(mediaQuery.matches);
    updateReducedMotion();

    mediaQuery.addEventListener?.("change", updateReducedMotion);
    return () => mediaQuery.removeEventListener?.("change", updateReducedMotion);
  }, []);

  return (
    <figure
      role="img"
      aria-label={heroLabels[locale]}
      className="relative min-h-[520px] overflow-hidden rounded-ui border border-white/10 bg-[radial-gradient(circle_at_18%_32%,rgba(248,196,92,0.28),transparent_34%),linear-gradient(135deg,rgba(5,7,13,0.74),rgba(10,19,35,0.44))] shadow-[inset_0_0_80px_rgba(255,122,32,0.1)] md:min-h-[620px]"
    >
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.52)_1px,transparent_1px)] bg-[length:58px_58px] opacity-20" />
      <div aria-hidden="true" className="absolute left-[8%] top-[10%] h-[42rem] w-[42rem] rounded-full border border-white/10 md:h-[54rem] md:w-[54rem]" />
      <div aria-hidden="true" className="absolute left-[18%] top-[22%] h-[34rem] w-[34rem] rounded-full border border-orbit/20 md:h-[46rem] md:w-[46rem]" />
      <div aria-hidden="true" className="absolute right-6 top-6 h-px w-32 bg-gradient-to-r from-transparent via-orbit/50 to-transparent" />
      <div aria-hidden="true" className="absolute right-12 top-10 h-20 w-px bg-gradient-to-b from-transparent via-orbit/40 to-transparent" />
      <div aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-sun/30 to-transparent" />

      <div className="absolute inset-0">
        {webglSupported ? <HomeSunHeroCanvas animated={!reducedMotion} /> : <HomeSunHeroFallback />}
      </div>

      <figcaption className="sr-only">{heroLabels[locale]}</figcaption>
    </figure>
  );
}
