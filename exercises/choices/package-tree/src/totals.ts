import type { PackageNode } from "./types.ts";

export function totalWeight(node: PackageNode): number {
  if (node.kind === "item") {
    return node.weightKg;
  }
  return node.children.reduce((sum, child) => sum + totalWeight(child), 0);
}

export function totalVolume(node: PackageNode): number {
  if (node.kind === "item") {
    return node.volumeM3;
  }
  return node.children.reduce((sum, child) => sum + totalVolume(child), 0);
}
