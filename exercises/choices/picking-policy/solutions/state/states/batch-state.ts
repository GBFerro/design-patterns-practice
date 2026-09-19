import type { Order } from "../types.ts";
import { IndividualState } from "./individual-state.ts";
import { oldest, type PlanResult, type PolicyState } from "./policy-state.ts";

export class BatchState implements PolicyState {
  readonly name = "batch" as const;

  constructor(private readonly orderIds: Set<string>) {}

  plan(queue: readonly Order[]): PlanResult {
    const surviving = queue.filter((order) => this.orderIds.has(order.id));
    const target = oldest(surviving);
    const matching = surviving.filter((order) => order.binId === target.binId);
    return {
      instruction: {
        mode: "batch",
        binId: target.binId,
        orderIds: matching.map((order) => order.id),
      },
      next: this,
    };
  }

  recordPicked(orderId: string): PolicyState {
    this.orderIds.delete(orderId);
    return this.orderIds.size === 0 ? new IndividualState() : this;
  }
}
