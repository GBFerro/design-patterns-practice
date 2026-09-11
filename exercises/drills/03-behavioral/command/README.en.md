[🌐 English](./README.en.md)

# Command

`Behavioral` · `Command` · `●●●` · ~40 min

## Context

Hollowell's instrument panel takes two kinds of operator action: move the
focuser by some number of microns, or rotate the filter wheel to a slot. Both
arrive as the same shape of value — an `ActionRecord` — and `panel.run(action)`
applies one to the panel's state and appends a line to `history`.

## The pressure

`run()` is a `switch` over `action.type`, two cases, six lines. It is
genuinely fine as it stands — nothing here is duplicated, nothing is
scattered. The switch is not the smell. What is missing is a way back: the
panel can *apply* an action, but nothing about the current design can *undo*
one, because undoing requires knowing, for each kind of action, what its
inverse is — and that knowledge does not exist anywhere yet, not even
informally. `history` records what happened; it has no opinion on how to
un-happen it.

## The target

**Command.** Each `ActionRecord` becomes a `Command` object — something with
an `execute()` and an `undo()` — built by one factory function that is the
only place left that still knows `ActionRecord`'s shape. A `CommandQueue`
runs commands and remembers them, so undo and redo become "pop the last one
and call its `undo()`" rather than a feature the panel has to invent from
scratch.

When you are done, `panel.run()` should no longer contain a switch over
`action.type` at all — only a call to the factory and a call to the queue.

## Done when (act 1)

- `./dp test command` is green throughout.
- `./dp shape command` no longer finds a `switch` over `action.type`, or the
  old `_focuserPosition` / `_filterSlot` fields.
- There is exactly one function that knows how an `ActionRecord` becomes a
  `Command`.
- `panel.history` still records the same strings it did before, in the same
  order — this refactor changes nothing an act-1 test can observe.
- Your `git log --oneline` shows small steps, each leaving the suite green.

## Then run `./dp act2 command`

## Hints

<details>
<summary>What should the Command interface actually require?</summary>

Two methods: `execute()` and `undo()`, plus something to show in `history` —
a `description` string is simpler than re-deriving it later from the command's
own fields. Resist adding anything else; a command that needs the factory to
hand it more than "the shared mutable state" and "its own arguments" is
usually a sign the state shape needs a second look, not the interface.

</details>

<details>
<summary>Where does the factory live, and what does it take?</summary>

One function, `toCommand(state, action)`, in its own file. It is the only
code that still pattern-matches on `action.type` — everywhere else in the
finished design, an `ActionRecord` has already become a `Command` by the time
anyone else sees it.

</details>

<details>
<summary>Does the queue need to know anything about focusers or filter wheels?</summary>

No — and if you find yourself writing that knowledge into the queue, stop.
The queue's job is entirely generic: run a command, remember it, and be able
to walk that memory backward. It should be able to run commands for a
completely different kind of panel without a single line changing.

</details>

## Reading

- GoF, *Command* — especially the discussion of `execute()`/`unexecute()` and
  composite commands ("macro commands").
- Fowler, *Refactoring* (2nd ed.) does not have a dedicated move for this one;
  the closest relative is *Replace Conditional with Polymorphism*, applied to
  a conditional that exists to pick a side effect rather than a value.
- [Command on refactoring.guru](https://refactoring.guru/design-patterns/command)
