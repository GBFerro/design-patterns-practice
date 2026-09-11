import type { InstrumentHooks } from "../pipeline.ts";
import { spectrograph } from "./spectrograph.ts";
import { thermalImager } from "./thermal-imager.ts";
import { wideFieldCamera } from "./wide-field-camera.ts";

const instruments: readonly InstrumentHooks[] = [wideFieldCamera, spectrograph, thermalImager];

export function findInstrument(name: string): InstrumentHooks {
  const instrument = instruments.find((candidate) => candidate.name === name);
  if (instrument === undefined) {
    throw new Error(
      `Unknown instrument "${name}". Available: ${instruments.map((i) => i.name).join(", ")}.`,
    );
  }
  return instrument;
}

export function instrumentNames(): readonly string[] {
  return instruments.map((instrument) => instrument.name);
}
