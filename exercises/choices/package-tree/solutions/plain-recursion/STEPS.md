# Steps — a plain recursive fold

1. `reduceTree<T>`: one generic function - a value for a leaf item (`fromItem`), and a way to
   combine a carton's children (`combine`) - called with itself recursively.
2. `sum`: one small helper, `(values) => values.reduce((total, value) => total + value, 0)`,
   used as `combine` by both totals below.
3. `totalWeight(node)`: `reduceTree(node, (item) => item.weightKg, sum)`.
4. `totalVolume(node)`: `reduceTree(node, (item) => item.volumeM3, sum)`.
5. No object, no interface, no class - two closures per call site, and one function that
   recurses on their behalf.
