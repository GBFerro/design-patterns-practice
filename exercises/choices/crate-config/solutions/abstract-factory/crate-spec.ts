import { PlasticCrateFamily, WoodCrateFamily, type CrateFamily } from "./crate-family.ts";
import type { CrateSpec } from "./types.ts";

function assembleCrate(
  family: CrateFamily,
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
    material: family.material,
    fastener: family.fastener(),
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
  return assembleCrate(new WoodCrateFamily(), lengthCm, widthCm, heightCm, maxLoadKg);
}

export function buildDomesticCrate(
  lengthCm: number,
  widthCm: number,
  heightCm: number,
  maxLoadKg: number,
): CrateSpec {
  return assembleCrate(new PlasticCrateFamily(), lengthCm, widthCm, heightCm, maxLoadKg);
}
