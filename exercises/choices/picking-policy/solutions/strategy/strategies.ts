import type { Order, PickInstruction } from "./types.ts";

export type RoutingStrategy = (
  queue: readonly Order[],
  batchOrderIds: ReadonlySet<string> | undefined,
) => PickInstruction;

function oldest(orders: readonly Order[]): Order {
  return [...orders].sort((a, b) => a.queuedAt - b.queuedAt)[0]!;
}

const individual: RoutingStrategy = (queue) => {
  const target = oldest(queue);
  return { mode: "individual", binId: target.binId, orderIds: [target.id] };
};

const batch: RoutingStrategy = (queue, batchOrderIds) => {
  const surviving = queue.filter((order) => batchOrderIds!.has(order.id));
  const target = oldest(surviving);
  const matching = surviving.filter((order) => order.binId === target.binId);
  return { mode: "batch", binId: target.binId, orderIds: matching.map((order) => order.id) };
};

export const strategies: Record<"individual" | "batch", RoutingStrategy> = { individual, batch };
