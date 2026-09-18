import { recordAnalyticsEvent, sendConfirmationEmail, sendSmsNotification, updateInventoryCount } from "./consumers.ts";
import type { Order } from "./types.ts";

/**
 * The one place that knows the full fan-out and can coordinate it - unlike an observer,
 * a colleague here doesn't decide on its own whether or when it runs.
 */
export class OrderEventsMediator {
  dispatch(order: Order): void {
    updateInventoryCount(order);
    recordAnalyticsEvent(order);
    sendConfirmationEmail(order);
    sendSmsNotification(order);
  }
}
