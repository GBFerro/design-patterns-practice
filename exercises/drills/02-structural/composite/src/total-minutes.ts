import { Journey, Line, Segment, Stop, type RouteNode } from "./types.ts";

/** Every node kind, totalled by hand - Line and Journey each get their
 *  own branch here, and both do the exact same reduce, because nothing
 *  lets them share that logic. */
export function totalMinutes(node: RouteNode): number {
  if (node instanceof Stop) return node.dwellMinutes;
  if (node instanceof Segment) return node.travelMinutes;
  if (node instanceof Line) return node.children.reduce((sum, child) => sum + totalMinutes(child), 0);
  if (node instanceof Journey) return node.children.reduce((sum, child) => sum + totalMinutes(child), 0);
  throw new Error("unknown route node");
}
