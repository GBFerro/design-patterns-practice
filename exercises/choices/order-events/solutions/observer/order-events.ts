import {
  AnalyticsObserver,
  EmailObserver,
  InventoryObserver,
  SmsObserver,
} from "./observers.ts";
import { OrderShippedSubject } from "./subject.ts";
import type { Order } from "./types.ts";

const subject = new OrderShippedSubject();
subject.subscribe(new InventoryObserver());
subject.subscribe(new AnalyticsObserver());
subject.subscribe(new EmailObserver());
subject.subscribe(new SmsObserver());

export function orderShipped(order: Order): void {
  subject.notifyAll(order);
}

export function resendOrderNotifications(order: Order): void {
  subject.notifyAll(order);
}
