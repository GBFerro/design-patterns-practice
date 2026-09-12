# Act 2 — the measured part

Every number here comes from `./dp trade abstract-factory`, which
applies the two patches in `../../patches/` to an isolated copy and
counts the diff.

## What act 2 asked for

A third family, wide-format - `WideFormatPlate`, `WideFormatInkSystem`,
`WideFormatFeeder` - working from `buildPress("wide-format")` exactly
the way digital and offset already do. Its ink system shares the word
"fountain" with offset's, on purpose: a name collision, not a hint to
share code.

## What it cost on this route

`patches/solution-act2.patch`

```
+1 new file   ·   2 existing files modified   ·   16 lines touched   ·   3 hunks
```

The new file is `parts/wide-format.ts`, all three products in one place
- grouped by family, the way every family's parts already were.
`types.ts` widens `PressFamily` by one member (1 hunk). `factory.ts`
gains one import, one `WideFormatPressFactory` class implementing all
three methods, and one registry entry (2 hunks). **`plate.ts`,
`ink-system.ts` and `ink-system.ts`'s siblings do not exist on this
route** - there is no per-part-kind file to update three times, because
parts are organized by family, not by kind.

## What it would have cost without the pattern

`patches/baseline-act2.patch` — the same requirement, on the act-1 `src/`:

```
+0 new files   ·   4 existing files modified   ·   29 lines touched   ·   4 hunks
```

Every dimension moves against the baseline here, not just one: nearly
twice the files (4 vs 2), nearly twice the lines (29 vs 16), and one
more hunk (4 vs 3). The reason is structural, not incidental:
`plate.ts`, `ink-system.ts` and `feeder.ts` each organize their file
around *one part kind, three families* - so a new family means editing
all three files, once each, adding one class and one switch case to
each. The pattern route organizes around *one family, three part kinds*
- so a new family means adding one file and one small class, in the one
place a family's identity already lived.

The word collision act 2 asked for (`"fountain"` in both offset's and
wide-format's ink system) is exactly the situation a per-kind file
layout makes riskiest: `ink-system.ts` now holds `OffsetInkSystem` and
`WideFormatInkSystem` a few lines apart, both returning strings with the
same word in them, and nothing about the file's structure stops a
future edit to one from being pasted into the other by mistake. The
pattern route never puts them in the same file at all.

## What this route made worse

- **A caller who wants "just the ink system" for one family still has to
  go through `getPressFactory(family).createInkSystem()`** (or the thin
  `createInkSystem(family)` wrapper) rather than reading one small
  switch - one more indirection for the common case of wanting a single
  part.
- **`assemblePress`'s mismatch check never fires on this route**, and
  cannot be made to, short of manually mixing two different
  `PressFactory` results - which nothing stops a caller from still
  doing, since `createPlate`, `createInkSystem` and `createFeeder`
  remain independently callable with independent `family` arguments.
  The guarantee this pattern buys is "one call site holding one factory
  cannot mismatch by accident," not "mismatching is impossible" - see
  WALKTHROUGH.md.
