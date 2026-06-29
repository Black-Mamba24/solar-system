import * as THREE from "three";

export function hash(value: number, seed = 1): number {
  const raw = Math.sin(value * 127.1 + seed * 311.7) * 43758.5453123;
  return raw - Math.floor(raw);
}

export function hash2(x: number, y: number, seed = 1): number {
  const raw = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123;
  return raw - Math.floor(raw);
}

export function wave(value: number): number {
  return (Math.sin(value) + 1) / 2;
}

export function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function latLonToVector(latDeg: number, lonDeg: number, radius: number): THREE.Vector3 {
  const lat = THREE.MathUtils.degToRad(latDeg);
  const lon = THREE.MathUtils.degToRad(lonDeg);
  const cosLat = Math.cos(lat);
  return new THREE.Vector3(Math.cos(lon) * cosLat * radius, Math.sin(lat) * radius, Math.sin(lon) * cosLat * radius);
}

export function vectorToLatLon(direction: THREE.Vector3): { lat: number; lon: number } {
  const normalized = direction.clone().normalize();
  return {
    lat: THREE.MathUtils.radToDeg(Math.asin(normalized.y)),
    lon: THREE.MathUtils.radToDeg(Math.atan2(normalized.z, normalized.x))
  };
}

export function angularDistanceDeg(aLat: number, aLon: number, bLat: number, bLon: number): number {
  const a = latLonToVector(aLat, aLon, 1).normalize();
  const b = latLonToVector(bLat, bLon, 1).normalize();
  return THREE.MathUtils.radToDeg(a.angleTo(b));
}

export function pseudoNoise3(direction: THREE.Vector3, seed: number): number {
  const a = wave(direction.x * 13.7 + direction.y * 9.1 + direction.z * 5.3 + seed);
  const b = wave(direction.x * 31.3 - direction.y * 21.7 + direction.z * 17.9 + seed * 1.7);
  const c = hash2(Math.floor((direction.x + 1) * 24), Math.floor((direction.z + 1) * 24), seed);
  return (a * 0.45 + b * 0.35 + c * 0.2);
}
