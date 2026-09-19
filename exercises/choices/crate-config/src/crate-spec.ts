import type { CrateSpec, Fastener, Material } from "./types.ts";

function fastenerFor(material: Material): Fastener {
  return material === "wood" ? "nails" : "bolts";
}

export function buildExportCrate(
  lengthCm: number,
  widthCm: number,
  heightCm: number,
  maxLoadKg: number,
): CrateSpec {
  if (lengthCm <= 0 || widthCm <= 0 || heightCm <= 0) {
    throw new Error("crate dimensions must be positive");
  }
  if (maxLoadKg <= 0) {
    throw new Error("maxLoadKg must be positive");
  }
  const material: Material = "wood";
  return {
    material,
    fastener: fastenerFor(material),
    lengthCm,
    widthCm,
    heightCm,
    maxLoadKg,
  };
}

export function buildDomesticCrate(
  lengthCm: number,
  widthCm: number,
  heightCm: number,
  maxLoadKg: number,
): CrateSpec {
  if (lengthCm <= 0 || widthCm <= 0 || heightCm <= 0) {
    throw new Error("crate dimensions must be positive");
  }
  if (maxLoadKg <= 0) {
    throw new Error("maxLoadKg must be positive");
  }
  const material: Material = "plastic";
  return {
    material,
    fastener: fastenerFor(material),
    lengthCm,
    widthCm,
    heightCm,
    maxLoadKg,
  };
}
