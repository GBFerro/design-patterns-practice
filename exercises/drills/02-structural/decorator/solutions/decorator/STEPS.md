# The route — one Fare interface, one small class per modifier

## When to choose this

When several independent modifiers can each apply to a base object, in
any combination, and each modifier's own logic is worth isolating and
testing on its own. A single modifier that always applies, or modifiers
that must run in a fixed, unchangeable order baked into the type system,
are both signs this route is doing more than the problem needs.

## What it costs

Four files replace one function's worth of `if` statements. Reading
"what does the group cap do" now means opening `group-cap.ts` instead of
scrolling to the third `if` in `calculateFare`.

## The moves

| # | Move | What you do | Commit |
| --- | --- | --- | --- |
| 1 | Write `Fare` and `BaseFare` | One method, `priceCents()`; `BaseFare` returns the flat starting price. | `refactor: introduce Fare and BaseFare` |
| 2 | Extract `StudentDiscount` | Wraps a `Fare`, halves whatever `priceCents()` it returns. | `refactor: extract StudentDiscount` |
| 3 | Extract `OffPeakDiscount` | Wraps a `Fare`, takes 80% of it. | `refactor: extract OffPeakDiscount` |
| 4 | Extract `GroupCap` | Wraps a `Fare`, caps whatever it returns. | `refactor: extract GroupCap` |
| 5 | Rewrite `calculateFare` | Build a `BaseFare`, wrap it in whichever decorators the options call for, return `priceCents()`. | `refactor: route calculateFare through the decorators` |

Steps 2-4 each extract one modifier's math into its own class, checked
by hand against the act-1 suite's own numbers before the next step
starts. Step 5 is the only place that still knows all three modifiers by
name - everywhere else, a decorator only knows the one `Fare` it wraps.

## Then

```bash
./dp act2 decorator
```

What a new modifier and a required order between two of them cost on
this route - and why this act 2 does not have a single winner - is in
[ACT2.md](./ACT2.md). The full reasoning, with the diagram mapping this
onto the GoF roles, is in [WALKTHROUGH.md](./WALKTHROUGH.md).
