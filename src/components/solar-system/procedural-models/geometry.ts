import * as THREE from "three";
import type { CraterSpec, SphericalPolygonSpec, SphericalPolylineSpec } from "./types";
import { clamp01, hash2, latLonToVector, pseudoNoise3, vectorToLatLon } from "./noise";

export interface DisplacedSphereOptions {
  radius: number;
  widthSegments?: number;
  heightSegments?: number;
  seed: number;
  baseColor: string;
  lightColor: string;
  darkColor: string;
  displacement?: number;
  craters?: CraterSpec[];
  polarColor?: string;
  polarStrength?: number;
  flattenY?: number;
}

function mixColor(a: THREE.Color, b: THREE.Color, amount: number): THREE.Color {
  return a.clone().lerp(b, clamp01(amount));
}

export function buildDisplacedSphereGeometry(options: DisplacedSphereOptions): THREE.BufferGeometry {
  const geometry = new THREE.SphereGeometry(options.radius, options.widthSegments ?? 72, options.heightSegments ?? 48);
  const position = geometry.getAttribute("position") as THREE.BufferAttribute;
  const colors: number[] = [];
  const base = new THREE.Color(options.baseColor);
  const light = new THREE.Color(options.lightColor);
  const dark = new THREE.Color(options.darkColor);
  const polar = options.polarColor ? new THREE.Color(options.polarColor) : undefined;

  for (let index = 0; index < position.count; index += 1) {
    const vertex = new THREE.Vector3(position.getX(index), position.getY(index), position.getZ(index));
    const direction = vertex.clone().normalize();
    const { lat, lon } = vectorToLatLon(direction);
    const terrain = pseudoNoise3(direction, options.seed);
    const shade = terrain;

    direction.multiplyScalar(options.radius);

    if (options.flattenY) {
      direction.y *= options.flattenY;
    }

    position.setXYZ(index, direction.x, direction.y, direction.z);

    let color = shade > 0.5 ? mixColor(base, light, (shade - 0.5) * 1.8) : mixColor(base, dark, (0.5 - shade) * 1.8);
    if (polar) {
      const polarMix = clamp01((Math.abs(lat) - (options.polarStrength ?? 66)) / 18);
      color = color.lerp(polar, polarMix);
    }
    colors.push(color.r, color.g, color.b);
  }

  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  return geometry;
}

export function buildSphericalEllipseGeometry({
  radius,
  lat,
  lon,
  latRadius,
  lonRadius,
  segments = 40,
  height = 1.006
}: {
  radius: number;
  lat: number;
  lon: number;
  latRadius: number;
  lonRadius: number;
  segments?: number;
  height?: number;
}): THREE.BufferGeometry {
  const vertices: number[] = [];
  const indices: number[] = [];
  const center = latLonToVector(lat, lon, radius * height);
  vertices.push(center.x, center.y, center.z);

  for (let step = 0; step <= segments; step += 1) {
    const angle = (step / segments) * Math.PI * 2;
    const point = latLonToVector(lat + Math.sin(angle) * latRadius, lon + Math.cos(angle) * lonRadius, radius * height);
    vertices.push(point.x, point.y, point.z);
  }

  for (let step = 1; step <= segments; step += 1) {
    indices.push(0, step, step + 1);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export function buildSphericalPolygonGeometry({ radius, patch, height = 1.014 }: { radius: number; patch: SphericalPolygonSpec; height?: number }): THREE.BufferGeometry {
  const points = patch.points;
  const centerLat = points.reduce((sum, point) => sum + point.lat, 0) / points.length;
  const centerLon = points.reduce((sum, point) => sum + point.lon, 0) / points.length;
  const centerLatRad = THREE.MathUtils.degToRad(centerLat);
  const contour = points.map((point) => new THREE.Vector2(THREE.MathUtils.degToRad(point.lon - centerLon) * Math.cos(centerLatRad), THREE.MathUtils.degToRad(point.lat - centerLat)));
  const triangles = THREE.ShapeUtils.triangulateShape(contour, []);
  const vertices: number[] = [];
  const indices: number[] = [];

  for (const point of points) {
    const vertex = latLonToVector(point.lat, point.lon, radius * height);
    vertices.push(vertex.x, vertex.y, vertex.z);
  }

  for (const triangle of triangles) {
    indices.push(triangle[0], triangle[1], triangle[2]);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export function buildSphericalPolylineGeometry({ radius, line, height = 1.025 }: { radius: number; line: SphericalPolylineSpec; height?: number }): THREE.BufferGeometry {
  const points = line.points.map((point) => latLonToVector(point.lat, point.lon, radius * height));
  return new THREE.BufferGeometry().setFromPoints(points);
}

export function buildRingBandGeometry(innerRadius: number, outerRadius: number, segments = 160): THREE.BufferGeometry {
  return new THREE.RingGeometry(innerRadius, outerRadius, segments);
}

export function buildRingParticlePositions({
  innerRadius,
  outerRadius,
  count,
  seed,
  verticalScale = 0.018
}: {
  innerRadius: number;
  outerRadius: number;
  count: number;
  seed: number;
  verticalScale?: number;
}): Float32Array {
  const points = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    const angle = hash2(index, 1, seed) * Math.PI * 2;
    const radial = innerRadius + hash2(index, 2, seed) * (outerRadius - innerRadius);
    points[index * 3] = Math.cos(angle) * radial;
    points[index * 3 + 1] = Math.sin(angle) * radial;
    points[index * 3 + 2] = (hash2(index, 3, seed) - 0.5) * verticalScale;
  }
  return points;
}

export function buildBandTorusGeometry(radius: number, lat: number, width: number): THREE.BufferGeometry {
  const latRad = THREE.MathUtils.degToRad(lat);
  const horizontalRadius = Math.cos(latRad) * radius;
  const y = Math.sin(latRad) * radius;
  const geometry = new THREE.TorusGeometry(horizontalRadius, Math.max(radius * width, radius * 0.01), 10, 128);
  geometry.rotateX(Math.PI / 2);
  geometry.translate(0, y, 0);
  return geometry;
}

export function sampleCraterSpecs(seed: number, count: number, minRadius: number, maxRadius: number, depth: number): CraterSpec[] {
  return Array.from({ length: count }, (_, index) => ({
    lat: -68 + hash2(index, 8, seed) * 136,
    lon: -180 + hash2(index, 9, seed) * 360,
    radius: minRadius + hash2(index, 10, seed) * (maxRadius - minRadius),
    depth: depth * (0.6 + hash2(index, 11, seed) * 0.7),
    rim: depth * (0.35 + hash2(index, 12, seed) * 0.35)
  }));
}
