# Act 2 — the measured part

Every number here comes from `./dp trade carrier-gateway`, which applies
the two patches in `../../patches/` to an isolated copy and counts the
diff.

## What act 2 asked for

Identical repeated rate requests must hit each carrier's native client at
most once. Same carrier, same origin, same destination, same weight -
the second call (and every one after it) has to return the same answer
without calling `northbridgeQuote`/`aerolaneRate`/`coastalEstimate`
again. Any one of the four fields differing is a fresh request.

## What it cost on this route

`patches/solution-act2.patch`

```
+0 new files   ·   2 existing files modified   ·   11 lines touched   ·   2 hunks
```

One field (`cache = new Map<string, CarrierRate>()`) and one wrapper
around the existing dispatch in `carrier-gateway-facade.ts`; one export
line added to `index.ts` so the learner-facing tracker becomes visible.
**Nothing in `mappers.ts` changed at all** - the cache sits entirely
outside the part of this route that knows the three carriers' shapes.

## What it would have cost without the pattern

`patches/baseline-act2.patch` — the same requirement, on the act-1
`src/`:

```
+1 new file   ·   3 existing files modified   ·   47 lines touched   ·   4 hunks
```

`src/` has no single place every request passes through, so the cache
needed its own file (`rate-cache.ts`) just to be shared between
`checkout.ts` and `rate-comparison.ts` - two functions that don't
otherwise know about each other. Both functions' three-way if/else chain
also had to change shape (from early `return`s to an assigned `rate`
variable, so the result could be stored before returning), which is
where most of the extra lines went.

## What the other two candidates cost

Neither of these patches ships in `patches/` under the names `./dp trade`
looks for - only one solution can be `absorbsAct2`. They're measured the
same way, kept as `adapter-act2.patch` and `proxy-act2.patch` for anyone
who wants to reproduce the numbers:

```
adapter   +0 new files · 4 existing files modified · 33 lines touched · 4 hunks
proxy     +0 new files · 2 existing files modified · 13 lines touched · 2 hunks
```

Adapter is the most expensive of all four measured routes, including the
no-pattern baseline, on file count: the cache had to be added three
times, once inside each adapter class, because nothing in that route
holds all three carriers at once. Proxy comes close to this route's
number - one class, one cache field - but still carries the three-way
`switch` inside the same method the cache wraps, which this route never
needed at all. See
[`solutions/adapter/ACT2.md`](../adapter/ACT2.md) and
[`solutions/proxy/ACT2.md`](../proxy/ACT2.md) for the detail.

## What this route made worse

- **`mappers.ts` still knows all three carriers' shapes, in one file.**
  Act 2 didn't change that, and it didn't have to - but a fourth carrier
  still means opening this one file and adding an entry, the same cost
  `adapter` (a fourth class) and `proxy` (a fourth `case`) would pay.
- **The cache has no eviction and no size limit**, same as every other
  route's - act 2's requirement was "at most once per identical request,"
  not "bounded memory," so none of the four measured routes address it.
  Worth naming as a real gap, not a strength this route happens to lack.
