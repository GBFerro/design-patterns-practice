import type { Feeder, InkSystem, Plate, Press } from "./types.ts";

/** Unchanged from `src/`. On this route it never actually fires - see
 *  ACT2.md - but it stays as a defensive backstop for any caller that
 *  builds parts by hand instead of going through one factory. */
export function assemblePress(plate: Plate, inkSystem: InkSystem, feeder: Feeder): Press {
  if (plate.family !== inkSystem.family || plate.family !== feeder.family) {
    throw new Error(
      `mismatched press family: plate=${plate.family}, inkSystem=${inkSystem.family}, feeder=${feeder.family}`,
    );
  }

  const family = plate.family;
  return {
    family,
    describe: () => `${family} press: ${plate.describe()}, ${inkSystem.describe()}, ${feeder.describe()}`,
  };
}
