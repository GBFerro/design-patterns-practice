# Act 2 — the measured part

Every number here comes from `./dp trade surcharge-rules`, which applies the two patches in
`../../patches/` to an isolated copy and counts the diff.

## What act 2 asked for

A hazmat surcharge, `hazmatCents`, of `3000` when a shipment's `remoteAreaCents` and
`oversizeCents` are both greater than zero - and `0` otherwise. It never applies on its own,
and every existing surcharge is unchanged.

## What it cost on this route

`patches/lookup-table-act2.patch` (not the one that ships as `patches/solution-act2.patch` -
see below)

```
+0 new files   ·   3 existing files modified   ·   14 lines touched   ·   3 hunks
```

`types.ts` gains `hazmatCents` (one hunk). `surcharges.ts` gains the `hazmat` entry, re-deriving
both conditions from the shipment (one hunk). `quote.ts` gains a `hazmatCents` line and folds it
into `totalCents` in `quoteSurcharges` (one hunk) - `totalSurchargeCents` needs no change, since
it already sums `Object.values(SURCHARGE_TABLE)` generically.

## What it would have cost without the pattern

`patches/baseline-act2.patch` - the same requirement, on the act-1 `src/`:

```
+0 new files   ·   2 existing files modified   ·   10 lines touched   ·   3 hunks
```

Same hunk count, fewer lines and one fewer file: `src/`'s two functions each needed the same
four-line addition, duplicated once per function, but never touched a third file the way this
route's separate `surcharges.ts` does.

## What the winning route cost

`patches/solution-act2.patch` is `rules-list`'s patch - see
[`solutions/rules-list/ACT2.md`](../rules-list/ACT2.md) for the winning numbers (3 files, 8
lines, 4 hunks) and [`solutions/strategy/ACT2.md`](../strategy/ACT2.md) for the most expensive
route.

## What this route made worse

- **The `hazmat` entry duplicates logic `remoteArea` and `oversize` already have**, instead of
  reading their computed amounts - cheaper than Strategy's version of the same duplication, but
  the same underlying risk.
- **Fewer lines than Strategy, but no fewer maintenance hazards** - a `Record` of isolated
  functions is exactly as blind to sibling results as a list of isolated classes, just with
  less syntax around the blindness.
