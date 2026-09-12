import type { Feeder, InkSystem, Plate } from "../types.ts";

export class DigitalPlate implements Plate {
  readonly family = "digital" as const;
  describe(): string {
    return "digital imaging plate";
  }
}

export class DigitalInkSystem implements InkSystem {
  readonly family = "digital" as const;
  describe(): string {
    return "digital dry-toner cartridge";
  }
}

export class DigitalFeeder implements Feeder {
  readonly family = "digital" as const;
  describe(): string {
    return "digital sheet feeder";
  }
}
