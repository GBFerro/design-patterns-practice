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

`patches/proxy-act2.patch` (kept for reproducibility; not one of the two
files `./dp trade` reads)

```
+0 new files   ·   2 existing files modified   ·   13 lines touched   ·   2 hunks
```

Close to [`facade`](../facade/ACT2.md)'s 11 lines and 2 hunks - much
closer than [`adapter`](../adapter/ACT2.md)'s 33. `carrier-gateway-proxy.ts`
gains a `cache` field and its `rate()` is split into a thin cache-checking
wrapper around a renamed `lookUp()`, which still holds the same three-way
`switch` act 1 wrote; `index.ts` gains the one tracker-export line every
route needs. The one class this route already had is most of why the
number is small - the two extra lines against Facade come from the
`switch` and `lookUp` split that Facade's `mappers.ts` didn't need any
change for at all.

## What this route made worse

- **`rate()` now does two jobs.** Before act 2, it was pure translation.
  After, it's a cache check, a cache store, and a translation dispatch,
  in one method - readable, but doing more than the method's own name
  ("give me the rate") suggests on its own.
- **The cache and the `switch` are stacked in the same file, doing
  unrelated work.** [`facade`](../facade/ACT2.md) kept its translation
  table (`mappers.ts`) completely untouched by act 2; this route's
  equivalent - the `switch` inside `lookUp()` - sits one method away from
  the new caching logic, in the same class.
