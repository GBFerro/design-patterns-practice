import {
  recordAnalyticsEvent,
  sendConfirmationEmail,
  sendSmsNotification,
  updateInventoryCount,
} from "./consumers.ts";
import type { Order } from "./types.ts";

export function orderShipped(order: Order): void {
  updateInventoryCount(order);
  recordAnalyticsEvent(order);
  sendConfirmationEmail(order);
  sendSmsNotification(order);
}

/** A customer asking support to resend the notifications needs the exact same fan-out. */
export function resendOrderNotifications(order: Order): void {
  updateInventoryCount(order);
  recordAnalyticsEvent(order);
  sendConfirmationEmail(order);
  sendSmsNotification(order);
}
