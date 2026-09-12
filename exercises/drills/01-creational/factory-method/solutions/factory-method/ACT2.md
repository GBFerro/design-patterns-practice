# Act 2 — the measured part

Every number here comes from `./dp trade factory-method`, which applies
the two patches in `../../patches/` to an isolated copy and counts the
diff.

## What act 2 asked for

A fourth job kind, `FoilStampingJob`, with its own `foilColor` field -
available from all three call sites the same way the other three kinds
already are.

## What it cost on this route

`patches/solution-act2.patch`

```
+1 new file   ·   2 existing files modified   ·   11 lines touched   ·   4 hunks
```

The new file is `jobs/foil-stamping.ts`, the product itself. Both
existing edits land in `factory.ts`: one new `FoilStampingJobFactory`
class and one new entry in `JOB_FACTORIES`. `types.ts` gains the field
and the widened union (2 hunks, 3 lines). **`counter.ts`, `reprint.ts`
and `batch-import.ts` do not appear in this patch at all** - the three
files act 1 set out to stop duplicating construction logic in.

## What it would have cost without the pattern

`patches/baseline-act2.patch` — the same requirement, on the act-1 `src/`:

```
+1 new file   ·   4 existing files modified   ·   12 lines touched   ·   8 hunks
```

Lines touched barely moves - 12 against 11, almost a tie, because each
of the three call sites only needs two lines (an import and a `case`).
Files and hunks are where this one actually resolves: four files against
two, eight hunks against four - exactly double, both times, because the
one change that the pattern route made once (a new factory, registered
once) the baseline route has to repeat identically in `counter.ts`,
`reprint.ts` and `batch-import.ts`. This is the opposite of most of this
repo's other act 2s, where lines touched is the number that carries the
argument and file/hunk count nearly ties - here lines nearly ties and
file/hunk count is the whole story. Reading only "how many lines
changed" here would make the two routes look almost equivalent, which is
not the target's own claim: the target's claim was always about **how
many places** have to agree, not how many characters.

## What this route made worse

- **Three near-identical edits became one edit that has to be trusted
  three times over**, just displaced: `factory.ts`'s `JOB_FACTORIES`
  table is now the one place a typo in a kind's key breaks all three
  call sites at once, rather than one of three switches breaking on its
  own. Centralizing the decision also centralizes the blast radius of
  getting it wrong.
- **A reader tracing `createJobFromCounter` for a specific kind now
  follows one more indirection** than tracing the old switch: call site
  → `createJob` → `JOB_FACTORIES[kind]` → the factory's `createJob`. The
  old switch was one function, one level deep.
