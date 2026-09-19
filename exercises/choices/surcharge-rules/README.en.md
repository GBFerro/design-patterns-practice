[🌐 English](./README.en.md)

# Surcharge rules

`Choice` · `Strategy · a lookup table · a rules list` · `●●●` · ~40 min

## Context

Ravensgate adds three surcharges to a shipment's base rate: **fuel** (a flat percentage),
**remote-area** (a flat fee if the destination is remote), and **oversize** (a flat fee if any
dimension is over threshold). `quoteSurcharges` and `totalSurchargeCents` each compute all
three independently.

## The pressure

Both functions repeat the same three checks, written twice, because nothing today forces them
to agree - the usual pressure this module's baselines carry into act 1.

## The target

**One of three candidates**, and this repository isn't telling you which:

- **Strategy** - one class per surcharge, each computing its amount from the shipment alone,
  interchangeable and independent by design.
- **A lookup table** - a `Record` of named, pure surcharge functions, each taking the shipment
  and nothing else.
- **A rules list** - an ordered array of rules, each one given every surcharge already computed
  *before* it in the list, not just the shipment.

Read the domain above, and this: all three candidates can make the validation-and-computation
logic live in one place instead of two - that part won't tell them apart. What's worth sitting
with is **what each candidate's surcharges are allowed to know about each other**, and whether
the next surcharge Ravensgate needs will turn out to depend on ones that already exist. Write
your answer down - `./dp choose surcharge-rules --pattern <name> --because "..."` - before you
see act 2. That's the exercise.

## Done when (act 1)

- `./dp test surcharge-rules` is green throughout, against your `src/`.
- `quoteSurcharges` and `totalSurchargeCents` behave exactly as they do today - this is a
  restructuring, not a rewrite. `./dp diff surcharge-rules --steps` (once you've chosen) shows
  one published route; yours doesn't have to match it, only the tests.
- Your `git log --oneline` shows small steps, each leaving the suite green.

## Then run `./dp choose surcharge-rules --pattern <name> --because "..."`, then `./dp act2 surcharge-rules`

## Hints

<details>
<summary>Can every surcharge in every candidate see the shipment's raw fields?</summary>

Yes - all three candidates compute every surcharge from the same `Shipment`. The question the
exercise is really asking is narrower: can a surcharge see what the *other surcharges already
worked out*, or only the raw shipment they all started from?

</details>

<details>
<summary>Is "independent, interchangeable strategies" always the right shape for a set of
related rules?</summary>

Not when the rules stop being independent. Strategy's whole design point - GoF's own framing -
is that strategies don't know about each other, which is exactly what makes them safe to swap.
That strength doesn't disappear when a new rule needs to know about the others; it just stops
being a strength for that one rule.

</details>

<details>
<summary>Does `docs/TYPESCRIPT.md` say anything about Strategy already?</summary>

Its "Strategy, verified" section confirms the pattern is essential for interchangeable,
independent behaviour - written in general terms, before either one has seen this domain's
particular act 2, and before act 2 asks for a rule that is not independent of the others.

</details>

## Reading

- GoF, *Strategy* - the *Intent* section.
- [Strategy](https://refactoring.guru/design-patterns/strategy) on refactoring.guru.
- [`docs/TYPESCRIPT.md`](../../../docs/TYPESCRIPT.md)'s "Strategy, verified" section is about
  exactly this exercise's tension, in general terms, before you've seen this domain's
  particular act 2.
