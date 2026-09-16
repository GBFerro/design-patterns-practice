# Act 2 — the measured part

Every number here comes from `./dp trade bridge`, which applies the two
patches in `../../patches/` to an isolated copy and counts the diff.

## What act 2 asked for

A third fare policy (zone-based: a flat rate per zone, with a two-zone
minimum) **and** a third payment medium (a transit pass: a flat 10%
discount) - arriving together. Every existing combination keeps working;
every new combination - zone×cash, zone×card, flat×pass, distance×pass,
zone×pass - has to work through the same `calculateFare` entry point.

## What it cost on this route

`patches/solution-act2.patch`

```
5 existing files modified   ·   29 lines touched   ·   6 hunks
```

Five files, not two, because both axes' overhead is real: `types.ts`
widens both unions, `index.ts` gains two export names, `fare-policy.ts`
gains `ZoneFarePolicy`, `payment-medium.ts` gains `PassPayment`, and
`fare.ts` gains one line in each of its two lookup tables. **`fare.ts`'s
`calculateFare` function itself - the part that actually dispatches a
request to a policy and a medium - does not change by a single
character.**

## What it would have cost without the pattern

`patches/baseline-act2.patch` — the same requirement, on the act-1 `src/`:

```
2 existing files modified   ·   48 lines touched   ·   4 hunks
```

Read only "files modified" or "hunks," and the baseline looks cheaper:
two files against five, four hunks against six. That is real, and it is
not an accident - the pattern route pays a fixed five-file tax for
having two hierarchies to open at all, no matter how small the change.
**Lines touched is where this resolves, and it is not close: 48 against
29**, because five new classes on the baseline route - each duplicating
either the zone formula or the pass discount, and often both concerns
side by side - cost roughly seven lines apiece, while the pattern route
pays for the same two new *concepts* exactly once each (`ZoneFarePolicy`,
`PassPayment`) and then only a one-line registration per table for every
combination that concept unlocks.

This is the opposite imbalance from Adapter's act 2 in this same module:
there, files and hunks tied and lines carried the argument outright.
Here, files and hunks side with the baseline and lines side with the
pattern - which is the honest shape of Bridge's actual claim. Bridge
never promised fewer files to open; it promised that a new value on
either axis costs a constant amount of *new logic*, not one multiplied
by however many values already exist on the other axis. Five files
opened once versus two files edited more times each: this act 2 is where
that trade becomes a number instead of an assertion.

## What this route made worse

- **No single file shows what a specific combination actually costs.**
  Reading `fare-policy.ts` alone shows what `zone` computes; reading
  `payment-medium.ts` alone shows what `pass` charges. Neither file
  shows the number `243` a rider paying by pass for a three-zone trip
  actually pays - that only exists once both are composed at runtime.
- **The two lookup tables are two more places a new value can be
  forgotten.** `Record<K, V>` makes a missing key a compile error, which
  catches the mistake - but it is still two separate tables to remember,
  where the baseline's mistake (a missing `if` branch) would at least be
  a single, visible gap in one function.
