# Act 2 — the measured part

Every number here comes from `./dp trade package-tree`, which applies the two patches in
`../../patches/` to an isolated copy and counts the diff (the same two files `./dp trade`
reads).

```
+0 new files   ·   3 existing files modified   ·   50 lines touched   ·   6 hunks
```

Worse than [`plain-recursion`](../plain-recursion/ACT2.md)'s 44 lines on every dimension, and
the most expensive of all four measured routes, including the no-pattern baseline. `types.ts`
gains the `Pallet` interface (one hunk); `totals.ts` gains `itemCount()` on the `CompositeNode`
interface, on `ItemNode`, on `CartonNode`, a whole new `PalletNode` class, and a new branch in
`build()` (five separate hunks, since each class sits apart from the others in the file);
`index.ts` gains one export line.

## What this route made worse

- **`PalletNode` duplicates `CartonNode`'s `volume()` and `itemCount()` logic exactly**,
  because nothing in this route shares behaviour between sibling classes - each one is a
  self-contained answer to "what is this kind of node," which is the same property that made
  act 1 easy to read and act 2 expensive to extend.
- **A fifth node kind would mean a fifth class, implementing a by-then four-method interface**
  - the interface only grows, and every class that existed before the fifth one arrived has to
  grow with it, whether or not the new method means anything for that class.
