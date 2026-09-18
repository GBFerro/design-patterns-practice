import { PickingPolicy } from "./policy.ts";
import type { Order, PickInstruction } from "./types.ts";

let policy = new PickingPolicy();

export function planNextPick(queue: readonly Order[]): PickInstruction {
  return policy.planNextPick(queue);
}

export function recordPicked(orderId: string): void {
  policy.recordPicked(orderId);
}

export function currentMode(): ReturnType<PickingPolicy["currentMode"]> {
  return policy.currentMode();
}

export function resetPickingPolicy(): void {
  policy = new PickingPolicy();
}
