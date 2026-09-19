# Act 2 — the measured part

Every number here comes from `./dp trade kata-04`, which applies the two patches in
`../../patches/` to an isolated copy and counts the diff.

## What act 2 asked for

Compliance flags low-value invoices: any invoice totaling under 500 cents also notifies a new
`"low-value-review"` channel, alongside whichever channels already apply. Line construction and
surcharge calculation are unaffected.

## What it cost on this route

`patches/notification-routing-act2.patch`, which is what ships as `patches/solution-act2.patch`:

```
+0 new files   ·   1 existing file modified   ·   4 lines touched   ·   2 hunks
```

`notifiedChannelsFor` gains one new clause and its threshold constant - the only place a
channel's condition needs to exist, because both entry points already call through it.

## What it would have cost without the pattern

`patches/baseline-act2.patch` - the same requirement, on the act-1 `src/`:

```
+0 new files   ·   1 existing file modified   ·   7 lines touched   ·   3 hunks
```

Nearly twice the lines and one more hunk: `src/` has no shared `notifiedChannelsFor`, so the
new clause (and its threshold constant) is written twice, once inside `finalizeInvoice`, once
inside `finalizeInvoiceBatch`.

## What the other route cost

[`solutions/line-construction/ACT2.md`](../line-construction/ACT2.md) - the same 7 lines, 3
hunks as the baseline, because that route never touched the notification branching at all.

## What this route made worse

Nothing measurable. The bet this route made - that notification routing was the axis worth
relieving first - is exactly the axis the low-value-review rule landed on.
