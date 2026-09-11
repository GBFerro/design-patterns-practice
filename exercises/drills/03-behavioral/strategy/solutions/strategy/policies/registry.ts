import type { SchedulingPolicy } from "../policy.ts";
import { fairShare } from "./fair-share.ts";
import { maxScience } from "./max-science.ts";
import { maxTargets } from "./max-targets.ts";

const policies: readonly SchedulingPolicy[] = [maxTargets, maxScience, fairShare];

/** The one place that knows which policies exist. */
export function policyNames(): readonly string[] {
  return policies.map((policy) => policy.name);
}

export function findPolicy(name: string): SchedulingPolicy {
  const policy = policies.find((candidate) => candidate.name === name);
  if (policy === undefined) {
    throw new Error(
      `Unknown scheduling policy "${name}". Available: ${policyNames().join(", ")}.`,
    );
  }
  return policy;
}
