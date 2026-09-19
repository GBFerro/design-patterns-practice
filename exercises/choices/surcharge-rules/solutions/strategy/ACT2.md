# Act 2 — the measured part

Every number here comes from `./dp trade surcharge-rules`, which applies the two patches in
`../../patches/` to an isolated copy and counts the diff.

## What act 2 asked for

A hazmat surcharge, `hazmatCents`, of `3000` when a shipment's `remoteAreaCents` and
`oversizeCents` are both greater than zero - and `0` otherwise. It never applies on its own,
and every existing surcharge is unchanged.

## What it cost on this route

`patches/strategy-act2.patch` (not the one that ships as `patches/solution-act2.patch` - see
below)

```
+0 new files   ·   3 existing files modified   ·   16 lines touched   ·   4 hunks
```

`types.ts` gains `hazmatCents` (one hunk). `surcharges.ts` gains the widened `id` union and a
whole new `HazmatSurcharge` class - re-deriving both conditions from the shipment, since no
strategy can read another's result - and a new entry in `SURCHARGES` (two hunks). `quote.ts`
gains one line in `quoteSurcharges`'s return literal (one hunk).

## What it would have cost without the pattern

`patches/baseline-act2.patch` - the same requirement, on the act-1 `src/`:

```
+0 new files   ·   2 existing files modified   ·   10 lines touched   ·   3 hunks
```

Fewer files, fewer lines and fewer hunks than this route: `src/`'s two functions each needed
the same small, local addition, duplicated once per function, without a fourth class or a
widened union to keep in sync.

## What the winning route cost

`patches/solution-act2.patch` is `rules-list`'s patch - see
[`solutions/rules-list/ACT2.md`](../rules-list/ACT2.md) for the winning numbers (3 files, 8
lines, 4 hunks) and [`solutions/lookup-table/ACT2.md`](../lookup-table/ACT2.md) for the middle
result.

## What this route made worse

- **The most expensive route on every dimension, including the no-pattern baseline.**
  Strategy's isolation is a real act-1 strength that simply had nothing to offer an act 2 built
  specifically around surcharges seeing each other.
- **A fourth class exists to answer one re-derived boolean** - real structure, spent on
  duplicating logic two other classes already have.
