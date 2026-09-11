# The route — six widgets stop talking to each other

## When to choose this

When a small group of objects needs to coordinate, and the coordination
rule itself - not any one object's own behavior - is what keeps getting
duplicated or scattered. If only two objects are involved, or if there is
really only one rule and one direction of effect, a mediator is a detour; it
earns its keep once three or more objects all need to react to each other.

## What it costs

One more file (the mediator), and it becomes the one place a reader must
open to answer "what makes this panel ready" - which used to be
reconstructable, if repetitively, from either output widget alone. Six small
files with obvious individual jobs become six small files plus one that
knows about all of them.

## The moves

| # | Move | What you do | Commit |
| --- | --- | --- | --- |
| 1 | Write `PanelMediator` with the four `*Changed` methods and the one `refresh()` | Give it direct references to `ReadyLamp` and `StartButton` now, since those have no inputs of their own to refactor away. | `refactor: introduce PanelMediator` |
| 2 | Strip `ReadyLamp` down to `setLit`/`lit` | It no longer takes any constructor arguments. | `refactor: ReadyLamp becomes a dumb display` |
| 3 | Strip `StartButton` down to `setEnabled`/`enabled` | Mirror of step 2. | `refactor: StartButton becomes a dumb display` |
| 4 | Rewire `FocusDial` to call `mediator.focusLockedChanged()` instead of `readyLamp.refresh()` / `startButton.refresh()` | Drop its `connect()` method and its two widget fields entirely - it now takes the mediator in its constructor instead. | `refactor: FocusDial reports to the mediator` |
| 5 | Rewire `FilterWheel` the same way | | `refactor: FilterWheel reports to the mediator` |
| 6 | Rewire `ExposureTimer` the same way | | `refactor: ExposureTimer reports to the mediator` |
| 7 | Rewire `WeatherBanner` the same way | | `refactor: WeatherBanner reports to the mediator` |
| 8 | Update the panel's wiring | Construct `readyLamp` and `startButton` first (no arguments now), then the mediator, then the four inputs (each taking the mediator). No more two-phase `connect()` step. | `refactor: wire the panel through the mediator` |

Steps 4–7 are four nearly-identical commits, and that repetition is the
point: each one is small enough to review in isolation, and by the fourth
one you are not discovering the pattern, you are applying it. If step 4 felt
effortless but step 7 still required thinking, something about
`WeatherBanner` is not as similar to the other three as it looks - worth
noticing before act 2 asks you to change exactly that widget's role.

## Then

```bash
./dp act2 mediator
```

What the seventh widget and the retired weather check cost, and what they
would have cost without the pattern, is in [ACT2.md](./ACT2.md). The full
reasoning, with the diagram mapping this onto the GoF roles, is in
[WALKTHROUGH.md](./WALKTHROUGH.md).
