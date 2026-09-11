[🌐 English](./README.en.md)

# Memento

`Behavioral` · `Memento` · `●●○` · ~30 min

## Context

An operator adjusts an exposure setup - instrument, filter, exposure time,
binning - before the next shot, and wants to save a checkpoint and undo
back to it if the next few changes turn out wrong.

## The pressure

`SetupHistory.save` reads all four fields off `ExposureSetup` directly
into a plain object; `SetupHistory.undo` writes all four back the same
way. `SetupHistory` has to know every field `ExposureSetup` has, by name,
in two places, just to do its one job - hold onto old versions and hand
them back. Nothing is wrong yet: both methods are short, and the field
list is easy to keep in sync today. What the shape cannot survive is
`ExposureSetup` growing a field `SetupHistory` needs to remember, without
`SetupHistory` itself being the file that has to change.

## The target

**Memento.** `ExposureSetup` gains `createMemento()` and `restore(memento)`;
`SetupHistory` stores whatever `createMemento()` hands it and passes it
back to `restore()` later, without ever reading a field off it. The
memento's own type has no members a caretaker could read even if it tried
- the compiler, not a comment, is what keeps the caretaker from knowing
`ExposureSetup`'s shape.

## Done when (act 1)

- `./dp test memento` is green throughout.
- `./dp shape memento` no longer finds `SetupHistory` assigning directly
  to `setup.instrumentName`, `setup.filterName`, `setup.exposureSeconds`
  or `setup.binning`.
- `SetupHistory` type-checks without importing anything from `ExposureSetup`
  except the class itself and the opaque memento type.
- Your `git log --oneline` shows small steps, each leaving the suite green.

## Then run `./dp act2 memento`

## Hints

<details>
<summary>What should the memento's exported type look like?</summary>

An interface with no members - `interface ExposureMemento {}`. A concrete
class implementing it holds the real fields, but only `ExposureSetup`'s
own file ever imports that concrete class by name.

</details>

<details>
<summary>How does <code>restore</code> read fields off something with no visible members?</summary>

It is the one place allowed to assume what it is really holding, and cast
back to the concrete type. That cast is safe specifically because nothing
outside `ExposureSetup` can construct a memento in the first place - every
one in existence came from `createMemento()`.

</details>

<details>
<summary>Does <code>SetupHistory</code> need to change at all?</summary>

Only its type annotations, from four named fields to one opaque memento
type. Its actual logic - push on save, pop on undo - does not change,
which is exactly the point: it never needed to know what it was holding.

</details>

## Reading

- GoF, *Memento* - especially the "wide interface, narrow interface"
  framing: the originator sees everything a memento holds, the caretaker
  sees nothing, and both views are the same object.
- Fowler, *Refactoring* (2nd ed.) - closest relative is *Encapsulate
  Field*, aimed at a caretaker's direct field access rather than at the
  originator's own fields.
- [Memento on refactoring.guru](https://refactoring.guru/design-patterns/memento)
