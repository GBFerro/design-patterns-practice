import type { Order, PickInstruction } from "../types.ts";

export interface PlanResult {
  readonly instruction: PickInstruction;
  readonly next: PolicyState;
}

export interface PolicyState {
  readonly name: "individual" | "batch";
  plan(queue: readonly Order[]): PlanResult;
  recordPicked(orderId: string): PolicyState;
}

export function oldest(orders: readonly Order[]): Order {
  return [...orders].sort((a, b) => a.queuedAt - b.queuedAt)[0]!;
}
