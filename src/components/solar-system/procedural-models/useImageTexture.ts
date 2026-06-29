import { useEffect, useMemo } from "react";
import * as THREE from "three";

export function useImageTexture(path: string | undefined, colorSpace: THREE.ColorSpace = THREE.SRGBColorSpace): THREE.Texture | null {
  const texture = useMemo(() => {
    if (!path || typeof window === "undefined") {
      return null;
    }

    const loader = new THREE.TextureLoader();
    const loadedTexture = loader.load(path);
    loadedTexture.colorSpace = colorSpace;
    loadedTexture.wrapS = THREE.RepeatWrapping;
    loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
    loadedTexture.anisotropy = 16;
    loadedTexture.needsUpdate = true;
    return loadedTexture;
  }, [colorSpace, path]);

  useEffect(() => {
    return () => {
      texture?.dispose();
    };
  }, [texture]);

  return texture;
}
