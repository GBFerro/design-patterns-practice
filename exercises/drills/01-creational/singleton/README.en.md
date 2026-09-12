[🌐 English](./README.en.md)

# Singleton

`Creational` · `Singleton` · `●●○` · ~30 min

## Context

Thornbury keeps one press-room configuration - rush surcharge, daily rush
cap, whether the room is in maintenance - read by five different modules:
a quoting function, a capacity check, an intake gate, a status report,
and a maintenance switch.

## The pressure

`getSettings()` builds the configuration once, lazily, on first call, and
every module that asks after that gets the same shared object back - the
textbook lazy singleton. It works, and every one of the five modules
reads it correctly. The cost shows up in `tests/press-room.test.ts`: the
test that flips maintenance mode on has to run *last*, because nothing
exported from this module can hand back a fresh instance for the next
test to start from. There is no way to isolate that one test - not a
missing helper, an *impossible* one, given this shape.

## The target

Replace the shared instance with an explicit factory: `createPressRoom
(settings)` builds one independent press room from a configuration you
hand it. Calling it twice, with two different settings, gives two press
rooms that cannot see or change each other's state - which is also
exactly what a test needs to isolate itself from every other test.

## Done when (act 1)

- `./dp test singleton` is green throughout.
- The five frozen functions (`rushQuoteTotal`, `canAcceptAnotherRushJob`,
  `canAcceptNewJob`, `describePressRoom`, `setMaintenanceMode`) keep their
  exact signatures.
- Nothing in the solution reads from a shared, module-level mutable
  variable the way `src/settings.ts`'s `instance` does.
- Your `git log --oneline` shows small steps, each leaving the suite green.

## Then run `./dp act2 singleton`

## Hints

<details>
<summary>What has to be true for two press rooms to never interfere with each other?</summary>

Each one has to own its own settings object, not share one - which means
whatever builds a press room has to take that settings object as an
argument, not read it from somewhere ambient.

</details>

<details>
<summary>Does the frozen entry point (`rushQuoteTotal(100)`, no settings argument) still work once nothing is a shared instance?</summary>

Yes - build one default press room, once, and bind the five frozen names
to its methods. Nothing about "there is a convenient default" requires
"there can only be one."

</details>

## Reading

- GoF, *Singleton* - the *Intent* section: "ensure a class only has one
  instance, and provide a global point of access to it."
- [Singleton on refactoring.guru](https://refactoring.guru/design-patterns/singleton)
