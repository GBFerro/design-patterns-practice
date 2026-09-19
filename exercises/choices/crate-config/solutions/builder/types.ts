export type Material = "wood" | "plastic";
export type Fastener = "nails" | "bolts";

export interface CrateSpec {
  readonly material: Material;
  readonly fastener: Fastener;
  readonly lengthCm: number;
  readonly widthCm: number;
  readonly heightCm: number;
  readonly maxLoadKg: number;
}
