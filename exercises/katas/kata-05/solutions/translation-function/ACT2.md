# Act 2 — the measured part

Every number here comes from `./dp trade kata-05`, which applies the two patches in
`../../patches/` to an isolated copy and counts the diff.

## What act 2 asked for

A new legacy status code, `"P"`, maps to a new `InventoryStatus` value, `"pendingInspection"`.
A record with that status also reports `quantity: 0`, regardless of what the legacy file says.
Bin location and timestamp parsing are unaffected.

## What it cost on this route

`patches/translation-function-act2.patch`, which is what ships as `patches/solution-act2.patch`:

```
+0 new files   ·   2 existing files modified   ·   6 lines touched   ·   3 hunks
```

One new `else if` branch in `toInventoryRecord`, one changed line in the same function's return
statement, and one line in `types.ts` widening `InventoryStatus` - the only place any of this
had to be written.

## What it would have cost without any restructuring

`patches/baseline-act2.patch` - the same requirement, on the act-1 `src/`:

```
+0 new files   ·   2 existing files modified   ·   10 lines touched   ·   5 hunks
```

Both changes, written twice - once in `syncInventorySnapshot`, once in `applyChangeFeedEvent` -
because `src/` never pulled the translation into one place.

## What the other route cost

[`solutions/legacy-adapter/ACT2.md`](../legacy-adapter/ACT2.md) - 8 lines, 4 hunks. More than
this route on every dimension, though still less than the no-pattern baseline above - the
Adapter route wasn't wasted, it just wasn't the cheapest way to protect this particular change.

## What this route made worse

Nothing. This route's bet - that a legacy integration this narrow never needed more than a
function - is exactly what act 2 confirms.
