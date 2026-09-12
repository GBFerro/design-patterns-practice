# Act 2 — the measured part

Every number here comes from `./dp trade singleton`, which applies the
two patches in `../../patches/` to an isolated copy and counts the diff.

## What act 2 asked for

A second press room, night shift, live at the same time as the main
floor - independent settings, independent `setMaintenanceMode` calls,
neither able to see or change the other's state.

## What it cost on this route

`patches/solution-act2.patch`

```
+0 new files   ·   1 existing file modified   ·   1 line touched   ·   1 hunk
```

One line in `index.ts`: `export { createPressRoom } from "./press-room.ts";`.
The factory already existed - `mainFloor` was already built by calling
it once - so "build a second, independent one" was already possible
before act 2 asked for it. The only thing act 2 actually needed was for
a caller outside this module to be *allowed* to call it too.

## What it would have cost without the pattern

`patches/baseline-act2.patch` — the same requirement, on the lazy
singleton in `src/`:

```
+0 new files   ·   2 existing files modified   ·   37 lines touched   ·   2 hunks
```

Every dimension moves against the baseline, and by a lot: 37 lines
against 1. `src/settings.ts` gains a second, independent implementation
of all five functions, because `rush-quote.ts`, `daily-capacity.ts`,
`intake-gate.ts`, `status-report.ts` and `maintenance-admin.ts` only know
how to read the one shared `instance` - there is no way to point any of
them at a different settings value without changing their signatures,
which would break every existing caller. Duplicating the five functions'
logic into a new `createPressRoom` inside `settings.ts` is the smallest
change that avoids that - and it is real, working duplication: the same
rush-surcharge formula now exists in two places that can drift apart.

## What this route made worse

- **`src/`'s counterfactual now has the rush-surcharge formula (and the
  other four) written down twice** - once in `rush-quote.ts` for the
  shared instance, once inside `createPressRoom` for anyone who needs an
  independent one. Nothing enforces that a future change to one updates
  the other.
- **The pattern route's own file count dropped from eight to three**
  going into act 1 (see `./dp trade singleton`'s "o que a estrutura
  custou" line) - which is not a act-2 cost, but is worth noticing
  before crediting act 2's 1-line change entirely to act 2: some of what
  made act 2 cheap was paid for back in act 1, when the five scattered
  files collapsed into one factory.
