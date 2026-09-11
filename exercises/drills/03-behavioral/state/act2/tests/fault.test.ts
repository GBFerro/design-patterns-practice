import assert from "node:assert/strict";
import { test } from "node:test";

import { TelescopeController } from "#exercise";

test("a fault can be raised from parked, slewing or tracking", () => {
  const fromParked = new TelescopeController();
  fromParked.raiseFault("watchdog timeout");
  assert.equal(fromParked.status, "fault");

  const fromSlewing = new TelescopeController();
  fromSlewing.slewTo("M31");
  fromSlewing.raiseFault("motor stall");
  assert.equal(fromSlewing.status, "fault");

  const fromTracking = new TelescopeController();
  fromTracking.slewTo("M31");
  fromTracking.arrive();
  fromTracking.raiseFault("lost encoder");
  assert.equal(fromTracking.status, "fault");
});

test("only park() is legal from fault", () => {
  const scope = new TelescopeController();
  scope.raiseFault("motor stall");

  assert.throws(() => scope.slewTo("M31"), /fault/);
  assert.throws(() => scope.arrive(), /fault/);
  assert.throws(() => scope.nudge(5), /fault/);
  assert.equal(scope.status, "fault", "every refused call must leave the state unchanged");

  assert.doesNotThrow(() => scope.park());
  assert.equal(scope.status, "parked");
});

test("raising a fault is itself recorded in the history", () => {
  const scope = new TelescopeController();
  scope.raiseFault("motor stall");
  assert.deepEqual(scope.history, [{ from: "parked", action: "raiseFault(motor stall)" }]);
});
