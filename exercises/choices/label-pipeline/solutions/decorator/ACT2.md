# Act 2 — the measured part

This route does not absorb act 2 within `./dp trade`'s budget - only one candidate can be
`absorbsAct2: true`, and [`pipeline`](../pipeline/ACT2.md) is it. This file reports what act 2
cost here anyway, measured the same way, because a choice you didn't pick is still worth
knowing the price of.

## What act 2 asked for

A new section - "SIGNATURE REQUIRED" - conditional on `weightKg > 20`, and positioned
differently by destination: right after the address, before the weight, for domestic
shipments; as the very last line, after customs, for international ones.

## What it cost on this route

`patches/decorator-act2.patch` (kept for reproducibility; not one of the two files
`./dp trade` reads)

```
+0 new files   ·   2 existing files modified   ·   41 lines touched   ·   4 hunks
```

Worse than [`pipeline`](../pipeline/ACT2.md)'s 23 lines on every dimension, and worse than
[`template-method`](../template-method/ACT2.md)'s 23, and worse than the no-pattern
baseline's 24. `renderer.ts` needed the base renderer split into `HeaderAddressRenderer` plus
a new `WeightDecorator`, and a new `SignatureRequiredDecorator` written from scratch.
`label-content.ts`'s `sections()` grew from one fixed chain into a branch building two
different chains, sharing a `withWarnings()` helper for the two decorators that didn't need
to move.

## What this route made worse

- **The base renderer had to be split for a reason unrelated to what it renders.**
  `HeaderAddressRenderer` and `WeightDecorator` together produce exactly what
  `BaseLabelRenderer` used to produce alone - splitting them bought nothing on its own, it
  only exists to give `SignatureRequiredDecorator` somewhere to land.
- **`sections()` now builds two chains instead of one**, sharing a helper for the parts that
  didn't change but still duplicating the overall shape of "wrap, wrap, wrap." A third
  destination category with its own positioning rule would mean a third branch, each one a
  near-copy of the other two.
