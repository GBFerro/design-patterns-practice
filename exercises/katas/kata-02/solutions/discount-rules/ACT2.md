# Act 2 — the measured part

Every number here comes from `./dp trade kata-02`, which applies the two patches in
`../../patches/` to an isolated copy and counts the diff.

## What act 2 asked for

Tanager signs a small-parcel arrangement: shipments to the `"national"` zone become eligible
too, but only when they weigh 12kg or less. Everything else tanager already does - the 25kg
overall cap, its zero negotiated discount - stays exactly as it is, and ravenex/skyfreight are
untouched.

## What it cost on this route

`patches/discount-rules-act2.patch` (not the one that ships as `patches/solution-act2.patch` -
see below):

```
+0 new files   ·   1 existing file modified   ·   10 lines touched   ·   2 hunks
```

`rate-shopping.ts` gains the new eligibility clause **twice** - once inside
`pickCheapestCarrier`, once inside `pickCheapestForBatch`'s loop - because this route's
`discountedCents` extraction never touched eligibility branching at all; it is exactly as
duplicated here as it is in `src/`.

## What it would have cost without any restructuring

`patches/baseline-act2.patch` - the same requirement, on the act-1 `src/`:

```
+0 new files   ·   1 existing file modified   ·   10 lines touched   ·   2 hunks
```

Identical. This route's own restructuring, real and defensible as it is, simply never touches
the axis this act 2 needed touched.

## What the winning route cost

[`solutions/eligibility-rules/ACT2.md`](../eligibility-rules/ACT2.md) - 2 lines, 1 hunk,
because that route bet on the eligibility axis instead.

## What this route made worse

Nothing worse than doing nothing - which is itself the finding. This route's restructuring
wasn't wasted (it still insulates `pickCheapestCarrier`/`pickCheapestForBatch` from the next
change to pricing), it just wasn't insurance against *this* change.
