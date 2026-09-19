import { BatchRound, IndividualRound } from "./rounds.ts";
import type { Order, PickInstruction } from "./types.ts";

const BATCH_THRESHOLD = 3;

export class PickingPolicy {
  private mode: "individual" | "batch" = "individual";
  private batchOrderIds: Set<string> | undefined;

  planNextPick(queue: readonly Order[]): PickInstruction {
    if (queue.length === 0) throw new Error("no orders queued");

    // A round only knows how to compute ONE instruction; it doesn't decide when
    // to become a different round, or remember that a batch is already running.
    // That bookkeeping still has to live here, same as it would without any
    // round classes at all.
    if (this.mode === "individual" && queue.length >= BATCH_THRESHOLD) {
      this.mode = "batch";
      this.batchOrderIds = new Set(queue.map((order) => order.id));
    }

    const round =
      this.mode === "individual"
        ? new IndividualRound()
        : new BatchRound(this.batchOrderIds!);
    return round.pick(queue);
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
