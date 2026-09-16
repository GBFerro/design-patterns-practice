import { CompositeRouteNode } from "./composite-node.ts";
import type { RouteNode } from "./route-node.ts";

export class Line extends CompositeRouteNode {
  constructor(
    public readonly name: string,
    children: readonly RouteNode[],
  ) {
    super(children);
  }
}
