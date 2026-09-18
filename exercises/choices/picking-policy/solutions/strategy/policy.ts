import { strategies } from "./strategies.ts";
import type { Order, PickInstruction } from "./types.ts";

const BATCH_THRESHOLD = 3;

export class PickingPolicy {
  private mode: "individual" | "batch" = "individual";
  private batchOrderIds: Set<string> | undefined;

  planNextPick(queue: readonly Order[]): PickInstruction {
    if (queue.length === 0) throw new Error("no orders queued");

    // The strategies are stateless functions - none of them can own "we already
    // started a batch, keep going even if the queue thins out." That guard has
    // to live somewhere, and this wrapper is the only place left for it.
    if (this.mode === "individual" && queue.length >= BATCH_THRESHOLD) {
      this.mode = "batch";
      this.batchOrderIds = new Set(queue.map((order) => order.id));
    }

    return strategies[this.mode](queue, this.batchOrderIds);
  }

  recordPicked(orderId: string): void {
    this.batchOrderIds?.delete(orderId);
    if (this.mode === "batch" && this.batchOrderIds?.size === 0) {
      this.mode = "individual";
      this.batchOrderIds = undefined;
    }
  }

  currentMode(): "individual" | "batch" {
    return this.mode;
  }
}
