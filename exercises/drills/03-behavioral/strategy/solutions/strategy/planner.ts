import { findPolicy } from "./policies/registry.ts";
import type { NightPlan, ObservationRequest, PlanEntry, PlanOptions } from "./types.ts";

/** Below this altitude the dome wall is in the way, whatever the policy says. */
const MINIMUM_ALTITUDE_DEG = 20;

interface PackContext {
  readonly submitted: readonly ObservationRequest[];
  readonly budgetMinutes: number;
  readonly policyName: string;
}

export function planNight(
  submitted: readonly ObservationRequest[],
  options: PlanOptions,
): NightPlan {
  const policy = findPolicy(options.policy);
  const observable = submitted.filter(isAboveHorizon);
  return pack(policy.rank(observable), {
    submitted,
    budgetMinutes: options.budgetMinutes,
    policyName: policy.name,
  });
}

function pack(ordered: readonly ObservationRequest[], context: PackContext): NightPlan {
  const entries: PlanEntry[] = [];
  let usedMinutes = 0;
  for (const request of ordered) {
    if (usedMinutes + request.minutes > context.budgetMinutes) continue;
    entries.push(toEntry(request, usedMinutes));
    usedMinutes += request.minutes;
  }
  return {
    policy: context.policyName,
    entries,
    usedMinutes,
    skipped: skippedIds(context.submitted, entries),
  };
}

function toEntry(request: ObservationRequest, startsAtMinute: number): PlanEntry {
  return {
    requestId: request.id,
    targetName: request.targetName,
    startsAtMinute,
    minutes: request.minutes,
  };
}

function skippedIds(
  submitted: readonly ObservationRequest[],
  entries: readonly PlanEntry[],
): readonly string[] {
  const scheduled = new Set(entries.map((entry) => entry.requestId));
  return submitted
    .filter((request) => !scheduled.has(request.id))
    .map((request) => request.id);
}

function isAboveHorizon(request: ObservationRequest): boolean {
  return request.altitudeDeg >= MINIMUM_ALTITUDE_DEG;
}
