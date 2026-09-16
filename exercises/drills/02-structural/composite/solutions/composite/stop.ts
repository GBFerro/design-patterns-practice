import type { RouteNode } from "./route-node.ts";

/** Leaf: a stop's only contribution is the time a vehicle dwells there. */
export class Stop implements RouteNode {
  constructor(
    public readonly name: string,
    public readonly dwellMinutes: number,
  ) {}

  totalMinutes(): number {
    return this.dwellMinutes;
  }
}
