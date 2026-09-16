[🌐 English](./README.en.md)

# Bridge

`Structural` · `Bridge` · `●●●` · ~35 min

## Context

Caldermoor prices a ride two ways at once: a **fare policy** decides the
base amount (flat, or by distance), and a **payment medium** decides how
that base amount becomes an actual charge (cash rounds up to the
nearest quarter, card adds a processing fee). Today there are two
policies and two mediums - four combinations in total.

## The pressure

Each of the four combinations - `FlatCashFare`, `FlatCardFare`,
`DistanceCashFare`, `DistanceCardFare` - is its own class, and each one
knows both how to compute its base fare **and** how to turn that base
fare into a charge. The cash-rounding rule is written twice (once per
policy); the distance formula is written twice (once per medium).
Nothing is wrong yet - `calculateFare` cleanly dispatches to one of the
four - but the shape is two axes, multiplied: a third policy or a third
medium doesn't add one class, it adds one class **per existing value on
the other axis**.

## The target

**Bridge.** A `FarePolicy` hierarchy that computes a base fare, and a
`PaymentMedium` hierarchy that turns a base fare into a charge -
independent of each other, connected only by composition. A policy is
built with whichever medium it needs; it calls `medium.chargeFor(...)`
and never asks what kind of medium it got.

## Done when (act 1)

- `./dp test bridge` is green throughout.
- `FlatFarePolicy` and `DistanceFarePolicy` exist, each extending one
  `FarePolicy` base class, each holding a `PaymentMedium` rather than
  knowing how a charge gets computed.
- `CashPayment` and `CardPayment` exist, each implementing
  `PaymentMedium`, and neither one mentions a fare policy by name.
- `calculateFare` no longer has four classes to choose between - it
  looks a policy up, looks a medium up, and lets the policy do the rest.
- Your `git log --oneline` shows small steps, each leaving the suite
  green.

## Then run `./dp act2 bridge`

## Hints

<details>
<summary>Which side holds a reference to the other?</summary>

`FarePolicy` holds a `PaymentMedium` (constructor injection), and calls
`medium.chargeFor(baseFareCents)` from inside its own `calculate`
method. `PaymentMedium` never references `FarePolicy` at all - the
dependency only runs one way.

</details>

<details>
<summary>What's the one method every policy has to implement?</summary>

`baseFareCents(measure): number`. Everything else - taking the base
fare and turning it into a real charge - is the same in every policy,
because it isn't the policy's job.

</details>

<details>
<summary>How does `calculateFare` go from two kind strings to a working combination?</summary>

Two small lookup tables, one per axis: a medium factory keyed by
`PaymentMediumKind`, a policy factory keyed by `FarePolicyKind`. Build
the medium first, then build the policy with that medium, then call
`calculate`.

</details>

## Reading

- GoF, *Bridge* - the *Intent* section: "decouple an abstraction from
  its implementation so that the two can vary independently."
- [Bridge on refactoring.guru](https://refactoring.guru/design-patterns/bridge)
