# The route — six checks as linked rule objects, ordered per telescope

## When to choose this

When a sequence of checks needs to change order, gain or lose members, or
run differently for different callers - and those pressures are either
already present or clearly coming. A validation sequence that has one true
order, used everywhere, forever, is not under-designed as a plain function;
this route is a bet that the order will need to move.

## What it costs

Reading "what does this telescope check, and in what order" now means
opening the chain builder, not just the one function every check used to
live in. Six small files with one job each replace one file with six jobs.

## The moves

| # | Move | What you do | Commit |
| --- | --- | --- | --- |
| 1 | Write `ValidationRule` and `BaseRule` | `check()` is abstract; `setNext`/`handle` live once, on the base class. | `refactor: introduce ValidationRule and BaseRule` |
| 2 | Extract `AltitudeRule` | First check, no dependencies on the others. | `refactor: extract AltitudeRule` |
| 3 | Extract `MoonSeparationRule` | | `refactor: extract MoonSeparationRule` |
| 4 | Extract `InstrumentAvailableRule` | | `refactor: extract InstrumentAvailableRule` |
| 5 | Extract `ExposureBudgetRule` | | `refactor: extract ExposureBudgetRule` |
| 6 | Extract `DomeClearanceRule` | Just the check itself - the "only for movable domes" decision does not live here. | `refactor: extract DomeClearanceRule` |
| 7 | Extract `WeatherRule` | Last of the six. | `refactor: extract WeatherRule` |
| 8 | Write `buildChain(telescope)` | Links the six in the act-1 order, including `DomeClearanceRule` only when `telescope.hasMovableDome`. | `refactor: introduce buildChain` |
| 9 | Route `validateRequest` through `buildChain(telescope).handle(...)` | Delete the six-`if` function. | `refactor: route validateRequest through the chain` |

Extracting one rule per commit (steps 2–7) means each extraction is checked
against the full act-1 suite on its own, before the next one starts - by the
time `DomeClearanceRule` is extracted in step 6, the movable-dome exception
has already been isolated to one `check()` method, so getting it right is a
local decision, not a repeat of five previous ones done under time pressure.

## Then

```bash
./dp act2 chain-of-responsibility
```

What the new rule and Ridgeline's reordering cost, and what they would have
cost without the pattern, is in [ACT2.md](./ACT2.md). The full reasoning,
with the diagram mapping this onto the GoF roles, is in
[WALKTHROUGH.md](./WALKTHROUGH.md).
