# Act 2 — the measured part

Every number here comes from `./dp trade strategy`, which applies the two patches in
`../../patches/` to an isolated copy, runs the act-2 suite against each, and counts the diff.
The CI runs the same command, so these numbers cannot quietly stop being true.

## What act 2 asked for

A fourth way of ordering the queue — `darkest-first`, highest targets first — and the policy
name now arrives from the night's config file, typed by an operator at two in the morning.
A name we do not know has to fail with the full list of the ones we do.

## What it cost on this route

`patches/solution-act2.patch`

```
+1 new file   ·   1 existing file modified   ·   3 lines touched   ·   1 hunk
```

One new file (`policies/darkest-first.ts`, nine lines) and two lines of registration: an
import, and one more entry in the `policies` array. Within the declared budget of ≤ 1 file
and ≤ 3 lines — and that budget was written into `meta.json` **before** the patch was
measured, which is the only thing that makes it evidence rather than decoration.

The second half of the requirement — "list what is available" — cost **nothing at all**. The
error message already derived its list from `policyNames()`, so the fourth policy appeared
in it the moment it was registered. That is the part of step 8 paying for itself.

## What it would have cost without the pattern

`patches/baseline-act2.patch` — the same requirement, implemented on the act-1 `src/`:

```
+0 new files   ·   1 existing file modified   ·   23 lines touched   ·   3 hunks
```

The same number of files, and eight times the lines. But the number that actually tells the
story is **three hunks in one file**, because those three hunks are three separate places
that had to be kept in agreement:

1. `KNOWN_POLICIES`, so the name is accepted;
2. the error message, so the operator is told the truth about what exists;
3. a fourth `case`, with its own copy of the horizon filter, the budget check and the start
   arithmetic — twenty of the twenty-three lines.

Forget any one of the three and you get a different, worse bug. Forget (2) and the operator
who typo'd is told about three policies when there are four. That is not hypothetical: the
act-2 test `a misspelled policy name is refused with the full list of what is available`
fails on exactly that omission, and it was the first thing I got wrong writing the baseline.

And the twenty duplicated lines are the real debt. The fourth branch means the packing loop
now exists four times, so the next bug found in it has four homes.

## What this route made worse

- **Reading a night end to end costs two files instead of one.** The `switch` version was
  horrible to extend and genuinely better at being read in one sitting. That is a trade, not
  a win, and anyone who tells you the pattern is strictly better is selling something.
- **A policy can only be an ordering.** "Never two spectroscopy targets in a row" needs to
  see what is already scheduled and does not fit `rank`. The `switch` would have swallowed it
  without complaint — badly, but without a redesign. The pattern made the expected change
  cheap and an unexpected *kind* of change more expensive.
- **Eight modules for three policies** is a lot of files for 188 lines. At this size the
  `Record<string, Rank>` discussed in [WALKTHROUGH.md](./WALKTHROUGH.md) is a serious rival,
  and the thing that decides it is whether a policy ever grows a second member.
