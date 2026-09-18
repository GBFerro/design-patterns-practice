import { IndividualState } from "./states/individual-state.ts";
import type { PolicyState } from "./states/policy-state.ts";
import type { Order, PickInstruction } from "./types.ts";

export class PickingPolicy {
  private state: PolicyState = new IndividualState();

  planNextPick(queue: readonly Order[]): PickInstruction {
    if (queue.length === 0) throw new Error("no orders queued");
    const { instruction, next } = this.state.plan(queue);
    this.state = next;
    return instruction;
  }

  recordPicked(orderId: string): void {
    this.state = this.state.recordPicked(orderId);
  }

  currentMode(): PolicyState["name"] {
    return this.state.name;
  }
}
