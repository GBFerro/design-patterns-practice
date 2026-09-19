# Act 2 — the measured part

Every number here comes from `./dp trade package-tree`, which applies the two patches in
`../../patches/` to an isolated copy and counts the diff.

## What act 2 asked for

A new node kind, `Pallet` - its own `tareWeightKg`, added to `totalWeight` on top of its
children's weight, but adding nothing of its own to `totalVolume`. And a new traversal,
`totalItemCount`, counting every `Item` leaf, however deep, with cartons and pallets
contributing nothing of their own. Every existing `Item`/`Carton` behaviour, including trees
with no pallet in them, stays exactly as act 1 left it.

## What it cost on this route

`patches/solution-act2.patch`

```
+0 new files   ·   3 existing files modified   ·   44 lines touched   ·   3 hunks
```

`types.ts` gains the `Pallet` interface; `totals.ts` changes in one contiguous edit -
`reduceTree` grows a third callback (`combinePallet`), and all three totals (including the new
`totalItemCount`) supply one; `index.ts` gains one export line. Every line of the real change
lands in `totals.ts`, as a single hunk - `reduceTree`'s signature and every call site that
uses it change together, because none of them can change independently of the others.

## What it would have cost without the pattern

`patches/baseline-act2.patch` — the same requirement, on the act-1 `src/`:

```
+0 new files   ·   3 existing files modified   ·   26 lines touched   ·   4 hunks
```

Fewer lines than this route - `src/`'s three functions each only needed their own small,
local change, without a shared signature to keep in sync - but one more hunk, because those
three functions sit far enough apart in `totals.ts` (with `totalVolume`, untouched, sitting
between the two that did change) that git can't merge the edits into one contiguous block the
way this route's single-signature change does.

## What the other two candidates cost

Neither of these patches ships in `patches/` under the name `./dp trade` looks for - only one
solution can be `absorbsAct2`. They're measured the same way, kept as `composite-act2.patch`
and `visitor-act2.patch` for anyone who wants to reproduce the numbers:

```
composite   +0 new files · 3 existing files modified · 50 lines touched · 6 hunks
visitor     +0 new files · 3 existing files modified · 34 lines touched · 5 hunks
```

Composite is the most expensive of all four measured routes on every dimension but file
count: a new node kind (one class) and a new operation (one method on every class, the new one
included) both had to happen at once, and `PalletNode` alone accounts for more than half the
new lines. Visitor is cheaper than Composite - a new operation is still just one new visitor
object - but the new node kind means a new method on the visitor interface *and* on every
existing visitor, which is where most of its five hunks go. See
[`solutions/composite/ACT2.md`](../composite/ACT2.md) and
[`solutions/visitor/ACT2.md`](../visitor/ACT2.md) for the detail.

## What this route made worse

- **`reduceTree`'s signature is now three callbacks long**, and every call site has to supply
  all three even when two of them are near-identical one-liners (`totalVolume` and
  `totalItemCount`'s pallet callbacks both just ignore the pallet and sum its children). A
  fourth node kind with its own special case would mean a fourth callback, at every call site,
  again.
- **Nothing groups "the three callbacks that make up one total" as a named thing.** Composite
  and Visitor both give a total's definition a place to live (a set of methods, a visitor
  object); this route's three loose arguments have no such home.
