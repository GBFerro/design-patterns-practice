import type { SchedulingPolicy } from "../policy.ts";
import type { ObservationRequest } from "../types.ts";

/**
 * Give every proposal its first slot before anyone gets a second, so one
 * proposal with twenty approved requests cannot take the whole night.
 */
export const fairShare: SchedulingPolicy = {
  name: "fair-share",
  rank(candidates) {
    return interleave(groupByProposal(candidates));
  },
};

function groupByProposal(
  candidates: readonly ObservationRequest[],
): ObservationRequest[][] {
  const groups = new Map<string, ObservationRequest[]>();
  for (const request of candidates) {
    const group = groups.get(request.proposalId);
    if (group === undefined) groups.set(request.proposalId, [request]);
    else group.push(request);
  }
  return [...groups.values()].map(byScienceValue);
}

function byScienceValue(group: readonly ObservationRequest[]): ObservationRequest[] {
  return [...group].sort((a, b) => b.priority - a.priority || a.minutes - b.minutes);
}

function interleave(groups: readonly ObservationRequest[][]): ObservationRequest[] {
  const deepest = Math.max(0, ...groups.map((group) => group.length));
  const ordered: ObservationRequest[] = [];
  for (let round = 0; round < deepest; round += 1) {
    for (const group of groups) {
      const request = group[round];
      if (request !== undefined) ordered.push(request);
    }
  }
  return ordered;
}
