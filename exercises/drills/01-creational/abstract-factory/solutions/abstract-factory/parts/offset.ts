import type { Feeder, InkSystem, Plate } from "../types.ts";

export class OffsetPlate implements Plate {
  readonly family = "offset" as const;
  describe(): string {
    return "offset aluminum plate";
  }
}

export class OffsetInkSystem implements InkSystem {
  readonly family = "offset" as const;
  describe(): string {
    return "offset wet-ink fountain";
  }
}

export class OffsetFeeder implements Feeder {
  readonly family = "offset" as const;
  describe(): string {
    return "offset continuous feeder";
  }
}
