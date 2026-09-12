# The route — one factory interface, one concrete factory per family

## When to choose this

When more than one related part must always be built together, from the
same family, and mismatching them is a real bug (not a hypothetical
one) that a runtime check currently catches too late to be useful. A
single part built by a single switch is not under-designed as a plain
function; this route earns its keep when *several* parts must agree.

## What it costs

A caller that used to ask three functions for three things now asks one
factory for a factory, then asks that factory for three things - one
more step, in exchange for those three things being unable to disagree.

## The moves

| # | Move | What you do | Commit |
| --- | --- | --- | --- |
| 1 | Write `PressFactory` | Three abstract methods, one per part. No implementations yet. | `refactor: introduce PressFactory` |
| 2 | Group the digital parts into `parts/digital.ts` | Move `DigitalPlate`, `DigitalInkSystem`, `DigitalFeeder` into one file, by family instead of by part kind. | `refactor: group digital parts by family` |
| 3 | Group the offset parts into `parts/offset.ts` | | `refactor: group offset parts by family` |
| 4 | Write `DigitalPressFactory` and `OffsetPressFactory` | Each `implements PressFactory`; the compiler refuses either if a method is missing. | `refactor: introduce the two concrete press factories` |
| 5 | Write `PRESS_FACTORIES` and `getPressFactory` | One table, one lookup function. | `refactor: introduce getPressFactory` |
| 6 | Rewrite `createPlate`/`createInkSystem`/`createFeeder` as thin wrappers | Each delegates to `getPressFactory(family)` instead of its own switch. | `refactor: route the three part constructors through getPressFactory` |
| 7 | Rewrite `buildPress` to hold one factory reference | `const factory = getPressFactory(family)`, then all three parts come from it. | `refactor: route buildPress through a single factory reference` |

Steps 2-3 are pure file moves (no behavior change, checked against the
full suite before step 4 adds anything new) - by the time `PressFactory`
gets its two implementations, the parts it needs are already sitting
together, one family per file.

## Then

```bash
./dp act2 abstract-factory
```

What a third family costs on this route, and what it would have cost
without the pattern, is in [ACT2.md](./ACT2.md). The full reasoning,
with the diagram mapping this onto the GoF roles, is in
[WALKTHROUGH.md](./WALKTHROUGH.md).
