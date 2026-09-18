import type { Order } from "../types.ts";
import { BatchState } from "./batch-state.ts";
import { oldest, type PlanResult, type PolicyState } from "./policy-state.ts";

const BATCH_THRESHOLD = 3;

export class IndividualState implements PolicyState {
  readonly name = "individual" as const;

  plan(queue: readonly Order[]): PlanResult {
    if (queue.length >= BATCH_THRESHOLD) {
      const batch = new BatchState(new Set(queue.map((order) => order.id)));
      return batch.plan(queue);
    }
    const target = oldest(queue);
    return {
      instruction: { mode: "individual", binId: target.binId, orderIds: [target.id] },
      next: this,
    };
  }

  recordPicked(_orderId: string): PolicyState {
    return this;
  }
}
