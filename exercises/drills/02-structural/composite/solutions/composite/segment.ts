import type { RouteNode } from "./route-node.ts";

/** Leaf: a single hop's only contribution is its own travel time. */
export class Segment implements RouteNode {
  constructor(public readonly travelMinutes: number) {}

  totalMinutes(): number {
    return this.travelMinutes;
  }
}
