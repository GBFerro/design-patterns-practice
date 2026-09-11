# Act 2 — the measured part

Every number here comes from `./dp trade memento`, which applies the two
patches in `../../patches/` to an isolated copy and counts the diff.

## What act 2 asked for

A fifth field, `ditherPattern` (`"none"` / `"spiral"` / `"box"`, default
`"none"`), added to what a checkpoint remembers - set through a new
`setDitherPattern` method, restored by `undo` alongside everything else,
in the same LIFO order as the other four fields.

## What it cost on this route

`patches/solution-act2.patch`

```
+0 new files   ·   2 existing files modified   ·   9 lines touched   ·   4 hunks
```

`memento.ts` gains one constructor parameter (+1, one hunk).
`setup.ts` gains the field default, the `setDitherPattern` method, and one
word threaded into an existing `createMemento` call (+7/-1, three hunks).
**`history.ts` does not appear in this patch at all.** `SetupHistory` still
only knows `ExposureMemento` - an opaque type - so a fifth field on the
thing it stores is not a fact `SetupHistory` needed to learn.

## What it would have cost without the pattern

`patches/baseline-act2.patch` — the same requirement, on the act-1 `src/`:

```
+0 new files   ·   2 existing files modified   ·   8 lines touched   ·   5 hunks
```

Read lines touched alone and the baseline looks slightly *cheaper* - 8
against 9, one line fewer. That comparison is real but it is also the
least interesting number here, and taken alone it would suggest the
pattern barely earned its keep this time. Hunk count tells the more
honest story: 5 against 4, and the extra hunk is not spread evenly - it
all lands in `history.ts`, which the baseline has to touch in three
separate places (the `Checkpoint` interface, the object literal inside
`save`, the field-by-field assignment inside `undo`) for exactly the
reason `SetupHistory` was rewritten in act 1 to avoid: it knows every
field `ExposureSetup` has, by name, and a new field is a new fact it
must be taught in every place it already knew the old four.

The pattern route's `history.ts` hunk count is zero, not smaller - the
one file this exercise's target promised would never need to change for
a new field, does not change. That is the actual claim act 1 made, and
it is what act 2 checks, not which route has the smaller diff overall.
This is close to the mirror of Chain of Responsibility's act 2: there,
the pattern route won clearly on lines while the baseline edged it out
by one hunk; here the baseline edges the pattern route out by one line
while the pattern route wins on hunks, and in both cases picking either
single number over the other tells only half the story.

## What this route made worse

- **Two files must agree on order, by hand, forever.** `memento.ts`'s
  constructor and `setup.ts`'s `createMemento`/`restore` list the same
  five fields in the same order in three separate places, and nothing
  checks that they stay in sync except the type checker refusing to
  compile a mismatched argument count - a field added to the class but
  left out of `createMemento` compiles fine and is silently never saved.
- **`restore`'s cast is a promise, not a proof.** `memento as
  ConcreteExposureMemento` is safe only because nothing outside
  `ExposureSetup`'s own file can construct a memento - a promise the type
  system enforces at the boundary (no other file can even name
  `ConcreteExposureMemento`) but does not itself verify inside `restore`.
