# Act 2 — the measured part

This route does not absorb act 2 within `./dp trade`'s budget - only one
candidate can be `absorbsAct2: true`, and
[`facade`](../facade/ACT2.md) is it. This file reports what act 2 cost
here anyway, measured the same way, because a choice you didn't pick is
still worth knowing the price of.

## What act 2 asked for

Identical repeated rate requests must hit each carrier's native client at
most once. Same carrier, same origin, same destination, same weight -
the second call (and every one after it) has to return the same answer
without calling the carrier's native client again.

## What it cost on this route

`patches/adapter-act2.patch` (kept for reproducibility; not one of the
two files `./dp trade` reads)

```
+0 new files   ·   4 existing files modified   ·   33 lines touched   ·   4 hunks
```

Worse than [`facade`](../facade/ACT2.md)'s 11 lines on every dimension,
and worse than [`proxy`](../proxy/ACT2.md)'s 13, and the only one of the
three candidates that touches *more* files than the no-pattern baseline
(4, against the baseline's 3). Each of `NorthbridgeAdapter`,
`AerolaneAdapter` and `CoastalAdapter` gains its own `cache` field and its
own key-check-then-store wrapper around its own `rate()`; `index.ts`
gains the one tracker-export line every route needs. The three adapters
were designed in act 1 to know nothing about each other - which is
exactly what made act 1 cheap, and exactly what forces this same eleven
lines' worth of caching logic to be written three separate times here.

## What this route made worse

- **The cache logic is now written three times, once per adapter class.**
  Each copy is small and each is correct, but "at most once per request"
  is one requirement, and this route represents it with three separate,
  independently-maintained implementations of the same idea. A bug fixed
  in one copy has no mechanism forcing it to be fixed in the other two.
- **Nothing about this route's act-1 structure predicted this cost.**
  `adapter`'s files were the smallest, most focused files of any
  candidate in act 1 - the exercise's own hint about "whether a subsystem
  is being asked to change uniformly" is the piece of information that
  would have flagged this in advance, and it isn't visible from reading
  any single adapter file in isolation.
