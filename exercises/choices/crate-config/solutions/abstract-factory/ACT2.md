# Act 2 — the measured part

Every number here comes from `./dp trade crate-config`, which applies the two patches in
`../../patches/` to an isolated copy and counts the diff.

## What act 2 asked for

An `insulated` flag, optional and defaulting to `false`, on both `buildExportCrate` and
`buildDomesticCrate`. An insulated crate's `maxLoadKg` may not exceed 800kg, wood or plastic
alike - an uninsulated crate is unaffected by that cap however high `maxLoadKg` goes.

## What it cost on this route

`patches/abstract-factory-act2.patch` (not the one that ships as
`patches/solution-act2.patch` - see below)

```
+0 new files   ·   2 existing files modified   ·   14 lines touched   ·   6 hunks
```

`types.ts` gains the `insulated: boolean` field (one hunk). `crate-spec.ts` gains the
`INSULATED_MAX_LOAD_KG` constant, an `insulated` parameter on `assembleCrate`, the cap check,
the field in the return literal, and an `insulated = false` parameter threaded through both
entry points - five hunks. `crate-family.ts` is untouched: neither `WoodCrateFamily` nor
`PlasticCrateFamily` has anything to say about insulation.

## What it would have cost without the pattern

`patches/baseline-act2.patch` - the same requirement, on the act-1 `src/`:

```
+0 new files   ·   2 existing files modified   ·   15 lines touched   ·   6 hunks
```

One line more than this route: `src/` has no shared `assembleCrate`, so the same cap check and
the same `insulated = false` parameter are written twice, once per function, instead of once.

## What the winning route cost, and why this one tied it

`patches/solution-act2.patch` is `object-literal`'s patch - see
[`solutions/object-literal/ACT2.md`](../object-literal/ACT2.md). Its numbers are identical to
this route's, hunk for hunk and line for line: `2 existing files modified · 14 lines touched ·
6 hunks`. That's not a rounding coincidence - once the family axis has nothing to do with
act 2's rule, this route's `assembleCrate(family, ...)` and object-literal's
`assembleCrate(material, ...)` end up making the exact same edit, in the exact same shape,
because the family object was never in the way of the change to begin with. See
[`solutions/builder/ACT2.md`](../builder/ACT2.md) for the one route that measured differently
(and worse) than both.

## What this route made worse

- **The family classes existed for act 1's mismatch-prevention guarantee, and had nothing to
  offer act 2.** That's not a bug in the pattern - it's exactly what
  `docs/TYPESCRIPT.md` predicts for a change that doesn't vary along the family axis.
- **A reader has to check both `crate-family.ts` and `crate-spec.ts` to be sure the family
  classes really are irrelevant here** - the tie is only visible once you've measured it, not
  from reading either file in isolation.
