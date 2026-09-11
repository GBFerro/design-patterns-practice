import type { SchedulingPolicy } from "../policy.ts";

/** Buy the most science value: highest priority first, shorter breaking ties. */
export const maxScience: SchedulingPolicy = {
  name: "max-science",
  rank(candidates) {
    return [...candidates].sort((a, b) => b.priority - a.priority || a.minutes - b.minutes);
  },
};
