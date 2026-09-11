# Act 2 — the measured part

Every number here comes from `./dp trade mediator`, which applies the two
patches in `../../patches/` to an isolated copy and counts the diff.

## What act 2 asked for

A seventh widget, `DomeStatus`, whose `open` state becomes a mandatory,
fourth condition for readiness. At the same time, `weatherSevere` stops
being checked at all — the dome already accounts for weather, so checking
both was two ways of asking almost the same question.

## What it cost on this route

`patches/solution-act2.patch`

```
+1 new file   ·   3 existing files modified   ·   20 lines touched   ·   6 hunks
```

One new file (`widgets/dome-status.ts`, a plain input widget reporting to
the mediator like the other four). `panel-mediator.ts` trades one field
(`severe` → `domeOpen`) and one method body for another (`weatherChanged`
becomes a no-op, `domeChanged` takes its place) — net +9/-4. `panel.ts` gains
one field, one `connect`-free constructor line, and one delegating method
(+6/-0, purely additive - the panel's wiring for the other five widgets
never changes). `types.ts` gains one method signature (+1/-0). No widget file
other than the mediator and the panel's own wiring changes at all -
`FocusDial`, `FilterWheel`, `ExposureTimer` and `WeatherBanner` do not know
`DomeStatus` exists, and `ReadyLamp`/`StartButton` do not know anything
changed - they are still just told what to display.

## What it would have cost without the pattern

`patches/baseline-act2.patch` — the same requirement, on the act-1 `src/`:

```
+1 new file   ·   4 existing files modified   ·   24 lines touched   ·   11 hunks
```

The new file costs about the same either way - `DomeStatus` needs the same
`connect()`-based wiring every other input widget already uses, pattern or
not. What costs more is *where* the other changes land. Dropping weather
from the ready formula is not one edit here, it is two: `ready-lamp.ts` and
`start-button.ts` each carry their own copy of the four-part condition, so
each needs its own edit removing `!this.weatherBanner.severe` and adding
`this.domeStatus.open` - and each of those two files also needs its
`WeatherBanner` import swapped for a `DomeStatus` import and its constructor
signature changed, landing in three separate hunks per file (import, field
list, formula) for six of the eleven hunks total. `panel.ts` needs four
hunks of its own: a new import, a new field, both output widgets'
constructor calls edited to pass `domeStatus` instead of `weatherBanner`,
and a new `connect()` call plus `setDomeOpen` method. Eleven hunks against
six, eight lines more, and one more file touched - the same requirement,
paid for in twice as many places because the formula lived in two files
instead of one.

## What this act did to act 1 - on both routes

Making the dome mandatory does not only retract weather's effect - it
retracts *every* act-1 assertion that reached `readyLampLit === true`
without ever opening a dome that did not used to exist. Running
`tests/panel.test.ts` against either finished act 2 (solution or baseline)
produces the same three failures: *"all four conditions together make the
panel ready"*, *"clearing the filter after being ready makes the panel not
ready again"*, and *"two panels do not share widget state"*, each asserting
a `true` the dome now blocks. *"severe weather overrides every other
condition"* keeps showing green on both routes - but only because it always
expected `false`, and `false` is what it gets now for an entirely different
reason. This is identical on both routes, which is itself worth noting: it is
a consequence of the requirement, not of how either route implemented it.

## What this route made worse

- **`ReadyLamp` and `StartButton` still cannot be understood without also
  reading `PanelMediator`.** Act 2 did not change that cost, and the
  mediator itself is now the one file that must be read to answer "what
  makes this panel ready" for a fifth time in a row (once per act-2 drill
  this repository has produced so far).
- **`weatherChanged`'s empty body is easy to mistake for a bug on first
  read.** A method that takes an argument, names it `_severe` to mark it
  unused, and does nothing, reads like an oversight until a comment or this
  file explains it was deliberate. The comment left in `panel-mediator.ts`
  is doing real work here, not decoration.
