[🌐 English](./README.en.md)

# Flyweight

`Structural` · `Flyweight` · `●●○` · ~30 min

## Context

Caldermoor's weekday timetable is 200,000 `StopTime`s - one for every
trip that stops at every stop, all day. Every `StopTime` needs to know
its stop's name, zone and whether it's wheelchair accessible.

## The pressure

`buildStopMetadata` builds a fresh `StopMetadata` object every time a
`StopTime` is created, even though Caldermoor only runs a handful of
physical stops. Two hundred thousand `StopTime`s, and only a few
distinct stops among them - but today, every single one carries its own
copy of the stop it stops at. Nothing about `renderStopTime` is wrong,
and nothing here fails a test - this pressure only shows up as a
number, not a bug.

## The target

**Flyweight.** One `StopMetadataFactory` holds a cache keyed by stop id.
`buildTimetable` asks the factory for a stop's metadata instead of
building it; the factory constructs a `StopMetadata` the first time a
given stop id is asked for, and returns the same object every time
after. `StopTime` still holds a `stop: StopMetadata` field - it just
holds a *shared* one now.

## Done when (act 1)

- `./dp test flyweight` is green throughout.
- `StopMetadataFactory` exists, and `buildTimetable` asks it for every
  stop instead of constructing one inline.
- No function outside `StopMetadataFactory` calls `new` or builds a
  `StopMetadata` object literal.
- Your `git log --oneline` shows small steps, each leaving the suite
  green.

## Then run `./dp act2 flyweight`

## Hints

<details>
<summary>What does `StopMetadataFactory` need to hold?</summary>

A `Map<string, StopMetadata>`, keyed by stop id - built once, checked
before ever constructing a new one.

</details>

<details>
<summary>What should `StopMetadataFactory.get` do on a stop id it has already built?</summary>

Return the exact same object it returned last time - not an equal-by-
value copy. That's the entire property Flyweight buys: two `StopTime`s
for the same stop share one `StopMetadata`, not two identical ones.

</details>

<details>
<summary>Does `renderStopTime` need to change at all?</summary>

No. It already reads `stopTime.stop.name` and friends - it has no idea,
and no reason to care, whether that `stop` is shared with anything else.

</details>

## Reading

- GoF, *Flyweight* - the *Intent* section: "use sharing to support large
  numbers of fine-grained objects efficiently."
- [Flyweight on refactoring.guru](https://refactoring.guru/design-patterns/flyweight)
