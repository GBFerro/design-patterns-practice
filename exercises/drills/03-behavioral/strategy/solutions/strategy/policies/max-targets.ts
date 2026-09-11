import type { SchedulingPolicy } from "../policy.ts";

/** Fit as many distinct targets into the night as possible: shortest first. */
export const maxTargets: SchedulingPolicy = {
  name: "max-targets",
  rank(candidates) {
    return [...candidates].sort((a, b) => a.minutes - b.minutes);
  },
};
