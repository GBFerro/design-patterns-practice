import assert from "node:assert/strict";
import { test } from "node:test";

import { TelescopeController } from "#exercise";

// Guards against the starting state being anything but parked - every other
// test assumes this.
test("a new telescope starts parked", () => {
  const scope = new TelescopeController();
  assert.equal(scope.status, "parked");
});

// Guards against the four methods being reordered relative to one another -
// the happy path, once.
test("the happy path: park -> slew -> arrive -> nudge -> park", () => {
  const scope = new TelescopeController();
  scope.slewTo("M31");
  assert.equal(scope.status, "slewing");
  scope.arrive();
  assert.equal(scope.status, "tracking");
  scope.nudge(12);
  assert.equal(scope.status, "tracking");
  scope.park();
  assert.equal(scope.status, "parked");
});

// Guards against park() losing its idempotence while already parked, which is
// the one transition act 1 deliberately leaves unguarded.
test("parking while already parked is a no-op, not an error", () => {
  const scope = new TelescopeController();
  assert.doesNotThrow(() => scope.park());
  assert.equal(scope.status, "parked");
});

// Guards against retargeting mid-slew being silently accepted - the one
// illegal transition this domain cares most about.
test("slewing while already slewing is refused, naming the slew in progress", () => {
  const scope = new TelescopeController();
  scope.slewTo("M31");
  assert.throws(() => scope.slewTo("M42"), /M31/);
  assert.equal(scope.status, "slewing", "the rejected call must not change the state");
});

// Guards against arrive() being accepted from a state that never started a
// slew, which would silently fabricate a slew that did not happen.
test("arriving without having slewed is refused, from parked and from tracking", () => {
  const parked = new TelescopeController();
  assert.throws(() => parked.arrive(), /parked/);

  const tracking = new TelescopeController();
  tracking.slewTo("M31");
  tracking.arrive();
  assert.throws(() => tracking.arrive(), /tracking/);
});

// Guards against nudge() being accepted outside tracking, which would let a
// caller "adjust pointing" on a telescope that is not actually locked on
// anything.
test("nudging is refused from parked and from slewing", () => {
  const parked = new TelescopeController();
  assert.throws(() => parked.nudge(5), /parked/);

  const slewing = new TelescopeController();
  slewing.slewTo("M31");
  assert.throws(() => slewing.nudge(5), /slewing/);
});

// Guards against an emergency park losing the in-progress target silently -
// parking from slewing must succeed (it is the abort button), and a slew
// afterwards must start clean rather than remembering the aborted target.
test("parking mid-slew succeeds and clears the aborted target", () => {
  const scope = new TelescopeController();
  scope.slewTo("M31");
  scope.park();
  assert.equal(scope.status, "parked");
  assert.doesNotThrow(() => scope.slewTo("M42"));
});

// Guards against the transition log being dropped or reordered while moving
// the bookkeeping out of four separate methods into one shared place.
test("every successful transition is recorded, in order, from the right state", () => {
  const scope = new TelescopeController();
  scope.slewTo("M31");
  scope.arrive();
  scope.park();
  assert.deepEqual(
    scope.history.map((entry) => [entry.from, entry.action]),
    [
      ["parked", "slewTo(M31)"],
      ["slewing", "arrive"],
      ["tracking", "park"],
    ],
  );
});

// Guards against a rejected call being logged anyway, which would make the
// history lie about what actually happened to the hardware.
test("a refused call is not recorded", () => {
  const scope = new TelescopeController();
  assert.throws(() => scope.nudge(5));
  assert.deepEqual(scope.history, []);
});
