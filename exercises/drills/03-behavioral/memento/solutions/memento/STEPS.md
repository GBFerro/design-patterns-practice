# The route — an opaque memento, threaded by hand

## When to choose this

When a caretaker needs to hold onto past states of something without
learning that something's shape - and especially when "learning that
shape" is a compile-time fact you want enforced, not a convention you
hope holds. A caretaker that already lives next to the thing it saves,
in the same file, written by the same person, on a class that never
grows fields anyone forgets to add to a list - is not under-designed as
plain field copying; this route is a bet that the originator's shape
will keep changing and the caretaker must not need to know.

## What it costs

Every field the originator wants remembered has to be threaded through
`createMemento` and `restore` by hand, one at a time. The memento does
not update itself, and nothing stops a new field from being added to
the class while `createMemento` forgets to pass it along - the type
checker enforces that the *caretaker* cannot read a field, not that the
*originator* remembered to save one.

## The moves

| # | Move | What you do | Commit |
| --- | --- | --- | --- |
| 1 | Write `ExposureMemento` and `ConcreteExposureMemento` | The interface has zero members; the concrete class holds the four real fields as `readonly` constructor parameters. | `refactor: introduce ExposureMemento` |
| 2 | Add `createMemento()` to `ExposureSetup` | Returns `new ConcreteExposureMemento(...)`, typed as the narrow interface. | `refactor: add ExposureSetup.createMemento` |
| 3 | Add `restore(memento)` to `ExposureSetup` | Casts to the concrete type once, then assigns all four fields. | `refactor: add ExposureSetup.restore` |
| 4 | Re-type `SetupHistory` against `ExposureMemento` | `Checkpoint` becomes an alias for the opaque type; `save`/`undo` call `createMemento`/`restore` instead of copying fields. | `refactor: route SetupHistory through ExposureMemento` |

Steps 2 and 3 are separate commits even though they are two methods on
the same class: `createMemento` can be checked against the full act-1
suite (every `save` still captures the right snapshot) before `restore`
exists at all, and a mistake in the cast inside `restore` is then
isolated to one commit, not mixed in with whether saving still works.

## Then

```bash
./dp act2 memento
```

What a fifth field costs on this route, and what it would have cost
without the pattern, is in [ACT2.md](./ACT2.md). The full reasoning,
with the diagram mapping this onto the GoF roles, is in
[WALKTHROUGH.md](./WALKTHROUGH.md).
