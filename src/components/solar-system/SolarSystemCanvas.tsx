"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { bodies } from "@/data/bodies";
import { dictionaries } from "@/i18n/dictionaries";
import type { Vector3Tuple } from "@/lib/orbits";
import type { CameraPreset, LayerKey, Locale } from "@/types/domain";
import { AsteroidBelt } from "./AsteroidBelt";
import { CelestialBodyMesh } from "./CelestialBodyMesh";
import { OrbitLine } from "./OrbitLine";
import { getOrbitCenter } from "./scene-helpers";
import { Stars } from "./Stars";

interface CameraPresetView {
  position: Vector3Tuple;
  target: Vector3Tuple;
}

interface SolarSystemCanvasProps {
  locale: Locale;
  elapsedDays: number;
  cameraPreset: CameraPreset;
  selectedBodyId?: string;
  layers: Record<LayerKey, boolean>;
  onSelectBody: (bodyId: string) => void;
}

const cameraPresetViews: Record<CameraPreset, CameraPresetView> = {
  full: { position: [0, 74, 92], target: [0, 0, 0] }
};

export function getCameraPresetView(cameraPreset: CameraPreset): CameraPresetView {
  return cameraPresetViews[cameraPreset];
}

function CameraPresetController({
  cameraPreset,
  controlsRef
}: {
  cameraPreset: CameraPreset;
  controlsRef: React.MutableRefObject<OrbitControlsImpl | null>;
}) {
  const { camera } = useThree();

  useEffect(() => {
    const view = getCameraPresetView(cameraPreset);
    camera.position.set(...view.position);
    camera.lookAt(...view.target);

    if (controlsRef.current) {
      controlsRef.current.target.set(...view.target);
      controlsRef.current.update();
    }
  }, [camera, cameraPreset, controlsRef]);

  return null;
}

export function SolarSystemCanvas({ locale, elapsedDays, cameraPreset, selectedBodyId, layers, onSelectBody }: SolarSystemCanvasProps) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const initialCameraView = getCameraPresetView(cameraPreset);

  return (
    <section className="relative h-[min(78vh,820px)] min-h-[620px] overflow-hidden rounded-ui border border-white/10 bg-[#03050b]">
      <Canvas camera={{ position: initialCameraView.position, fov: 52 }} dpr={[1, 1.7]} gl={{ antialias: true }}>
        <color attach="background" args={["#03050b"]} />
        <ambientLight intensity={0.24} />
        <pointLight position={[0, 0, 0]} intensity={800} color="#f8c45c" />
        <Stars />
        {layers.orbits ? <AsteroidBelt /> : null}
        {layers.orbits
          ? bodies.map((body) => (body.orbit && !body.parentId ? <OrbitLine key={`${body.id}-orbit`} orbit={body.orbit} center={getOrbitCenter(body, bodies, elapsedDays)} /> : null))
          : null}
        {layers.moonOrbit
          ? bodies.map((body) => (body.orbit && body.parentId ? <OrbitLine key={`${body.id}-orbit`} orbit={body.orbit} center={getOrbitCenter(body, bodies, elapsedDays)} /> : null))
          : null}
        {bodies.map((body) => (
          <CelestialBodyMesh
            key={body.id}
            body={body}
            bodies={bodies}
            locale={locale}
            elapsedDays={elapsedDays}
            selected={body.id === selectedBodyId}
            showLabel={layers.labels && (body.orbit?.showLabelByDefault ?? true)}
            onSelectBody={onSelectBody}
          />
        ))}
        <CameraPresetController cameraPreset={cameraPreset} controlsRef={controlsRef} />
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.08}
          minDistance={8}
          maxDistance={120}
          target={initialCameraView.target}
          zoomToCursor
        />
      </Canvas>
      <p className="absolute bottom-3 left-3 rounded-ui bg-black/60 px-3 py-2 text-xs text-slate-200">
        {dictionaries[locale].compressedScale}
      </p>
    </section>
  );
}
