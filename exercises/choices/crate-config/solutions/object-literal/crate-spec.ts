import type { CrateSpec, Fastener, Material } from "./types.ts";

/** The one piece of "which fastener goes with which material" knowledge, as data. */
const FASTENER_BY_MATERIAL: Record<Material, Fastener> = {
  wood: "nails",
  plastic: "bolts",
};

function assembleCrate(
  material: Material,
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
  return {
    material,
    fastener: FASTENER_BY_MATERIAL[material],
    lengthCm,
    widthCm,
    heightCm,
    maxLoadKg,
  };
}

export function buildExportCrate(
  lengthCm: number,
  widthCm: number,
  heightCm: number,
  maxLoadKg: number,
): CrateSpec {
  return assembleCrate("wood", lengthCm, widthCm, heightCm, maxLoadKg);
}

export function buildDomesticCrate(
  lengthCm: number,
  widthCm: number,
  heightCm: number,
  maxLoadKg: number,
): CrateSpec {
  return assembleCrate("plastic", lengthCm, widthCm, heightCm, maxLoadKg);
}
