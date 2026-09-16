import type { RouteNode } from "./route-node.ts";

/** Composite: any node built out of other nodes sums them the same way,
 *  written exactly once - regardless of what those children are. */
export abstract class CompositeRouteNode implements RouteNode {
  constructor(protected readonly children: readonly RouteNode[]) {}

  totalMinutes(): number {
    return this.children.reduce((sum, child) => sum + child.totalMinutes(), 0);
  }
}
