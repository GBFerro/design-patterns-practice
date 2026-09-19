# Act 2 — the measured part

Every number here comes from `./dp trade kata-04`, which applies the two patches in
`../../patches/` to an isolated copy and counts the diff.

## What act 2 asked for

Compliance flags low-value invoices: any invoice totaling under 500 cents also notifies a new
`"low-value-review"` channel, alongside whichever channels already apply. Line construction and
surcharge calculation are unaffected.

## What it cost on this route

`patches/line-construction-act2.patch` (not the one that ships as
`patches/solution-act2.patch` - see below):

```
+0 new files   ·   1 existing file modified   ·   7 lines touched   ·   3 hunks
```

`invoicing.ts` gains the new notification clause **twice** - once inside `finalizeInvoice`, once
inside `finalizeInvoiceBatch` - because this route's `buildInvoiceLine` extraction never touched
notification branching at all; it is exactly as duplicated here as it is in `src/`.

## What it would have cost without any restructuring

`patches/baseline-act2.patch` - the same requirement, on the act-1 `src/`:

```
+0 new files   ·   1 existing file modified   ·   7 lines touched   ·   3 hunks
```

Identical. This route's own restructuring, real and defensible as it is, simply never touches
the axis this act 2 needed touched.

## What the winning route cost

[`solutions/notification-routing/ACT2.md`](../notification-routing/ACT2.md) - 4 lines, 2 hunks,
because that route bet on the notification axis instead.

## What this route made worse

Nothing worse than doing nothing - which is itself the finding. This route's restructuring
wasn't wasted (it still insulates both entry points from the next change to how a line is
built), it just wasn't insurance against *this* change.
