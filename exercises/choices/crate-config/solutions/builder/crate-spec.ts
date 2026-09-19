import { CrateSpecBuilder } from "./crate-spec-builder.ts";
import type { CrateSpec } from "./types.ts";

export function buildExportCrate(
  lengthCm: number,
  widthCm: number,
  heightCm: number,
  maxLoadKg: number,
): CrateSpec {
  return new CrateSpecBuilder()
    .material("wood")
    .dimensions(lengthCm, widthCm, heightCm)
    .maxLoad(maxLoadKg)
    .build();
}

export function buildDomesticCrate(
  lengthCm: number,
  widthCm: number,
  heightCm: number,
  maxLoadKg: number,
): CrateSpec {
  return new CrateSpecBuilder()
    .material("plastic")
    .dimensions(lengthCm, widthCm, heightCm)
    .maxLoad(maxLoadKg)
    .build();
}
