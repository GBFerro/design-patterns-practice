import type { Feeder, PressFamily } from "./types.ts";

class DigitalFeeder implements Feeder {
  readonly family = "digital" as const;
  describe(): string {
    return "digital sheet feeder";
  }
}

class OffsetFeeder implements Feeder {
  readonly family = "offset" as const;
  describe(): string {
    return "offset continuous feeder";
  }
}

export function createFeeder(family: PressFamily): Feeder {
  switch (family) {
    case "digital":
      return new DigitalFeeder();
    case "offset":
      return new OffsetFeeder();
  }
}
