[🌐 English](./README.en.md)

# Observer

`Behavioral` · `Observer` · `●●○` · ~35 min

## Context

Every alert at Hollowell — a seeing measurement crossing a threshold, a
weather condition worth acting on — needs to reach four places: the control
room's permanent log, the on-call operator's pager, the dome (which closes
itself on weather, and ignores seeing entirely), and the end-of-night report.
`AlertCenter.publish(alert)` is the one door every alert walks through.

## The pressure

`publish()` calls all four consumers directly, by name, in a fixed order:
`this.log.record(alert)`, `this.pager.page(alert)`, `this.dome.respond(alert)`,
`this.report.append(alert)`. This is not duplicated or scattered — it is four
short, clear lines, and as act 1 stands, nothing is wrong with it. The pressure
is what it cannot do: there is no way for anything *other than these four,
named, built-in classes* to hear about an alert, and no way for any of the
four to stop hearing about them once the center exists. The set of listeners
is fixed at the class's own definition, not something that can change while
the program runs.

## The target

**Observer.** Each consumer becomes something that answers one shared
question — `onAlert(alert)` — and `publish()` stops calling four named things
and starts looping over a list of them. The four built-in consumers are still
built in; they are simply list members like any other, from the center's
point of view.

When you are done, `publish()` should not mention `log`, `pager`, `dome`, or
`report` by name anywhere — only a loop over observers.

## Done when (act 1)

- `./dp test observer` is green throughout.
- `./dp shape observer` no longer finds the four named calls back to back.
- `publish()` contains one loop, not four named calls.
- `logEntries`, `pagerEntries`, `domeEntries` and `reportEntries` still report
  exactly what they did before — this refactor changes nothing an act-1 test
  can observe, including the dome's silence on seeing alerts.
- Your `git log --oneline` shows small steps, each leaving the suite green.

## Then run `./dp act2 observer`

## Hints

<details>
<summary>What should the shared observer interface require?</summary>

One method: `onAlert(alert)`, returning nothing. Resist adding a name, a
priority, or a way to ask "are you still interested" — none of that is needed
yet, and Observer does not require it in general.

</details>

<details>
<summary>The four consumers have four different method names today - do I
have to rename them?</summary>

Yes, to `onAlert`, or the loop has nothing uniform to call. Renaming
`record`/`page`/`respond`/`append` to the same name does not erase what each
one is *for* — that is still visible in the class name and in what the method
body does. The uniform name is only about how the center calls them, not
about what they mean.

</details>

<details>
<summary>Where does the list of observers live, and what is on it at the
start?</summary>

A single `private readonly observers: AlertObserver[]` field on the center,
populated with the four built-ins in the constructor. Nothing else changes:
the four are still created by the center, still always present — they are
just reached through one list instead of four named fields.

</details>

## Reading

- GoF, *Observer* — especially the discussion of push vs. pull models (this
  exercise is push: the alert's full data travels with the notification).
- Fowler, *Refactoring* (2nd ed.) does not name this one directly; it is close
  in spirit to *Replace Conditional with Polymorphism* applied to a dispatch
  list instead of a dispatch condition.
- [Observer on refactoring.guru](https://refactoring.guru/design-patterns/observer)
