[🌐 English](./README.en.md)

# Decorator

`Structural` · `Decorator` · `●●○` · ~30 min

## Context

Caldermoor fares can be modified three ways: a student discount, an
off-peak discount, and a group cap that stops a party fare from ever
exceeding a flat ceiling. A rider can qualify for any combination.

## The pressure

`calculateFare` takes three booleans and applies each modifier in turn,
in the order the `if`s happen to be written. Nothing is wrong yet - the
function is short, and every combination is correct today. What it
resists is treating a modifier as its own thing: there is no way to test
"what does the student discount do" without going through the whole
function, and no way to add a modifier without editing the one place
every existing modifier already lives.

## The target

**Decorator.** One `Fare` interface with a single method, `priceCents()`.
`BaseFare` is the fare before any modifier touches it. Each modifier -
`StudentDiscount`, `OffPeakDiscount`, `GroupCap` - is its own small class
that wraps a `Fare` and adjusts what it returns. `calculateFare` still
decides which modifiers apply and in what order they wrap, but each
modifier's own math now lives in its own file, independently
constructible and testable.

## Done when (act 1)

- `./dp test decorator` is green throughout.
- `Fare`, `BaseFare`, `StudentDiscount`, `OffPeakDiscount` and
  `GroupCap` all exist as separate classes, each implementing `Fare`.
- `calculateFare`'s body no longer computes a price itself - it only
  decides which decorators to wrap a `BaseFare` in.
- Your `git log --oneline` shows small steps, each leaving the suite
  green.

## Then run `./dp act2 decorator`

## Hints

<details>
<summary>What does every decorator hold onto?</summary>

The `Fare` it wraps - not a `BaseFare` specifically, just whatever
`Fare` it was constructed with. A decorator should be able to wrap
another decorator without knowing that's what it's doing.

</details>

<details>
<summary>Where does the decision of which modifiers apply live?</summary>

`calculateFare`, and only there. Every decorator class itself takes no
booleans and makes no decisions - it always applies its own adjustment
to whatever `Fare` it was given.

</details>

<details>
<summary>Does the order the decorators wrap in matter today?</summary>

Not yet - the two percentage discounts commute with each other, and the
cap is naturally last regardless of order. Keep that in mind for act 2.

</details>

## Reading

- GoF, *Decorator* - the *Intent* section: "attach additional
  responsibilities to an object dynamically... a flexible alternative to
  subclassing for extending functionality."
- [Decorator on refactoring.guru](https://refactoring.guru/design-patterns/decorator)
