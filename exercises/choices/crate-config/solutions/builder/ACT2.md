# Act 2 — the measured part

Every number here comes from `./dp trade crate-config`, which applies the two patches in
`../../patches/` to an isolated copy and counts the diff.

## What act 2 asked for

An `insulated` flag, optional and defaulting to `false`, on both `buildExportCrate` and
`buildDomesticCrate`. An insulated crate's `maxLoadKg` may not exceed 800kg, wood or plastic
alike - an uninsulated crate is unaffected by that cap however high `maxLoadKg` goes.

## What it cost on this route

`patches/builder-act2.patch` (not the one that ships as `patches/solution-act2.patch` - see
below)

```
+0 new files   ·   3 existing files modified   ·   19 lines touched   ·   8 hunks
```

`types.ts` gains the `insulated: boolean` field (one hunk). `crate-spec-builder.ts` gains a
private `insulatedValue` field, a `.insulated()` method, a line in `.build()`'s destructuring,
a new validation check, and a line in the return literal - five separate hunks, since the
class's parts sit apart in the file. `crate-spec.ts` gains an `insulated = false` parameter on
each of the two entry points *and* a new `.insulated(insulated)` link in each fluent chain -
two hunks, one per function.

## What it would have cost without the pattern

`patches/baseline-act2.patch` - the same requirement, on the act-1 `src/`:

```
+0 new files   ·   2 existing files modified   ·   15 lines touched   ·   6 hunks
```

Fewer files, fewer lines and fewer hunks than this route, on every dimension - `src/`'s two
functions each needed the same four-line addition (a parameter, a validation check, a field in
the return), duplicated once per function, but never touched a third file the way this route's
builder class does.

## What the winning route cost

`patches/solution-act2.patch` is `object-literal`'s patch - see
[`solutions/object-literal/ACT2.md`](../object-literal/ACT2.md) for the winning numbers
(2 files, 14 lines, 6 hunks) and
[`solutions/abstract-factory/ACT2.md`](../abstract-factory/ACT2.md) for the tie.

## What this route made worse

- **The new field touched the most files and the most hunks of any route, including the
  no-pattern baseline.** Builder's ceremony - a private slot, a fluent method, three separate
  edits inside `.build()` - paid for itself nowhere in this particular change.
- **Both call sites needed a new line, not just an edited one.** `.insulated(insulated)` is a
  whole new link in each chain; the other two candidates only needed to pass one more argument
  to a call that was already there.
