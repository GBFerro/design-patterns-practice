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

`patches/template-method-act2.patch` (kept for reproducibility; not one of
the two files `./dp trade` reads)

```
+0 new files   ·   2 existing files modified   ·   39 lines touched   ·   3 hunks
```

Worse than [`state`](../state/ACT2.md)'s 12 lines, and worse than the
no-pattern baseline's 31 lines too - despite touching the same number of
files as the baseline. `rounds.ts` **did not change at all.** Surge turned
out to be `BatchRound`, pointed at a different id set, with `urgent: true`
stapled onto its result from the outside - it didn't earn a subclass of
its own, because the thing that varies between "compute a batch
instruction" and "compute a surge instruction" isn't a step in the
skeleton, it's which set of orders the caller currently cares about.  That
question belongs to `PickingPolicy`, and `policy.ts` alone carries the
entire cost: both of its methods gain a second mode check, exactly the
same shape [`strategy`](../strategy/ACT2.md)'s wrapper did.

## What this route made worse

- **The round classes turned out to be decoration.** They look like
  `State`'s per-mode classes - one file, one class per mode - which is
  exactly the resemblance this exercise's `README.en.md` hints is worth
  questioning before you commit to `--because`. But a round only answers
  "given this pool of orders, what's the instruction?" - it never answers
  "should we be looking at a different pool right now?" That second
  question is what act 2 is actually about, and no round can answer it.
- **The skeleton itself bought nothing here.** `pick()`'s shared shape -
  select candidates, then group around the oldest - was never the hard
  part; the hard part was deciding *when* to select from which pool, and
  Template Method has no slot for that.
