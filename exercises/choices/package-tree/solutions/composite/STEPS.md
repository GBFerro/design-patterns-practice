# Steps — Composite

1. `CompositeNode`: one interface, `weight(): number` and `volume(): number`.
2. `ItemNode implements CompositeNode`: a leaf, holding its own `weightKg`/`volumeM3`.
3. `CartonNode implements CompositeNode`: holds a list of `CompositeNode` children, and both
   methods sum whatever the children answer.
4. `build(data)`: converts the tree's frozen wire shape (`types.ts`, plain data crossing the
   exercise boundary) into a real object graph of `ItemNode`/`CartonNode` instances.
5. `totalWeight(node)`/`totalVolume(node)`: `build(node).weight()` / `build(node).volume()` -
   one line each.
