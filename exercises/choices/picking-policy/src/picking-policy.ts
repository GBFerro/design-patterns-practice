import type { Order, PickInstruction } from "./types.ts";

const BATCH_THRESHOLD = 3;

let mode: "individual" | "batch" = "individual";
let batchOrderIds = new Set<string>();

function oldest(orders: readonly Order[]): Order {
  return [...orders].sort((a, b) => a.queuedAt - b.queuedAt)[0]!;
}

export function planNextPick(queue: readonly Order[]): PickInstruction {
  if (queue.length === 0) throw new Error("no orders queued");

  // Entering batch mode snapshots which orders belong to this batch. Anything
  // that arrives after this point waits for the next one - re-checking
  // `queue.length` on every call would let a late arrival join a batch that
  // has already started, or would flip back to individual mode the instant
  // the queue dips below the threshold mid-batch.
  if (mode === "individual" && queue.length >= BATCH_THRESHOLD) {
    mode = "batch";
    batchOrderIds = new Set(queue.map((order) => order.id));
  }

  if (mode === "individual") {
    const target = oldest(queue);
    return { mode: "individual", binId: target.binId, orderIds: [target.id] };
  }

  const surviving = queue.filter((order) => batchOrderIds.has(order.id));
  const target = oldest(surviving);
  const matching = surviving.filter((order) => order.binId === target.binId);
  return {
    mode: "batch",
    binId: target.binId,
    orderIds: matching.map((order) => order.id),
  };
}

export function recordPicked(orderId: string): void {
  batchOrderIds.delete(orderId);
  if (mode === "batch" && batchOrderIds.size === 0) mode = "individual";
}

export function currentMode(): "individual" | "batch" {
  return mode;
}

/** Test-only seam: the policy's state is module-level, so tests need a way back to zero. */
export function resetPickingPolicy(): void {
  mode = "individual";
  batchOrderIds = new Set();
}
