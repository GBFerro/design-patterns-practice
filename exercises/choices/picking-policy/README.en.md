[🌐 English](./README.en.md)

# Picking policy

`Choice` · `Strategy · State · Template Method` · `●●○` · ~40 min

## Context

Ravensgate's warehouse floor picks orders one at a time - until enough of
them pile up that it's cheaper to walk one aisle once and pick several
orders from the same bin in a single pass.

## The pressure

`planNextPick` decides what a picker does next. Below a threshold, it hands
out one order at a time, oldest first. Once three or more orders are
queued, it should switch to handing out *batches*: several orders that
share a bin, picked together. Once a batch has started, it has to be
finished - a batch that gives up half-way through because the queue
happened to thin out is worse than no batching at all, and an order that
arrives after the batch already started has to wait for the *next* one.

Right now this all lives in one function, with the current mode tracked as
a single mutable variable checked at the top of every call. Reading it
means holding both modes in your head at once, and the mode-tracking logic
is the kind of thing that gets copy-pasted the moment a second caller needs
it.

## The target

**One of three candidates**, and this repository isn't telling you which:

- **Strategy** - swap the routing logic (individual vs. batch) for an
  object that can be selected and replaced independently.
- **State** - give the policy itself a notion of "which mode am I in right
  now," with each mode responsible for its own behaviour and its own
  transitions.
- **Template Method** - factor the shared shape of "pick a candidate pool,
  then group it" into one algorithm, with each mode supplying the step that
  differs.

Read the domain above, and this: **whether the behaviour depends on a mode
that itself transitions** is the question worth sitting with before you
pick. Write your answer down - `./dp choose picking-policy --pattern
<name> --because "..."` - before you see act 2. That's the exercise.

## Done when (act 1)

- `./dp test picking-policy` is green throughout, against your `src/`.
- `planNextPick` and `recordPicked` behave exactly as they do today - this
  is a restructuring, not a rewrite. `./dp diff picking-policy --steps` (once
  you've chosen) shows one published route; yours doesn't have to match it,
  only the tests.
- Your `git log --oneline` shows small steps, each leaving the suite green.

## Then run `./dp choose picking-policy --pattern <name> --because "..."`, then `./dp act2 picking-policy`

## Hints

<details>
<summary>What's the smallest thing each candidate would need to hold?</summary>

Something has to remember "we're mid-batch, and here's exactly which
orders are in it" across calls - that's true no matter which candidate you
pick. The question the exercise is really asking is *where* that memory
lives, and who's responsible for updating it.

</details>

<details>
<summary>Does "queue.length >= 3" alone tell you when to leave batch mode?</summary>

No - a batch that's already running has to finish even if the queue drops
below the threshold mid-batch, and a batch only ever contains the orders
that were queued at the moment it started. Whatever you pick has to express
"stay in batch mode until *this specific set* of orders is gone," not just
"batch mode while the count is high."

</details>

<details>
<summary>Is Template Method solving the same problem as the other two?</summary>

Template Method is about a fixed algorithm shape with a swappable step.
Ask what actually varies here: is it *one step* inside an otherwise-fixed
sequence, or is it *which set of orders and which transition rule* apply
right now? That's worth answering before you write `--because`.

</details>

## Reading

- GoF, *Strategy*, *State* and *Template Method* - the *Intent* sections.
  *Design Patterns* also discusses State and Strategy's structural overlap
  directly under State's *Related Patterns*, which is worth reading before
  you commit to an answer here.
- [Strategy](https://refactoring.guru/design-patterns/strategy),
  [State](https://refactoring.guru/design-patterns/state) and
  [Template Method](https://refactoring.guru/design-patterns/template-method)
  on refactoring.guru.
