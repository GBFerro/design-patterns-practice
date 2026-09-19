import type { Feeder, InkSystem, Plate, Press } from "./types.ts";

/** The only thing standing between a press and a mismatched set of parts:
 *  a check that runs when the press is assembled, not when the parts were
 *  created. */
export function assemblePress(plate: Plate, inkSystem: InkSystem, feeder: Feeder): Press {
  if (plate.family !== inkSystem.family || plate.family !== feeder.family) {
    throw new Error(
      `mismatched press family: plate=${plate.family}, inkSystem=${inkSystem.family}, feeder=${feeder.family}`,
    );
  }

  const family = plate.family;
  return {
    family,
    describe: () =>
      `${family} press: ${plate.describe()}, ${inkSystem.describe()}, ${feeder.describe()}`,
  };
}
