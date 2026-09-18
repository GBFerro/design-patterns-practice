import { OrderEventsMediator } from "./order-events-mediator.ts";
import type { Order } from "./types.ts";

const mediator = new OrderEventsMediator();

export function orderShipped(order: Order): void {
  mediator.dispatch(order);
}

export function resendOrderNotifications(order: Order): void {
  mediator.dispatch(order);
}
