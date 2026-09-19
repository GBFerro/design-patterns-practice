# Act 2 — the measured part

Every number here comes from `./dp trade warehouse-registry`, which applies the two patches in
`../../patches/` to an isolated copy and counts the diff.

## What act 2 asked for

A second, independent bin registry, live in the same process as the first: registering or
clearing bins in one must never affect the other. `createWarehouseRegistry(): 
WarehouseRegistryHandle` has to exist so a caller can build as many as it needs.

## What it cost on this route

`patches/injection-act2.patch`, which is what ships as `patches/solution-act2.patch`:

```
+0 new files   ·   1 existing file modified   ·   3 lines touched   ·   1 hunk
```

The whole patch is `index.ts` gaining `createWarehouseRegistry` to its export list and a new
`export type { WarehouseRegistryHandle }` line - `registry.ts` itself doesn't change at all,
because the factory and the interface were already there in act 1, just not exported.

## What it would have cost without the pattern

`patches/baseline-act2.patch` - the same requirement, on the act-1 `src/`:

```
+0 new files   ·   2 existing files modified   ·   38 lines touched   ·   2 hunks
```

`src/`'s registry is hard-wired to one shared module-level array with no factory to expose, so
`createWarehouseRegistry()` has to be written from scratch there - the full cost this route
never pays.

## What the losing routes cost

- [`solutions/singleton/ACT2.md`](../singleton/ACT2.md): 2 files, 32 lines, 3 hunks - cheaper
  than the baseline because there's a class to reuse, but still expensive, because the private
  constructor exists specifically to prevent a second instance.
- [`solutions/module/ACT2.md`](../module/ACT2.md): 2 files, 39 lines, 2 hunks - as expensive as
  the baseline, because a module has exactly one instance and nothing to reuse when a second one
  is needed.

## What this route made worse

Nothing measurable. The one real cost paid here was in act 1, not act 2: more indirection than
either other candidate to reach the one default registry, for a payoff - a near-free second
registry - that act 1 never told the reader was coming. See
[WALKTHROUGH.md](./WALKTHROUGH.md)'s "What it cost" section.
