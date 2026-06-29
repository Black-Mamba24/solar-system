import React, { useMemo } from "react";
import { buildDisplacedSphereGeometry } from "./geometry";
import { marsProfile, mercuryProfile, moonProfile } from "./profiles";
import { SphericalPatch } from "./ModelPrimitives";
import type { ProceduralBodyModelProps, RockyProfile } from "./types";

function getRockyProfile(bodyId: string): RockyProfile {
  if (bodyId === "moon") return moonProfile;
  if (bodyId === "mars") return marsProfile;
  return mercuryProfile;
}

export function RockyBodyModel({ body, radius, selected, asset, onSelectBody }: ProceduralBodyModelProps) {
  const profile = getRockyProfile(body.id);
  const geometry = useMemo(
    () =>
      buildDisplacedSphereGeometry({
        radius,
        seed: profile.seed,
        baseColor: profile.baseColor,
        lightColor: profile.lightColor,
        darkColor: profile.darkColor,
        displacement: profile.displacement,
        craters: profile.craters,
        polarColor: body.id === "mars" ? "#f3dfc8" : undefined,
        polarStrength: 73
      }),
    [body.id, profile, radius]
  );

  return (
    <group name={`${body.id}-procedural-rocky-model`} scale={selected ? 1.08 : 1}>
      <mesh name={`${body.id}-surface`} geometry={geometry} userData={{ textureSourceId: asset?.id, textureSourcePath: asset?.localPath }} onClick={() => onSelectBody(body.id)}>
        <meshStandardMaterial vertexColors roughness={profile.roughness} metalness={0.03} emissive={selected ? profile.lightColor : "#000000"} emissiveIntensity={selected ? 0.08 : 0} />
      </mesh>
      {profile.ridges?.map((ridge) => <SphericalPatch key={ridge.name} patch={ridge} radius={radius} height={body.id === "mars" && ridge.name.includes("olympus") ? 1.018 : 1.012} />)}
      {body.id === "mars" ? (
        <>
          <SphericalPatch patch={{ name: "mars-north-polar-cap", lat: 82, lon: 0, latRadius: 7, lonRadius: 178, color: "#f6ead8", opacity: 0.88 }} radius={radius} height={1.018} />
          <SphericalPatch patch={{ name: "mars-south-polar-cap", lat: -82, lon: 0, latRadius: 8, lonRadius: 178, color: "#f7e7d4", opacity: 0.9 }} radius={radius} height={1.018} />
        </>
      ) : null}
    </group>
  );
}
