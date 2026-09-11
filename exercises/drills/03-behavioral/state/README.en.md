[🌐 English](./README.en.md)

# State

`Behavioral` · `State` · `●●●` · ~45 min

## Context

Hollowell's mount runs through a small lifecycle every night: it sits parked, it
slews toward a target, it locks on and tracks, and an operator can nudge the
pointing a few arcseconds without losing lock. A controller class exposes four
calls — `park`, `slewTo`, `arrive`, `nudge` — and each one means something
different depending on what the telescope is currently doing.

## The pressure

Each of the four methods opens with its own `if` against `this.currentStatus`,
written independently, with its own error message. Nothing writes down, in one
place, the table of which calls are legal from which state. That table exists —
it is very short — but it is scattered: part of it lives in `slewTo`'s guard,
part in `arrive`'s, part in `nudge`'s, and `park`'s guard is really an
idempotence check rather than a transition rule at all.

The scattering is the smell, and it is more dangerous than the duplication
itself: `slewTo`'s guard is written as "refuse if slewing," not "allow only
from parked or tracking" — an exclusion list, not an inclusion list. The two
read the same today, with three states. They stop reading the same the moment a
fourth state exists, and nothing about the current code would warn you.

## The target

**State.** Each status becomes its own small object that knows how to respond
to all four calls — by returning the next state, or by refusing. The controller
stops asking "what state am I in, and is this legal from it" and starts simply
asking the current state object to handle the call.

When you are done, there should be no string comparison against a status
anywhere in the controller — only a current state object being asked to do
something.

## Done when (act 1)

- `./dp test state` is green throughout.
- `./dp shape state` no longer finds the scattered status comparisons.
- Every legal and illegal transition is a fact about exactly one state object,
  not a fact reconstructed by reading all four methods together.
- `park()` from mid-slew still works and still clears the aborted target —
  that behaviour does not change, only where it lives.
- Your `git log --oneline` shows small steps, each leaving the suite green.

## Then run `./dp act2 state`

## Hints

<details>
<summary>Where do I even start extracting a state object?</summary>

Pick the state with the fewest exceptions to its rules — `parked` is usually
the easiest: it can only be parked (no-op) or start a slew. Write a
`ParkedState` object that answers `park` and `slewTo` correctly, and have the
controller delegate just those two calls to it while the other two states stay
inline. Confirm the suite is still green before touching a second state.

</details>

<details>
<summary>Slewing needs to remember which target it is slewing toward - where
does that live now?</summary>

It can live on the state object itself, as a constructor parameter, rather
than on the controller. Once a state can carry its own data, the second call
to `slewTo` while slewing is answered by asking *that specific instance* what
it is busy doing — no controller-level field required.

</details>

<details>
<summary>How should the controller actually dispatch to the current state?</summary>

Each of the four controller methods becomes one line: call the matching method
on the current state, and replace the current state with whatever came back
(or let the state throw, which the controller does not need to catch). Logging
can move into that one shared dispatch point instead of living in each state.

</details>

## Reading

- GoF, *State* — especially *Applicability* and the note on who is responsible
  for deciding the next state (the state itself, or the context).
- Fowler, *Refactoring* (2nd ed.), chapter 10 — *Replace Type Code with
  Subclasses* and *Replace Conditional with Polymorphism* are the moves that
  get you most of the way here.
- [State on refactoring.guru](https://refactoring.guru/design-patterns/state)
