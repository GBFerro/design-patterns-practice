import type { InkSystem, PressFamily } from "./types.ts";

class DigitalInkSystem implements InkSystem {
  readonly family = "digital" as const;
  describe(): string {
    return "digital dry-toner cartridge";
  }
}

class OffsetInkSystem implements InkSystem {
  readonly family = "offset" as const;
  describe(): string {
    return "offset wet-ink fountain";
  }
}

export function createInkSystem(family: PressFamily): InkSystem {
  switch (family) {
    case "digital":
      return new DigitalInkSystem();
    case "offset":
      return new OffsetInkSystem();
  }
}
