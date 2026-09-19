# Act 2 — the measured part

Every number here comes from `./dp trade kata-02`, which applies the two patches in
`../../patches/` to an isolated copy and counts the diff.

## What act 2 asked for

Tanager signs a small-parcel arrangement: shipments to the `"national"` zone become eligible
too, but only when they weigh 12kg or less. Everything else tanager already does - the 25kg
overall cap, its zero negotiated discount - stays exactly as it is, and ravenex/skyfreight are
untouched.

## What it cost on this route

`patches/eligibility-rules-act2.patch`, which is what ships as `patches/solution-act2.patch`:

```
+0 new files   ·   1 existing file modified   ·   2 lines touched   ·   1 hunk
```

`isEligible` gains one new clause in its zone check, inside the same `else` branch that already
handles tanager - the only place the small-parcel rule needs to exist, because both entry
points already call through it, and `isEligible` already receives `weightKg` as a parameter.

## What it would have cost without the pattern

`patches/baseline-act2.patch` - the same requirement, on the act-1 `src/`:

```
+0 new files   ·   1 existing file modified   ·   10 lines touched   ·   2 hunks
```

Five times the lines and one more hunk: `src/` has no shared `isEligible`, so the new clause is
written twice, once inside `pickCheapestCarrier`, once inside `pickCheapestForBatch`'s loop.

## What the other route cost

[`solutions/discount-rules/ACT2.md`](../discount-rules/ACT2.md) - the same 10 lines, 2 hunks as
the baseline, because that route never touched the eligibility branching at all.

## What this route made worse

Nothing measurable. The bet this route made - that eligibility was the axis worth relieving
first - is exactly the axis the small-parcel exception landed on.

## A false start, corrected before this route was published

The first act-2 design for this kata was a skyfreight regional-zone pricing promotion, aimed at
the discount axis instead. It was rejected after measuring, not before: the winning candidate's
own extraction needed a new parameter threaded through its signature and both call sites, which
cost *more* hunks than the baseline's plain duplication. A structure that has to widen its own
signature to absorb a change isn't cheaper than the change it's supposed to protect against -
that's as real a finding as a passing measurement, which is why this kata's act 2 was rebuilt
around an axis (eligibility) that fits inside a function's *existing* parameters instead.
