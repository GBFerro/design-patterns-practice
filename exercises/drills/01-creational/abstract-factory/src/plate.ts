import type { Plate, PressFamily } from "./types.ts";

class DigitalPlate implements Plate {
  readonly family = "digital" as const;
  describe(): string {
    return "digital imaging plate";
  }
}

class OffsetPlate implements Plate {
  readonly family = "offset" as const;
  describe(): string {
    return "offset aluminum plate";
  }
}

export function createPlate(family: PressFamily): Plate {
  switch (family) {
    case "digital":
      return new DigitalPlate();
    case "offset":
      return new OffsetPlate();
  }
}
