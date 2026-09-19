# Act 2 — the measured part

Every number here comes from `./dp trade surcharge-rules`, which applies the two patches in
`../../patches/` to an isolated copy and counts the diff.

## What act 2 asked for

A hazmat surcharge, `hazmatCents`, of `3000` when a shipment's `remoteAreaCents` and
`oversizeCents` are both greater than zero - and `0` otherwise. It never applies on its own,
and every existing surcharge is unchanged.

## What it cost on this route

`patches/solution-act2.patch`

```
+0 new files   ·   3 existing files modified   ·   8 lines touched   ·   4 hunks
```

`types.ts` gains `hazmatCents` (one hunk). `surcharges.ts` gains the widened `id` union and one
new rule object reading `soFar.remoteArea`/`soFar.oversize` directly - no re-derivation, two
hunks since the union and the rules array sit apart in the file. `quote.ts` gains one line in
`quoteSurcharges`'s return literal (one hunk) - `totalSurchargeCents` needs no change, since
`applyRules` already returns every id generically.

## What it would have cost without the pattern

`patches/baseline-act2.patch` - the same requirement, on the act-1 `src/`:

```
+0 new files   ·   2 existing files modified   ·   10 lines touched   ·   3 hunks
```

Fewer lines than this route, and one fewer hunk: `src/`'s two functions each needed the same
small, local addition, duplicated once per function but landing as one contiguous edit per
function - three hunks total against this route's four, even though this route's real logic
(8 lines) is smaller than the baseline's duplicated 10.

## What the other two candidates cost

Neither Strategy's patch nor the lookup table's patch ships under the name `./dp trade` looks
for - only one solution can be `absorbsAct2`. They're measured the same way and kept as
`strategy-act2.patch` and `lookup-table-act2.patch`:

```
strategy        +0 new files · 3 existing files modified · 16 lines touched · 4 hunks
lookup-table    +0 new files · 3 existing files modified · 14 lines touched · 3 hunks
```

Both cost more lines than this route, because both have to re-derive
`destination === "remote"` and the oversize check from the raw shipment instead of reading
`remoteArea`/`oversize`'s already-computed amounts - this route's whole advantage is not
needing to do that. See [`solutions/strategy/ACT2.md`](../strategy/ACT2.md) and
[`solutions/lookup-table/ACT2.md`](../lookup-table/ACT2.md) for the detail.

## What this route made worse

- **Four hunks against the baseline's three** - the fewest-lines win doesn't translate into a
  fewest-hunks win, because this route's change is spread across the `id` union, the rules
  array and the return literal instead of landing inside two already-existing function bodies.
- **`soFar`'s loose `Record<string, number>` shape** means a rule reordered above its
  dependencies would silently read `undefined` (coerced to `0` by the `??` fallbacks) instead
  of failing to compile.
