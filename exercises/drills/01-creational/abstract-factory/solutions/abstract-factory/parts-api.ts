import { getPressFactory } from "./factory.ts";
import type { Feeder, InkSystem, Plate, PressFamily } from "./types.ts";

/** Same frozen signatures as `src/`'s independent constructors - each one
 *  now asks one factory for one part, instead of switching on `family`
 *  itself. */
export function createPlate(family: PressFamily): Plate {
  return getPressFactory(family).createPlate();
}

export function createInkSystem(family: PressFamily): InkSystem {
  return getPressFactory(family).createInkSystem();
}

export function createFeeder(family: PressFamily): Feeder {
  return getPressFactory(family).createFeeder();
}
