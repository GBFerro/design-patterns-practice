import type { Carton, Item, PackageNode } from "./types.ts";

/** One named operation over the tree, one method per node kind. */
interface PackageVisitor<T> {
  visitItem(item: Item): T;
  visitCarton(carton: Carton, childResults: readonly T[]): T;
}

function walk<T>(node: PackageNode, visitor: PackageVisitor<T>): T {
  if (node.kind === "item") {
    return visitor.visitItem(node);
  }
  return visitor.visitCarton(
    node,
    node.children.map((child) => walk(child, visitor)),
  );
}

const sum = (values: readonly number[]): number =>
  values.reduce((total, value) => total + value, 0);

const weightVisitor: PackageVisitor<number> = {
  visitItem: (item) => item.weightKg,
  visitCarton: (_carton, childResults) => sum(childResults),
};

const volumeVisitor: PackageVisitor<number> = {
  visitItem: (item) => item.volumeM3,
  visitCarton: (_carton, childResults) => sum(childResults),
};

export function totalWeight(node: PackageNode): number {
  return walk(node, weightVisitor);
}

export function totalVolume(node: PackageNode): number {
  return walk(node, volumeVisitor);
}
