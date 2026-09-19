import {
  recordAnalyticsEvent,
  sendConfirmationEmail,
  sendSmsNotification,
  updateInventoryCount,
} from "./consumers.ts";
import type { Order } from "./types.ts";

export interface OrderObserver {
  notify(order: Order): void;
}

export class EmailObserver implements OrderObserver {
  notify(order: Order): void {
    sendConfirmationEmail(order);
  }
}

export class SmsObserver implements OrderObserver {
  notify(order: Order): void {
    sendSmsNotification(order);
  }
}

export class InventoryObserver implements OrderObserver {
  notify(order: Order): void {
    updateInventoryCount(order);
  }
}

export class AnalyticsObserver implements OrderObserver {
  notify(order: Order): void {
    recordAnalyticsEvent(order);
  }
}
