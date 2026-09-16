# The route — a policy hierarchy and a medium hierarchy, bridged by composition

## When to choose this

When two concerns are each expected to grow their own list of variants,
and every combination of the two needs to keep working. A single axis
that will only ever have one "kind" of variation is not under-designed
as a switch; this route earns its keep the moment two independent lists
of variants would otherwise have to be multiplied into one list of
classes.

## What it costs

Tracing "how is a distance fare paid in cash actually computed" now
means opening two files instead of one: `fare-policy.ts` for the base
amount, `payment-medium.ts` for the charge. Neither file, read alone,
tells you what a specific combination costs - that answer only exists
once both are composed.

## The moves

| # | Move | What you do | Commit |
| --- | --- | --- | --- |
| 1 | Write `PaymentMedium` | One method, `chargeFor(baseFareCents): number`. No implementations yet. | `refactor: introduce PaymentMedium` |
| 2 | Extract `CashPayment` | Moves the rounding rule out of both cash classes into one place. | `refactor: extract CashPayment` |
| 3 | Extract `CardPayment` | Moves the fee out of both card classes into one place. | `refactor: extract CardPayment` |
| 4 | Write `FarePolicy` | Abstract base holding a `PaymentMedium`; `calculate` composes `baseFareCents` with `medium.chargeFor`. | `refactor: introduce FarePolicy` |
| 5 | Extract `FlatFarePolicy` and `DistanceFarePolicy` | Each overrides `baseFareCents` only - no medium logic left in either. | `refactor: extract FlatFarePolicy and DistanceFarePolicy` |
| 6 | Rewrite `calculateFare` | Two lookup tables, one per axis; build a medium, build a policy with it, delegate. Delete the four old classes. | `refactor: route calculateFare through the two tables` |

Steps 2-3 extract the medium side first, checked by hand against each
old class's own values before anything depends on them. Step 4's
`FarePolicy` is written with no product knowledge - by the time step 5
extracts the two concrete policies, there is nothing left to invent
about how a policy talks to a medium. Step 6 is a pure deletion of the
four old classes plus the two-table dispatch that replaces them.

## Then

```bash
./dp act2 bridge
```

What a new value on each axis, at once, costs on this route, and what it
would have cost without the pattern, is in [ACT2.md](./ACT2.md). The
full reasoning, with the diagram mapping this onto the GoF roles, is in
[WALKTHROUGH.md](./WALKTHROUGH.md).
