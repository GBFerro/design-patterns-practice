[🌐 English](./README.en.md)

# Act 2 — a seventh widget, and one interaction that no longer belongs

The dome now reports its own status. `panel.setDomeOpen(open)` is the
seventh widget's only input, and **the exposure cannot start unless the dome
is open** — `readyLamp` and `startButton` both need to learn about it.

**At the same time, weather stops mattering to readiness directly.** The
dome only opens when the weather permits it, so checking `weatherSevere`
separately, on top of checking `domeOpen`, is now redundant — and worse, it
is two ways of asking almost the same question that could disagree with each
other. `panel.setWeatherSevere(severe)` still exists and still does not
throw, but from this point on it has no effect on `readyLampLit` or
`startButtonEnabled`. Only `domeOpen`, `focusLocked`, `filter !== null` and
`exposureSeconds > 0` decide readiness now.

**One consequence, and it is deliberate - and it is bigger than it looks.**
Every other drill in this module keeps its act-1 suite green forever,
including after act 2. This is the one exception, and not only because
weather's effect was retracted: making the dome a *mandatory* condition
means any act-1 test that reached `readyLampLit === true` without ever
opening the dome can no longer reach it, full stop. Run `tests/panel.test.ts`
against your finished act 2 and expect **three failures, not one**:
*"all four conditions together make the panel ready"*, *"clearing the filter
after being ready makes the panel not ready again"*, and *"two panels do not
share widget state"* all assert a `true` that the dome now blocks. The fourth
test that looks related, *"severe weather overrides every other condition"*,
will still show green - but only because it already expected `false`, and
the panel is `false` now for a completely different reason (no dome, not
severe weather). A passing test that no longer tests what its name claims is
arguably worse than a failing one, since nothing flags it.

None of this is a sign you broke something. Updating or removing these tests
- and being honest in each commit message about *why* each one no longer
holds - is part of doing this act correctly, as much a part of this
exercise's answer as the dome widget itself.
