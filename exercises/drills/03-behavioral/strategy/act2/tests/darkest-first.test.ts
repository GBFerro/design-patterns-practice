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

test("darkest-first offers the highest targets first", () => {
  const plan = planNight(
    [
      request({ id: "low", altitudeDeg: 25 }),
      request({ id: "zenith", altitudeDeg: 88 }),
      request({ id: "mid", altitudeDeg: 55 }),
    ],
    { policy: "darkest-first", budgetMinutes: 600 },
  );

  assert.deepEqual(
    plan.entries.map((entry) => entry.requestId),
    ["zenith", "mid", "low"],
  );
});

// The new policy must not re-implement the night: the horizon, the budget and the
// skipped list are the packer's job, and a fourth policy is not a licence to copy
// them.
test("darkest-first still obeys the horizon and the budget", () => {
  const plan = planNight(
    [
      request({ id: "below", altitudeDeg: 12, minutes: 30 }),
      request({ id: "high", altitudeDeg: 80, minutes: 90 }),
      request({ id: "higher-but-long", altitudeDeg: 85, minutes: 900 }),
    ],
    { policy: "darkest-first", budgetMinutes: 120 },
  );

  assert.deepEqual(
    plan.entries.map((entry) => entry.requestId),
    ["high"],
  );
  assert.deepEqual(plan.skipped, ["below", "higher-but-long"]);
  assert.equal(plan.usedMinutes, 90);
});

test("darkest-first is advertised alongside the other three", () => {
  assert.deepEqual([...policyNames()].sort(), [
    "darkest-first",
    "fair-share",
    "max-science",
    "max-targets",
  ]);
});

// The operator typo case: the message has to carry every available name, not a
// hand-maintained sample that drifts from what the code accepts.
test("a misspelled policy name is refused with the full list of what is available", () => {
  assert.throws(
    () => planNight([], { policy: "darkest_first", budgetMinutes: 600 }),
    (error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      assert.match(message, /darkest_first/);
      for (const name of policyNames()) {
        assert.ok(
          message.includes(name),
          `the failure must name "${name}" as an option, got: ${message}`,
        );
      }
      return true;
    },
  );
});
