import assert from "node:assert/strict";
import { test } from "node:test";

import { planNight, policyNames } from "#exercise";
import type { ObservationRequest } from "#exercise";

function request(
  overrides: Partial<ObservationRequest> & { readonly id: string },
): ObservationRequest {
  return {
    targetName: `Target ${overrides.id}`,
    proposalId: "P-1",
    priority: 3,
    minutes: 30,
    altitudeDeg: 60,
    ...overrides,
  };
}

function ids(requests: readonly { readonly requestId: string }[]): string[] {
  return requests.map((entry) => entry.requestId);
}

// Guards against moving the horizon filter after packing, which silently spends
// budget on targets the dome wall is in front of.
test("a target below the minimum altitude never reaches the plan, and is reported skipped", () => {
  const plan = planNight(
    [
      request({ id: "a", altitudeDeg: 19, minutes: 60 }),
      request({ id: "b", altitudeDeg: 20, minutes: 60 }),
    ],
    { policy: "max-targets", budgetMinutes: 600 },
  );

  assert.deepEqual(ids(plan.entries), ["b"]);
  assert.deepEqual(plan.skipped, ["a"]);
});

// Guards against collapsing the three policies onto one comparator.
test("max-targets offers the shortest observations first", () => {
  const plan = planNight(
    [
      request({ id: "long", minutes: 180 }),
      request({ id: "short", minutes: 20 }),
      request({ id: "middle", minutes: 90 }),
    ],
    { policy: "max-targets", budgetMinutes: 120 },
  );

  assert.deepEqual(ids(plan.entries), ["short", "middle"]);
  assert.equal(plan.usedMinutes, 110);
});

// Guards against max-science quietly sorting by duration, which fits more
// observations and buys less science - the failure looks like an improvement.
test("max-science takes one high-value target over two cheap ones", () => {
  const plan = planNight(
    [
      request({ id: "cheap-1", priority: 1, minutes: 60 }),
      request({ id: "flagship", priority: 5, minutes: 110 }),
      request({ id: "cheap-2", priority: 1, minutes: 60 }),
    ],
    { policy: "max-science", budgetMinutes: 120 },
  );

  assert.deepEqual(ids(plan.entries), ["flagship"]);
});

// Guards against dropping either tie-break. Array sort is stable in V8, so equal
// priority and equal duration must preserve submission order; an in-place sort of
// the caller's array or a hand-rolled comparator loses that without failing loudly.
test("max-science breaks ties by duration, then by submission order", () => {
  const submitted = [
    request({ id: "first", priority: 4, minutes: 60 }),
    request({ id: "quick", priority: 4, minutes: 30 }),
    request({ id: "second", priority: 4, minutes: 60 }),
  ];

  const plan = planNight(submitted, { policy: "max-science", budgetMinutes: 600 });

  assert.deepEqual(ids(plan.entries), ["quick", "first", "second"]);
  assert.deepEqual(
    submitted.map((entry) => entry.id),
    ["first", "quick", "second"],
    "planNight must not reorder the caller's array",
  );
});

// Guards against fair-share degenerating into max-science, which is what happens
// if the round-robin is replaced by a single sort on priority.
test("fair-share gives every proposal a first slot before anyone gets a second", () => {
  const plan = planNight(
    [
      request({ id: "big-1", proposalId: "P-BIG", priority: 5, minutes: 60 }),
      request({ id: "big-2", proposalId: "P-BIG", priority: 5, minutes: 60 }),
      request({ id: "small-1", proposalId: "P-SMALL", priority: 2, minutes: 60 }),
    ],
    { policy: "fair-share", budgetMinutes: 180 },
  );

  assert.deepEqual(ids(plan.entries), ["big-1", "small-1", "big-2"]);
});

// Guards against an off-by-one in the budget check: a request that exactly fills
// what is left must fit.
test("an observation that exactly fills the remaining budget fits", () => {
  const plan = planNight(
    [request({ id: "a", minutes: 90 }), request({ id: "b", minutes: 30 })],
    { policy: "max-science", budgetMinutes: 120 },
  );

  assert.equal(plan.entries.length, 2);
  assert.equal(plan.usedMinutes, 120);
  assert.deepEqual(plan.skipped, []);
});

// Guards against `break` where `continue` belongs: one oversized request must not
// end the night.
test("an observation longer than the whole night is skipped without stopping the rest", () => {
  const plan = planNight(
    [
      request({ id: "impossible", priority: 5, minutes: 900 }),
      request({ id: "possible", priority: 4, minutes: 60 }),
    ],
    { policy: "max-science", budgetMinutes: 120 },
  );

  assert.deepEqual(ids(plan.entries), ["possible"]);
  assert.deepEqual(plan.skipped, ["impossible"]);
});

// Guards against deriving the start time from the loop index instead of from the
// minutes already spent.
test("each entry starts where the previous one ended", () => {
  const plan = planNight(
    [
      request({ id: "a", minutes: 20 }),
      request({ id: "b", minutes: 45 }),
      request({ id: "c", minutes: 15 }),
    ],
    { policy: "max-targets", budgetMinutes: 600 },
  );

  assert.deepEqual(
    plan.entries.map((entry) => [entry.requestId, entry.startsAtMinute, entry.minutes]),
    [
      ["c", 0, 15],
      ["a", 15, 20],
      ["b", 35, 45],
    ],
  );
});

// Guards against reaching for the first element of an empty night.
test("a night with nothing submitted plans nothing", () => {
  const plan = planNight([], { policy: "fair-share", budgetMinutes: 600 });

  assert.deepEqual(plan.entries, []);
  assert.equal(plan.usedMinutes, 0);
  assert.deepEqual(plan.skipped, []);
  assert.equal(plan.policy, "fair-share");
});

// Guards against the dispatch and the list of names drifting apart: every name
// reported as available must actually plan a night.
test("every advertised policy name works, and an unknown one is refused by name", () => {
  const submitted = [request({ id: "a" })];

  for (const name of policyNames()) {
    assert.equal(planNight(submitted, { policy: name, budgetMinutes: 600 }).policy, name);
  }
  assert.ok(policyNames().includes("max-targets"));
  assert.ok(policyNames().includes("max-science"));
  assert.ok(policyNames().includes("fair-share"));

  assert.throws(
    () => planNight(submitted, { policy: "max-moonlight", budgetMinutes: 600 }),
    /max-moonlight/,
  );
});
