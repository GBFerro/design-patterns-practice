import type { Item, PackageNode } from "./types.ts";

/**
 * One generic fold over the tree: a value from every item, and a way to combine a
 * carton's children into one value. No object, no interface - two functions, passed in.
 */
function reduceTree<T>(
  node: PackageNode,
  fromItem: (item: Item) => T,
  combine: (childValues: readonly T[]) => T,
): T {
  if (node.kind === "item") {
    return fromItem(node);
  }
  return combine(node.children.map((child) => reduceTree(child, fromItem, combine)));
}

const sum = (values: readonly number[]): number => values.reduce((total, value) => total + value, 0);

export function totalWeight(node: PackageNode): number {
  return reduceTree(node, (item) => item.weightKg, sum);
}

export function totalVolume(node: PackageNode): number {
  return reduceTree(node, (item) => item.volumeM3, sum);
}
