import type { CrateSpec, Fastener, Material } from "./types.ts";

function fastenerFor(material: Material): Fastener {
  return material === "wood" ? "nails" : "bolts";
}

export class CrateSpecBuilder {
  private materialValue: Material | undefined;
  private lengthCmValue: number | undefined;
  private widthCmValue: number | undefined;
  private heightCmValue: number | undefined;
  private maxLoadKgValue: number | undefined;

  material(material: Material): this {
    this.materialValue = material;
    return this;
  }

  dimensions(lengthCm: number, widthCm: number, heightCm: number): this {
    this.lengthCmValue = lengthCm;
    this.widthCmValue = widthCm;
    this.heightCmValue = heightCm;
    return this;
  }

  maxLoad(maxLoadKg: number): this {
    this.maxLoadKgValue = maxLoadKg;
    return this;
  }

  build(): CrateSpec {
    const { materialValue, lengthCmValue, widthCmValue, heightCmValue, maxLoadKgValue } = this;
    if (materialValue === undefined) {
      throw new Error("material is required");
    }
    if (lengthCmValue === undefined || widthCmValue === undefined || heightCmValue === undefined) {
      throw new Error("dimensions are required");
    }
    if (maxLoadKgValue === undefined) {
      throw new Error("maxLoad is required");
    }
    if (lengthCmValue <= 0 || widthCmValue <= 0 || heightCmValue <= 0) {
      throw new Error("crate dimensions must be positive");
    }
    if (maxLoadKgValue <= 0) {
      throw new Error("maxLoadKg must be positive");
    }
    return {
      material: materialValue,
      fastener: fastenerFor(materialValue),
      lengthCm: lengthCmValue,
      widthCm: widthCmValue,
      heightCm: heightCmValue,
      maxLoadKg: maxLoadKgValue,
    };
  }
}
