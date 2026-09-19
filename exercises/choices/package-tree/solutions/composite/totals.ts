import type { PackageNode as PackageNodeData } from "./types.ts";

/**
 * The tree crosses this exercise's frozen boundary as plain data (see types.ts) - a wire
 * shape, not an object graph. build() is where that data becomes a real composite: a graph
 * of objects, each one able to answer weight() and volume() on its own.
 */
interface CompositeNode {
  weight(): number;
  volume(): number;
}

class ItemNode implements CompositeNode {
  constructor(private readonly weightKg: number, private readonly volumeM3: number) {}

  weight(): number {
    return this.weightKg;
  }

  volume(): number {
    return this.volumeM3;
  }
}

class CartonNode implements CompositeNode {
  constructor(private readonly children: readonly CompositeNode[]) {}

  weight(): number {
    return this.children.reduce((sum, child) => sum + child.weight(), 0);
  }

  volume(): number {
    return this.children.reduce((sum, child) => sum + child.volume(), 0);
  }
}

function build(data: PackageNodeData): CompositeNode {
  if (data.kind === "item") {
    return new ItemNode(data.weightKg, data.volumeM3);
  }
  return new CartonNode(data.children.map(build));
}

export function totalWeight(node: PackageNodeData): number {
  return build(node).weight();
}

export function totalVolume(node: PackageNodeData): number {
  return build(node).volume();
}
