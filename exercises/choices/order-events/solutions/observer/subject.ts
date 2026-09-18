import type { OrderObserver } from "./observers.ts";
import type { Order } from "./types.ts";

/** Every consumer is an equal, independent subscriber - none knows the others exist. */
export class OrderShippedSubject {
  private readonly observers: OrderObserver[] = [];

  subscribe(observer: OrderObserver): void {
    this.observers.push(observer);
  }

  notifyAll(order: Order): void {
    for (const observer of this.observers) {
      observer.notify(order);
    }
  }
}
