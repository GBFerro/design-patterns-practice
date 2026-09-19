# Act 2 — the measured part

Every number here comes from `./dp trade kata-01`, which applies the two patches in
`../../patches/` to an isolated copy and counts the diff.

## What act 2 asked for

A supplier recall: a new `"recalled"` return reason, refunded in full to the original
payment method, capped at 50000 cents, with no change to how the restock disposition or the
notification channel are decided.

## What it cost on this route

`patches/condition-based-restock-act2.patch` (not the one that ships as
`patches/solution-act2.patch` - see below):

```
+0 new files   ·   2 existing files modified   ·   8 lines touched   ·   3 hunks
```

`types.ts` gains the same one union member every route needs. `returns.ts` gains the new
branch **twice** - once inside `processReturn`, once inside `processBulkReturns`'s loop -
because this route's `dispositionFor` extraction never touched refund-by-reason branching at
all; it is exactly as duplicated here as it is in `src/`.

## What it would have cost without any restructuring

`patches/baseline-act2.patch` - the same requirement, on the act-1 `src/`:

```
+0 new files   ·   2 existing files modified   ·   8 lines touched   ·   3 hunks
```

Identical. This route's own restructuring, real and defensible as it is, simply never touches
the axis this act 2 needed touched.

## What the winning route cost

[`solutions/reason-based-refunds/ACT2.md`](../reason-based-refunds/ACT2.md) - 5 lines, 2
hunks, because that route bet on the refund-by-reason axis instead.

## What this route made worse

Nothing worse than doing nothing - which is itself the finding. This route's restructuring
wasn't wasted (it still insulates `processReturn`/`processBulkReturns` from the next change to
restock disposition), it just wasn't insurance against *this* change.
