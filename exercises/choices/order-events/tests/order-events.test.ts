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

const order: Order = {
  id: "O100",
  customerEmail: "a@example.com",
  customerPhone: "+15551234567",
};

test("orderShipped notifies inventory, analytics, email and sms, in that order", () => {
  orderShipped(order);
  assert.deepEqual(calledConsumers(), ["inventory", "analytics", "email", "sms"]);
});

test("resendOrderNotifications notifies the exact same four consumers", () => {
  resendOrderNotifications(order);
  assert.deepEqual(calledConsumers(), ["inventory", "analytics", "email", "sms"]);
});

test("two shipments each trigger their own full fan-out", () => {
  orderShipped(order);
  orderShipped({ ...order, id: "O101" });
  assert.deepEqual(calledConsumers(), [
    "inventory",
    "analytics",
    "email",
    "sms",
    "inventory",
    "analytics",
    "email",
    "sms",
  ]);
});
