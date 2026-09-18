import type { Order, PickInstruction } from "./types.ts";

function oldest(orders: readonly Order[]): Order {
  return [...orders].sort((a, b) => a.queuedAt - b.queuedAt)[0]!;
}

/**
 * The skeleton: pick a candidate pool, then group it around the oldest member.
 * What varies between rounds is only how the candidate pool is selected -
 * grouping is identical either way, which is the first sign this algorithm
 * doesn't have much shape for subclasses to specialise.
 */
export abstract class PickingRound {
  protected abstract readonly mode: "individual" | "batch";

  pick(queue: readonly Order[]): PickInstruction {
    const candidates = this.selectCandidates(queue);
    const target = oldest(candidates);
    const matching = this.mode === "batch" ? candidates.filter((order) => order.binId === target.binId) : [target];
    return { mode: this.mode, binId: target.binId, orderIds: matching.map((order) => order.id) };
  }

  protected abstract selectCandidates(queue: readonly Order[]): readonly Order[];
}

export class IndividualRound extends PickingRound {
  protected readonly mode = "individual" as const;

  protected selectCandidates(queue: readonly Order[]): readonly Order[] {
    return queue;
  }
}

export class BatchRound extends PickingRound {
  protected readonly mode = "batch" as const;

  constructor(private readonly orderIds: ReadonlySet<string>) {
    super();
  }

  protected selectCandidates(queue: readonly Order[]): readonly Order[] {
    return queue.filter((order) => this.orderIds.has(order.id));
  }
}
