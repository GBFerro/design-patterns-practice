import type { ObservationRequest } from "./types.ts";

/**
 * A scheduling policy answers exactly one question: in what order should the
 * night's candidates be offered to the packer?
 *
 * It does not decide what fits, what is above the horizon, or when anything
 * starts. Those are the same on every night and live in the packer.
 */
export interface SchedulingPolicy {
  readonly name: string;
  rank(candidates: readonly ObservationRequest[]): readonly ObservationRequest[];
}
