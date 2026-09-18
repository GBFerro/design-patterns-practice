import { recordCall } from "./call-tracker.ts";
import type { Order } from "./types.ts";

export function sendConfirmationEmail(order: Order): void {
  recordCall("email");
}

export function sendSmsNotification(order: Order): void {
  recordCall("sms");
}

export function updateInventoryCount(order: Order): void {
  recordCall("inventory");
}

export function recordAnalyticsEvent(order: Order): void {
  recordCall("analytics");
}
