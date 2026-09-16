import type { RouteNode } from "./route-node.ts";

/** The client never checks what kind of node it has - every RouteNode
 *  already knows how to total itself. */
export function totalMinutes(node: RouteNode): number {
  return node.totalMinutes();
}
