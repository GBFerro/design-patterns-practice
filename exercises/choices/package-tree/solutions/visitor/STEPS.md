# Steps — Visitor

1. `PackageVisitor<T>`: one interface, `visitItem(item): T` and
   `visitCarton(carton, childResults): T`.
2. `walk<T>(node, visitor)`: the one dispatcher - calls `visitor.visitItem` on a leaf,
   `visitor.visitCarton` on a carton, passing the already-walked children's results.
3. `weightVisitor`/`volumeVisitor`: two plain objects satisfying `PackageVisitor<number>`,
   one per total.
4. `totalWeight(node)`/`totalVolume(node)`: `walk(node, weightVisitor)` /
   `walk(node, volumeVisitor)` - one line each.
