# Act 2 — the measured part

Every number here comes from `./dp trade kata-01`, which applies the two patches in
`../../patches/` to an isolated copy and counts the diff.

## What act 2 asked for

A supplier recall: a new `"recalled"` return reason, refunded in full to the original
payment method, capped at 50000 cents, with no change to how the restock disposition or the
notification channel are decided.

## What it cost on this route

`patches/reason-based-refunds-act2.patch`, which is what ships as `patches/solution-act2.patch`:

```
+0 new files   ·   2 existing files modified   ·   5 lines touched   ·   2 hunks
```

`types.ts` gains one union member. `returns.ts` gains one new branch inside `refundFor` -
the only place the recall's refund rule needs to exist, because both entry points already
call through it.

## What it would have cost without the pattern

`patches/baseline-act2.patch` - the same requirement, on the act-1 `src/`:

```
+0 new files   ·   2 existing files modified   ·   8 lines touched   ·   3 hunks
```

More lines and one more hunk: `src/` has no shared `refundFor`, so the new branch is written
twice, once inside `processReturn`, once inside `processBulkReturns`'s loop.

## What the other route cost

[`solutions/condition-based-restock/ACT2.md`](../condition-based-restock/ACT2.md) - the same
8 lines, 3 hunks as the baseline, because that route never touched the refund branching at
all.

## What this route made worse

Nothing measurable. The bet this route made - that the reason axis was the one worth
relieving first - is exactly the axis the recall landed on.
