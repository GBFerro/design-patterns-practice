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

`patches/template-method-act2.patch` (kept for reproducibility; not one of the two files
`./dp trade` reads)

```
+0 new files   ·   1 existing file modified   ·   23 lines touched   ·   3 hunks
```

Ties [`pipeline`](../pipeline/ACT2.md) on lines and beats it on file count (1, against
pipeline's 2) - but needs one more hunk, and all three hunks land in `label-template.ts`, the
one file this pattern's whole premise says should be the most stable: the skeleton
(`sections()`) gains a new `beforeWeight()` call, the base class gains the hook's default
(empty) implementation, `DomesticLabel` gains its first-ever override, and
`InternationalLabel`'s `extras` grows a second condition.

## What this route made worse

- **The skeleton itself had to change.** Every other edit in every other candidate touched
  something built to be extended - a new decorator, a new stage, a new array entry. This is
  the one route where act 2 reached into the class explicitly designed not to need it.
- **`DomesticLabel`, empty since act 1, is no longer empty** - a reader who remembers "the
  domestic case needs nothing extra" from act 1 has to update that memory, where
  [`pipeline`](../pipeline/ACT2.md)'s equivalent (an `if` that pushes a stage) never asked the
  reader to hold that belief in the first place.
