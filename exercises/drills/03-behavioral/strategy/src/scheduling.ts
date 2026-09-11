import type { NightPlan, ObservationRequest, PlanEntry, PlanOptions } from "./types.ts";

const KNOWN_POLICIES = ["max-targets", "max-science", "fair-share"];

export function policyNames(): readonly string[] {
  return KNOWN_POLICIES;
}

export function planNight(
  submitted: readonly ObservationRequest[],
  options: PlanOptions,
): NightPlan {
  if (!KNOWN_POLICIES.includes(options.policy)) {
    throw new Error(
      `Unknown scheduling policy "${options.policy}". ` +
        `Available: max-targets, max-science, fair-share.`,
    );
  }

  const entries: PlanEntry[] = [];
  let usedMinutes = 0;

  switch (options.policy) {
    // Fit as many targets as possible: shortest first.
    case "max-targets": {
      const queue = submitted
        .filter((request) => request.altitudeDeg >= 20)
        .slice()
        .sort((a, b) => a.minutes - b.minutes);
      for (const request of queue) {
        if (usedMinutes + request.minutes > options.budgetMinutes) continue;
        entries.push({
          requestId: request.id,
          targetName: request.targetName,
          startsAtMinute: usedMinutes,
          minutes: request.minutes,
        });
        usedMinutes += request.minutes;
      }
      break;
    }

    // Buy the most science value: priority first, shorter breaks the tie.
    case "max-science": {
      const queue = [...submitted].filter((request) => request.altitudeDeg >= 20);
      queue.sort((a, b) => {
        if (b.priority !== a.priority) return b.priority - a.priority;
        return a.minutes - b.minutes;
      });
      for (let index = 0; index < queue.length; index += 1) {
        const request = queue[index];
        if (request === undefined) continue;
        if (usedMinutes + request.minutes > options.budgetMinutes) continue;
        entries.push({
          requestId: request.id,
          targetName: request.targetName,
          startsAtMinute: usedMinutes,
          minutes: request.minutes,
        });
        usedMinutes += request.minutes;
      }
      break;
    }

    // One slot per proposal before anyone gets a second.
    case "fair-share": {
      const buckets = new Map<string, ObservationRequest[]>();
      for (const request of submitted) {
        if (request.altitudeDeg < 20) continue;
        const bucket = buckets.get(request.proposalId);
        if (bucket === undefined) buckets.set(request.proposalId, [request]);
        else bucket.push(request);
      }
      const groups = [...buckets.values()].map((bucket) =>
        [...bucket].sort((a, b) => b.priority - a.priority || a.minutes - b.minutes),
      );
      const deepest = Math.max(0, ...groups.map((group) => group.length));
      for (let round = 0; round < deepest; round += 1) {
        for (const group of groups) {
          const request = group[round];
          if (request === undefined) continue;
          if (usedMinutes + request.minutes > options.budgetMinutes) continue;
          entries.push({
            requestId: request.id,
            targetName: request.targetName,
            startsAtMinute: usedMinutes,
            minutes: request.minutes,
          });
          usedMinutes += request.minutes;
        }
      }
      break;
    }
  }

  const scheduled = new Set(entries.map((entry) => entry.requestId));
  return {
    policy: options.policy,
    entries,
    usedMinutes,
    skipped: submitted
      .filter((request) => !scheduled.has(request.id))
      .map((request) => request.id),
  };
}
