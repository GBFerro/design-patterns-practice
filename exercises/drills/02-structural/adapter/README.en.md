[🌐 English](./README.en.md)

# Adapter

`Structural` · `Adapter` · `●●○` · ~30 min

## Context

Caldermoor Transit Authority is replacing its turnstiles. The new ones
speak one interface, `FareReader`, to every modern station. Three
stations still run legacy card scanners, installed a decade ago, that
speak a completely different shape: dollars instead of cents, a card
number instead of a card id, and a status string instead of `null` for
"no card."

## The pressure

`admitPassenger` implements the fare rule for modern readers.
`admitLegacyPassenger` implements the exact same rule a second time, for
legacy scanners, converting dollars to cents inline. Both functions
agree today - same fare, same two checks, same shape of result - but
nothing enforces that they keep agreeing. A rounding tweak, a changed
refusal message, a new rule: each has to land in both places, by hand,
correctly, twice.

## The target

**Adapter.** One admission rule, `admitPassenger`, written once against
`FareReader`. A `LegacyReaderAdapter` wraps a legacy scanner and makes it
speak `FareReader` - dollars become cents, a card number becomes a
`cardId`, `"no-card"` becomes `null`. `admitLegacyPassenger` shrinks to a
single line: wrap, then delegate.

## Done when (act 1)

- `./dp test adapter` is green throughout.
- `admitPassenger` is the only place the fare rule (`FARE_CENTS`,
  the two checks, the result shape) is written.
- `admitLegacyPassenger` no longer computes a balance itself - it
  constructs an adapter and calls `admitPassenger`.
- Your `git log --oneline` shows small steps, each leaving the suite
  green.

## Then run `./dp act2 adapter`

## Hints

<details>
<summary>What does `LegacyReaderAdapter` need to implement?</summary>

`FareReader` - nothing more. One method, `readFare(): FareRead | null`,
translating whatever the legacy scanner just reported.

</details>

<details>
<summary>Where does the dollars-to-cents conversion belong now?</summary>

Inside the adapter's `readFare`, and nowhere else. `admitPassenger`
should never see a dollar amount - only `FareRead.balanceCents`.

</details>

<details>
<summary>What should `admitLegacyPassenger` look like when you're done?</summary>

One line: construct a `LegacyReaderAdapter` around the scanner, then
call `admitPassenger` with it. If it still has an `if` or a `Math.round`
in it, the rule is still duplicated.

</details>

## Reading

- GoF, *Adapter* - the *Intent* section: "convert the interface of a
  class into another interface clients expect."
- [Adapter on refactoring.guru](https://refactoring.guru/design-patterns/adapter)
