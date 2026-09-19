import type { Fastener, Material } from "./types.ts";

/** A family ties a material to the one fastener that's valid for it. */
export interface CrateFamily {
  readonly material: Material;
  fastener(): Fastener;
}

export class WoodCrateFamily implements CrateFamily {
  readonly material = "wood";

  fastener(): Fastener {
    return "nails";
  }
}

export class PlasticCrateFamily implements CrateFamily {
  readonly material = "plastic";

  fastener(): Fastener {
    return "bolts";
  }
}
