[🌐 English](./README.en.md)

# Mediator

`Behavioral` · `Mediator` · `●●●` · ~45 min

## Context

Hollowell's control-room panel has four widgets an operator drives directly —
a focus dial, a filter wheel, an exposure timer, a weather banner — and two
that only ever display a derived verdict: a ready lamp, and the button that
starts the exposure. Both need the same answer to the same question every
time any of the four inputs changes: *is everything set to expose?*

## The pressure

Today, each of the four input widgets holds a direct reference to both
output widgets, and calls `.refresh()` on both the moment its own state
changes. Both output widgets hold direct references back to all four inputs,
and each independently recomputes the same four-part condition — locked,
filtered, timed, clear weather — to decide what it shows. Six widgets, and
every one of them knows about several of the others by name. Nothing is
broken: change any one input today and both outputs update correctly. The
cost is that the actual rule — what "ready" means — exists in two places at
once, written slightly differently, and every widget's constructor is a
small lesson in who else currently needs to know about whom.

## The target

**Mediator.** The four input widgets stop holding references to the output
widgets, and the output widgets stop holding references to the inputs.
Instead, every widget reports its own changes to one `PanelMediator`, which
is the only object that computes "ready" - once - and pushes the result to
the two outputs.

When you are done, no widget file should import another widget file. Every
import should point at the mediator, or at nothing.

## Done when (act 1)

- `./dp test mediator` is green throughout.
- `./dp shape mediator` no longer finds `connect(readyLamp...)` wiring or a
  widget calling `.refresh()` on another widget directly.
- `ReadyLamp` and `StartButton` no longer read any other widget's state -
  they only display whatever the mediator tells them to.
- The four combinations act 1's tests already check (locked, filtered,
  timed, clear weather - and each one's absence) still produce the same
  `readyLampLit` / `startButtonEnabled` values.
- Your `git log --oneline` shows small steps, each leaving the suite green.

## Then run `./dp act2 mediator`

## Hints

<details>
<summary>What should the mediator's interface to each widget look like?</summary>

One method per input: `focusLockedChanged(locked)`, `filterChanged(selected)`,
`exposureChanged(seconds)`, `weatherChanged(severe)`. Resist a single generic
`notify(event, value)` for now - named methods let the compiler catch a
mismatched argument; a generic event bus would not, for a panel this small.

</details>

<details>
<summary>How do the output widgets receive their new value without
computing it themselves?</summary>

Give them a setter - `setLit(lit)`, `setEnabled(enabled)` - and nothing
else. They should end up with no knowledge of focus, filters, exposure, or
weather at all; they just remember the last boolean they were told.

</details>

<details>
<summary>Where does the "ready" formula itself end up living?</summary>

In exactly one method on the mediator, called once by each of the four
`*Changed` methods. If you find the formula appearing twice anywhere, the
refactor is not finished yet.

</details>

## Reading

- GoF, *Mediator* — especially the contrast with Observer: a mediator
  encapsulates *how a group of objects interact*, not just that one object's
  change should be broadcast.
- Fowler, *Refactoring* (2nd ed.) has no single move for this; the closest
  relative is *Extract Class*, applied to behavior that was smeared across
  every participant rather than concentrated in one of them.
- [Mediator on refactoring.guru](https://refactoring.guru/design-patterns/mediator)
