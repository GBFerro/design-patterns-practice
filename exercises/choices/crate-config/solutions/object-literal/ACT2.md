# Act 2 — the measured part

Every number here comes from `./dp trade crate-config`, which applies the two patches in
`../../patches/` to an isolated copy and counts the diff.

## What act 2 asked for

An `insulated` flag, optional and defaulting to `false`, on both `buildExportCrate` and
`buildDomesticCrate`. An insulated crate's `maxLoadKg` may not exceed 800kg, wood or plastic
alike - an uninsulated crate is unaffected by that cap however high `maxLoadKg` goes.

## What it cost on this route

`patches/solution-act2.patch`

```
+0 new files   ·   2 existing files modified   ·   14 lines touched   ·   6 hunks
```

`types.ts` gains the `insulated: boolean` field (one hunk). `crate-spec.ts` gains the
`INSULATED_MAX_LOAD_KG` constant, an `insulated` parameter on `assembleCrate`, the cap check,
the field in the return literal, and an `insulated = false` parameter threaded through both
entry points - five hunks, none of them touching `FASTENER_BY_MATERIAL`.

## What it would have cost without the pattern

`patches/baseline-act2.patch` - the same requirement, on the act-1 `src/`:

```
+0 new files   ·   2 existing files modified   ·   15 lines touched   ·   6 hunks
```

One line more than this route: `src/` has no shared `assembleCrate`, so the same cap check and
the same `insulated = false` parameter are written twice, once per function, instead of once.
Same file count, same hunk count - the duplication costs exactly one extra line, not an extra
place to look.

## What the other candidate tied

Neither Builder's patch nor Abstract Factory's patch ships under the name `./dp trade` looks
for - only one solution can be `absorbsAct2`. Abstract Factory's is kept as
`abstract-factory-act2.patch`, and it is identical to this one, hunk for hunk and line for
line:

```
abstract-factory   +0 new files · 2 existing files modified · 14 lines touched · 6 hunks
builder             +0 new files · 3 existing files modified · 19 lines touched · 8 hunks
```

See [`solutions/abstract-factory/ACT2.md`](../abstract-factory/ACT2.md) for why: once the
family axis has nothing to do with the change, its `assembleCrate(family, ...)` and this
route's `assembleCrate(material, ...)` make the exact same edit. See
[`solutions/builder/ACT2.md`](../builder/ACT2.md) for the one route that paid more - and why.

## What this route made worse

- **Nothing changed here that wasn't already going to change in `assembleCrate` regardless of
  which candidate won** - which is exactly the finding: this act 2 doesn't reward any of the
  three candidates' structure, it's indifferent to all of it except Builder's extra ceremony.
