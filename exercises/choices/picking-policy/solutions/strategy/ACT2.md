# Act 2 — the measured part

This route does not absorb act 2 within `./dp trade`'s budget - only one
candidate can be `absorbsAct2: true`, and [`state`](../state/ACT2.md) is
it. This file reports what act 2 cost here anyway, measured the same way,
because a choice you didn't pick is still worth knowing the price of.

## What act 2 asked for

A third mode, `surge`, that only triggers from `batch` mode when three or
more orders outside the current batch pile up - and that falls back to
`batch` (never straight to `individual`) once it clears.

## What it cost on this route

`patches/strategy-act2.patch` (kept for reproducibility; not one of the two
files `./dp trade` reads)

```
+0 new files   ·   3 existing files modified   ·   58 lines touched   ·   5 hunks
```

Worse than [`state`](../state/ACT2.md)'s 12 lines on every dimension
except file count, and worse than the no-pattern baseline's 31 lines too.
`strategies.ts` gains a `surge` entry - cheap, three lines, because it
reuses `batch`'s own grouping function. The expensive edit is
`policy.ts`: **both of `PickingPolicy`'s methods grow a second mode check**,
because `individual` and `batch` were never anything more than pure
functions - neither one could own "remember which orders are in the
current batch," let alone "and now also remember which orders are
surging, and which suspended batch to resume." That memory was always
going to live in the wrapper. Act 1 hid this, because two modes fit in one
`if`/`else` without looking crowded. Three modes don't.

## What this route made worse

- **The wrapper class is now the single most complex file in any of the
  three candidates.** `PickingPolicy.planNextPick` reads two escalation
  checks in a row, and `recordPicked` branches on `this.mode` before it can
  do anything. The strategies themselves stayed almost unchanged - all the
  growth landed in exactly the place this candidate's own `STEPS.md`
  predicted it would.
- **The strategies' own simplicity turned out not to matter.** `individual`
  and `batch` are still one line of real logic each - but that was never
  where act 2's cost was going to land, and having small strategy
  functions bought nothing against a requirement about *when* a mode
  changes rather than *what* a mode computes.
