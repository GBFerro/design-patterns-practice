[🌐 English](./README.en.md)

# Builder

`Creational` · `Builder` · `●●○` · ~35 min

## Context

Thornbury quotes print jobs through a chainable draft: `startQuote(...)`
opens one, a handful of optional stages (`applyRush`, `applyDiscount`,
`setProofRequired`, `setDeliveryMethod`) narrow it down, and `build()`
turns it into a priced `Quote`.

## The pressure

Each stage is a free function closed over the current state: it checks
whatever rule it happens to know about, then returns a **brand new**
draft built from `{ ...state, theOneFieldThatChanged }`. That works, but
look at `applyRush` and `applyDiscount`: a rush job and a discount are
mutually exclusive, and neither stage knows which one the caller will
reach for first - so *both* have to check for the other, and the same
rule (`"a rush job cannot also receive a discount"`) is written out
twice, once per direction. A third field with a rule spanning it and one
of these two would need a third copy of the reasoning, not a fourth line
somewhere central.

## The target

**Builder.** One mutable class holding all the fields in a single
internal state object; every stage mutates it in place and hands back
`this`; every business rule - however many fields it spans - is checked
exactly once, in `build()`, after the chain is done and every field has
its final value. No stage needs to know what order it was called in,
because no stage validates anything.

## Done when (act 1)

- `./dp test builder` is green throughout.
- `startQuote`, every stage's name, and `build()` keep the exact same
  signatures - callers do not change.
- Every business rule check lives in `build()`. No `applyX` or `setX`
  method throws.
- A rule spanning two fields is written once, not once per field.
- Your `git log --oneline` shows small steps, each leaving the suite green.

## Then run `./dp act2 builder`

## Hints

<details>
<summary>What does the builder need to hold, if not one private field per property?</summary>

One internal object with every field on it - required and optional
alike, given their defaults up front in `startQuote`. `build()` can then
spread it wholesale into the result instead of naming every field again.

</details>

<details>
<summary>Where does `applyRush`'s discount check go?</summary>

Nowhere, on the pattern route - it moves to `build()`, next to the same
check `applyDiscount`'s old body used to carry. One check, not two.

</details>

<details>
<summary>Does `setDeliveryMethod`'s courier/quantity check need to move too?</summary>

Yes, for the same reason: no stage validates anything once the pattern
lands. `quantity` is fixed from `startQuote` onward here, so this
particular check was never at risk of an ordering bug - but it still
belongs in one place with the rest.

</details>

## Reading

- GoF, *Builder* - the *Intent* section: "separate the construction of a
  complex object from its representation so that the same construction
  process can create different representations."
- [Builder on refactoring.guru](https://refactoring.guru/design-patterns/builder)
