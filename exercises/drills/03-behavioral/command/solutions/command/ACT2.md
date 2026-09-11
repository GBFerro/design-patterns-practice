# Act 2 — the measured part

Every number here comes from `./dp trade command`, which applies the two
patches in `../../patches/` to an isolated copy and counts the diff.

## What act 2 asked for

`panel.undo()` and `panel.redo()`, plus a new `macro` action kind that wraps a
list of actions and runs, undoes, and counts as exactly one unit — including a
macro nested inside another macro.

## What it cost on this route

`patches/solution-act2.patch`

```
+1 new file   ·   4 existing files modified   ·   35 lines touched   ·   5 hunks
```

One new file (`commands/macro.ts`) and four small, almost entirely additive
edits: `types.ts` gains the `macro` variant and two interface methods (+4/-1),
`factory.ts` gains one case and one import (+3/-0), `panel.ts` gains two
one-line delegations (+8/-0), `queue.ts` gains an `undone` stack and two
methods (+18/-1). `MoveFocuserCommand` and `RotateWheelCommand` — the two
command classes that already existed — change by zero lines. They already
knew how to undo themselves; nothing about adding a second way to *run* them
(inside a macro) or a second direction to run them in (redo) touched what they
do.

`MacroCommand` is not a new concept bolted on sideways — it implements the
same `Command` interface everything else does, which is why the factory's
`"macro"` case is one line: `new MacroCommand(action.actions.map(toCommand))`,
recursing through the same function that builds every other command. That
recursion is also what makes a macro nested inside a macro work without a
single extra line: `MacroCommand`'s `execute()` and `undo()` do not know or
care whether a sub-command is a `MoveFocuserCommand` or another `MacroCommand`.

## What it would have cost without the pattern

`patches/baseline-act2.patch` — the same requirement, on the act-1 `src/`:

```
+0 new files   ·   2 existing files modified   ·   77 lines touched   ·   2 hunks
```

Read the file and hunk counts alone and the baseline looks *cheaper*: two
files against four, two hunks against five. That is the honest surprise of
this exercise, and it is worth sitting with before looking at the third
number. **Lines touched tells the real story: 77 against 35, more than double.**

The reason the baseline's count is so concentrated is that it cannot be
anything else. `ConcretePanel` held its state as two plain fields
(`_focuserPosition`, `_filterSlot`) that `run()` mutated directly and
irreversibly — there was never a record of *how* to undo a mutation, only the
mutation itself. Retrofitting undo means the fields have to stop being the
whole story: the baseline rewrites the panel around a `Snapshot[]` history
and a movable pointer, one hunk, 72 lines, touching every method `panel.ts`
has. `types.ts` picks up the same `macro` variant and interface methods the
pattern route needed (+4/-1) — that part is identical cost either way, because
it is the public shape of the feature, not a consequence of how it is built.

So the file-count and hunk-count axes are measuring something real but
secondary: how many *places* a change reaches. The pattern route reaches more
places because the work was already split into files that each own one
concern, and adding a capability means touching the files that concern
touches. The baseline reaches fewer places because there was only one place
to reach — `ConcretePanel` did everything, so everything it gains lands in the
one file that already did everything. Concentration is not the same as
cheapness: the 72-line rewrite is a full replacement of how the class
represents its own state, done under the pressure of keeping nine act-2 tests
and seven act-1 tests green at once. The pattern route never had to touch how
`MoveFocuserCommand` or `RotateWheelCommand` represent anything, because they
already had an answer to "what is your inverse."

## What this route made worse

- **Five files' worth of `import` lines to trace before you can answer "what
  does running a macro actually do."** The switch-based act-1 code answered
  that question by reading one function top to bottom.
- **`RotateWheelCommand`'s capture-at-execute-time field (`fromSlot`) is easy
  to get wrong in a new command class**, and nothing in the `Command`
  interface enforces it — a command that captures its "undo data" at
  construction time instead would pass every act-1 test and silently produce
  the wrong `fromSlot` inside a macro that runs commands out of construction
  order. The interface cannot express this rule; only the convention and the
  act-2 tests catch it.
