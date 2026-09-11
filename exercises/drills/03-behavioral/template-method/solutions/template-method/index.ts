import { findInstrument, instrumentNames } from "./instruments/registry.ts";
import { runPipeline } from "./pipeline.ts";
import type { NightLog } from "./types.ts";

export function runNight(instrument: string, target: string): NightLog {
  return runPipeline(findInstrument(instrument), target);
}

export { instrumentNames };
export type { NightLog, StepLog } from "./types.ts";
