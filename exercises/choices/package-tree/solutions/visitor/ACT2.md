# Act 2 — the measured part

Every number here comes from `./dp trade package-tree`, which applies the two patches in
`../../patches/` to an isolated copy and counts the diff (the same two files `./dp trade`
reads).

```
+0 new files   ·   3 existing files modified   ·   34 lines touched   ·   5 hunks
```

Between [`plain-recursion`](../plain-recursion/ACT2.md)'s 44 lines/3 hunks and
[`composite`](../composite/ACT2.md)'s 50 lines/6 hunks - fewer total lines than either, but
more hunks than the winner. `types.ts` gains the `Pallet` interface (one hunk); `totals.ts`
gains `visitPallet` on the interface, a new branch in `walk()`, and a `visitPallet`
implementation on each of `weightVisitor` and `volumeVisitor`, plus the entirely new
`itemCountVisitor` object (four separate hunks, since the three visitor objects sit apart in
the file); `index.ts` gains one export line.

## What this route made worse

- **Two of the three `visitPallet` implementations are nearly identical**
  (`volumeVisitor`'s and `itemCountVisitor`'s both just sum the children and ignore the tare) -
  nothing shares that logic, because each visitor object is a self-contained answer to "how do
  I combine a pallet's children," independent of its siblings.
- **A fourth node kind would mean a fourth interface method**, implemented in every visitor
  that already exists by then - the interface only grows, same as Composite from the other
  direction.
