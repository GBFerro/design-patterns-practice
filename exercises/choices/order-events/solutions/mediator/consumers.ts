import { recordCall } from "./call-tracker.ts";
import type { Order } from "./types.ts";

export function sendConfirmationEmail(_order: Order): void {
  recordCall("email");
}

export function sendSmsNotification(_order: Order): void {
  recordCall("sms");
}

export function updateInventoryCount(_order: Order): void {
  recordCall("inventory");
}

export function recordAnalyticsEvent(_order: Order): void {
  recordCall("analytics");
}
