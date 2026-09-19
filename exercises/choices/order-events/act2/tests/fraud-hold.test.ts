import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

import {
  calledConsumers,
  orderShipped,
  resendOrderNotifications,
  resetCalls,
} from "#exercise";
import type { Order } from "#exercise";

beforeEach(() => {
  resetCalls();
});

const clean: Order = {
  id: "O100",
  customerEmail: "a@example.com",
  customerPhone: "+15551234567",
};
const held: Order = {
  id: "O200",
  customerEmail: "b@flagged.example",
  customerPhone: "+15559876543",
};

test("a clean order still fires all four, in the act-1 order", () => {
  orderShipped(clean);
  assert.deepEqual(calledConsumers(), ["inventory", "analytics", "email", "sms"]);
});

test("a held order fires only inventory and analytics - no email, no sms", () => {
  orderShipped(held);
  assert.deepEqual(calledConsumers(), ["inventory", "analytics"]);
});

test("resendOrderNotifications respects the hold identically", () => {
  resendOrderNotifications(held);
  assert.deepEqual(calledConsumers(), ["inventory", "analytics"]);
});

test("resendOrderNotifications fires all four for a clean order", () => {
  resendOrderNotifications(clean);
  assert.deepEqual(calledConsumers(), ["inventory", "analytics", "email", "sms"]);
});

test("a held order followed by a clean order: each gets its own correct fan-out", () => {
  orderShipped(held);
  orderShipped(clean);
  assert.deepEqual(calledConsumers(), [
    "inventory",
    "analytics",
    "inventory",
    "analytics",
    "email",
    "sms",
  ]);
});
